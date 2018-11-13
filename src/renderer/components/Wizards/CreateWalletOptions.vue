<template>
    <main class="create-wallet-options">
        <Header></Header>
        <div class="row">
            <div class="col-md-6">
                <form class="wallet_form" v-on:submit.prevent="onSubmit">
                    <div class="form-group">
                        <label for="name" class="control-label">Wallet name</label>
                        <input value="test" id="name" name="name" type="text" class="form-control" required="required">
                    </div>
                    <div class="form-group">
                        <label for="password" class="control-label">Wallet password</label>
                        <input id="password" name="password" type="password" class="form-control" aria-describedby="passwordHelpBlock">
                        <span id="passwordHelpBlock" class="help-block">A wallet password is recommended but not required.</span>
                    </div>
                    <div class="form-group">
                        <label for="location" class="control-label">Wallet path</label>
                        <input :value="walletDir" id="location" name="location" type="text" class="form-control" aria-describedby="locationHelpBlock" disabled>
                    </div>
                </form>
            </div>
            <div class="col-md-6">
                <div class="teh_matrix" style="border-radius:4px;width:100%;border:1px solid green;height:250px;overflow:hidden;background-color:black;">
                    <canvas id="q" width="450px" height="250px"></canvas>
                    <span class="centered"></span>
                    <img class="doge" width=80px src="~@/assets/doge_icon.png"/>
                    <span class="title">Very Secure Wallet Generator™</span>
                    <span class="body">
                        ☑ many encryptions<br>
                        ☑ so keccak-256<br>
                        ☑ very password<br>
                        ☑ magic<br>
                    </span>
                </div>
            </div>
        </div>
        <navigation ref="nav"></navigation>
    </main>
</template>

<script>
    import EventBus from './../../main';
    import Header from './components/Header'
    import Navigation from './components/Navigation'

    export default {
        name: "CreateWalletOptions",
        components: {Header, Navigation},
        beforeRouteLeave(to, from, next) {
            next();
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
                let wallet_name = jQuery(".wallet_form input#name").val();
                let wallet_pass = jQuery(".wallet_form input#password").val();

                if(!wallet_name) {
                    this.$store.commit('showError', 'Thou shall specify a wallet name');
                } else {
                    this.create_wallet(wallet_name, wallet_pass);
                }
            },
            create_wallet (name, password) {
                this.clearMatrixMsg();
                this.showMatrixMsg('GENERATING NEW WALLET')

                this.$store.commit('appState', "create_wallet");
                ipcRenderer.send('rpc_create_wallet', {name: name, password: password})
            },
            showMatrixMsg(msg){
                let obj = jQuery('.teh_matrix span.centered');
                obj.css('display', 'inline');
                obj.html(msg);
            },
            randomMatrixMsg(){
                let obj = jQuery('.teh_matrix .centered');
                let val = obj.html();
                let new_val = null;

                while(1) {
                    new_val = this.lulz[Math.floor(Math.random() * this.lulz.length)].toUpperCase();
                    if(new_val !== val){
                        obj.html(new_val);
                        return;
                    }
                }
            },
            showMatrix(){
                jQuery('.teh_matrix span').each(function(i, obj){
                    jQuery(obj).css('opacity', '1');
                });
                jQuery('.teh_matrix img').each(function(i, obj){
                    jQuery(obj).css('opacity', '1');
                });
            },
            showMatrixGenerating(){
                this.clearMatrixMsg();
                let obj = jQuery('.teh_matrix .centered');
                obj.html('...GENERATING NEW WALLET...');
            },
            clearMatrixMsg(){
                jQuery('.teh_matrix span, .teh_matrix img').each(function(i, obj){
                    obj = jQuery(obj);
                    obj.css('display', 'none');
                });
            }
        },
        mounted() {
            let self = this;

            EventBus.$on('wallet_created', function (data) {
                data['name'] = jQuery(".wallet_form input#name").val();
                self.$store.commit('addCreatedWallet', data);
                self.$router.push({name: 'create-wallet-seed'});
            });

            EventBus.$on('wallet_created_error', function (data) {
                self.clearMatrixMsg();
                self.showMatrixMsg('¯\\_(ツ)_/¯')
            });

            setTimeout(this.showMatrix, 200);

            // get wowdir
            ipcRenderer.send('rpc_get_wowdir');

            jQuery(document).ready(function(){
                let q = document.getElementById('q');
                let width = q.width;
                let height = q.height;
                let yPositions = Array(300).join(0).split('');
                let ctx = q.getContext('2d');

                let draw = function () {
                    ctx.fillStyle='rgba(0,0,0,.05)';
                    ctx.fillRect(0,0,width,height);
                    ctx.fillStyle='#0F0';
                    ctx.font = '10pt Georgia';
                    yPositions.map(function(y, index){
                        let text = String.fromCharCode(1e2+Math.random()*33);
                        let x = (index * 10)+10;
                        q.getContext('2d').fillText(text, x, y);
                        if(y > 100 + Math.random()*1e4)
                        {
                            yPositions[index]=0;
                        }
                        else
                        {
                            yPositions[index] = y + 10;
                        }
                    });
                };

                let matrix_interval = null;
                function RunMatrix(){
                    matrix_interval = setInterval(draw, 33);
                }

                RunMatrix();

                function StopMatrix() {
                    clearInterval(matrix_interval);
                }
            })
        },
        computed: {
            wallet() {
                return this.$store.getters.created_wallet;
            },
            walletDir(){
                return this.$store.state.wallet_dir;
            },
            walletCreating(){
                return this.$store.state.wallet_creating;
            }
        }
    }
</script>

<style scoped>
</style>
