<template>
  <div id="signIn">
    <div id="title" v-title data-title="签收"></div>
    <div id="container"></div>
    <div id="panel"></div>
    <div id="signYes">
      <div id="signYes1" v-if="signYes">
        <ul id="signUl">
          <li><h3>{{carModel}}</h3></li>
          <div class="clearBoth"></div>
          <li v-for="item in proList">
            <h1>{{item.goodsCode}} -{{item.goodsName}}</h1>
            <div class="clearBoth"></div>
            <h2>{{item.num}}件/{{item.weight}}/{{item.volume}}</h2>
            <div class="clearBoth"></div>
          </li>
          <div class="clearBoth"></div>
        </ul>
        <div class="clearBoth"></div>
        <p @click="telphone()">有问题请联系客服</p>
        <div id="letGo">
          <button class="error">异常签收</button>
          <button @click="qianshou()" class="noerror">签收</button>
        </div>
      </div>
      <div id="signYes2" v-if="normalSign">
        <div class="title"><span style="float: left;margin-left: 5%;color:#6E6E6E;">取消</span><span style="float: right;margin-right: 5%;color:#2C9CFF;">确定</span></div>
         <ul>
           <li v-for="(item,index) in normalSignList">
               {{item.displayName}}
           </li>
           <div class="clearBoth"></div>
         </ul>
         <textarea placeholder="其他想说的，可以填在这里" v-model="remark" @keyup="remarkKeyUp()"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
  import AMap from 'AMap'
  import {androidIos} from "../js/app";
  import bridge from '../js/bridge';
  export default {
    name: "sign-in",
    data(){
      return{
        startJ :"",
        startW :"",
        endJ:"",
        endW:"",
        carModel:"",
        proList:[],
        signYes:false,
        normalSign:true,
        normalSignList:[],
      }
    },
    mounted: function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods: {
      go:function () {
        var _this = this;
        _this.init();
      },
      init: function () {
        var _this = this;
        $.ajax({
          type: "GET",
          url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
          data:{str:"normal_Receipt",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
          dataType: "json",
          timeout: 10000,
          success: function (getSysConfigList) {
            _this.normalSignList = getSysConfigList;
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        });
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/order/getGoodsDetail ",
          data:JSON.stringify({
             userCode:sessionStorage.getItem("token"),
             source : sessionStorage.getItem("source"),
             pk:_this.$route.query.pk,
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          async:false,
          success: function (getGoodsDetail) {
            if(getGoodsDetail.success == "1"){
              _this.startJ = getGoodsDetail.deliAddr.addressLatAndLon == undefined ? "120.40" : getGoodsDetail.deliAddr.addressLatAndLon.split(",")[0] ;
              _this.startW = getGoodsDetail.deliAddr.addressLatAndLon == undefined ? "30.26" : getGoodsDetail.deliAddr.addressLatAndLon.split(",")[1] ;
              _this.endJ = getGoodsDetail.arriAddr.addressLatAndLon == undefined ? "121.40" : getGoodsDetail.arriAddr.addressLatAndLon.split(",")[0] ;
              _this.endW = getGoodsDetail.arriAddr.addressLatAndLon == undefined ? "30.36" : getGoodsDetail.arriAddr.addressLatAndLon.split(",")[1] ;
              var carLength = getGoodsDetail.carLength != "" ? "（" + getGoodsDetail.carLength + "米）" : "";
              var carModel = getGoodsDetail.carModel != "" ? "（" + getGoodsDetail.carModel + "）" : "";
              _this.carModel  = getGoodsDetail.transType  + carLength + carModel;
              for(var i = 0 ;i < getGoodsDetail.list.length ; i++){
                 if(getGoodsDetail.list[i].volume * 1000 - 1000 < 0 ){
                   getGoodsDetail.list[i].volume = getGoodsDetail.list[i].volume*1000 + "升";
                 }else{
                   getGoodsDetail.list[i].volume = getGoodsDetail.list[i].volume*1 + "立方米";
                 }
                if(getGoodsDetail.list[i].weight - 1000 < 0 ){
                  getGoodsDetail.list[i].weight = getGoodsDetail.list[i].weight*1 + "千克";
                }else{
                  getGoodsDetail.list[i].weight = getGoodsDetail.list[i].weight/1000 + "吨";
                }
              }
              _this.proList = getGoodsDetail.list;
              _this.$nextTick(function () {
                _this.height();
                var signUl = document.getElementById("signUl");
                var fontSize = document.getElementsByTagName("html")[0].style;
                var fontpx = fontSize.fontSize.replace("px","");
                 var width = signUl.offsetWidth;
                 signUl.style.marginLeft =  -width/(2*fontpx) + "rem";
              })
            }else{
              androidIos.second(getGoodsDetail.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        })
        var map = new AMap.Map("container", {
          resizeEnable: true,
          center: [_this.startJ, _this.startW],//地图中心点
          zoom: 13 //地图显示的缩放级别
        });
        AMap.plugin(['AMap.ToolBar','AMap.Scale'],
          function(){
            map.addControl(new AMap.ToolBar());
            map.addControl(new AMap.Scale());
          });
        //构造路线导航类
        var driving = new AMap.Driving({
          map: map,
          panel: "panel"
        });
        driving.search([_this.startJ, _this.startW], [_this.endJ, _this.endW], function(status, result) {
        });
      },
      height:function () {
        var signYes = document.getElementById("signYes");
        var signYesHeight = signYes.offsetHeight;
        var fontSize = document.getElementsByTagName("html")[0].style;
        var fontpx = fontSize.fontSize.replace("px","");
        var containerBottom =  document.getElementById("container");
        containerBottom.style.bottom = signYesHeight / fontpx + "rem";
      },
      telphone:function () {
        bridge.invoke('callTelephone',"021-11111111111");
      },
      qianshou:function () {
        //1 异常 2 正常
        var _this = this ;
        androidIos.loading("正在签收");
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/order/signInv",
          data:JSON.stringify({
            userCode:sessionStorage.getItem("token"),
            source : sessionStorage.getItem("source"),
            pk:_this.$route.query.pk,
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          async:false,
          success: function (signInv) {
            if(signInv.success == "1"){
                 _this.$cjj("签收成功");
            }else{
              androidIos.second(signInv.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        })
      }
    }
  }
</script>
<style>
  #signIn .amap-logo{
    display: none!important;
  }
  #signIn .amap-copyright{
    display: none!important;
  }
  #signIn .amap-scalecontrol{
    bottom: 0.3rem !important;
  }
  #signIn .amap-icon{
    width:19px;
  }
  #signIn .amap-zoomcontrol{
    display: none!important;
  }
  #signIn .amap-controls{
    display: none;
  }
</style>
<style scoped>
  #panel {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
    display: none!important;
  }
  #container{
    top: 1.3rem!important;
    height: auto!important;
  }
  #signYes{
    position: fixed;
    bottom: 0;
    left:0;
    height: auto;
    width:auto;
    right:0;
    background: white;
  }
  #signYes1 li h1{
    width: 100%;
    max-width: 6rem;
    padding-left: 0.6rem;
    font-size: 0.39rem;
    float: left;
    margin-top: 0.1rem;
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 0 0rem;
    color:#333;
    background-image: url("../images/product.png");
    margin-bottom: 0.2rem;
  }
  #signYes1 li h2{
    width: 100%;
    max-width: 6rem;
    padding-left: 0.6rem;
    font-size: 0.39rem;
    float: left;
    margin-top: 0.1rem;
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 0 0rem;
    color:#333;
    background-image: url("../images/weight.png");
    margin-bottom: 0.2rem;
  }
  #signYes1 li h3{
    width: 100%;
    max-width: 6rem;
    padding-left: 0.6rem;
    font-size: 0.39rem;
    float: left;
    margin-top: 0.1rem;
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 0 0rem;
    color:#333;
    background-image: url("../images/trantype.png");
    margin-bottom: 0.2rem;
  }
  #signYes1 ul{
    float: left;
    position: relative;
    left: 50%;
    padding-top: 0.9rem;
  }
  #signYes1 li{
     float: left;
  }
  #signYes1 p{
    font-size: 0.3125rem;
    text-align: center;
    color:#546C98;
    width: 2.7rem;
    padding-right: 1rem;
    display: block;
    margin: 1.08rem auto 0 auto;
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 100% 50%;
    background-image: url("../images/kefuicon.png");
  }
  #signYes1 #letGo {
    width:77%;
    border-radius: 0.2rem;
    overflow: hidden;
    display: block;
    margin: 0.53rem auto 1.12rem auto;
  }
  #signYes1 .error{
    width:28.5%;
    height: 1.08rem;
    background: #56b0ff;
    color:white;
    font-size: 0.38rem;
    float: left;
  }
  #signYes1 .noerror{
    width:71.5%;
    height: 1.08rem;
    background: #2d9cff;
    color:white;
    font-size: 0.38rem;
    float: left;
  }
  #signYes2 .title{
   width:100%;
    height:1.09rem;
    font-size: 0.4rem;
    line-height: 1.09rem;
    border-bottom: 1px solid #ECECEC;
  }
  #signYes2 .title span{
    font-size: 0.4rem;
  }
  #signYes2 ul{
    width:90%;
    display: block;
    margin:0.2rem auto ;
  }
  #signYes2 ul li{
     font-size:0.35rem;
     color:#333;
    background:rgb(248,248,248);
    border:1px solid rgb(222,222,222);
    float: left;
    padding:0 0.2rem;
    line-height:0.68rem ;
    margin-top: 0.57rem;
    margin-right: 0.1rem;
    min-width: 1.6rem;
    text-align: center;
  }
  #signYes2 textarea{
    width:84%;
    padding: 3%;
    margin: 0.5rem auto;
    display: block;
    height: 3rem;
    border: 1px solid #dadada;
    font-size: 0.375rem;
    color:#666;
    resize:none;
  }
</style>
