<template>
    <transition name="fade">
            <div class="password_seq">
                <div class="cardish"></div>
                <div class="fbi"></div>
                <div class="tao"></div>
                <div class="imsi"></div>
                <div class="secure"></div>
                <div class="sat"></div>
                <div class="drone"></div>
                <div class="heli"></div>

                <div class="grass_container">
                    <div class="grass"></div>
                    <div class="grassfill"></div>
                </div>
            </div>
    </transition>

</template>

<script>
    export default {
        name: "WarioPassword",
        computed: {
            wallet() {
                return this.$store.getters.wallet;
            },
            btc(){
                return (this.$store.getters.btc_rate) * this.$store.getters.wallet.balance;
            },
            bubble_img() {
                let rate = this.$store.getters.btc_rate;
                let btc = rate * this.$store.getters.wallet.balance;

                if(btc < 1){
                    return this.path_bubble(0);
                } else if(btc < 100){
                    return this.path_bubble(1);
                } else if(btc < 500){
                    return this.path_bubble(2);
                } else if(btc < 1000){
                    return this.path_bubble(3);
                } else if(btc < 1000){
                    return this.path_bubble(4);
                }
            }
        },
        methods: {
            path_bubble(number) {
                // vuejs+webpack sux
                return require(`../../../assets/bubbles/${number}.png`);
            }
        },
        mounted() {
            let drone = jQuery('.drone');
            let window_width = jQuery(window).width();

            function drone_animate(){
                drone.animate({
                    left: `${window_width}px`
                }, 16000, 'linear', () => {
                    drone.css('left', '-100px');
                    drone_animate();
                });
            }

            drone_animate();
        }
    }
</script>

<style scoped>

</style>
