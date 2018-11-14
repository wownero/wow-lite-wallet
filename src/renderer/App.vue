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
                                <button id="x_btn2" v-on:click="submitPassword" type="button" class="btn btn-success">
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
                'rotateInterval': false,
                'message_box_images': [],
                'messages': []
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
            rotateMessage() {
                this.$store.commit('showMessage', {
                    'title': this.$store.state.message_box.title,
                    'message': this.entryFromArr(this.messages)
                });
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
                        if (!this.rotateInterval) {
                          this.rotateInterval = setInterval(this.rotateMessage, 5000);
                        }
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
            ipcRenderer.send('rpc_get_wowdir');
            ipcRenderer.send('rpc_get_cfg');

            Array.prototype.insert = function ( index, item ) {
                this.splice( index, 0, item );
            };

            jQuery(document).ready(function(){
                jQuery('#background').animate({
                    'background-position-y': '-200px'
                }, 1000);
            });

            ipcRenderer.send('rpc_get_embedded_version');

            // bootstrap edgy messages.js
            let {messages} = require('./assets/messages.js');
            this.messages = messages;

            // bootstrap edgy images
            for (let i = 0; i < 32; i++) {
                this.message_box_images.push('l' + i + '.gif');
            }

            let html = jQuery('body');
            let window_width = jQuery(window).width();
            let window_height = jQuery(window).height();

            // background mouse animations
            jQuery(document).mousemove((event) => {
                let offset_x = 100 - (event.pageX / window_width) * 100;
                let offset_y = -40 - (event.pageY / window_height) * 100;

                html.css('background-position-x', '' + (offset_x / 5) + 'px');
                html.css('background-position-y', '' + (offset_y / 5) + 'px');
            });

            this.$electron.ipcRenderer.on('embedded_version', (event, version) => {
                this.$store.commit('addEmbeddedVersion', {
                    'version': version
                });
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
    @import url('~@/assets/wow.css');
</style>

