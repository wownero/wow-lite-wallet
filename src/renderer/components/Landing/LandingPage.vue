<template>
    <main class="landing">
        <div class="row">
            <div class="col-sm-7">
                <img id="logo" src="~@/assets/wownero-light-intro.png" alt="electron-vue">

                <p>Welcome to wownero light!</p>
                <ul style="margin-bottom: 22px">
                    <li>Electron/Vue.js <small>(OSX/Windows/Linux)</small></li>
                    <li>Remote node only</li>
                </ul>

                <button id="create_wallet_btn" v-on:click="createWallet" type="button" class="btn btn-success">
                    <i class="fa fa-plus" id="create_wallet_icon" aria-hidden="true"></i>
                    Create a new wallet
                </button>

                <button id="x_btn" v-on:click="openWallet" type="button" class="btn btn-success">
                    <!-- fa fa-refresh fa-spin -->
                    <i class="fa fa-folder-open" aria-hidden="true"></i>
                    Open wallet
                </button>
            </div>

            <div class="col-sm-5">
                <div class="card my-4" style="margin-top: 0 !important;">
                    <h5 class="card-header">Node</h5>
                    <div class="card-body node">
                        <div class="form-group">
                            <select class="form-control">
                                <option>node.wowne.ro:34568</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="card my-4 wfs-explorer" style="margin-top: 0 !important;">
                    <h5 class="card-header">Funding required</h5>
                    <div class="card-body">
                        <wfs-explorer></wfs-explorer>
                    </div>
                </div>
            </div>
        </div>

        <wario-landing></wario-landing>
        <transition name="fade">
            <div class="refresh" v-if='wallet.state === 3'>
                <div class="box">
                    <div class="text">
                        {{height_from}} / {{height_to}}
                    </div>
                </div>
            </div>
        </transition>
    </main>
</template>

<script>
    import WalletExplorer from './components/WalletExplorer'
    import WfsExplorer from './components/WfsExplorer'
    import WarioLanding from './WarioLanding'

    export default {
        name: 'LandingPage',
        components: {WalletExplorer, WfsExplorer, WarioLanding},
        beforeRouteLeave(to, from, next) {
            next();
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            createWallet(){
                // make sure any stale process is killed anyway ;/
                ipcRenderer.send('rpc_kill_wallet');

                this.$router.push({name: 'create-wallet-options'});
            },
            openWallet(){
                const {dialog} = require('electron').remote;

                dialog.showOpenDialog({
                    defaultPath: this.$store.state.wallet_dir,
                    properties: ['openFile'],
                    filters: {
                        name: 'All Files',
                        extensions: ['*.keys']
                    }
                }, (files) => {
                    if (files !== undefined) {
                        this.$store.commit('addWalletPath', files[0]);

                        this.$store.commit('showPassword', {
                            'message': 'Enter wallet password'
                        });

                        setTimeout(() => {
                            jQuery('#password').focus();
                        }, 50);
                    }
                });
            }
        },
        mounted() {
            const axios = require('axios');
            axios.get('https://funding.wownero.com/api/1/convert/wow-usd?amount=1000').then(response => {
                this.$store.commit('addRate', response.data.usd);
            });

            let appVersion = require('electron').remote.app.getVersion();
            axios.get(`https://funding.wownero.com/api/1/wowlight?version=${appVersion}`).then(response => {
                if(response.data.data === false) {
                    const {dialog} = require('electron').remote
                    const dialogOptions = {
                        type: 'error',
                        title: 'Outdated client',
                        buttons: ['OK'],
                        message: `You are running an old instance of wowlight and need to upgrade!\n\nVisit https://light.wownero.com for a shiny new version.`
                    }
                    dialog.showMessageBox(dialogOptions, i => {
                    });
                }
            });

            ipcRenderer.send('rpc_get_wowdir');

            this.$electron.ipcRenderer.on('rpc_wallet_opening', (event) => {
                console.log('opening');
                this.$store.commit('showMessage', {
                    'title': 'Opening Wallet...',
                    'message': ''
                });
            });

            //this.$router.push({name: 'dashboard'});
        },
        computed: {
            walletDir(){
                return this.$store.state.wallet_dir;
            },
            height_from() {
                return this.$store.getters.height_from;
            },
            height_to() {
                return this.$store.getters.height_to;
            },
            wallet(){
                return this.$store.state.wallet;
            }
        }
    }
</script>
