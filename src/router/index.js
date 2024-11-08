import Vue from 'vue';
import VueRouter from 'vue-router';
import CustomerLogin from '../views/CustomerLogin.vue';
import HomePage from '../views/HomePage.vue';
import CustomerProfile from '../views/CustomerProfile.vue';

Vue.use(VueRouter);

const routes = [
    { path: '/', name: 'home', component: HomePage },
    { path: '/login', name: 'login', component: CustomerLogin },
    { path: '/customer/profile', name: 'profile', component: CustomerProfile, meta: { requiresAuth: true } },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!localStorage.getItem('authToken')) {
            next({ name: 'login' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;