<template>
    <main class="support">
        <navbar-dashboard></navbar-dashboard>
    </main>
</template>

<script>
    import EventBus from './../../main';
    import NavbarDashboard from './components/Navbar'

    export default {
        name: 'support',
        components: {NavbarDashboard},
        beforeRouteLeave(to, from, next) {
            next();
        },
        computed: {
            wallet() {
                // return this.$store.getters.wallet;
                return {
                    'balance': 4000
                }
            },
            txs() {
                // let wallet = this.$store.getters.wallet;
                // if(wallet.hasOwnProperty('txs')){
                //     return wallet.txs;
                // } else {
                //     return [];
                // }
            }
        },
        methods: {
            getStore(){
                let x = this.$store;
                debugger;
            },
            collapse(event){
                let obj = jQuery(event.target).parent();
                obj.attr('data-collapsed', obj.attr('data-collapsed') === 'false');
            }
        },
        mounted() {
            // let nav_item = jQuery('.navbar .navbar-nav.clickme')
            // let icon =  nav_item.find('.fa');
            // icon.removeClass('fa-heart-o');
            // icon.addClass('fa-list-ul')
            // nav_item.find('span.text').html('Balance');
            // nav_item.click(() => {
            //     this.$router.push({name: 'support'});
            // });
        }
    }
</script>
