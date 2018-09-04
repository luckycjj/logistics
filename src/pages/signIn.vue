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
          <button class="error" @click="errorClick()">异常签收</button>
          <button @click="qianshou()" class="noerror">签收</button>
        </div>
      </div>
      <div id="signYes2" v-if="normalSign">
        <div class="title"><span @click="goback(1)" style="float: left;padding-left: 5%;color:#6E6E6E;">取消</span><span @click="signyesYY(1)" style="float: right;padding-right: 5%;color:#2C9CFF;">确定</span></div>
        <div id="star_grade" class="star_grade scorelistscore"></div>
        <ul>
           <li v-for="(item,index) in normalSignList" @click="normalSignListClick(1,index)" :class="item.choose ? 'chooseTrue' : ''">
               {{item.displayName}}
           </li>
           <div class="clearBoth"></div>
         </ul>
         <textarea placeholder="其他想说的，可以填在这里" maxlength="100" @keyup="remarkKeyup(1)" v-model="normalSignRemark"></textarea>
      </div>
      <div id="signYes3" v-if="errorSign">
        <div class="title"><span @click="goback(2)" style="float: left;padding-left: 5%;color:#6E6E6E;">取消</span><span @click="signyesYY(2)" style="float: right;padding-right: 5%;color:#2C9CFF;">确定</span></div>
        <ul>
          <li v-for="(item,index) in errorSignList" @click="normalSignListClick(2,index)" :class="item.choose ? 'chooseTrue' : ''">
            {{item.displayName}}
          </li>
          <div class="clearBoth"></div>
        </ul>
        <textarea placeholder="其他异常情况，请如实填写，稍后将有客服人员与 您电话联系" @keyup="remarkKeyup(2)"  maxlength="100" v-model="errorSignRemark"></textarea>
      </div>
      <div id="signYes4" v-if="errorSignEnd">
        <div class="title"><span @click="goback(3)" style="float: left;padding-left: 5%;color:#6E6E6E;">取消</span></div>
        <img src="../images/errorSignEnd.png">
        <p>感谢您的反馈!</p>
        <h1>稍后将会有客服人员联系您核实信息，请保持手机畅通</h1>
      </div>
      <div id="signYes5" v-if="normalSignEnd">
        <div class="title"><span @click="goback(4)" style="float: left;padding-left: 5%;color:#6E6E6E;">取消</span></div>
        <img src="../images/okgoyes.png">
        <p>感谢您的评价!</p>
      </div>
    </div>
  </div>
</template>

