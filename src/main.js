// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import  Toast from './vueJs/toast.js'
import { isAndroid } from './js/detector';
import bridge from './js/bridge';
import {bomb} from "./js/zujian";
import {androidIos} from "./js/app";
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
      if(bomb.hasClass("app","appBox")){
        $("#errorwifeBox").remove();
        $("#common-blackBox").remove();
        $(".tanBox-bigBox").remove();
        var http =  location.href;
        if(http.indexOf("/uploadData/uploadDataT") != -1){
          var message = sessionStorage.getItem("source") == "2" ? JSON.parse(localStorage.getItem("UPMESSA")) :  JSON.parse(localStorage.getItem("DRIVERMESSA"));
          var type = androidIos.GetQueryString("type");
          if(type != null && message != null && (message.Drivepic != "" || message.IDpic != "" || message.Licensepic != "" || message.Roadpic != "" || message.Travelpic != "" || message.bank != "" || message.bankNumber != "" || message.company != "" || message.name != "" || (message.nvitationodeIC != null &&  message.nvitationodeIC != "" )|| message.peopleNumber != "" )){
            androidIos.first("信息尚未上传，需要保存吗？");
            $(".tanBox-close").unbind('click').click(function(){
              $(".tanBox-bigBox").remove();
              if(sessionStorage.getItem("source") == 2){
                localStorage.removeItem("UPMESSA");
              }else if(sessionStorage.getItem("source") == 3){
                localStorage.removeItem("DRIVERMESSA");
              }
              androidIos.gogogogo();
            });
            $(".tanBox-yes").unbind('click').click(function(){
              $(".tanBox-bigBox").remove();
              androidIos.gogogogo();
            });
          }else{
            androidIos.gogogogo();
          }
        }else{
          androidIos.gogogogo();
        }
      }
      responseCallback('js执行过了');
    });
    renderApp();
  });
} else {
  renderApp();
}
