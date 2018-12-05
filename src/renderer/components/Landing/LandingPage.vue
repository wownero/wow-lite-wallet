<template>
    <main class="landing">
        <div class="row">
            <div class="col-sm-7">
                <img id="logo" src="~@/assets/wownero-light-intro.png" alt="electron-vue">

                <p>Welcome to wownero light!</p>
                <ul style="margin-bottom: 22px">
                    <li>Electron/Vue.js <small>(OSX/Windows/Linux)</small></li>
                    <li>Works most of the time</li>
                </ul>

                <button id="create_wallet_btn" v-on:click="createWallet" type="button" class="btn btn-success btn-sm">
                    <i class="fa fa-plus" id="create_wallet_icon" aria-hidden="true"></i>
                    Create wallet
                </button>

                <div class="dropdown" style="display: inline-block;">
                    <button class="btn btn-success btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-folder-open" aria-hidden="true"></i>
                        Open wallet
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a v-on:click="openWallet" class="dropdown-item" href="#">Browse</a>
                        <a v-on:click="openLastWallet" v-if="cfg_wallet_path !== ''" class="dropdown-item" href="#">{{cfg_wallet_path_name}}</a>
                    </div>
                </div>

                <button id="" v-on:click="settings" type="button" class="btn btn-success btn-sm">
                    <!-- fa fa-refresh fa-spin -->
                    <i class="fa fa-cog" aria-hidden="true"></i>
                    Settings
                </button>
            </div>

            <div class="col-sm-5">
                <div class="card my-4" style="margin-top: 0 !important;">
                    <h5 class="card-header">Node</h5>
                    <div class="card-body node">
                        <div class="form-group node_select">
                            <select id="selectnode" class="form-control">
                                <option :selected="selected_node === node.address" v-bind:value="node.address" v-for="node in nodes">{{node.region}} - {{node.address}}</option>
                            </select>
                            <div class="node_status">
                                <small class="location"></small>
                            </div>
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
            settings(){
                this.$router.push({name: 'settings'});
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
            },
            openLastWallet(){
                if(!this.cfg_wallet_path || this.cfg_wallet_path === ''){
                    alert('Invalid wallet path?!');
                    return;
                }

                this.$store.commit('addWalletPath', this.cfg_wallet_path);
                this.$store.commit('showPassword', {
                    'message': 'Enter wallet password'
                });

                setTimeout(() => {
                    jQuery('#password').focus();
                }, 50);
            }
        },
        mounted() {
            let select_node = jQuery('#selectnode');
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
                    dialog.showMessageBox(dialogOptions, i => {});
                }
            });

            this.$electron.ipcRenderer.on('rpc_wallet_opening', (event) => {
                console.log('opening');
                this.$store.commit('showMessage', {
                    'title': 'Opening Wallet...',
                    'message': ''
                });
            });

            select_node.on('change', (fuckme) => {
                let address = fuckme.currentTarget.value;
                let nodes = this.$store.getters.cfg.nodes;
                let node = nodes.find(_node => _node.address === address)

                ipcRenderer.send('rpc_cfg_set_node', node.address);

                jQuery('.node_status .location').html(`Location: ${node.location}`);
            });
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
            },
            nodes(){
                return this.$store.getters.cfg.nodes;
            },
            selected_node(){
                return this.$store.getters.cfg.node;
            },
            cfg_wallet_path(){
                return this.$store.getters.cfg.wallet_path;
            },
            cfg_wallet_path_name(){
                let path = require("path");
                return path.basename(this.cfg_wallet_path);
            }
        }
    }
</script>
