<template>
    <main class="enterpassword">
        <div class="password_container">
            <div class="row">
                <div class="col-md-12">
                    <h5>Enter wallet password:</h5>
                    <form class="unlock-form">
                        <div class="input-group">
                            <input type="password" id="password" class="form-control" placeholder="Secure Wallet Password Login Authentication" required="" autofocus autocomplete="off" style="z-index:666;">
                        </div>
                    </form>
                </div>
            </div>

            <div class="row" style="margin-top:12px;">
                <div class="col-md-12">
                    <div class="btn-group btn-group-justified pull-right">
                        <a href="#" v-on:click="back" class="btn btn-sm btn-light">ABORT! ABORT!</a>
                        <a href="#" v-on:click="login" class="btn btn-sm btn-primary">Continue</a>
                    </div>
                </div>
            </div>
        </div>

        <wario-password></wario-password>
    </main>
</template>

<script>
    import WarioPassword from './components/WarioPassword'

    export default {
        name: 'EnterPassword',
        components: {WarioPassword},
        beforeRouteLeave(to, from, next) {
            next();
        },
        methods: {
            login() {
                let password = jQuery('#password').val();
                this.$store.commit('addWalletPassword', password);

                ipcRenderer.send('rpc_open_wallet', {
                    path: this.walletPath, password: this.walletPassword
                });

                this.$router.push({name: 'landing-page'});
            },
            back(){
                this.$router.push({name: 'landing-page'});
            }
        },
        mounted() {
            jQuery('main.credits .hypnotoad').click((event) => {
                this.back();
            });
            jQuery('#password').focus();
        },
        computed: {
            walletPath(){
                return this.$store.state.wallet_path;
            },
            walletPassword(){
                return this.$store.state.wallet_password;
            },
            walletDir(){
                return this.$store.state.wallet_dir;
            }
        }
    }
</script>
