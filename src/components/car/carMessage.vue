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
             <img :src="item.carMessage.carPeople.pic" class="peopleImg">
             <div class="peoplemessage">
               <p>{{item.carMessage.carPeople.name}}</p>
               <h1>驾龄：{{item.carMessage.carPeople.year}}年</h1>
             </div>
            <div class="tel" v-if="item.carType == 1 && carType == 0" @click="changeCarpeople(item.carMessage.carPeople.carPeoplePk,0)">
              <img src="../../images/replace.png">
            </div>
            <div class="tel" @click="tel(item.carMessage.carPeople.tel)">
              <img src="../../images/tel.png">
            </div>
            <div class="clearBoth"></div>
          </div>
          <div id="peopleMessageS" v-if="item.carMessage.carPeopleFu.carPeoplePk != ''">
            <img :src="item.carMessage.carPeopleFu.pic" class="peopleImg">
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
        orderPk:""
      }
    },
    mounted:function () {
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
    methods:{
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
                  pic:getCarDetail.driverDto.length==0?"":(getCarDetail.driverDto[0].driverImg == null || getCarDetail.driverDto[0].driverImg == ""?"data:image/png;base64,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":getCarDetail.driverDto[0].driverImg),
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
     width:1.2rem;
     float: left;
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
</style>
