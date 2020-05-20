import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        height_from: 0,  // height refreshes
        height_to: 0,
        wallet_dir: "",
        cfg: {
            "node": "",
            "nodes": [],
            "wallets": []
        },
        created_wallet: {},  // only used when creating wallets
        appState: "",  // not really used
        error: "",
        message_box: {
            'title': '',
            'message': ''
        },
        password_box: {
            'message': ''
        },
        btc_rate: 0,  // per 1000 WOW
        wallet: {
            'path': '',
            'txs': [],
            'balance': 0,
            'unlocked': 0,
            'address': '',
            'btc': 0,
            'state': -1
        }, // wallet opened
        wallet_path: '',
        wallet_password: '',
        version_embedded: '',
        version: require('electron').remote.app.getVersion()
    },
    mutations: {
        addEmbeddedVersion(state, data){
            state.version_embedded = data.version;
        },
        addCreatedWallet({ created_wallet }, data) {
            created_wallet.seed = data.seed;
            created_wallet.address = data.address;
            created_wallet.view_key = data.view_key;
            created_wallet.name = data.name;
            created_wallet.password = data.password;
        },
        addWalletDir(state, data){
            state.wallet_dir = data;
        },
        addCfg({cfg}, data){
            console.log('store addCfg');
            if (typeof data === 'string' || data instanceof String){ // fucku javascript
                data = JSON.parse(data);
            }

            if(data.hasOwnProperty('node')){
                cfg.node = data.node;
            }

            if(data.hasOwnProperty('nodes')){
                cfg.nodes = data.nodes;
            }

            if(data.hasOwnProperty('wallet_path')){
                cfg.wallet_path = data.wallet_path;
            }

            if(data.hasOwnProperty('wallets')){
                cfg.wallets = data.wallets;
            }
        },
        appState(state, data){
            state.appState = data;
        },
        addRate(state, data){
            state.btc_rate = data;
        },
        showError(state, data){
            state.error = data;
        },
        showMessage(state, data){
            state.message_box.title = data.title;
            state.message_box.message = data.message;
        },
        showPassword(state, data){
            console.log('setShowPassword')
            state.password_box.message = data.message;
        },
        addHeightRefresh(state, data){
            state.height_from = data.from;
            state.height_to = data.to;
        },
        addWallet({wallet}, data){
            if(data.hasOwnProperty('wallet_path')){
                wallet.path = data.wallet_path;
            }

            if(data.hasOwnProperty('txs')){
                console.log('setting store: txs')
                wallet.txs = data.txs;
            }

            if(data.hasOwnProperty('balance')){
                wallet.balance = data.balance;
            }

            if(data.hasOwnProperty('unlocked')){
                wallet.unlocked = data.unlocked;
            }

            if(data.hasOwnProperty('address')){
                wallet.address = data.address;
            }

            if(data.hasOwnProperty('state')){
                wallet.state = data.state;
            }
        },
        addWalletPath(state, path){
            state.wallet_path = path;
        },
        addWalletPassword(state, password){
            state.wallet_password = password;
        }
    },
    getters: {
        created_wallet: state => state.created_wallet,
        wallet_dir: state => state.wallet_dir,
        appState: state => state.appState,
        error: state => state.error,
        wallet: state => state.wallet,
        wallet_path: state => state.wallet_path,
        wallet_password: state => state.wallet_password,
        btc_rate: state => state.btc_rate,
        message_box: state => state.message_box,
        password_box: state => state.password_box,
        height_from: state => state.height_from,
        height_to: state => state.height_to,
        version_embedded: state => state.version_embedded,
        cfg: state => state.cfg
    }
});
