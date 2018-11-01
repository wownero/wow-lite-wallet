<template>
    <main class="create-wallet-seed">
        <Header></Header>
        <div class="row">
            <div class="col-md-6">
                <span class="title">
                    Seed
                </span>
                <p>
                    <b>Write your seed down</b>.
                    It's your only chance to recover a lost wallet.
                </p>
                <p>
                    <textarea style="height:150px" class="seed" name="text" rows="6" cols="40" :value="wallet.seed"></textarea>
                </p>
                <span class="title">
                    View key
                </span>
                <p>
                    <textarea style="height:70px" class="seed" name="text" rows="6" cols="40" :value="wallet.view_key"></textarea>
                </p>
            </div>
            <div class="col-md-6">
                <span class="title">
                    Overview
                </span>
                <p>
                    Your wallet is about to be created in:
                </p>
                <ul>
                    <li>
                    <code>{{walletDir}}</code>
                    </li>
                </ul>
                <p>
                    2 files will be written:
                </p>
                <ul>
                    <li><code>{{wallet.name}}.keys</code></li>
                    <li><code>{{wallet.name}}.cache</code></li>
                </ul>
                <p>
                    Where <code>.keys</code> is the wallet and <code>.cache</code> holds transactional
                    information. You ought to backup either the <code>.keys</code> file or the seed text as shown.
                </p>

                <div class="form-check" style="margin-top:14px;">
                    <label class="form-check-label">
                        <input v-on:click="toggleValid" class="form-check-input" type="checkbox" value="" id="tos_checkbox">
                        This is an useless checkbox. You are required to tick it. Sucks, but there are worse things in life.

                    </label>
                </div>
            </div>
        </div>
        <navigation></navigation>
    </main>
</template>

<script>
    const path = require('path');
    import EventBus from './../../main';
    import Header from './components/Header'
    import Navigation from './components/Navigation'

    export default {
        name: "CreateWalletSeed",
        components: {Header, Navigation},
        beforeRouteLeave(to, from, next) {
            console.log('weiowehweh');
            next();
        },
        mounted () {
            this.toggleValid();
        },
        methods: {
            toggleValid() {
                let tos = jQuery('.btn_next');
                tos.attr("disabled", !tos.attr("disabled"));
            },
            goBack(){
                this.$router.push({name: 'landing-page'});
            },
            goNext(){
                ipcRenderer.send('rpc_commit_wallet', this.$store.getters.created_wallet);

                this.$electron.ipcRenderer.on('rpc_wallet_committed', (event) => {
                    let path = require('path');
                    let path_wallet = path.join(this.walletDir, this.wallet.name);

                    ipcRenderer.send('rpc_open_wallet', {
                        path: path_wallet, password: this.wallet.password
                    });

                    this.$router.push({name: 'landing-page'});
                });
            },
        },
        computed: {
            wallet() {
                return this.$store.getters.created_wallet;
            },
            walletDir(){
                return this.$store.state.wallet_dir;
            }
        }
    }
</script>

<style scoped>
</style>
