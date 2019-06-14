<template>
    <div class="wario_seq">
        <div class="wario_walking_animated">
            <div class="wario_walking">

            </div>
            <div class="coin" style="height: 20px;width: 20px;top:0;right:10px;"></div>
            <div class="coin" style="height: 32px;width: 28px;top:14px;right:38px;-webkit-transform: scaleX(-1);"></div>
            <div class="coin" style="height: 20px;width: 20px;top:30px;right:22px;"></div>
            <div class="coin" style="height: 24px;width: 24px;top:54px;right:32px;"></div>
        </div>

        <div class="perlsux"></div>

        <div class="grass_container">
            <div class="grass"></div>

            <div class="grassfill">
                <span class="version">
                    0.1.3 - <span style="font-size:12px;">{{version_embedded}}</span>
                </span>
                <a class="credits" href="#"  v-on:click="openCredits">
                    Credits
                </a>
                <span class="author">
                    dsc
                </span>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "WarioLanding",
        data(){
            return {
                'electron_version': null
            }
        },
        mounted() {
            let wario = jQuery('.wario_walking_animated');
            let window_width = jQuery(window).width();

            function wario_animate(){
                wario.animate({
                    left: `${window_width}px`
                }, 8000, 'linear', () => {
                    wario.css('left', '-400px');
                    wario_animate();
                });
            }

            wario_animate();
        },
        methods: {
            openCredits(){
                this.$router.push({name: 'credits'});
            }
        },
        computed: {
            version_embedded(){
                return this.$store.state.version_embedded;
            },
            version(){
                return this.$store.state.version;
            }
        }
    }
</script>

<style scoped>

</style>