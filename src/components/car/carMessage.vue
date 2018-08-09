<template>
  <div id="carMessage">
    <div id="title" v-title data-title="车辆详情"></div>
    <div id="mescroll" class="mescroll" :class="type>9?'meBottom':''">
      <ul id="dataList" class="data-list">
        <li v-for="item in pdlist">
          <div class="top">
            <span v-html="item.carState==1?'运输中':'空闲中'"></span>
            <img src="../../images/order2.png"  style="height: 1.64rem;">
            <div class="clearBoth"></div>
          </div>
          <div style="width:100%;height:3rem;position: relative;"  v-if="type==1 && orderPk!=''">
            <router-view/>
            <div style="width:100%;height:3rem;position: absolute;top:0;left:0;background: transparent;z-index:999;" @click="mapSClick()">
            </div>
          </div>
          <div id="carMessageBox">
            <p>{{item.carMessage.number}}<span>{{item.carMessage.tranType}}</span><span class="km"></span></p>
            <h1>满载：{{item.carMessage.weight}}吨&nbsp;&nbsp;已承载：{{item.carMessage.nowWeight}}吨</h1>
          </div>
          <div id="peopleMessage" v-if="type==1">
            <div class="imgBoxOverFllow">
              <img :src="item.carMessage.carPeople.pic" :onerror="errorlogo" class="peopleImg">
            </div>
             <div class="peoplemessage">
               <p>{{item.carMessage.carPeople.name}}</p>
               <h1>驾龄：{{item.carMessage.carPeople.year}}年</h1>
             </div>
            <div class="tel replace" v-if="item.carType == 1 && carType == 0" @click="changeCarpeople(item.carMessage.carPeople.carPeoplePk,0)">
              <img src="../../images/replace.png">
            </div>
            <div class="tel" @click="tel(item.carMessage.carPeople.tel)">
              <img src="../../images/tel.png">
            </div>
            <div class="clearBoth"></div>
          </div>
          <div id="peopleMessageS" v-if="item.carMessage.carPeopleFu.carPeoplePk != ''">
            <div class="imgBoxOverFllow">
              <img :src="item.carMessage.carPeopleFu.pic" :onerror="errorlogo" class="peopleImg">
            </div>
            <div class="peoplemessage">
              <p>{{item.carMessage.carPeopleFu.name}}</p>
              <h1>驾龄：{{item.carMessage.carPeopleFu.year}}年</h1>
            </div>
            <div class="tel" v-if="item.carType == 1 && carType == 0" @click="changeCarpeople(item.carMessage.carPeopleFu.carPeoplePk,1)">
              <img src="../../images/replace.png">
            </div>
            <div class="tel" @click="tel(item.carMessage.carPeopleFu.tel)">
              <img src="../../images/tel.png">
            </div>
            <div class="clearBoth"></div>
          </div>
          <div id="peopleSecond" v-if="type==1 && item.carMessage.carPeopleFu.carPeoplePk =='' && orderPk != ''"  @click="changeCarpeople('',1)"><p>添加后备司机</p></div>
          <div id="productList" v-if="item.list.length>0 && orderPk!=''">
            <h6>已派订单</h6>
            <ul>
              <li v-for="(number,index) in item.list" v-if="index<5">
                <p>运输号 {{number.number}}</p>
                <h1>{{number.startAddress}}-{{number.endAddress}}&nbsp;&nbsp;<span></span></h1>
                <h2 v-for="numberList in number.product">{{numberList.tranType}}/{{numberList.product}}/{{numberList.proNumber}}件/{{numberList.weight}}吨/{{numberList.volume}}立方米</h2>
                <h3>提货 {{number.startTime}}</h3>
                <h3>到货 {{number.endTime}}</h3>
                <h5>{{number.type | orderTypeName}}</h5>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div id="sure">
      <div class="go gogogo" id="gogogo" v-if="type==1 && orderPk!=''" @click="sendCar()">
        <button>派车</button>
      </div>
      <div class="go" v-else-if="type==2" @click="changeCarpeople('',0)">
        <button>添加主司机</button>
      </div>
      <div class="go gogogo" id="gogogo1" v-else-if="type==1 && orderPk==''" @click="sureCarpeople()">
        <button>确定绑定车辆司机</button>
      </div>
    </div>
    <div id="successBox" v-if="success">
      <div id="success">
        <img src="../../images/success.png">
        <p>派车成功</p>
      </div>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import  "../../js/markingSystem";
  var thisThat;
  export default {
    name: "carMessage",
    data(){
      return{
        type:"",
        pdlist:[],
        success:false,
        carType:0,
        pkCar:"",
        orderPk:"",
        errorlogo: 'this.src="' + require('../../images/carpeople.png') + '"',
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var self = this;
        thisThat = self;
        self.carType = self.$route.query.carType;
        self.pkCar = self.$route.query.pkCar;
        self.orderPk = sessionStorage.getItem("dispatchPK") == undefined?"":sessionStorage.getItem("dispatchPK");
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", "")
          }
        });
      },
      upCallback: function(page) {
        //联网加载数据
        var self = this;
        getListDataFromNet(page.num, page.size, function(curPageData) {
          //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

          //如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if(page.num == 1) self.pdlist = [];

          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);
          sessionStorage.setItem("driverPk",self.pkCar);
          var changeCarpeople = sessionStorage.getItem("changeCarpeople");
          if(changeCarpeople!=undefined){
            changeCarpeople = JSON.parse(changeCarpeople);
            self.pdlist[0].carMessage.carPeople = changeCarpeople;
          }
          var changeCarFupeople = sessionStorage.getItem("changeCarFupeople");
          if(changeCarFupeople!=undefined){
            changeCarFupeople = JSON.parse(changeCarFupeople);
            self.pdlist[0].carMessage.carPeopleFu = changeCarFupeople;
          }
          self.type = curPageData[0].carMessage.carPeople.carPeoplePk!=""?1:2;
          self.$nextTick(function () {
            for(var x = 0 ; x < document.getElementsByClassName("peopleImg").length;x++){
              var className = document.getElementsByClassName("peopleImg")[x];
              className.onload = function () {
                for (var i = 0; i < document.getElementsByClassName("peopleImg").length; i++) {
                  var heightImg = $(".peopleImg").eq(i).height();
                  var heightBox = $(".imgBoxOverFllow").eq(i).height();
                  var widthBox = $(".imgBoxOverFllow").eq(i).width();
                  var htmlSize = $("html").css("fontSize").replace("px", "");
                  if (heightImg > heightBox) {
                    $(".peopleImg").eq(i).css("marginTop", (heightBox - heightImg) / 2 / htmlSize + "rem");
                  } else {
                    $(".peopleImg").eq(i).height(heightBox / htmlSize + "rem");
                    $(".peopleImg").eq(i).width("auto");
                    var widthImg = $(".peopleImg").eq(i).width();
                    $(".peopleImg").eq(i).css("marginLeft", (widthBox - widthImg) / 2 / htmlSize + "rem");
                  }
                }
              }
            }
          })
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      mapSClick:function(){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/car/map'});
      },
      changeCarpeople:function(pk,type){
        var _this = this;
        androidIos.addPageList();
        var zhuCarp = "";
        if(type == 1){
           zhuCarp = _this.pdlist[0].carMessage.carPeople.carPeoplePk;
        }else{
          zhuCarp = _this.pdlist[0].carMessage.carPeopleFu.carPeoplePk;
        }
        _this.$router.push({ path: '/car/changeCarpeople',query:{driverPk:pk,driverType:type,carPk:_this.pkCar,driverZ:zhuCarp}});
      },
      sendCar:function(){
        var _this = this;
        if(bomb.hasClass("gogogo","gogogo")){
          androidIos.first("确认派车吗？");
          $(".tanBox-yes").unbind('click').click(function(){
            $(".tanBox-bigBox").remove();
            bomb.removeClass("gogogo","gogogo");
            androidIos.loading("正在派车");
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp()+"/order/arrangeVehicle",
              data:JSON.stringify({
                userCode:sessionStorage.getItem("token") ,
                pkCar:_this.pkCar,
                pkDriver2:_this.pdlist[0].carMessage.carPeopleFu.carPeoplePk,
                pkDriver:_this.pdlist[0].carMessage.carPeople.carPeoplePk,
                pk:sessionStorage.getItem("dispatchPK"),
                source:sessionStorage.getItem("source")
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (arrangeVehicle) {
                $("#common-blackBox").remove();
                bomb.addClass("gogogo","gogogo");
                if(arrangeVehicle.success == "1"){
                  _this.success = true;
                  setTimeout(function () {
                    _this.success = false;
                    bridge.invoke('gobackfrom');
                  },1000)
                }else{
                  androidIos.second(arrangeVehicle.message)
                }
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                $("#common-blackBox").remove();
                bomb.addClass("gogogo","gogogo");
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                }else if(status=='error'){
                  androidIos.errorwife();
                }
              }
            })
          });
        }else{
          bomb.first("请不要频繁点击");
        }

      },
      sureCarpeople:function(){
        var _this = this;
        if(bomb.hasClass("gogogo1","gogogo")){
          var carJson={
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
            pkCar:_this.pkCar,
            pkDriver:_this.pdlist[0].carMessage.carPeople.carPeoplePk
          }
          bomb.removeClass("gogogo1","gogogo");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/driver/modifyCar",
            data: JSON.stringify(carJson),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout:30000,
            success: function (addCar) {
              bomb.addClass("gogogo1","gogogo");
              if(addCar.success=="1"){
                _this.$cjj("保存成功");
                setTimeout(function () {
                  androidIos.gobackFrom(_this);
                },500)
              }else{
                androidIos.second(addCar.message);
              }
            },
            error:function () {
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo1","gogogo");
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！")
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }else{
          bomb.first("请不要频繁点击");
        }

      },
      tel:function(tel){
        bridge.invoke('callTelephone',tel);
      },
      addClass:function(obj,cls){//增加class
        var idJson = obj.className.split(" ");
        for(var i=0;i<idJson.length;i++){
          if(idJson[i]==cls){
            return false;
          }
        }
        idJson.push(cls);
        obj.className = idJson.join(" ");
        return true;
      },
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp()+"/carrier/getCarDetail",
        data:JSON.stringify({
          pk:thisThat.$route.query.pkCar,
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source")
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        success: function (getCarDetail) {
          if(getCarDetail.success == "1"){
            var list = [];
            for(var i =0 ;i<getCarDetail.invoice.length;i++){
                var invoice = getCarDetail.invoice[i];
                var proList =[];
                for(var x = 0; x<invoice.itemDaos.length;x++){
                  var nomal = {
                    tranType:invoice.transType,
                    product:invoice.itemDaos[x].goodsCode + "-" + invoice.itemDaos[x].goodsName,
                    proNumber:invoice.itemDaos[x].num,
                    weight:invoice.itemDaos[x].weight/1000,
                    volume:invoice.itemDaos[x].volume*1
                  }
                  proList.push(nomal);
                }
                var json = {
                  number:invoice.vbillno,
                  startAddress:invoice.deliAddr,
                  endAddress:invoice.arriAddr,
                  product:proList,
                  startTime:invoice.deliDate,
                  endTime:invoice.arriDate,
                  type:invoice.status,
                }
                list.push(json);
            }
            var data=[{
              orderType:1,
              carType:1,
              carState:getCarDetail.weight*1>0?1:2,
              carMessage:{
                number:getCarDetail.carNo,
                tranType:getCarDetail.carType,
                weight:getCarDetail.loadWeight*1,
                nowWeight:getCarDetail.weight*1,
                carPeople:{
                  tel:getCarDetail.driverDto.length==0?"":getCarDetail.driverDto[0].carrierName,
                  name:getCarDetail.driverDto.length==0?"":getCarDetail.driverDto[0].driverName,
                  year:getCarDetail.driverDto.length==0?"":(getCarDetail.driverDto[0].driverAge*1<1?"小于1":getCarDetail.driverDto[0].driverAge),
                  pic:getCarDetail.driverDto.length==0?"":getCarDetail.driverDto[0].driverImg,
                  carPeoplePk:getCarDetail.driverDto.length==0?"":getCarDetail.driverDto[0].pkDriver
                },
                carPeopleFu:{
                  tel:"",
                  name:"",
                  year:"",
                  pic:"",
                  carPeoplePk:""
                },
              },
              list:list
            }];
            var listData=data;//模拟分页数据
            successCallback&&successCallback(listData);//成功回调
          }else{
            androidIos.second(getCarDetail.message)
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
    },500)
  }
</script>

<style scoped>
  #successBox{
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom: 0;
    width:auto;
    height: auto;
    background: rgba(255,255,255,0);
  }
  #success{
    width:22%;
    position: absolute;
    top:40%;
    left:39%;
    background: rgba(0,0,0,0.5);
    border-radius: 0.3rem;
  }
  #success img{
    width:35%;
    display: block;
    margin:0.3rem auto;
  }
  #success p{
    text-align: center;
    margin-bottom: 0.3rem;
    color:white;
    font-size: 0.35rem;
  }
  #carMessage #dataList{
    width:100%;
    margin-top: 0.2rem;
  }
  .top{
    width:100%;
    background:white;
    min-height:1.64rem;
    position: relative;
  }
  .top span{
    font-size: 0.375rem;
    color: #fff;
    line-height: 1.8rem;
    margin-left: 0.3rem;
    position: absolute;
    z-index: 11;
  }
  .top img{
    width:100%;
    top:0;
    left:0;
    position: absolute;
  }
  #carMessage .mescroll{
    position: fixed;
    top:1.21875rem;
    bottom: 1.2rem;
    height: auto;
  }
  #carMessageBox{
    width:94%;
    padding:0.2rem 3%;
    background: white;
  }
  #carMessageBox p{
     margin-top: 0.1rem;
     font-size: 0.375rem;
    color:#333;
  }
  #carMessageBox p span{
    font-size: 0.3125rem;
    color:#999;
    margin-left: 0.2rem;
  }
  #carMessageBox h1{
    margin-top: 0.1rem;
    font-size: 0.3125rem;
    color:#999;
  }
  #peopleMessage,#peopleMessageS{
    width:94%;
    padding:0.2rem 3%;
    background: white;
    margin-top: 0.2rem;
  }
  #peopleMessage .peopleImg,#peopleMessageS .peopleImg{
     width:100%;
  }
  #peopleMessage .peoplemessage,#peopleMessageS .peoplemessage{
    float: left;
    margin-left: 0.3rem;
    margin-top: 0.1rem;
  }
  #peopleMessage .peoplemessage p,#peopleMessageS .peoplemessage p{
    font-size: 0.3125rem;
    color:#333;
  }
  #peopleMessage .peoplemessage h1,#peopleMessageS .peoplemessage h1{
    font-size: 0.3125rem;
    color:#999;
  }
  #peopleMessage .tel,#peopleMessageS .tel{
    width: 0.8rem;
    float: right;
    margin-top: 0.2rem;
    font-size: 0.3125rem;
    color: #333;
    margin-left: 0.4rem;
  }
  #peopleMessage .tel img,#peopleMessageS .tel img{
    display: block;
    margin: 0 auto;
    width:100%;
  }
  #peopleMessage  .replace img{
    width:80%;
    margin-top: 10%!important;
  }
  #productList{
    margin-top: 0.2rem;
  }
  #productList h6{
     font-size: 0.3125rem;
    color:#999;
    margin-left: 0.3rem;
    margin-bottom: 0.2rem;
  }
  #productList li{
    margin-bottom: 0.1rem;
    width:94%;
    padding:0.2rem 3%;
    background: white;
    position: relative;
  }
  #productList li p{
    font-size: 0.3125rem;
    color:#999;
  }
  #productList li h1,#productList li h2{
    font-size: 0.35rem;
    color:#333;
  }
  #productList li h1 span,#productList li h3{
    font-size: 0.3125rem;
    color:#999;
  }
  #productList li h5{
    font-size: 0.3125rem;
    color:#333;
    position: absolute;
    top:0.2rem;
    right:3%;
  }
  #sure .go{
    position: fixed;
    bottom:0;
    height:1.2rem;
    width:100%;
    background: #3399FF;
  }
  #sure button{
    width:100%;
    background: transparent;
    color:white;
    font-size: 0.4rem;
    letter-spacing: 0.0625rem;
    line-height: 1.21rem;
  }
  #peopleSecond{
     width:4rem;
    background-image: url("../../images/add.png");
    background-repeat: no-repeat;
    background-position: 0.35rem 50%;
    background-size: 0.8rem 0.8rem;
    border:1px solid #c3c0c0;
    background-color: #f5f5f5;
    border-radius: 0.3rem;
    margin: 0.2rem auto 0 auto;
  }
  #peopleSecond p{
    font-size: 0.4rem;
    line-height: 1.2rem;
    margin-left: 1.25rem;
    color:#666;
  }
  .imgBoxOverFllow{
    width:1.2rem;
    height:1.2rem;
    overflow: hidden;
    float: left;
    border-radius: 50%;
    line-height: 1.2rem;
  }
  .imgBoxOverFllow img{
    width:100%;
    display: inline-block;
    vertical-align: middle;
  }
</style>
