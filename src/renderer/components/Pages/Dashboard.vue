<template>
    <main class="dashboard">
            <navbar-dashboard></navbar-dashboard>
            <send></send>
            <receive></receive>
            <tx-history></tx-history>
            <wario-txs></wario-txs>
    </main>
</template>

<script>
    import EventBus from './../../main';
    import Send from './components/Send'
    import Receive from './components/Receive'
    import TxHistory from './components/TxHistoryList'
    import NavbarDashboard from './components/Navbar'
    import WarioTxs from './WarioTxs'

    export default {
        name: 'dashboard',
        components: {WarioTxs, TxHistory, Send, Receive, NavbarDashboard},
        beforeRouteLeave(to, from, next) {
            next();
        },
        computed: {
            wallet() {
                return this.$store.getters.wallet;
                // return {
                //     'balance': 4000
                // }
            },
            txs() {
                // let wallet = this.$store.getters.wallet;
                // if(wallet.hasOwnProperty('txs')){
                //     return wallet.txs;
                // } else {
                //     return [];
                // }
            }
        },
        methods: {
            getStore(){
                let x = this.$store;
                debugger;
            },
            collapse(event){
                let obj = jQuery(event.target).parent();
                obj.attr('data-collapsed', obj.attr('data-collapsed') === 'false');
            }
        },
        mounted() {
            // should possibly move these events up the component stack
            this.$electron.ipcRenderer.on('rpc_sending_monies', (event) => {
                let notif = new Notification('Pending transaction', {
                    body: 'Sending transaction...'
                });
            });

            this.$electron.ipcRenderer.on('rpc_monies_sent_error', (event, data) => {
                // show notification
                let notif = new Notification('Transaction failed!', {
                    body: data.message
                });

                // reset loading view
                this.$store.commit('showMessage', {
                    'title': '',
                    'message': ''
                });
            });

            this.$electron.ipcRenderer.on('rpc_monies_sent', (event, data) => {
                // show notification
                let notif = new Notification('Transaction complete', {
                    body: 'Transaction sent!'
                });

                // reset loading view
                this.$store.commit('showMessage', {
                    'title': '',
                    'message': ''
                });
            });
        }
    }
</script>
