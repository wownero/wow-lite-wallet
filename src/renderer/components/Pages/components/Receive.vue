<template>
    <div class="col-md-12 nopadding nomargin">
        <div class="card my-6" id="dashboard_receive" data-collapsed="true">
            <h5 class="card-header" @click="$parent.collapse">
                <i class="fa fa-bars" aria-hidden="true"></i>
                Receive
            </h5>
            <div class="card-body" style='background-color: transparent;'>
                <div class="row">
                    <div class="col-md-12">
                        <form id="news_post" role="form" lpformnum="2" _lpchecked="1" onsubmit="return false;">
                            <!-- text input -->
                            <div class="form-group">
                                <textarea disabled rows=1 class="form-control">{{wallet.address}}</textarea>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Receive",
        computed: {
            wallet() {
                return this.$store.getters.wallet;
            }
        }
    }
</script>

<style scoped>

</style>
