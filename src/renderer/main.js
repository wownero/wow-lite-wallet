import Vue from 'vue'

import App from './App'
import router from './router'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
import store from './store/index'

const EventBus = new Vue();
export default EventBus;

import { shell } from 'electron'


/* eslint-disable no-new */
let app = new Vue({
    components: {App},
    el: '#app',
    router,
    store,
    template: '<App/>',
    mounted () {
        jQuery(document).on('click', 'a[href^="http"]', function(event) {
            console.log(shell);
            event.preventDefault();
            shell.openExternal(this.href);
        });

        let self = null;

        this.$nextTick(() => {
            self = this;
        });

        this.$electron.ipcRenderer.on('rpc_get_wowdir', (event, data) => {
            this.$store.commit('addWalletDir', data);
        });

        this.$electron.ipcRenderer.on('rpc_wallet_created', (event, data) => {
            self.$store.commit('appState', null);

            if (typeof data === 'string' || data instanceof String) {
                this.$store.commit('showError', data);
                EventBus.$emit('wallet_created_error', 'error')
                return;
            }

            EventBus.$emit('wallet_created', data);
        });

        this.$electron.ipcRenderer.on('rpc_wallet_opened', (event, data) => {
            this.$store.commit('addWallet', data);
            this.$router.push({name: 'dashboard'});
        });

        this.$electron.ipcRenderer.on('rpc_wallet_closed', (event) => {
            this.$store.commit('showMessage', {
                'title': '',
                'message': ''
            });
            this.$store.commit('addWallet', {'txs': []});
            this.$store.commit('addWallet', {'balance': 0});
            this.$store.commit('addWallet', {'unlocked': 0});
            this.$store.commit('addWallet', {'address': ''});
            console.log('reset store');
            this.$router.push({name: 'landing-page'});
        });

        this.$electron.ipcRenderer.on('rpc_unlocked_changed', (event, data) => {
            this.$store.commit('addWallet', {'unlocked': data});
        });

        this.$electron.ipcRenderer.on('rpc_balance_changed', (event, data) => {
            this.$store.commit('addWallet', {'balance': data});
        });

        this.$electron.ipcRenderer.on('rpc_txs_changed', (event, data) => {
            console.log('txs changed', data);
            this.$store.commit('addWallet', {'txs': data});
        });

        this.$electron.ipcRenderer.on('rpc_height_refreshed', (event, data) => {
            console.log(data);
            this.$store.commit('addHeightRefresh', data);
        });

        this.$electron.ipcRenderer.on('rpc_state_changed', (event, data) => {
            this.$store.commit('addWallet', data);
        });
    }
});
