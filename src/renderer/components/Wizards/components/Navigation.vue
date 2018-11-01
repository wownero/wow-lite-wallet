<template>
    <div class="row navigation" style="margin-top:20px;">
        <div class="col-md-3">
            <button v-on:click="goBack" type="button" class="btn btn-success pull-left">
                <!-- fa fa-refresh fa-spin -->
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                Go back
            </button>
        </div>
        <div class="col-md-6 msg">
            <div v-if="hasError !== ''">
                <div class="alert alert-warning" role="alert">
                    <i class="fa fa-exclamation-triangle "></i>
                    <strong>Warning:</strong> {{hasError}}
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <button style="float:right;" v-on:click="goNext" type="button" class="btn btn-success btn_next pull-right">
                <div style="display:inline" v-if="appState === 'create_wallet'">
                    <i class="fa fa-refresh fa-spin" aria-hidden="true"></i>
                </div>
                Next
                <i style="margin-left:6px;" class="fa fa-arrow-right" aria-hidden="true"></i>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Navigation",
        computed: {
            hasError(){
                return this.$store.getters.error;
            },
            appState(){
                return this.$store.getters.appState;
            }
        },
        watch: {
            hasError (new_msg, old_msg) {
                // Our fancy notification (2).
                console.log(`We have ${new_msg} fruits now, yaay!`);
            }
        },
        methods: {
            goBack(){
                this.$store.commit('showError', '');
                this.$parent.goBack();
            },
            goNext(){
                this.$store.commit('showError', '');
                this.$parent.goNext();
            },
            showError(msg){
                this.clearMsg();
                let msgbox = jQuery(".navigation .msg");

                msgbox.addClass('error');

                let html = `
                <div class="alert alert-danger" role="alert">
                    <i class="fa fa-exclamation-triangle "></i>
                    <strong>Error:</strong> ${msg}
                </div>
                `;

                msgbox.html(html);
            }
        }
    }
</script>

<style scoped>

</style>