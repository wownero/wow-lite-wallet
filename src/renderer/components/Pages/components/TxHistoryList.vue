<template>
    <div class="col-md-12 nopadding nomargin">
        <div class="card my-6" id="incoming_txs" data-collapsed="true">
            <h5 class="card-header" @click="$parent.collapse">
                <i class="fa fa-bars" aria-hidden="true"></i>
                Transaction history <small>({{txs.length}})</small>
            </h5>
            <div class="card-body" style='background-color: transparent;'>
                <div v-if="txs.length === 0 && wallet.shown_transfers">
                    <center>
                        No transactions yet
                        <br>
                        <br>
                        <img src="~@/assets/wizard.png"/>
                    </center>
                </div>

                <ul class="list-group" >
                    <li class="list-group-item tx_item" v-for="tx in txs">
                        <span class="datetime">
                            {{tx.date}}
                        </span>

                        <span class="height">
                            <b>Blockheight</b>: {{tx.blockheight}}
                        </span>

                        <br>
                        <a style="font-family: sans-serif;" target="_blank" :href="`https://explore.wownero.com/tx/${tx.id}`">{{tx.id.substring(0, 20)}}...</a>
                        <a style="margin-left:4px;" href="#"></a>

                        <span class="amount" :data-in="tx.in">
                            <span class="direction">
                                {{tx.in === 'in' ? '+' : '-'}}{{tx.amount}}

                                <small style="color: black">
                                    ➞ $ {{Number((usd_rate/1000)*tx.amount).toFixed(2)}}
                                </small>
                            </span>
                        </span>
                    </li>
                </ul>

                <br>

                <center v-if="txs.length > 100">
                    <small>(Showing last 100 transactions)</small>
                </center>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TxHistoryList",
        computed: {
            usd_rate() {
                return this.$store.getters.usd_rate;
            },
            wallet() {
                return this.$store.getters.wallet;
            },
            txs() {
                let txs_store = this.$store.getters.wallet.txs;
                let _txs = [];
                let _txs_pooled = [];

                txs_store.map((tx, i) => {
                    if(this.isNumeric(tx.blockheight)){
                        _txs.push(tx);
                    } else {
                        _txs_pooled.push(tx);
                    }
                });

                _txs = _txs.sort((a, b) => {
                    return a.blockheight - b.blockheight;
                }).reverse();

                _txs_pooled.map((tx, i) => {
                    _txs.insert(0, tx);
                });
                return _txs;
            }
        },
        methods: {
            isNumeric(value) {
                return /^\d+$/.test(value);
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
            },
            showMatrixMsg(msg){
                let obj = jQuery('.teh_matrix span.centered');
                obj.css('display', 'inline');
                obj.html(msg);
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>