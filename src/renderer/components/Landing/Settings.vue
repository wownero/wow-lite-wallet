<template>
    <main class="credits">
        <div class="row">
            <div class="col-sm-12">
                <div class="row">
                    <div class="col-sm-12" style="margin-bottom:4px;">
                        <h4>Settings</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <p>
                            We started working on this page but got lazy and played videogames instead.
                        </p>
                        <p>
                            If you want customization, download the <a href="https://github.com/wownero/wownero/releases">CLI wallet</a>.
                        </p>
                    </div>
                </div>
                <div class="row" style="margin-top:8px;">
                    <div class="col-sm-12">
                        <h4>Custom node</h4>
                        <p>
                            Adding your own node is simple; edit the following JSON file:
                        </p>
                        <p>
                            <code>{{pathConfig}}</code>
                        </p>
                        <p>
                            Goodluck!
                        </p>
                    </div>
                </div>
                <div class="row" style="margin-top:14px;">
                    <div class="col-sm-12">
                        <button v-on:click="back" type="button" class="btn btn-success btn-sm pull-left">
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <wario-settings></wario-settings>
    </main>
</template>

<script>
    import WarioSettings from './WarioSettings'

    export default {
        name: 'Settings',
        components: {WarioSettings},
        beforeRouteLeave(to, from, next) {
            next();
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            back(){
                this.$router.push({name: 'landing-page'});
            }
        },
        mounted() {

        },
        computed: {
            pathConfig() {
                const path = require('path');

                return path.join(this.$store.state.wallet_dir, 'wowlight.json');
            }
        }
    }
</script>
