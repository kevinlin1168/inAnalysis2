import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import router from './router';
import axios from 'axios'
import VueAxios from 'vue-axios'
// import store from './store';
import BootstrapVue from 'bootstrap-vue';
import 'element-ui/lib/theme-chalk/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import fontawesome from '@fortawesome/fontawesome';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
import regular from '@fortawesome/fontawesome-free-regular';
import brands from '@fortawesome/fontawesome-free-brands';
import VueCookie from 'vue-cookie';

fontawesome.library.add(solid);
fontawesome.library.add(regular);
fontawesome.library.add(brands);

Vue.component('font-awesome-icon', FontAwesomeIcon);
// import locale from 'element-ui/lib/locale/lang/zh-TW'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
Vue.config.productionTip = false;
Vue.use(ElementUI, {locale});
Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);
Vue.use(VueCookie);

new Vue({
  el: '#app',
  router,
  // store,
  render: h => h(App)
}).$mount('#app');
