// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import  Toast from './vueJs/toast.js'
import QRCode from 'qrcode'
import { isAndroid } from './js/detector';
import bridge from './js/bridge';
import  {androidIos} from './js/app.js';
import PinchZoom from "./js/pinchzoom";
Vue.config.productionTip = false
Vue.use(Toast)
/* eslint-disable no-new */
const  renderApp = () => {
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
}

if (isAndroid() && !window.WebViewJavascriptBridge) {
  document.addEventListener('WebViewJavascriptBridgeReady', () => {
    window.WebViewJavascriptBridge.init(message => console.log(message));
    WebViewJavascriptBridge.registerHandler('goback', function(data, responseCallback) {
      var addPageList = window.sessionStorage.getItem("addPageList");
      $("#errorwifeBox").remove();
      $("#common-blackBox").remove();
      $(".tanBox-bigBox").remove();
      if (addPageList * 1 > 0) {
        var number = addPageList * 1 - 1;
        sessionStorage.setItem("addPageList", number);
        window.history.go(-1);
      } else {
        bridge.invoke('gobackfrom');
      }
      responseCallback('js执行过了');
    });
    renderApp();
  });
} else {
  renderApp();
}
