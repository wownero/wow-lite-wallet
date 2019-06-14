const fs = require('fs');
const os = require('os');
const path = require('path');
let childProcess = require('child_process');
let textEncoding = require('text-encoding');
let TextDecoder = textEncoding.TextDecoder;
import { platform, cliPath } from './binaries';

export class WowRpc {
    // ps -ef | grep defunct | grep -v grep | cut -b8-20 | xargs kill -9
    constructor(wowdir, cli_path) {
        this._wowdir = wowdir;
        this._cli_process = null;
        this._cli_log_path = path.join(os.tmpdir(), 'wowlight-wallet.log');
        if(!cli_path) {
            this._cli_path = cliPath;
        } else {
            this._cli_path = cli_path;
        }

        console.log('WowRPC bin path: ' + this._cli_path);

        this._wallet_path = '';
        this._cli_wallet_password = '';
        this._cli_wallet_address = null;
        this._cli_daemon_address = '';
        this._cli_wallet_selected_account = null;
        this._cli_balance_unlocked = null;
        this._cli_balance = null;
        this._cli_txs = [];
        this._version = "";
        this._buffer = "";
        this._sending = false;

        // this will hold the newly created wallet details: address, view_key, seed, password
        this._create_wallet = {};
        this._create_wallet_tmp_path = path.join(os.tmpdir(), 'wowtmp');

        this._cli_args_default = [
            '--use-english-language-names',
            '--log-file',
            this._cli_log_path
        ]
        this._cli_args_create_wallet = [
            '--generate-new-wallet',
            this._create_wallet_tmp_path
        ]
        // '--restore-deterministic-wallet' recover from seed

        // lil' state machine
        // 0: not spawned
        // 1: spawned - not authed
        // 2: spawned - authed, not refreshed
        // 3: spawned - authed/refreshed (shows prompt)
        this._states = {
            'cw': 'create wallet',
            0: 'not spawned',
            1: 'spawned - not authed',
            2: 'spawned - authed',
            3: 'spawned - starting refresh',
            4: 'spawned - ended refresh',
            5: 'spawned - showing prompt'
        };
        this._state = 0;
        this._checkMemPoolTimeout = 10000
        this.shown_transfers = false;
    }

    commitWallet(wallet_name) {
        // moves `/tmp/tmpwallet to destination`
        console.log(`moving into: ${this._wowdir}/${wallet_name}`);
        let cmd = process.platform === 'win32' ? 'move' : 'mv';

        let dest_path = path.join(this._wowdir, wallet_name);
        console.log(dest_path);
        console.log(`${cmd} "${this._create_wallet_tmp_path}" "${dest_path}"`);

        let cmd_wcache = `${cmd} "${this._create_wallet_tmp_path}" "${dest_path}"`;
        let cmd_wkeys = `${cmd} "${this._create_wallet_tmp_path}.keys" "${dest_path}.keys"`;

        console.log(`[CMD] ${cmd_wcache}`);
        console.log(`[CMD] ${cmd_wkeys}`);
        let wow = childProcess.execSync(cmd_wcache);
        let wow2 = childProcess.execSync(cmd_wkeys);
        return 1;
    }

    _checkMemPool(){
        if(this._state === 5){
            this._sendCmd('show_transfers');
            this._sendCmd('balance');
            this._sendCmd('save');
            setTimeout(this._checkMemPool.bind(this), this._checkMemPoolTimeout);
        }
    }

    _sendPassword(){
        this.log('sending pass');
        this._cli_process.stdin.write(`${this._cli_wallet_password}\n`);
    }

    _sendCmd(cmd){
        if(this._sending && cmd === 'show_transfers') {
            // skip `show_transfers` command when making a transaction
            return;
        }

        if(cmd === 'show_transfers') {
            this.shown_transfers = true;

            if(this._state !== 5){
                return;
            }
        }

        this.log(`Sending cmd "${cmd}"`);

        try {
            this._cli_process.stdin.write(`${cmd}\n`);
        } catch(err) {
            console.log(err);
            return;
        }

        if(cmd.startsWith('set')){
            this._sendPassword();
        }
    }

