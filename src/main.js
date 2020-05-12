import Vue from 'vue';
import router from './router';
import '@/styles/index.scss'; // global css
import store from './store';
import App from './app.vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
Vue.use(VueAwesomeSwiper);
Vue.config.productionTip = false;

require('jquery');

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
