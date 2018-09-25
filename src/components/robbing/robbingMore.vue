<template>
  <div id="robbingMore">
    <div id="title" v-title data-title="订单详情"></div>
    <div v-if="carloading" style="position: fixed;top:1.3rem;bottom:0;height:auto;width:100%;">
      <img src="../../images/carloading.gif" style="width:4rem;position: absolute;top:50%;left:50%;margin-left: -2rem;margin-top: -4rem">
      <p style="font-size: 0.4rem;top:50%;text-align: center;line-height: 1rem;color:#3399FF;width:100%;position: absolute">正在加载中...</p>
    </div>
    <div id="mescroll" class="mescroll" :style="{bottom:type == 1 || type ==2 || type==3 ?'1.2rem':'0'} ">
      <ul id="dataList" class="data-list">
        <li v-for="item in pdlist">
          <div class="top">
            <div style="width:100%;position: relative;top:0;left:0;">
              <span v-html="type==1?'待抢单':type==2?'待调度':type==3?'安排车辆':item.orderType"></span>
              <img src="../../images/order2.png" style="height: 1.64rem;">
            </div>
          </div>
          <div class="message">
            <div class="goodsmessage">
              <p :data-start="item.pickMessage.address" :data-end="item.endMessage.address" class="startEnd"><span style="float: left;font-size: 0.4rem;color:#333;font-weight: bold;">{{item.goodsmessage.startAddress}}<img style="display: inline-block;margin:0rem 0.3rem 0.13rem 0.3rem;width:0.41rem;" src="../../images/addressImg.png">{{item.goodsmessage.endAddress}}</span><span  v-if="type == '20' || type == '40' || type == '60' " class="distance">{{item.goodsmessage.distance}}km</span><div class="clearBoth"></div></p>
              <h1>{{item.goodsmessage.tranType}}</h1>
              <h4>{{item.goodsmessage.money}}元</h4>
              <div class="clearBoth"></div>
              <div v-for="itemS in item.goodsmessage.productList ">
                <h2>{{itemS.goods}}</h2>
                <h3>{{itemS.number}}件<span v-if="itemS.weight.replace(/[^0-9]/g,'')*1 > 0 ">/{{itemS.weight}}</span><span  v-if="itemS.volume.replace(/[^0-9]/g,'')*1 > 0">/{{itemS.volume}}</span></h3>
                <div class="clearBoth"></div>
              </div>
              <div class="clearBoth"></div>
              <h5>{{item.goodsmessage.startTime}} - {{item.goodsmessage.endTime}}</h5>
            </div>
            <div class="peoplemessage">
              <p><span >发货方</span></p>
              <div style="background: white;box-shadow: 0 0.1rem 10px #d8d8d8;position: relative;margin:0.1rem auto 0 auto;border-radius: 0.2rem;">
                <div class="messageBox">
                  <h1 style="font-size: 0.38rem; color:#333;font-weight: bold;float: left;margin-left: 4%;margin-top: 0.52rem;">{{item.pickMessage.name}}</h1>
                  <h1 style="font-size: 0.35rem; color:#999;float: left;margin-left: 0.3rem;margin-top: 0.52rem;">{{item.pickMessage.tel}}</h1>
                  <div class="clearBoth"></div>
                  <h1 style="font-size: 0.35rem; color:#666;margin-left: 4%;margin-top: 0.4rem;">{{item.pickMessage.company}}</h1>
                  <h1 style="font-size: 0.35rem; color:#999;margin-left: 4%;margin-top: 0.2rem;">{{item.pickMessage.address}}</h1>
                </div>
                <div class="thirdBox" @click="telphone(item.pickMessage.tel)">
                  <h6></h6>
                </div>
                <div class="clearBoth"></div>
              </div>
            </div>
            <div class="peoplemessage">
              <p><span>收货方</span></p>
              <div style="background: white;box-shadow: 0 0.1rem 10px #d8d8d8;position: relative;margin:0.1rem auto 0 auto;border-radius: 0.2rem;">
                <div class="messageBox">
                  <h1 style="font-size: 0.38rem; color:#333;font-weight: bold;float: left;margin-left: 4%;margin-top: 0.52rem;">{{item.endMessage.name}}</h1>
                  <h1 style="font-size: 0.35rem; color:#999;float: left;margin-left: 0.3rem;margin-top: 0.52rem;">{{item.endMessage.tel}}</h1>
                  <div class="clearBoth"></div>
                  <h1 style="font-size: 0.35rem; color:#666;margin-left: 4%;margin-top: 0.4rem;">{{item.endMessage.company}}</h1>
                  <h1 style="font-size: 0.35rem; color:#999;margin-left: 4%;margin-top: 0.2rem;">{{item.endMessage.address}}</h1>
                </div>
                <div class="thirdBox" @click="telphone(item.endMessage.tel)">
                  <h6></h6>
                </div>
                <div class="clearBoth"></div>
              </div>
            </div>
          </div>
          <div class="insurance">
            <!--<p>保险</p>
            <h1>{{item.insurance.name}}<span>¥ {{item.insurance.price}}/次</span></h1>
            <div class="clearBoth"></div>-->
            <p>付款方</p>
            <h1>{{item.pickPay.people}}</h1>
            <div class="clearBoth"></div>
            <p>备注</p>
            <h1 style="text-indent:0.7rem;">{{item.pickPay.remark}}</h1>
            <div class="clearBoth"></div>
          </div>
          <div class="company">
            <div class="firstBox">
              <img :src="httpurl + item.owner.logo" :onerror="errorlogo" class="companyImg">
            </div>
            <div class="secondBox">
              <p><span>{{item.owner.company}}</span></p>
              <h2>入驻<span>{{item.owner.year}}</span></h2>
            </div>
            <div class="thirdBox" @click="telphone(item.owner.phone)">
              <h6></h6>
            </div>
            <div class="clearBoth"></div>
          </div>
          <div class="number">
            订单编号：{{item.number}}<br>
            下单时间：{{item.time}}
          </div>
        </li>
      </ul>
    </div>
    <div id="sure">
      <div class="go gogogo" id="gogogo" v-if="type==1" @click="qD()">
        <button>抢单</button>
      </div>
      <div class="go" v-else-if="type==2">
        <button class="noYes colorBottom"  @click="ohno()">拒绝</button>
        <button class="noYes gogogo" id="gogogo2" @click="ohyeah()">同意</button>
        <div class="clearBoth"></div>
      </div>
      <div class="go" v-else-if="type==3">
        <button style="width:50%;background:#7bb5f9;" @click="closedOrderButton()">取消订单</button>
        <button @click="sendCar()" style="width:50%;">派车</button>
      </div>
    </div>
    <div id="cancelReasonBox" v-if="cancelReasonBox">
      <div id="cancelReason">
        <div id="cancelReasonTitle">
          <img src="../../images/closed.png" @click="cancelReasonClosed()">
          <p>选择拒绝订单理由</p>
        </div>
        <ul class="errorUl">
          <li v-for="(item,index) in cancelReason" :class="index%2==0?'errorAbnormalLeft':'errorAbnormalRight'" @click="cancelReasonClick($event)">
            {{item.displayName}}
          </li>
          <div class="clearBoth"></div>
          <input type="text" placeholder="其他原因" v-model="cancelreason" maxlength="50">
        </ul>
        <button @click="cancelReasonChange()" class="gogogo" id="gogogo1">提交</button>
      </div>
    </div>
    <div id="closedOrderBox" v-if="closedOrderBox">
      <div id="closedOrder">
        <div id="closedOrderTitle">
          <img src="../../images/closed.png" @click="closedOrderClosed()">
          <p>选择取消订单理由</p>
        </div>
        <ul class="errorUl">
          <li v-for="(item,index) in closedOrder" :class="index%2==0?'errorAbnormalLeft':'errorAbnormalRight'" @click="closedOrderClick($event)">
            {{item.displayName}}
          </li>
          <div class="clearBoth"></div>
          <input type="text" placeholder="其他原因" maxlength="40" v-model="closedOrderReason">
        </ul>
        <button @click="orderClosedChange()" id="gogogo3" class="gogogo">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import AMap from 'AMap'
  import {bomb} from "../../js/zujian";
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import bridge from '../../js/bridge';
  import  "../../js/markingSystem";
  import "../../js/swipeslider"
  var thisThat;
  export default {
    name: "robbingMore",
    data(){
      return{
        carloading:true,
        type:"",
        pick:true,
        ordertype:"",
        pdlist:[],
        imgsetTime:"",
        cancelReasonBox:false,
        cancelReason:[],
        cancelreason:"",
        closedOrderBox:false,
        closedOrder:[],
        closedOrderReason:"",
        httpurl:"",
        orderNowoperation:"2",
        errorlogo: 'this.src="' + require('../../images/carpeople.png') + '"'
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var self = this;
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/settings/findParamValueByName ",
          data: JSON.stringify({
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
            paramName:"resourcePath"
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          async:false,
          timeout:30000,
          success: function(findParamValueByName){
            if(findParamValueByName.success == "1"){
              self.httpurl = findParamValueByName.paramValue;
            }else{
              androidIos.second(findParamValueByName.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("当前状况下网络状态差，请检查网络！")
            }else if(status=="error"){
              androidIos.errorwife();
            }
          }
        });
        thisThat = self;
        sessionStorage.removeItem("siteSure");
        sessionStorage.removeItem("Sitechoosesite");
        sessionStorage.removeItem("Sitedismantling");
        sessionStorage.removeItem("weh");
        sessionStorage.removeItem("nowOrderCartype");
        sessionStorage.setItem("dispatchPK",self.$route.query.pk);
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
          self.pick = true;
          self.mescroll.endSuccess(curPageData.length);
          self.orderType = self.pdlist[0].orderType;
          self.$nextTick(function () {
            if (self.type != 3) {
              $("#siteCar").hide();
            }else{
              $("#siteCar").show();
              $("#siteLook").remove();
            }
            for(var x = 0 ; x < $(".firstBox").length;x++){
              var className = document.getElementsByClassName("companyImg")[x];
              className.onload = function () {
                for (var i = 0; i < $(".firstBox").length; i++) {
                  var heightImg = $(".companyImg").eq(i).height();
                  var heightBox = $(".firstBox").eq(i).height();
                  var widthBox = $(".firstBox").eq(i).width();
                  var htmlSize = $("html").css("fontSize").replace("px", "");
                  if (heightImg > heightBox) {
                    $(".companyImg").eq(i).css("marginTop", (heightBox - heightImg) / 2 / htmlSize + "rem");
                  } else {
                    $(".companyImg").eq(i).height(heightBox / htmlSize + "rem");
                    $(".companyImg").eq(i).width("auto");
                    var widthImg = $(".companyImg").eq(i).width();
                    $(".companyImg").eq(i).css("marginLeft", (widthBox - widthImg) / 2 / htmlSize + "rem");
                  }
                }
              }
            }
            $(document).unbind("click").on("click","#siteCar",function () {
              androidIos.chooseSite(self.orderNowoperation);
              $("#sitechoosesite").unbind("click").click(function () {
                var list=[];
                for(var i = 0;i < self.pdlist[0].goodsmessage.productList.length ; i++){
                  var pro = self.pdlist[0].goodsmessage.productList[i];
                  var data = {
                    goods:pro.goods,
                    number:pro.number,
                    weight:pro.weight,
                    weightBoth:pro.weight.indexOf("吨") !=  -1 ? pro.weight.split("吨")[0] : pro.weight.split("千克")[0] ,
                    volume:pro.volume,
                    volumeBoth:pro.volume.indexOf("升") !=  -1 ? pro.volume.split("升")[0] : pro.volume.split("立方米")[0] ,
                    tranType:self.pdlist[0].goodsmessage.tranType
                  }
                  list.push(data)
                }
                var json = {
                  startTime:self.pdlist[0].goodsmessage.startTime,
                  startAddress:self.pdlist[0].pickMessage.address,
                  startAddresspk:self.pdlist[0].pickMessage.addresspk,
                  endTime:self.pdlist[0].goodsmessage.endTime,
                  endAddress:self.pdlist[0].endMessage.address,
                  endAddresspk:self.pdlist[0].endMessage.addresspk,
                  product:list
                }
                if((new Date(json.endTime)).getTime() - (new Date()).getTime() < 0){
                  bomb.first("该订单到达时间小于当前时间，无法拆段");
                  return false;
                }
                androidIos.addPageList();
                sessionStorage.setItem("Sitechoosesite",JSON.stringify(json));
                self.$router.push({ path: '/site/chooseSite'});
              });
              $("#sitedismantling").unbind("click").click(function () {
                var list=[];
                for(var i = 0;i < self.pdlist[0].goodsmessage.productList.length ; i++){
                  var pro = self.pdlist[0].goodsmessage.productList[i];
                  var weightBoth = pro.weight.indexOf("吨") !=  -1 ? pro.weight.split("吨")[0] : pro.weight.split("千克")[0];
                  var volumeBoth = pro.volume.indexOf("升") !=  -1 ? pro.volume.split("升")[0] : pro.volume.split("立方米")[0];
                  var data = {
                    goodPk:pro.pkInvPackB,
                    goods:pro.goods,
                    goodsCode:pro.goodsCode,
                    number:pro.number,
                    weight:pro.weight,
                    weightBoth:weightBoth ,
                    volume:pro.volume,
                    volumeBoth: volumeBoth,
                    tranType:self.pdlist[0].goodsmessage.tranType,
                    density:weightBoth / volumeBoth
                  }
                  list.push(data)
                }
                var json = {
                  startTime:self.pdlist[0].goodsmessage.startTime,
                  startAddress:self.pdlist[0].pickMessage.address,
                  startAddresspk:self.pdlist[0].pickMessage.addresspk,
                  endTime:self.pdlist[0].goodsmessage.endTime,
                  endAddress:self.pdlist[0].endMessage.address,
                  endAddresspk:self.pdlist[0].endMessage.addresspk,
                  product:list
                }
                androidIos.addPageList();
                sessionStorage.setItem("Sitedismantling",JSON.stringify(json));
                self.$router.push({ path: '/robbing/dismantling'});
              });
            });
          })
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      pickMessage:function (m) {
        var _this = this;
        if(m != (_this.pick).toString()){
          _this.pick = !_this.pick;
        }
      },
      telphone:function(tel){
        bridge.invoke('callTelephone',tel);
      },
      qD:function(){
        var _this = this;
        if(bomb.hasClass("gogogo","gogogo")){
          androidIos.first("确认抢此单么？");
          $(".tanBox-yes").unbind('click').click(function(){
            $(".tanBox-bigBox").remove();
            androidIos.loading("正在抢单");
            bomb.removeClass("gogogo","gogogo");
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/order/grabSingle",
              data: JSON.stringify({pk: _this.$route.query.pk, userCode: sessionStorage.getItem("token"), source:sessionStorage.getItem("source")}),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (grabSingle) {
                $("#common-blackBox").remove();
                bomb.addClass("gogogo","gogogo");
                if(grabSingle.success =="" || grabSingle.success == "1"){
                  _this.$cjj("抢单成功");
                  setTimeout(function () {
                    androidIos.gobackFrom(_this);
                  },1000)
                }else{
                  androidIos.second(grabSingle.message);
                }
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                bomb.addClass("gogogo","gogogo");
                $("#common-blackBox").remove();
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
      sendCar:function () {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/site/car'});
      },
      ohno:function(){
        var _this = this;
        androidIos.first("确定拒绝订单吗？");
        $(".tanBox-yes").unbind('click').click(function(){
          $(".tanBox-bigBox").remove();
          _this.cancelReasonBox = true;
          if(_this.cancelReason.length == 0) {
            $.ajax({
              type: "GET",
              url: androidIos.ajaxHttp() + "/settings/getSysConfigList",
              data: {
                str: "refusal",
                userCode: sessionStorage.getItem("token"),
                source: sessionStorage.getItem("source")
              },
              dataType: "json",
              timeout: 30000,
              success: function (getSysConfigList) {
                _this.cancelReason = getSysConfigList;
              },
              complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                } else if (status == 'error') {
                  androidIos.errorwife();
                }
              }
            })
          }
        });
      },
      ohyeah:function(){
        var _this = this;
        if(bomb.hasClass("gogogo2","gogogo")){
          androidIos.first("确定同意吗？");
          $(".tanBox-yes").unbind('click').click(function(){
            $(".tanBox-bigBox").remove();
            androidIos.loading("正在接收");
            bomb.removeClass("gogogo2","gogogo");
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/order/agreeAppoint",
              data: JSON.stringify({pk: _this.$route.query.pk, userCode: sessionStorage.getItem("token"), source:sessionStorage.getItem("source")}),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (grabSingle) {
                $("#common-blackBox").remove();
                bomb.addClass("gogogo2","gogogo");
                if(grabSingle.success =="" || grabSingle.success == "1"){
                  _this.$cjj("接收成功");
                  setTimeout(function () {
                    androidIos.gobackFrom(_this);
                  },500);
                }else{
                  androidIos.second(grabSingle.message);
                }
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                bomb.addClass("gogogo2","gogogo");
                $("#common-blackBox").remove();
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
      closedOrderButton:function () {
         var _this = this;
         androidIos.first("确定取消订单吗？");
        $(".tanBox-yes").unbind('click').click(function(){
          $(".tanBox-bigBox").remove();
          _this.closedOrderBox = true;
          if(_this.closedOrder.length == 0) {
            $.ajax({
              type: "GET",
              url: androidIos.ajaxHttp() + "/settings/getSysConfigList",
              data: {
                str: "carrier_closeOrder",
                userCode: sessionStorage.getItem("token"),
                source: sessionStorage.getItem("source")
              },
              dataType: "json",
              timeout: 30000,
              success: function (getSysConfigList) {
                _this.closedOrder = getSysConfigList;
              },
              complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                } else if (status == 'error') {
                  androidIos.errorwife();
                }
              }
            })
          }
        });
      },
      orderClosedChange:function () {
        var _this = this;
        if(bomb.hasClass("gogogo3","gogogo")){
          var list = [];
          for(var i = 0 ;i<_this.closedOrder.length;i++){
            if($("#closedOrder .errorUl li").eq(i).hasClass("errorPriceBoxLi")){
              list.push(_this.closedOrder[i].displayName)
            }
          }
          if((list.length == 0 || list[0] == '其他原因')&& _this.cancelreason == ''){
            bomb.first("请选择或填写取消订单的理由");
            return false;
          }
          bomb.removeClass("gogogo3","gogogo");
          androidIos.loading("正在取消");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/carrierCloseOrder",
            data:JSON.stringify({
              remark:list[0] == undefined && _this.cancelreason != '' ? '其他原因:' + _this.cancelreason :list[0] != undefined && _this.cancelreason != '' ? list[0] + ',其他原因:' + _this.cancelreason : list[0] ,
              pk:_this.$route.query.pk,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            timeout: 30000,
            success: function (closeOrder) {
              if(closeOrder.success == "1"){
                _this.$cjj("取消成功");
                setTimeout(function () {
                  bridge.invoke('gobackfrom');
                },500)
              }else{
                androidIos.second(closeOrder.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo3","gogogo");
              $("#common-blackBox").remove();
              if(status=='timeout'){//超时,status还有success,error等值的情况
                _this.cancelReasonBox = false;
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                _this.cancelReasonBox = false;
                androidIos.errorwife();
              }
            }
          })
        }else{
          bomb.first("请不要频繁点击")
        }
      },
      cancelReasonClosed:function(){
        var _this = this;
        _this.cancelReasonBox = false;
        _this.cancelreason = "";
        $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
      },
      closedOrderClosed:function () {
        var _this = this;
        _this.closedOrderBox = false;
        _this.closedOrderReason = "";
        $("#closedOrderBox .errorUl li").removeClass("errorPriceBoxLi");
      },
      cancelReasonClick:function(e){
        if(!this.hasClass(e.target,"errorPriceBoxLi")){
          $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
          this.addClass(e.target,"errorPriceBoxLi");
        }else{
          $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
        }
      },
      closedOrderClick:function (e) {
        if(!this.hasClass(e.target,"errorPriceBoxLi")){
          $("#closedOrderBox .errorUl li").removeClass("errorPriceBoxLi");
          this.addClass(e.target,"errorPriceBoxLi");
        }else{
          $("#closedOrderBox .errorUl li").removeClass("errorPriceBoxLi");
        }
      },
      cancelReasonChange:function(){
        var _this = this;
        if(bomb.hasClass("gogogo1","gogogo")){
          var list =[];
          for(var i =0;i<$("#cancelReasonBox .errorUl li").length;i++){
            if($("#cancelReasonBox .errorUl li").eq(i).hasClass("errorPriceBoxLi")){
              list.push(_this.cancelReason[i].displayName);
            }
          }
          if((list.length == 0 || list[0] == '其他原因') && _this.cancelreason == ""){
            bomb.first("请选择或填写拒绝订单的理由！");
            return false;
          }
          var json = {
            type:list[0] == undefined?"":list[0],
            remark:_this.cancelreason,
            pk: _this.$route.query.pk,
            userCode: sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }
          androidIos.loading("正在拒绝");
          bomb.removeClass("gogogo1","gogogo");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/order/refuseAppoint",
            data: JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (refuseAppoin) {
              bomb.addClass("gogogo1","gogogo");
              $("#common-blackBox").remove();
              if(refuseAppoin.success =="" || refuseAppoin.success == "1"){
                _this.$cjj("拒绝成功");
                setTimeout(function () {
                  androidIos.gobackFrom(_this);
                },500)
              }else{
                androidIos.second(refuseAppoin.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              _this.cancelReasonBox = false;
              bomb.addClass("gogogo1","gogogo");
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }else{
          bomb.first("请不要频繁点击");
        }

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
      hasClass:function(obj,cls){//判断是不是有这个class
        var idJson = obj.className.split(" ");
        for(var i=0;i<idJson.length;i++){
          if(idJson[i]==cls){
            return true;
          }
        }
        return false;
      },
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      var type = thisThat.$route.query.type;
      var ajax;
      if(type == "1" || type == "2" || type == "3"){
         ajax = "/order/loadSegmentDetail";
      }else{
        ajax = "/order/loadEntrustDetail";
      }
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp()+ajax,
        data:JSON.stringify({pk:thisThat.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        success: function (loadSegmentDetail) {
          thisThat.carloading = false;
          if (loadSegmentDetail.success == "" || loadSegmentDetail.success == "1") {
            thisThat.type = thisThat.$route.query.type;
            thisThat.orderNowoperation = loadSegmentDetail.segType;
            var list=[];
            var weh = 0;
            for(var i =0;i<loadSegmentDetail.invPackDao.length;i++){
              var weight = loadSegmentDetail.invPackDao[i].weigthUnit==3?loadSegmentDetail.invPackDao[i].weight*1000:loadSegmentDetail.invPackDao[i].weight*1;
              var listJson = {
                pkInvPackB:loadSegmentDetail.invPackDao[i].pkInvPackB,
                goodsCode:loadSegmentDetail.invPackDao[i].goodsCode+"-"+loadSegmentDetail.invPackDao[i].goodsType,
                goods:loadSegmentDetail.invPackDao[i].goodsName+"-"+loadSegmentDetail.invPackDao[i].goodsTypeName,
                number:loadSegmentDetail.invPackDao[i].num,
                weight: weight/1000 - 1 <0 ? weight + "千克" : weight/1000 + "吨",
                volume:loadSegmentDetail.invPackDao[i].volume*1 - 1 < 0 ? loadSegmentDetail.invPackDao[i].volume*1000 + "升" : loadSegmentDetail.invPackDao[i].volume*1 + "立方米",
              }
              weh += weight/1000 + weh ;
              list.push(listJson);
            }
            sessionStorage.setItem("weh",weh);
            sessionStorage.setItem("nowOrderCartype",loadSegmentDetail.transType);
            sessionStorage.setItem("dataStart",loadSegmentDetail.delivery.addressLatAndLon);
            sessionStorage.setItem("dataEnd",loadSegmentDetail.arrival.addressLatAndLon);
            var tranTypeBoth = loadSegmentDetail.transType;
            if(loadSegmentDetail.carLength !=  "" && loadSegmentDetail.carLength != null){
              tranTypeBoth = tranTypeBoth + "(" + loadSegmentDetail.carLength + "米)";
            }
            if(loadSegmentDetail.carModel != "" && loadSegmentDetail.carModel != null){
              tranTypeBoth = tranTypeBoth + "(" + loadSegmentDetail.carModel + ")";
            }
            var pdlist = [{
              orderType:loadSegmentDetail.trackingStatus==null?"已确认":loadSegmentDetail.trackingStatus,
              evaluate:{
                grade:loadSegmentDetail.appraiseScore==""?0:loadSegmentDetail.appraiseScore
              },
              goodsmessage:{
                startAddress:loadSegmentDetail.delivery!=null?(loadSegmentDetail.delivery.province+loadSegmentDetail.delivery.area):"",
                endAddress:loadSegmentDetail.arrival!=null?(loadSegmentDetail.arrival.province+loadSegmentDetail.arrival.area):"",
                distance:"0",
                tranType:tranTypeBoth,
                productList:list,
                money:loadSegmentDetail.price*1,
                startTime:loadSegmentDetail.deliDate,
                endTime:loadSegmentDetail.arriDate
              },
              pickMessage:{
                name:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.contact:"",
                tel:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.mobile:"",
                company:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.addrName:"",
                address:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.province+loadSegmentDetail.delivery.area+loadSegmentDetail.delivery.detailAddr:"",
                addresspk:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.pkAddress:"",
              },
              endMessage:{
                name:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.contact:"",
                tel:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.mobile:"",
                company:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.addrName:"",
                address:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.province+loadSegmentDetail.arrival.area+loadSegmentDetail.arrival.detailAddr:"",
                addresspk:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.pkAddress:"",
              },
              insurance:{
                name:"",
                price:"200"
              },
              pickPay:{
                people:"发货方",
                remark:loadSegmentDetail.remark
              },
              owner:{
                logo:loadSegmentDetail.customerDto != null ? loadSegmentDetail.customerDto.customerImg : "",
                company:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.customerName:"",
                year:loadSegmentDetail.customerDto!=null?((((new Date()).getTime()-(new Date(loadSegmentDetail.customerDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 -0.5)<0?"不到半年":androidIos.fixed(((new Date()).getTime()-(new Date(invoiceDetail.customerDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 ,1)+"年"):"",
                phone:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.mobile:"",
              },
              number:type=="1" || type == '2' || type =="3"?loadSegmentDetail.segmentNo:loadSegmentDetail.entrustNo,
              time:loadSegmentDetail.createTime
            }]
            var data=pdlist;
            var listData=data;//模拟分页数据
            successCallback&&successCallback(listData);//成功回调
          }else{
            androidIos.second(loadSegmentDetail.message);
            successCallback&&successCallback(thisThat.pdlist);//成功回调
          }

        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
          thisThat.carloading = false;
          if(status=='timeout'){//超时,status还有success,error等值的情况
            successCallback&&successCallback(thisThat.pdlist);
            androidIos.second("网络请求超时");
          }else if(status=='error'){
            successCallback&&successCallback(thisThat.pdlist);
            androidIos.errorwife();
          }
        }
        })
    },500)
  }

</script>

<style scoped>
  #full_feature{
    padding-top: 0!important;
    width:94%;
    margin:0.4rem auto 0 auto!important;
  }
  #orderLogisticsMore #dataList{
    width:100%;
  }
  .top{
    width:100%;
    min-height:1.8rem;
  }
  .top span{
    font-size: 0.45rem;
    color: white;
    position: absolute;
    top: 0.5rem;
    left: 1rem;
  }
  .top img{
    width:100%;
  }
  .message{
    width:94%;
    margin: 0.2rem auto 0 auto;
  }
  .goodsmessage{
    width:92%;
    padding: 0.2rem 4%;
    background: white;
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    margin-top: 0.4rem;
  }
  #robbingMore .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 1.2rem;
    height: auto;
  }
  .goodsmessage p{
    width:100%;
    font-size: 0.375rem;
    line-height:0.8rem ;
    color:#333;
  }
  .goodsmessage p span{
    font-size: 0.35rem;
    line-height: 0.8rem;
    color:#333;
    float: right;
  }
  .goodsmessage h1,.goodsmessage h2,.goodsmessage h3,.goodsmessage h4{
    width: 42%;
    padding-left: 8%;
    min-height: 0.7rem;
    font-size: 0.36rem;
    float: left;
    margin-top: 0.2rem;
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 0 0.05rem;
    color:#333;
  }
  .goodsmessage h3 span{
    font-size: 0.36rem;
    color:#333;
  }
  .goodsmessage h1{
    background-image: url("../../images/trantype.png");
  }
  .goodsmessage h2{
    background-image: url("../../images/product.png");
  }
  .goodsmessage h3{
    background-image: url("../../images/weight.png");
  }
  .goodsmessage h4{
    background-image: url("../../images/price.png");
  }
  .goodsmessage h5{
    width:93%;
    padding:0.1rem 0 0.1rem 7%;
    font-size: 0.36rem;
    line-height: 0.8rem;
    background-image: url("../../images/time.png");
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 0 50%;
  }
  .peoplemessage{
    width:100%;
    margin-top: 0.25rem;
    position: relative;
  }
  .peoplemessage p{
    width:100%;
    line-height: 0.8rem;
  }
  .peoplemessage h1{
    color:#333;
    font-size: 0.3125rem;
    line-height: 0.5rem;
  }
  .messageBox{
    float: left;
    width:80%;
    margin-bottom: 0.2rem;
  }
  .peoplemessage p span{
    color:#999;
    font-size: 0.35rem;
    margin-right: 0.5rem;
    font-weight: bold;
   /* padding: 0 0.2rem 0.1rem 0.2rem;
    margin-left: 0.2rem;*/
  }
  .colorFull{
    color:#2c9cff!important;
    border-bottom: 2px solid #2c9cff;
  }
  .insurance{
    width:90%;
    margin:0.4rem auto 0 auto;
    padding: 0.2rem 2%;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    border-radius: 0.2rem;
    background: white;
  }
  .insurance p{
    font-size: 0.35rem;
    color:#999;
    line-height: 0.8rem;
    float: left;
  }
  .insurance h1{
    font-size: 0.35rem;
    line-height: 0.8rem;
    color:#666;
    float: right;
  }
  .insurance h1 span{
    font-size: 0.35rem;
    color:#ff4e18;
    margin-left: 0.2rem;
  }
  .company,.carrier{
    width: 90%;
    padding: 0.2rem 2%;
    margin: 0.4rem auto 0 auto;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    border-radius: 0.2rem;
    background: white;
    position: relative;
  }
  .firstBox{
    float: left;
    position: absolute;
    top: 50%;
    margin-top: -0.9rem;
    width:1.8rem;
    height:1.8rem;
    overflow: hidden;
    border-radius: 50%;
    line-height: 1.8rem;
  }
  .firstBox img{
    width:100%;
    display: inline-block;
    vertical-align: middle;
  }
  .secondBox{
    width:50%;
    float: left;
    margin-top: 0.25rem;
    margin-left: 25%;
  }
  .containerImport{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  .panelImport {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
    display: none!important;
  }
  .thirdBox {
    width: 20%;
    float: right;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.56rem;
  }
  .carrier .thirdBox{
    margin-top: -0.75rem!important;
  }
  .thirdBox h6{
    height:1.12rem;
    font-size: 0.3125rem;
    color:#333;
    text-align: center;
    background-image: url("../../images/tel.png");
    background-repeat: no-repeat;
    background-size: 1.12rem 1.12rem;
    background-position: 50% 0%;
  }
  .secondBox p{
    font-size: 0.375rem;
    color:#333;
  }
  .secondBox p span{
    font-size: 0.375rem;
    color:#333;
  }
  .secondBox h1{
    font-size: 0.35rem;
    color:#333;
  }
  .secondBox h2,  .secondBox span{
    font-size: 0.35rem;
    color:#333;
    line-height: 0.7rem;
  }
  .secondBox h2 span{
    margin-left: 0.2rem;
  }
  .number{
    width:94%;
    margin: 0.6rem auto 0.4rem auto;
    font-size: 0.34rem;
    color:#999;
    line-height: 0.71rem;
  }
  #sure .go{
    position: fixed;
    bottom:0;
    height:1.2rem;
    width:100%;
  }
  #sure button{
    width:100%;
    background: #3492ff; /* Safari 5.1 - 6.0 */
    color:white;
    font-size: 0.4rem;
    letter-spacing: 0.0625rem;
    line-height: 1.21rem;
    float: left;
  }
  .noYes{
    width:50%!important;
    float: left;
  }
  .colorBottom{
    background: #88c4ff!important;
  }
  .logisticsBox{
    height:0.7rem;
    overflow: hidden;
    background: white;
    margin: 0.3rem auto 0 auto;
    padding-top: 0.3rem;
    width: 94%;
    border-radius: 0.12rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
  }
  .logisticsBoxDown{
    height: auto;
  }
  .logisticsBox li{
    width: 97%;
    margin-left: 3%;
  }
  .logisticsBox li .logisticsL{
    float: left;
    width:10%;
  }
  .logisticsR{
    float: left;
    min-width:44%;
    font-size: 0.3125rem;
    color:#666;
    line-height: 0.35rem;
  }
  .logisticsBox li img{
    width:0.35rem;
    float: left;
    margin:0.1rem 0 0 0.1rem!important;
  }
  .logisticsCircle{
    width:0.3rem;
    height: 0.3rem;
    border-radius: 50%;
    margin:0 auto;
    background: rgba(228, 228, 228, 1);
  }
  .logisticsShuxian{
    width:1px;
    height:0.4rem;
    margin:0 auto;
    background: rgba(228, 228, 228, 1);
  }
  .logisticsCircleFull{
    background: #3399FF!important;
  }
  .logisticsImg{
    -webkit-transform:scaleY(-1);
    transform:scaleY(-1);
  }
  .error{
    width: 96%;
    padding: 0.2rem 2%;
    margin-top: 0.2rem;
    background: white;
  }
  .errorFirst{
    width:48%;
    float: left;
    line-height: 1.5rem;
    font-size: 0.375rem;
    color:#333;
    text-align: center;
    background-image: url("../../images/error.png");
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 22% 50%;
  }
  .errorSecond{
    width:48%;
    float: right;
    line-height: 1.5rem;
    font-size: 0.375rem;
    color:#333;
    text-align: center;
    background-image: url("../../images/error.png");
    background-repeat: no-repeat;
    background-size: 0.5rem 0.5rem;
    background-position: 22% 50%;
  }
  .errorLine{
    width:4%;
    height:1.5rem;
    float: left;
  }
  .errorLine div{
    width:1px;
    height:0.75rem;
    background: #dbdbdb;
    margin: 0.375rem auto;
  }
  #scoreBox,#cancelReasonBox,#closedOrderBox{
    width:100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
    z-index:188;
    background-color:rgba(0,0,0,0.5);
  }
  #score,#cancelReason,#closedOrder{
    position: absolute;
    bottom:0;
    background: white;
    width:100%;
  }
  #scoreTitle p,#cancelReasonTitle p,#closedOrderTitle p{
    width:100%;
    text-align: center;
    line-height: 1rem;
    font-size: 0.375rem;
    color:#999;
    position: relative;
  }
  #scoreTitle img,#cancelReasonTitle img,#closedOrderTitle img{
    position: absolute;
    width:1rem;
    z-index: 1;
  }
  #errorAbnormal ul,.errorUl{
    width:90%;
    margin: 0.3rem auto;
    border-bottom: 1px solid #dbdbdb;
  }
  #errorAbnormal ul li,.errorUl li{
    width:48%;
    font-size: 0.3125rem;
    color:#666;
    text-align: center;
    line-height: 0.8rem;
    border: 1px solid #666;
    margin-top: 0.15rem;
    border-radius: 0.2rem;

  }
  #orderLogistics #mescroll{
    position: absolute;
    top:0;
    bottom:0;
    height: auto;
    width:100%;
    overflow: scroll;
  }
  .meBottom{
    bottom: 1.2rem!important;
  }
  #errorAbnormal ul input,.errorUl input{
    width:96%;
    padding: 0 2%;
    background: rgba(242, 242, 242, 1);
    line-height: 0.8rem;
    border-radius: 0.2rem;
    margin: 0.2rem 0;
    font-size: 0.3125rem;
  }
  #errorAbnormalChange,#errorPriceChange{
    width:90%;
    margin: 0.1rem auto;
  }
  #errorAbnormalChange span,#errorPriceChange span{
    font-size: 0.03125rem;
    color:#666;
    line-height: 0.8rem;
  }
  #errorAbnormalChange img,#errorPriceChange img{
    width:0.6rem;
    float: right;
    margin-top: 0.1rem;
  }
  #score button,#cancelReason button,#closedOrderBox button{
    width:96%;
    margin-left: 2%;
    border-radius: 0.3rem;
    background: #3399FF;
    color:white;
    font-size: 0.375rem;
    letter-spacing: 0.0625rem;
    line-height: 1rem;
    margin-bottom: 0.1rem;
  }
  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);

    filter: grayscale(100%);

    filter: gray;
  }
  .errorPriceBoxLi{
    border-color:#3399FF!important;
    color:#3399FF!important;
  }
  #carPeopleMessage{
    padding:0.2rem 3%;
    background: white;
    width: 94%;
    margin: 0 auto;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    position: relative;
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
  }
  #carPeopleMessage .peopleImg{
    width:1.2rem;
    float: left;
  }
  #carPeopleMessage .carPeopleMessage{
    float: left;
    margin-left: 0.3rem;
    margin-top: 0.1rem;
  }
  #carPeopleMessage .carPeopleMessage p{
    font-size: 0.3125rem;
    color:#333;
  }
  #carPeopleMessage .carPeopleMessage h1{
    font-size: 0.3125rem;
    color:#999;
  }
  #carPeopleMessage .tel{
    width:1.5rem;
    position: absolute;
    right:0;
    top:50%;
    margin-top: -0.56rem;
  }
  #carPeopleMessage .tel p{
    font-size: 0.3125rem;
    color:#333;
    text-align: center;
  }
  #carPeopleMessage .tel img{
    display: block;
    margin: 0 auto;
    width:1.12rem;
  }
  #evaluate{
    width:94%;
    background: white;
    margin: 0.4rem auto;
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
  }
  #evaluate span{
    line-height: 1.5rem;
    font-size: 0.35rem;
    margin-left: 0.3rem;
    color:#333;
    float: left;
  }
  #star_gradeS{
    float: left;
    margin-left: 0.3rem;
    margin-top: 0.55rem;
  }
  #evaluate img{
    float: right;
    width:0.25rem;
    margin-right: 0.3rem;
    margin-top: 0.524038rem;
  }
  #score ul{
    width:94%;
    padding: 0.2rem 3%;
  }
  #score ul p{
    float: left;
    width:1.3rem;
    line-height: 1rem;
    font-size: 0.37rem;
    color:#333;
  }
  #score ul .star_grade{
    margin: 0.2rem 0 00.2rem;
    float: left;
  }
  .errorAbnormalLeft{
    float:left;
  }
  .errorAbnormalRight{
    float: right;
  }
  .carPeopleMessageTitle{
    margin-top: 0.4rem!important;
    border-radius: 0.2rem;
  }
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
  #gunlun{
    list-style: none;
    display: block;
    width: 100%;
    text-align: center;
    padding: 0;
    margin: 0;
  }
  #gunlun li{
    width: 0.3rem;
    height: 0.3rem;
    margin: 0.3rem 0.1rem 0 0.1rem;
    background-color: #a7d6ff;
    border-radius: 50%;
    display: inline-block;
    cursor: pointer;
  }
  .gunlicolorFul{
    background: #3492ff!important;
  }
</style>
