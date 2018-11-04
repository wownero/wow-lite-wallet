<template>
    <div id="app" class="container nopadding nomargin">
        <router-view></router-view>

        <transition name="fade">
            <div class="loading" v-if='hasMessage()'>
                <div class="box">
                    <img id="logo" :src="loading_img">
                    <div class="text">
                        <h5 style="margin-bottom: 4px;">
                            <div class="dots" :style="`background-image: url(${path('loading.gif')})`"></div>
                            {{$store.state.message_box.title}}
                        </h5>
                        <p style="font-size:14px;">
                            {{$store.state.message_box.message}}
                        </p>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="fade">
            <div class="password" v-if='showPassword()'>
                <div class="box">
                    <div class="text">
                        <h5 style="margin-bottom: 8px;font-size:18px;">
                            <span class="message">{{$store.state.password_box.message}}</span>
                        </h5>
                        <div class="row">
                            <div class="col-sm-9" style="padding-right: 0;">
                                <input type="password" id="password" class="form-control" placeholder="..." required="" autofocus autocomplete="off" style="z-index:666;">
                            </div>
                            <div class="col-sm-3">
                                <button id="x_btn" v-on:click="submitPassword" type="button" class="btn btn-success">
                                    <!-- fa fa-refresh fa-spin -->
                                    <i class="fa fa-folder-open" aria-hidden="true"></i>
                                    Open
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'wowlight',
        computed: {
            height_from() {
                return this.$store.getters.height_from;
            },
            height_to() {
                return this.$store.getters.height_to;
            },
            walletPath(){
                return this.$store.state.wallet_path;
            },
            walletPassword(){
                return this.$store.state.wallet_password;
            },
            wallet(){
                return this.$store.state.wallet;
            }
        },
        data () {
            return {
                'background_pos': -200,
                'loading_img': '',
                'message_box_images': [],
                'messages': [
                    "This could take a while. Or not. Who knows? It might even give you an error!",
                    "Two days from now, tomorrow will be yesterday.",
                    "You will soon have an out of money experience.",
                    "Two can live as cheaply as one, for half as long.",
                    "Hard work pay off in future. Laziness pay off now.",
                    "The crypto apocalypse is near, might as well have dessert.",
                    "This coin is no good. Try another.",
                    "Of all the shitcoins, you picked WOW. Congratulations!",
                    "WOW is going nowhere, but at least the path is interesting.",
                    "Indecision is key to flexibility.",
                    "A day without sunshine is like night.",
                    "The fortune you seek is in another wallet.",
                    "You have kleptomania. Take some WOW for it.",
                    "perl5 is just syntax; CPAN is the language",
                    "This software sucks. Why are you executing random crap from the internet?",
                    "Linux sucks.",
                    "Windows sucks.",
                    "OSX sucks.",
                    "TempleOS ftw.",
                    "Perl sucks.",
                    "garyzeasshole sucks.",
                    'My hobby is \'collecting magic internet money\'.',
                    'Hacking Roger Ver.',
                    'Hacking Statue of liberty.',
                    'Monero is better. You should use it.',
                    'Hacking Area 51.',
                    'Hacking the Illuminati.',
                    'Hacking everyone.',
                    'PRIVMSG garyzeasshole A/S/L?\\r\\n',
                    'Hacking all banks.',
                    'Be your own bank. lol.',
                    'Hacking fluffypony.',
                    'Making WOW great again.',
                    'Ordering Kebab.',
                    'Ordering Pizza.',
                    'SELECT * INTO OUTFILE \'/tmp/kek.dump\' FROM users; DROP TABLE clients; #cunts',
                    'SELECT * FROM Users WHERE UserId = 105 OR 1=1; ',
                    '¯\\_(ツ)_/¯',
                    'Shorting MoneroV.',
                    'Losing private keys.',
                    'Shorting Verge.',
                    'Boating accidents.',
                    'Forking Wownero.',
                    'Stealing wowbux funds.',
                    'Spamming bitcointalk.org.',
                    'Shilling wownero on reddit.',
                    'Spambot attacking freenode.',
                    'Hacking jwintern.',
                    'Hacking dsc.',
                    'Stealing WFS funds.',
                    'Trolling Perl community.',
                    'Don\'t you dare spending any WOW today.',
                    'No Doubt - Don\'t Speak',
                    'Adding N to (X)',
                    'Running garytheasshole\'s oneliners...',
                    '.seen mattcode',
                    'Checking gap in pond',
                    'Check can withdraw new purse',
                    'Sun is not doing, Allah is doing',
                    'When block?',
                    'When payout?',
                    'When fork?',
                    'ö-pöpoo!'
                ]
            }
        },
        methods: {
            nudgeBg() {
                //jQuery('#wrapper').css('background-position-y', '-200px')
                //console.log(background_pos);
            },
            submitPassword(){
                let password = jQuery('#password').val();
                this.$store.commit('addWalletPassword', password);
                console.log(this.walletPath);
                console.log(this.walletPassword);

                this.$store.commit('showPassword', {
                    'message': ''
                });

                ipcRenderer.send('rpc_open_wallet', {
                    path: this.walletPath, password: this.walletPassword
                });
            },
            entryFromArr(arr){
                return arr[Math.floor(Math.random() * arr.length)];
            },
            showPassword() {
                return this.$store.state.password_box.message !== "";
            },
            hasMessage() {
                if(this.$store.state.message_box.title !== "") {
                    let url = this.entryFromArr(this.message_box_images);
                    let url_spl = url.split('.');
                    this.loading_img = this.path(url);

                    if(this.$store.state.message_box.message === "") {
                        let message = this.entryFromArr(this.messages);
                        let a = {
                            'title': this.$store.state.message_box.title,
                            'message': message
                        }

                        this.$store.commit('showMessage', a);
                    }
                    return true;
                } else {
                    return false;
                }
            },
            path (icon) {
                // vuejs+webpack sux
                return require(`./assets/loading/${icon}`);
            }
        },
        mounted () {
            Array.prototype.insert = function ( index, item ) {
                this.splice( index, 0, item );
            };

            jQuery(document).ready(function(){
                jQuery('#background').animate({
                    'background-position-y': '-200px'
                }, 1000);
            });

            for (let i = 0; i < 32; i++) {
                this.message_box_images.push('l' + i + '.gif');
            }

            let html = jQuery('body');
            let window_width = jQuery(window).width();
            let window_height = jQuery(window).height();

            jQuery(document).mousemove((event) => {
                let offset_x = 100 - (event.pageX / window_width) * 100;
                let offset_y = -40 - (event.pageY / window_height) * 100;

                html.css('background-position-x', '' + (offset_x / 5) + 'px');
                html.css('background-position-y', '' + (offset_y / 5) + 'px');
            });

            this.$electron.ipcRenderer.on('rpc_wallet_opened', (event) => {
                this.$store.commit('showMessage', {
                    'title': '',
                    'message': ''
                });
            });

            this.$electron.ipcRenderer.on('rpc_dialog_native', (event, data) => {
                const {dialog} = require('electron').remote;
                dialog.showMessageBox(data, i => {

                });
            });

            jQuery(document).keyup((e) => {
                if(this.$store.state.password_box.message !== "") {
                    if (e.keyCode === 13) {
                        this.submitPassword();
                    }
                }

                if (e.keyCode === 27) {
                    this.$store.commit('showPassword', {
                        'message': ''
                    });
                }
            });
        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
    @import url('~@/assets/bootstrap.min.css');
    @import url('~@/assets/wow.css');
</style>