    _parse_stdout(data){
        if(platform === 'win'){ data = data.replace(/\r/g, ""); }

        // detect incoming transaction
        let re_incoming_tx = /Height \d+, txid \<([a-zA-Z0-9]+)\>, ([0-9]+.[0-9]+), idx/g;
        if(data.match(re_incoming_tx)){
            let matches;
            while ((matches = re_incoming_tx.exec(data)) !== null) {
                this._paymentReceived(matches[1], matches[2]);
            }
        }

        // detect background mining prompt
        let re_background_mining = /Do you want to do it now?/g;
        if(data.match(re_background_mining)){
            this._sendCmd("No\n");
        }

        if(this._state === 5 && data.match(/Error: invalid password/)){
            this._sendCmd(this._cli_wallet_password);
        }

        // detect show_transfers output
        let re_transfers_in = /([0-9]+|pool|pending)[ ]+(in|out)[ ]+(.+?(?=  ))[ ]+([0-9]+.[0-9]+)[ ]+([a-zA-Z0-9]+)/g;
        if(this._state === 5 && data.match(re_transfers_in)){
            let matches;
            let pushed = 0;
            while ((matches = re_transfers_in.exec(data)) !== null) {
                let blockheight = matches[1];
                if(WowRpc.isNumeric(blockheight)){
                    blockheight = parseInt(blockheight);
                }

                let tx = {
                    blockheight: blockheight,
                    in: matches[2] === 'in' ? 'in' : 'out',
                    date: matches[3],
                    amount: matches[4],
                    id: matches[5]
                };

                if(this.getTxId(tx.id) === false){
                    this._cli_txs.push(tx);
                    pushed += 1;
                }
            }

            if(pushed > 0){
                this.log(`discovered ${pushed} tx's`);
                this.wowCall(this.onWalletTxsChanged, this._cli_txs);
            }
            return;
        }

        // detect cli startup
        if(data.match(/This is the command line wownero wallet./)){
            this._setState(1);
        }

        // detect successful transfer
        if(data.match(/Transaction successfully submitted/)){
            this._sending = false;
            this.onTransactionCompleted();
        }

        if(data.match(/Opened wallet: W/)){
            this._cli_wallet_address = data.substring(15, data.indexOf('\n'));
            this.log(`Wallet: ${this._cli_wallet_address}`);
            this._setState(2);
        }

        // if(data === `Logging to ${this._cli_log_path}\n`){
        //     this._sendPassword();
        // }

        if(data.match(/Starting refresh.../)){
            this._setState(3);
        }

        if(data.match(/Error: /)){
            let re_error = /Error: (.*)/g;
            let re_error_offline_daemon = /wallet failed to connect to daemon: (.*):(\d+)./g;

            console.log(`||${data}||`);

            let re_error_offline_daemon_matched = re_error_offline_daemon.exec(data);
            if(re_error_offline_daemon_matched){
                let msg = `Remote node '${re_error_offline_daemon_matched[1]}:${re_error_offline_daemon_matched[2]}' offline, please use another.`;
                this.onError(msg);
                return;
            }

            let re_error_matched = re_error.exec(data);
            if(re_error_matched){
                this.onError(re_error_matched[1]);
            } else {
                this.onError("Unknown error occurred");
            }
        }

        if(data.match(/Refresh done, blocks received:/)){
            this._setState(4);
            this.onWalletOpened({
                'wallet_path': this._wallet_path,
                'address': this._cli_wallet_address
            });
        }

        let currently_selected = data.match(/Currently selected account: \[([0-9])\]/);
        if(currently_selected){
            this._cli_wallet_selected_account = parseInt(currently_selected[1]);
        }

        let balance = data.match('Balance: ([0-9]+.[0-9]+)');
        if(balance){
            this._setBalance(balance[1]);
        }

        let balance_unlocked = data.match('unlocked balance: ([0-9]+.[0-9]+)');
        if(balance_unlocked) {
            this._setBalanceUnlocked(balance_unlocked[1]);
        }

        // detect output from command `show_transfers`
        if(data.match(/\[wallet [a-zA-Z0-9]+\]:/)){
            this._setState(5);
        }

        let re_height_refresh = /Height (\d+) \/ (\d+)/g;
        let re_height_refresh_data = re_height_refresh.exec(data);
        if(re_height_refresh_data){
            let from = re_height_refresh_data[1];
            let to = re_height_refresh_data[2];
            this.wowCall(this.onHeightRefresh, {'from': from, 'to': to});
        }
    }