<script>
  import AMap from 'AMap'
  import {androidIos} from "../js/app";
  import bridge from '../js/bridge';
  import {bomb} from "../js/zujian";
  import  "../js/markingSystem";
  export default {
    name: "sign-in",
    data(){
      return{
        startJ :"",
        startW :"",
        endJ:"",
        endW:"",
        carModel:"",
        normalSignRemark:"",
        errorSignRemark:"",
        proList:[],
        signYes:true,
        normalSign:false,
        errorSign:false,
        errorSignEnd:false,
        normalSignEnd:false,
        normalSignList:[],
        errorSignList:[],
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
        $(document).unbind("click").on("click","#star_grade .set_image_item",function () {
          var x = $(this).index("#star_grade .set_image_item");
          $("#star_grade").html("");
          $("#star_grade").markingSystem({
            num: 5,
            havePoint: true,
            haveGrade: true,
            backgroundImageInitial:require('../images/star_hollow.png'),
            backgroundImageOver:require('../images/star_solid.png'),
            unit: '星',
            grade:x*1+1,
            height:0.8* $("html").css("font-size").replace("px", ""),
            width:0.8* $("html").css("font-size").replace("px", ""),
          });
          $("#star_grade .set_image_top").css("z-index",10);
          var width =  $("#star_grade .set_image_all").width();
          $("#star_grade .set_image_all").css("marginLeft",-width/2 + "px");
        })
        $.ajax({
          type: "GET",
          url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
          data:{str:"normal_Receipt",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
          dataType: "json",
          timeout: 10000,
          success: function (getSysConfigList) {
            for(var i = 0 ; i < getSysConfigList.length ; i++){
              getSysConfigList[i].choose = false;
            }
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
          type: "GET",
          url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
          data:{str:"error_Receipt",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
          dataType: "json",
          timeout: 10000,
          success: function (getSysConfigList) {
            for(var i = 0 ; i < getSysConfigList.length ; i++){
              getSysConfigList[i].choose = false;
            }
            _this.errorSignList = getSysConfigList;
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
              var carLength = getGoodsDetail.carLength != "" ? "(" + getGoodsDetail.carLength + "米)" : "";
              var carModel = getGoodsDetail.carModel != "" ? "(" + getGoodsDetail.carModel + ")" : "";
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
                if(_this.signYes){
                  _this.positionWidth();
                }
                if(_this.normalSign){
                  _this.startXing();
                }
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
      normalSignListClick:function (type,index) {
        if(type == 1){
          var _this = this;
          _this.normalSignList[index].choose  = !_this.normalSignList[index].choose;
        }else if(type == 2){
          var _this = this;
          _this.errorSignList[index].choose  = !_this.errorSignList[index].choose;
        }

      },
      telphone:function () {
        bridge.invoke('callTelephone',"50929122");
      },
      qianshou:function () {
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
              setTimeout(function () {
                _this.signYes = false;
                _this.normalSign = true;
                _this.errorSign = false;
                _this.errorSignEnd = false;
                _this.normalSignEnd = false;
                _this.$nextTick(function () {
                  _this.height();
                  _this.startXing();
                })
              },500)
            }else{
              androidIos.second(signInv.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            $("#common-blackBox").remove();
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        })
      },
      errorClick:function () {
        var _this = this;
        _this.signYes = false;
        _this.normalSign = false;
        _this.errorSign = true;
        _this.errorSignEnd = false;
        _this.normalSignEnd = false;
        _this.$nextTick(function () {
          _this.height();
        })
      },
      goback:function (type) {
        var _this = this;
        if(type == 2){
          _this.signYes = true;
          _this.normalSign = false;
          _this.errorSign = false;
          _this.errorSignEnd = false;
          _this.normalSignEnd = false;
          for(var i = 0; i < _this.errorSignList.length;i++){
           _this.errorSignList[i].choose = false;
          }
          _this.errorSignRemark = "";
          _this.$nextTick(function () {
            _this.height();
            _this.positionWidth();
          })
        }else if(type == 1 ||type == 3 || type == 4){
          androidIos.gobackFrom(_this);
        }
      },
      remarkKeyup:function (type) {
        var _this = this;
        if(type == 1){
          _this.normalSignRemark = _this.normalSignRemark.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】]/g,'');
        }else if(type == 2){
          _this.errorSignRemark = _this.errorSignRemark.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】]/g,'');
        }
      },
      signyesYY:function (type) {
        var _this = this;
        if(type == 1){
          var list = [];
          for(var i = 0; i < _this.normalSignList.length;i++){
            if(_this.normalSignList[i].choose){
              list.push(_this.normalSignList[i].displayName)
            }
          }
          var number = $("#star_grade .grade").text();
          if(list.length == 0 && _this.normalSignRemark == ""){
            bomb.first("请选择或填写内容");
            return false;
          }
          var json = {
            scoreList:JSON.stringify([{
               name:"货物",
               score:number.replace("分",""),
            }]),
            average:number.replace("分",""),
            scorereason:list.join(",") + "," + _this.normalSignRemark,
            pk:_this.$route.query.pk,
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/clientAppraisal",
            data:JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (clientAppraisal) {
              if(clientAppraisal.success == "1"){
                _this.signYes = false;
                _this.normalSign = false;
                _this.errorSign = false;
                _this.errorSignEnd = false;
                _this.normalSignEnd = true;
                _this.$nextTick(function () {
                  _this.height();
                })
              }else{
                androidIos.second(clientAppraisal.message);
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
        }else if(type == 2){
          var list = [];
          for(var i = 0; i < _this.errorSignList.length;i++){
             if(_this.errorSignList[i].choose){
                list.push(_this.errorSignList[i].displayName)
             }
          }
          if(list.length == 0 && _this.errorSignRemark == ""){
             bomb.first("请选择或填写异常类型");
             return false;
          }
          androidIos.loading("正在签收");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/order/abnormalReceipt",
            data:JSON.stringify({
              expType: list.join(","),
              pkEntrust:_this.$route.query.pk,
              memo:_this.errorSignRemark ,
              userCode: sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async:false,
            success: function (abnormalReceipt) {
              if(abnormalReceipt.success == "1"){
                _this.$cjj("签收成功");
                setTimeout(function () {
                  _this.signYes = false;
                  _this.normalSign = false;
                  _this.errorSign = false;
                  _this.errorSignEnd = true;
                  _this.normalSignEnd = false;
                  for(var i = 0; i < _this.errorSignList.length;i++){
                    _this.errorSignList[i].choose = false;
                  }
                  _this.errorSignRemark = "";
                  _this.$nextTick(function () {
                    _this.height();
                  })
                },500)
              }else{
                androidIos.second(abnormalReceipt.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              $("#common-blackBox").remove();
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }
      },
      positionWidth:function () {
        var signUl = document.getElementById("signUl");
        var fontSize = document.getElementsByTagName("html")[0].style;
        var fontpx = fontSize.fontSize.replace("px","");
        var width = signUl.offsetWidth;
        signUl.style.marginLeft =  -width/(2*fontpx) + "rem";
      },
      height:function () {
        var signYes = document.getElementById("signYes");
        var signYesHeight = signYes.offsetHeight;
        var fontSize = document.getElementsByTagName("html")[0].style;
        var fontpx = fontSize.fontSize.replace("px","");
        var containerBottom =  document.getElementById("container");
        containerBottom.style.bottom = signYesHeight / fontpx + "rem";
      },
      startXing:function () {
        var _this = this;
        $("#star_grade").html("");
        $("#star_grade").markingSystem({
          num: 5,
          havePoint: true,
          haveGrade: true,
          backgroundImageInitial:require('../images/star_hollow.png'),
          backgroundImageOver:require('../images/star_solid.png'),
          unit: '星',
          grade:0,
          height: 0.8* $("html").css("font-size").replace("px", ""),
          width: 0.8* $("html").css("font-size").replace("px", ""),
        });
        $("#star_grade .set_image_top").css("z-index",10);
        var width =  $("#star_grade .set_image_all").width();
        $("#star_grade .set_image_all").css("marginLeft",-width/2 + "px");
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
  #signIn .set_image_all {
    cursor: pointer;
    position: relative;
    left:50%;
  }
  #signIn .set_image_top div{
    position: relative;
  }
  #signIn .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
  }
  #signIn .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #signIn .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 13;
  }

  #signIn .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #signIn .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #signIn .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
    display: none!important;
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
    max-width: 7rem;
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
    line-height: 0.5rem;
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
  #signYes2 .title, #signYes3 .title{
   width:100%;
    height:1.09rem;
    font-size: 0.4rem;
    line-height: 1.09rem;
    border-bottom: 1px solid #ECECEC;
  }
  #signYes2 .title span,#signYes3 .title span,#signYes4 .title span,#signYes5 .title span{
    font-size: 0.4rem;
  }
  #signYes2 ul,#signYes3 ul{
    width:90%;
    display: block;
    margin:0.2rem auto ;
  }
  #star_grade{
    margin-top: 0.5rem;
  }
  #signYes2 ul li,#signYes3 ul li{
     font-size:0.35rem;
     color:#333;
    background:rgb(248,248,248);
    border:1px solid rgb(222,222,222);
    float: left;
    padding:0 0.2rem;
    line-height:0.75rem ;
    margin-top: 0.57rem;
    margin-right: 0.1rem;
    min-width: 1.6rem;
    text-align: center;
    border-radius: 0.15rem;
  }
  #signYes2 textarea,#signYes3 textarea{
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
  .chooseTrue{
    color:white!important;
    background: #2C9CFF!important;
    border: 1px solid #2c9cff!important;
  }
  #signYes4 .title,#signYes5 .title{
     width:100%;
     height:1.09rem;
     font-size: 0.4rem;
     line-height: 1.09rem;
   }
  #signYes4 img, #signYes5 img{
    width:1.9rem;
    display: block;
    margin: 1rem auto 0.65rem auto;
  }
  #signYes4 p,#signYes5 p{
    font-size:0.4rem;
    font-weight:400;
    color:#333;
    text-align: center;
  }
  #signYes5 p{
    margin-bottom: 1.77rem;
  }
  #signYes4 h1{
    font-size:0.34rem;
    font-weight:400;
    color:#999;
    text-align: center;
    margin-top: 0.26rem;
    margin-bottom:1.16rem ;
  }
</style>
