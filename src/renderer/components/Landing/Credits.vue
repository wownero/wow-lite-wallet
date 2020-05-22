<template>
    <main class="credits">
        <div class="row">
            <div class="col-sm-12">
                <div class="row">
                    <div class="col-sm-12" style="margin-bottom:4px;">
                        <h4>Credits / shout-outs</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-3">
                        <ul>
                            <li>wowario <small>(Lead copy&paste)</small></li>
                            <li>thrmo <small>(Lead shill)</small></li>
                            <li>bomb-on <small>(Lead Pool)</small></li>
                            <li><a href="#" v-on:click="jw">jwintern</a> <small>(CEO™)</small></li>
                            <li>Monero community</li>
                            <li>rbrunner <small>(MMS)</small></li>
                            <li>Febo</li>
                            <li>Highdude</li>
                            <li>unknownids_</li>
                            <li>charuto</li>
                            <li>cisme_ <small>(Lead Artist©)</small></li>
                        </ul>
                    </div>
                    <div class="col-sm-3">
                        <ul>
                            <li>fuwa <small>(Android wallet)</small></li>
                            <li>Bitconnect</li>
                            <li>solar</li>
                            <li>Gary <small>(Perl maintainer)</small></li>
                            <li>shillo <small>(GUI hater)</small></li>
                            <li>wowbux <small>(scam)</small></li>
                            <li>gingeropolous</li>
                            <li>camthegeek <small>(AEON)</small></li>
                            <li>binaryFate</li>
                            <li>Bathmat</li>
                            <li>bibble</li>
                        </ul>
                    </div>
                    <div class="col-sm-3">
                        <ul>
                            <li>vicer0y <small>(wownero.info)</small></li>
                            <li>@bl4sty</li>
                            <li>kico <small>(TooL)</small></li>
                            <li>notmike <small>(popping off)</small></li>
                            <li>chachasmooth</li>
                            <li>johnhmay</li>
                            <li>chron0</li>
                            <li>kinghat</li>
                            <li>needmoney90</li>
                            <li>nioc</li>
                            <li>ksk</li>
                        </ul>
                    </div>
                    <div class="col-sm-3">
                        <ul>
                            <li>philkode <small>(Vision)</small></li>
                            <li>OhGodAGirl</li>
                            <li>p3rL</li>
                            <li>TheoStorm</li>
                            <li>Osiris1</li>
                            <li>phx</li>
                            <li>scoobybejesus</li>
                            <li>kloinka</li>
                            <li>ilovetron</li>
                            <li>\x</li>
                            <li>mj <small>(Resident artist)</small></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <wario-landing></wario-landing>
    </main>
</template>

<script>
    import WarioLanding from './WarioLanding'

    export default {
        name: 'Credits',
        components: {WarioLanding},
        beforeRouteLeave(to, from, next) {
            next();
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            },
            back(){
                this.$router.push({name: 'landing-page'});
            },
            jw(){
                const {dialog} = require('electron').remote;
                dialog.showMessageBox({
                    type: 'error',
                    title: 'jwintern.txt',
                    buttons: ['OK'],
                    message: '<jwinterm> we can just merge it if you want\n<jwinterm> I mean\n<jwinterm> I\'m not gonna review it'
                }, i => { });
            }
        },
        mounted() {
            jQuery('main.credits .hypnotoad').click((event) => {
                this.back();
            });
        },
        computed: {
            walletDir(){
                return this.$store.state.wallet_dir;
            }
        }
    }
</script>
