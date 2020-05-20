<template>
    <nav class="navbar navbar-dark bg-dark fixed-top navbar-expand-md">
        <div class="container nopadding nomargin">
            <a class="navbar-brand" href="#">
                <img id="logo" src="~@/assets/wownero.png">
            </a>

            <div class="balance_container">
                <span class="balance">
                    Balance: <span>{{wallet.balance}}</span>
                </span>
                |
                <span class="balance_btc">
                    Unlocked: <span>{{wallet.unlocked}}</span>
                </span>
                |
                <span class="balance_btc">
                    BTC: <span>{{Number(btc_rate*wallet.balance).toFixed(9)}}</span>
                </span>
            </div>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
                    aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ml-auto clickme">
                    <li class="nav-item">
                        <a class="nav-link" v-on:click="closeWallet">
                            <i class="fa fa-sign-out" aria-hidden="true"></i>
                            Back
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "DashboardNavbar",
        computed: {
            wallet() {
                return this.$store.getters.wallet;
            },
            btc_rate() {
                return this.$store.getters.btc_rate;
            }
        },
        methods: {
            closeWallet(){
                console.log('closing');
                ipcRenderer.send('rpc_close_wallet');
            }
        }
    }
</script>

<style scoped>

</style>
