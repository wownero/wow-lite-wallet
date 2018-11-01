<template>
    <div class="col-md-12 nopadding nomargin">
        <div class="card my-6" id="dashboard_send" data-collapsed="true">
            <h5 class="card-header" @click="$parent.collapse">
                <i class="fa fa-bars" aria-hidden="true"></i>
                Send
            </h5>
            <div class="card-body" style='background-color: transparent;'>
                <div class="row">
                    <div class="col-md-12">
                        <form id="sendForm" role="form" lpformnum="2" _lpchecked="1" onsubmit="return false;">
                            <!-- text input -->
                            <div class="form-group">
                                <label>Destination address</label>
                                <textarea placeholder="WO..." rows=1 v-on:input="validate" class="form-control address"></textarea>
                            </div>

                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-group amount">
                                        <label>Amount <small class="amount_usd"></small></label>
                                        <input type="text" v-on:input="validate" v-on:keypress="isAmount()" name="amount" class="form-control amount" placeholder="Amount">
                                    </div>
                                </div>
                                <div class="col-md-6"></div>
                                <div class="col-md-3">
                                    <div class="form-group pull-right">
                                        <label>&nbsp;</label>

                                        <button class="btn btn-primary send_btn disabled" style="display:block;min-width: 140px;"v-on:click="sendMonies();" type="submit">Send</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="col-md-6">

                    </div>
                </div>
                <div class="row" v-if="error !== ''">
                    <div class="col-md-12">
                        <code>Error: {{error}}</code>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Send",
        data () {
            return {
                'error': '',
                'messages_sending_tx': [
                    "This could take a while. Or not. Who knows? It might even give you an error.",
                    "Call your local bank if this is taking too long.",
                    "inb4 F5-spamming the block explorer.",
                    "a^2 + b^2 = c^2. Quick maths.",
                    "Draining wallet in favor of hookers and blow.",
                    "Dear blockchain, please accept this transaction as formal notification that I want to transfer some WOW. Apologies for the inconvenience.",
                    "Currently transferring magic internet money.",
                    "\"Oh, that was a darknet market? Must've filled out the wrong address!\"",
                    "You'll never get rich by spending WOW!",
                    "PRIVMSG wowario wen lightning network?\\r\\n",
                    "Thank you for using WOW. Please like and subscribe.",
                    "Perl not involved in the creation of this transaction.",
                    "zZzzZ.. Are we done yet?"
                ]
            }
        },
        computed: {
            wallet() {
                return this.$store.getters.wallet;
            },
            usd_rate() {
                return this.$store.getters.usd_rate;
            }
        },
        methods: {
            isAmount(evt) {
                evt = (evt) ? evt : window.event;
                let charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                    evt.preventDefault();
                } else {
                    return true;
                }
            },
            entryFromArr(arr){
                return arr[Math.floor(Math.random() * arr.length)];
            },
            sendMonies(){
                if(!this.validate()){
                    return;
                }

                let form = jQuery('#sendForm');
                let address = form.find('textarea.address').val().trim();
                let amount = form.find('input.amount').val().trim();

                const {dialog} = require('electron').remote
                const dialogOptions = {
                    type: 'info',
                    title: 'Confirm transaction',
                    buttons: ['OK', 'Cancel'],
                    message: `Please confirm the transaction.\n\nAmount: ${amount}\nAddress: ${address}\n\nIs this okidoki?`
                }

                dialog.showMessageBox(dialogOptions, i => {
                    if(i === 0){
                        this.$store.commit('showMessage', {
                            'title': 'Creating transaction',
                            'message': this.entryFromArr(this.messages_sending_tx)
                        });

                        ipcRenderer.send('rpc_send_monies', {address: address, amount: amount});
                    }
                })

            },
            validate(){
                this.error = '';
                let form = jQuery('#sendForm');
                let regexp_address = /(W[o|W][a-zA-Z0-9]{95})/g;
                let address = form.find('textarea.address').val().trim();
                let amount = form.find('input.amount').val().trim();
                let usd = jQuery('form#sendForm .amount label small');

                let invalid = function(msg){
                    jQuery('button.send_btn').addClass('disabled');
                }

                if(amount.startsWith('.') || amount.endsWith('.')) {
                    this.error = 'Invalid WOW amount'
                    usd.html('');
                    return invalid();
                }

                if((amount.split('.').length - 1) > 1){
                    this.error = 'Invalid WOW amount';
                    usd.html('');
                    return invalid();
                }

                if((amount == 0)){
                    //this.error = 'Invalid WOW amount';
                    usd.html('');
                    return invalid();
                }

                usd.html(`(${Number((this.usd_rate/1000)*amount).toFixed(2)} USD)`);

                let addy_match = address.match(regexp_address);
                if(!addy_match){
                    this.error = 'Invalid WOW address'
                    return invalid();
                }

                if(this.wallet.balance > 0 && this.wallet.unlocked === 0) {
                    this.error = 'Unlocked balance is zero. Wait a bit (typically ~10 minutes)';
                    return invalid();
                } else if(amount <= this.wallet.balance && amount >= this.wallet.unlocked){
                    this.error = 'Not enough unlocked balance. Wait a bit (typically ~10 minutes)';
                    return invalid();
                } else if(this.wallet.unlocked === 0){
                    return invalid();
                } else if(amount > this.wallet.balance) {
                    this.error = 'You ain\'t got that kind of money bro';
                    return invalid();
                }

                jQuery('button.send_btn').removeClass('disabled');
                return true;
            }
        },
        mounted () {
            this.$electron.ipcRenderer.on('rpc_monies_sent_error', (event, data) => {
                this.error = data.message;
            });
        }
    }
</script>

<style scoped>

</style>