    _parse_stdout_create_wallet(data){
        if(platform === 'win'){ data = data.replace(/\r/g, ""); } // lol windows
        this._buffer += data;

        if(data === `Logging to ${this._cli_log_path}\n`){
            this._cli_process.stdin.write(`wow\n`);
            this._cli_process.stdin.write(`wow\n`);  // ?? :D
        }

        // if(data.match(/List of available languages for your wallet's seed:/)){
        //     this._cli_process.stdin.write(`1\n`);
        // }
        //
        // if(data.match(/Error: invalid language choice entered./)){
        //     this._cli_process.stdin.write(`1\n`);
        // }

        if(data.match(/Background refresh thread started/)){
            let re_addy = /Generated new wallet: (W[o|W][a-zA-Z0-9]{95})/;
            let re_addy_match = this._buffer.match(re_addy);
            if(re_addy_match){
                this._create_wallet['address'] = re_addy_match[1];
            }

            let re_view_key = /View key: ([0-9a-fA-F]+)\n/;
            let re_view_key_match = this._buffer.match(re_view_key);
            if(re_view_key_match){
                this._create_wallet['view_key'] = re_view_key_match[1];
            }

            let re_seed_lol = /(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+ )(\w+)/g;
            let re_seed_match = this._buffer.match(re_seed_lol);
            if(re_seed_match){
                let seed = re_seed_match[0].trim();
                if(seed.split(' ').length !== 25){
                    this.onCreateWalletFinished("could not get seed; invalid num words");
                }

                this._create_wallet['seed'] = seed;
                this.kill();
                this.onCreateWalletFinished(this._create_wallet);
            } else {
                this.kill();
                this.onCreateWalletFinished("could not get seed");
            }
        }
    }

    createWallet(wowdir, name, password){
        try { fs.unlinkSync(`${this._create_wallet_tmp_path}`); }
        catch(err) { }
        try { fs.unlinkSync(`${this._create_wallet_tmp_path}.keys`); }
        catch(err) { }

        let wowdir_name = path.join(wowdir, name);
        if(fs.existsSync(`${wowdir_name}`) || fs.existsSync(`${wowdir_name}.keys`)){
            this.onCreateWalletFinished(`Wallet already exists: ${wowdir_name}`);
            return;
        }

        let args = this._cli_args_default.concat(this._cli_args_create_wallet);
        args.push('--password');
        if(!password) {
            args.push('');
        } else {
            args.push(password);
        }

        this._setState('cw');
        console.log('FINAL ARGS:', args);
        this._cli_process = childProcess.spawn(this._cli_path, args);

        this._create_wallet['name'] = name;
        this._create_wallet['password'] = password;

        this._cli_process.stdout.on('data', function(data) {
            data = new TextDecoder("utf-8").decode(data);
            console.log("[cli] " + data);
            this._parse_stdout_create_wallet(data);
        }.bind(this));

        this._cli_process.stdout.on('end', function(data) {
            this._buffer = "";
            console.log('PROCESS ENDED!')
        });

        this._cli_process.on('exit', function(code) {
            this._buffer = "";
            if (code !== 0) {
                console.log('Failed: ' + code)
            }
        });
    }

    sendMonies(address, amount){
        let cmd = `transfer ${address} ${amount}`;
        console.log(cmd);
        this._sending = true;
        this._sendCmd(cmd)
    }

