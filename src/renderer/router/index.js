import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'landing-page',
            component: require('@/components/Landing/LandingPage').default
        },
        {
            path: '/create-wallet-options',
            name: 'create-wallet-options',
            component: require('@/components/Wizards/CreateWalletOptions').default
        },
        {
            path: '/create-wallet-seed',
            name: 'create-wallet-seed',
            component: require('@/components/Wizards/CreateWalletSeed').default
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: require('@/components/Pages/Dashboard').default
        },
        {
            path: '/support',
            name: 'support',
            component: require('@/components/Pages/Support').default
        },
        {
            path: '/credits',
            name: 'credits',
            component: require('@/components/Landing/Credits').default
        },
        {
            path: '/enter-password',
            name: 'enter-password',
            component: require('@/components/Landing/EnterPassword').default
        },
        {
            path: '/settings',
            name: 'settings',
            component: require('@/components/Landing/Settings').default
        }
    ],
    beforeEach: () => {
        console.log("changed");
    }
});
