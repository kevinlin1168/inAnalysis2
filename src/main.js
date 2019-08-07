import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import router from './router';
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
import VueResource from 'vue-resource';

fontawesome.library.add(solid);
fontawesome.library.add(regular);
fontawesome.library.add(brands);

Vue.component('font-awesome-icon', FontAwesomeIcon)
// import locale from 'element-ui/lib/locale/lang/zh-TW'

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(BootstrapVue);
Vue.use(VueResource);


new Vue({
  el: '#app',
  router,
  // store,
  render: h => h(App)
}).$mount('#app');