    connect(wallet_path, wallet_password){
        this._wallet_path = wallet_path;
        this._cli_wallet_password = wallet_password;

        if(typeof this._cli_daemon_address == 'undefined'){
            // this is some truly stupid hacky shit
            this._cli_daemon_address = 'node.wowne.ro:34568';
        }

        let cli_args = ['--daemon-address', this._cli_daemon_address];
        cli_args = cli_args.concat(this._cli_args_default);
        cli_args.push('--wallet-file');
        cli_args.push(wallet_path);
        cli_args.push('--password');
        cli_args.push(this._cli_wallet_password);

        console.log('FINAL ARGS:', cli_args);

        this._cli_process = childProcess.spawn(this._cli_path, cli_args);

        this._cli_process.stdout.on('data', function(data) {
            data = new TextDecoder("utf-8").decode(data);
            console.log("[cli] " + data);
            this._parse_stdout(data);
        }.bind(this));

        this._cli_process.stdout.on('end', function(data) {
            this._buffer = "";
            console.log('PROCESS ENDED!')
        });

        this._cli_process.on("error", function(e) { console.log(e); });
        this._cli_process.on('exit', function(code) {
            this._buffer = "";
            if (code !== 0) {
                console.log('Failed: ' + code)
            }
        });
    };

    exit(){
        this._state = 0;
        this._sendCmd('exit');  // seeya
        this.log(`Wallet closed: ${this._cli_wallet_address}`);
    }

    kill(){
        console.log('Wallet kill');
        this._buffer = "";
        this._state = 0;

        if(this._cli_process) {
            this._cli_process.stdout.pause();
            this._cli_process.stdin.pause();

            this._cli_process.kill('SIGKILL');  // F
            this.log(`Wallet closed: ${this._cli_wallet_address}`);
        }
    }

    _paymentReceived(tx_id, amount){
        this.log(`Incoming tx: ${tx_id}, ${amount}`);
    }

    _setBalance(balance){
        this.log(`New balance: ${balance}`);
        this._cli_balance = parseFloat(balance);

        this.wowCall(this.onWalletBalanceChanged, this._cli_balance);
    }

    _setBalanceUnlocked(balance){
        this.log(`New balance unlocked: ${balance}`);
        this._cli_balance_unlocked = parseFloat(balance);

        this.wowCall(this.onWalletBalanceUnlockedChanged, this._cli_balance_unlocked);
    }

    _setState(state){
        if(state === this._state) return;

        this.log(`New state: ${this._states[state]}`);
        this._state = state;

        if(state === 5){
            // connect check mempool loop
            // this._sendCmd('set ask-password 0');
            this._checkMemPool();
        }

        this.onStateChanged(state);
    }

    getTxId(txid){
        let found = false;
        this._cli_txs.forEach(function(obj){
            if(obj.id === txid){
                found = true;
            }
        });
        return found;
    }

    log(msg){
        console.log('\x1b[36m%s\x1b[0m', msg);
    }

    wowCall(fn, data){
        // ¯\_(ツ)_/¯
        if(fn != null){
            fn(data);
        }
    }

    getEmbeddedVersion(){
        console.log('Retrieving embedded version.');
        let args = ['--version'];
        this._cli_process = childProcess.spawn(this._cli_path, args);
        this._cli_process.stdout.on('data', (data) => {
            data = new TextDecoder("utf-8").decode(data);
            console.log("[cli] " + data);
            let version = data.trim().split(" ").slice(1).join(" ").trim();
            this._cli_process.kill();

            this.onEmbeddedVersion(version);
        });
    }

    onEmbeddedVersion(version){
        // overloaded
    }

    onWalletOpened(data){
        // overloaded
    }

    onCreateWalletFinished(){
        // overloaded
    }

    onWalletAddressChanged(){
        // overloaded
    }

    onWalletSelectedAccountChanged() {
        // overloaded
    }

    onWalletBalanceUnlockedChanged() {
        // overloaded
    }
    onWalletBalanceChanged() {
        // overloaded
    }
    onWalletTxsChanged(data) {
        // overloaded
    }

    onTransactionCompleted(){
        // overloaded
    }

    onHeightRefresh(data){
        // overloaded
    }

    onError(msg){
        // overloaded
    }

    onStateChanged(state){
        // overloaded
    }

    static isNumeric(value) {
        return /^\d+$/.test(value);
    }
}
