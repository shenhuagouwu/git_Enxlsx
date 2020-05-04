import Vue from 'vue';
import router from './router';
import '@/styles/index.scss'; // global css
import store from './store';
import App from './app.vue';
// import api from './api/index.js';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
Vue.use(VueAwesomeSwiper);
Vue.config.productionTip = false;
// Vue.prototype.$api = api;

require('jquery');

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
