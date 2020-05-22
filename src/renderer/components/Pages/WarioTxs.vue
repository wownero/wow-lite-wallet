<template>
    <transition name="fade">
            <div class="wario_seq" v-if="show_wario">
                <div class="wario_standing_animated">
                    <div class="wario_standing">

                    </div>

                    <div v-if="btc < 1">
                        <div class="bubble" :style="`background-image: url(${this.path_bubble(0)})`"></div>
                    </div>

                    <div v-else-if="btc < 100">
                        <div class="bubble" :style="`background-image: url(${this.path_bubble(1)})`"></div>
                    </div>

                    <div v-else-if="btc < 500">
                        <div class="bubble" :style="`background-image: url(${this.path_bubble(2)})`"></div>
                    </div>

                    <div v-else-if="btc < 1500">
                        <div class="bubble" :style="`background-image: url(${this.path_bubble(3)})`"></div>
                    </div>

                    <div v-else-if="btc >= 1500">
                        <div class="bubble" :style="`background-image: url(${this.path_bubble(4)})`"></div>
                    </div>
                </div>

                <div class="grass_container">
                    <div class="grass"></div>
                    <div class="grassfill"></div>
                </div>
            </div>
    </transition>

</template>

<script>
    export default {
        name: "WarioTxs",
        computed: {
            wallet() {
                return this.$store.getters.wallet;
            },
            btc(){
                return this.$store.getters.btc_rate * this.$store.getters.wallet.balance;
            },
            bubble_img() {
                let bal = this.$store.getters.wallet.balance;

                if(bal < 1){
                    return this.path_bubble(0);
                } else if(bal < 100){
                    return this.path_bubble(1);
                } else if(bal < 1000){
                    return this.path_bubble(2);
                } else if(bal < 2000){
                    return this.path_bubble(3);
                } else if(bal > 2000){
                    return this.path_bubble(4);
                }
            }
        },
        data () {
            return {
                'show_wario': true
            }
        },
        methods: {
            path_bubble(number) {
                // vuejs+webpack sux
                return require(`../../assets/bubbles/${number}.png`);
            }
        },
        mounted() {
            setTimeout((event) => {
                this.show_wario = false;
            }, 4000);
        }
    }
</script>

<style scoped>

</style>