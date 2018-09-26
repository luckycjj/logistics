<template>
  <div id="trackMore">
    <div id="title" v-title data-title="订单详情"></div>
    <div v-if="carloading" style="position: fixed;top:1.3rem;bottom:0;height:auto;width:100%;">
      <img src="../../images/carloading.gif" style="width:4rem;position: absolute;top:50%;left:50%;margin-left: -2rem;margin-top: -4rem">
      <p style="font-size: 0.4rem;top:50%;text-align: center;line-height: 1rem;color:#3399FF;width:100%;position: absolute">正在加载中...</p>
    </div>
    <div id="mescroll" class="mescroll" :class="type==0 || (peopleType == 2 && type !=1 ) || (type==8 && endtype == '0' && actFlag != 'Y')?'meBottom':''">
      <ul id="dataList" class="data-list">
        <li v-for="item in pdlist">
          <div class="top">
            <div style="width:100%;position: relative;top:0;left:0;">
              <span v-html="item.orderValue"></span>
              <img src="../../images/order2.png" style="height: 1.64rem;">
            </div>
            <div class="clearBoth"></div>
            <ul id="errorBiglist" class="logisticsBox" :class="errorBiglistOk ? 'logisticsBoxDown' : '' "  v-if="item.errorBiglist.length > 0">
              <li v-for="(cjj,index) in item.errorBiglist">
                <div class="logisticsL">
                  <div class="logisticsCircle" :class="index==0?'logisticsCircleFull':''"></div>
                  <div class="logisticsShuxian"></div>
                </div>
                <div class="logisticsR">
                  {{cjj.memo}}&nbsp;&nbsp;{{cjj.createTime}}
                </div>
                <img src="../../images/downJian.png"  :class="errorBiglistOk?'logisticsImg':''" v-if="index == 0 && item.errorBiglist.length > 1" @click="errorBiglistBoxDown()">
                <div class="clearBoth"></div>
              </li>
            </ul>
            <ul id="logisticsBox" class="logisticsBox" :class="logisticsOk?'logisticsBoxDown':''"  v-if="item.logistics.length > 0">
              <li v-for="(cjj,index) in item.logistics">
                <div class="logisticsL">
                  <div class="logisticsCircle" :class="index==0?'logisticsCircleFull':''"></div>
                  <div class="logisticsShuxian"></div>
                </div>
                <div class="logisticsR">
                  {{cjj.type}}&nbsp;&nbsp;{{cjj.time}}
                </div>
                <img src="../../images/downJian.png"  :class="logisticsOk?'logisticsImg':''" v-if="index==0 && item.logistics.length > 1" @click="logisticsBoxDown()">
                <div class="clearBoth"></div>
              </li>
            </ul>
          </div>
          <div class="waitForTime" v-if="(type == 3 || type == 6)&& timeShowF != ''">
            {{timeShowF}}
          </div>
          <div id="full_feature" class="swipslider" v-if="type >0 && type < 8 && carList.length > 0" :style="{minHeight:type ==1?'2.5rem':'6rem'}">
            <ul class="sw-slides">
              <li class="sw-slide" v-for="(car,index) in carList">
                <div style="width:100%;background: white;height:3rem;box-shadow: 0 0.1rem 10px #d8d8d8;overflow:hidden;position: relative;margin:0.4rem auto 0 auto;border-top-left-radius: 0.2rem;border-top-right-radius: 0.2rem;" v-if="type > 1">
                  <div   v-if="(car.ordertype == '20' || car.ordertype == '31' || car.ordertype == '32' || car.ordertype == '33' || car.ordertype == '41' || car.ordertype == '42' ) && car.peopleJ != '' && car.peopleW != ''" @click="mapGo(car)">
                    <div :id="'container'+index" class="containerImport"></div>
                    <div :id="'panel'+index" class="panelImport"></div>
                    <div style="width:100%;height:3rem;position: absolute;top:0;left:0;background: transparent;z-index:180;border-top-left-radius: 0.2rem;border-top-right-radius: 0.2rem;"></div>
                  </div>
                  <img style="width:50%;margin: 0 auto;" src="../../images/notransport.png" v-else>
                </div>
                <div id="carPeopleMessage">
                  <div class="imgBoxOverFllow">
                    <img :src="car.logo" :onerror="errorlogo" class="peopleImg">
                  </div>
                  <div class="carPeopleMessage">
                    <p >{{car.name}}</p> <h2  v-if="car.ordertype == '20' || car.ordertype == '31' || car.ordertype == '32' || car.ordertype == '33' || car.ordertype == '41'">距离目的地<span v-html="car.length-1>0 ? car.length+'千米':car.length*1000+'米'"></span></h2>
                    <div :id="'star_grade'+index"  class="star_grade"></div>
                    <h1>驾龄：{{car.year}}年</h1>
                  </div>
                  <div class="tel" @click="telphone(car.tel)">
                    <img src="../../images/tel.png">
                  </div>
                  <div class="clearBoth"></div>
                </div>
              </li>
            </ul>
          </div>
          <div class="message">
            <div class="goodsmessage">
              <p :data-start="item.pickMessage.address" :data-end="item.endMessage.address" class="startEnd"><span style="float: left;font-size: 0.4rem;color:#333;font-weight: bold;">{{item.goodsmessage.startAddress}}<img style="display: inline-block;margin:0rem 0.3rem 0.13rem 0.3rem;width:0.41rem;" src="../../images/addressImg.png">{{item.goodsmessage.endAddress}}</span><span  v-if="type == '20' || type == '40' || type == '60' " class="distance">{{item.goodsmessage.distance}}km</span><div class="clearBoth"></div></p>
              <h1>{{item.goodsmessage.tranType}}</h1>
              <h4>{{item.goodsmessage.money}}元</h4>
              <div class="clearBoth"></div>
              <div v-for="itemS in item.goodsmessage.productList ">
                <h2>{{itemS.goods}}</h2>
                <h3>{{itemS.number}}件<span v-if="itemS.weight.replace(/[^0-9]/g,'')*1 > 0">/{{itemS.weight}}</span><span v-if="itemS.volume.replace(/[^0-9]/g,'')*1 > 0">/{{itemS.volume}}</span></h3>
                <div class="clearBoth"></div>
              </div>
              <div class="clearBoth"></div>
              <h5>{{item.goodsmessage.startTime}} - {{item.goodsmessage.endTime}}</h5>
            </div>
            <div class="peoplemessage">
              <p><span>发货方</span></p>
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
          <div class="error" v-if="type > 1 && type < 8 && peopleType == 1">
            <div class="errorFirst" @click="errorFirst()">
               异常反馈
            </div>
            <div class="errorLine"><div></div></div>
            <div class="errorSecond" @click="errorSecond()">
               费用反馈
            </div>
            <div class="clearBoth"></div>
          </div>
          <div class="company">
            <div class="firstBox">
              <img :src="httpurl + item.owner.logo"  :onerror="errorlogo" class="companyImg">
            </div>
            <div class="secondBox">
              <p><span>{{item.owner.company}}</span></p>
              <h2>入驻<span>{{item.owner.year}}</span></h2>
            </div>
            <div class="thirdBox"  @click="telphone(item.owner.phone)">
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
      <div class="go gogogo" id="gogogo" v-if="peopleType==1">
        <button v-if="type==1" @click="chufa()">出发</button>
        <button v-else-if="type==2" @click="daoda(31)">提货到达</button>
        <button v-else-if="type==3" @click="daoda(32)">开始装货</button>
        <button v-else-if="type==4" @click="daoda(33)">装货完毕</button>
        <button v-else-if="type==5" @click="daoda(41)">运输到达</button>
        <button v-else-if="type==6" @click="daoda(42)">开始卸货</button>
        <button v-else-if="type==7" @click="daoda(43)">卸货完毕</button>
        <button v-else-if="type==8 && endtype == '0' && actFlag == 'Y'" @click="qianshou(endtype)">交接</button>
        <button v-else-if="type==8 && endtype == '1'" @click="qianshou(endtype)">签收</button>
        <button v-else-if="type==9 && pdlist[0].exp_sign == 1" @click="uploadbill(1)">确认异常签收</button>
        <button v-else-if="type==9 && pdlist[0].exp_sign == 0" @click="uploadbill(0)">上传单据</button>
      </div>
      <div class="go"  v-else>
        <button v-if="type==1" @click="genghuan()">更换车辆</button>
      </div>
    </div>
    <div id="errorAbnormalBox" v-if="errorAbnormalBox">
         <div id="errorAbnormal">
            <div id="errorabnormalTitle">
              <img src="../../images/closed.png" @click="errorAbnormalClosed()">
              <p>选择异常事故</p>
            </div>
           <ul class="errorUl">
             <li v-for="(item,index) in errorAbnormal" :class="index%2==0?'errorAbnormalLeft':'errorAbnormalRight'" @click="errorAbnormalClick($event)">
                {{item.displayName}}
             </li>
             <div class="clearBoth"></div>
             <input type="text" placeholder="其他异常" maxlength="100" v-model="errorabnormal">
           </ul>
           <!--<div id="errorAbnormalChange">
             <span>是否需要更换运力</span>
             <img src="../../images/checked.png" class="gray" id="errorAbnormalChangeImg" @click="errorAbnormalChangeImg()">
             <div class="clearBoth"></div>
           </div>-->
           <button @click="errorAbnormalChange()"  class="gogogo" id="gogogo2">提交</button>
         </div>
    </div>
    <div id="errorPriceBox" v-if="errorPriceBox">
      <div id="errorPrice">
        <div id="errorpriceTitle">
          <img src="../../images/closed.png" @click="errorPriceClosed()">
          <p>填写费用</p>
        </div>
        <ul style="border: none;" class="errorUl">
          <li v-for="(item,index) in errorPriceList" :class="index%2==0?'errorAbnormalLeft':'errorAbnormalRight'" @click="errorPriceListListClick($event)">
            {{item.displayName}}
          </li>
          <div class="clearBoth"></div>
          <input type="text" placeholder="填写原因" maxlength="40" style="margin-bottom: 0;" v-model="errorPricetype"/>
          <input type="text" placeholder="金额" maxlength="40" v-model="errorPrice"/>
        </ul>
        <button @click="errorPriceChange()" id="gogogo4" class="gogogo">提交</button>
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
  import "../../js/swipeslider"
  var thisThat;
  var pdlist = []
  export default {
    name: "robbingMore",
    data(){
      return{
        carloading:true,
        type:"",
        pick:true,
        logisticsOk:false,
        errorBiglistOk:false,
        pdlist:[],
        peopleType:0,
        errorAbnormalBox:false,
        errorPriceBox:false,
        errorAbnormal:[],
        errorPriceList:[],
        errorabnormal:"",
        errorPricetype:"",
        errorPrice:"",
        mescroll:"",
        endtype:0,
        carList:[],
        httpurl:"",
        carpeoList:[],
        actFlag:"Y",
        errorlogo: 'this.src="' + require('../../images/carpeople.png') + '"',
        setTimeGoF:null,
        timeShowF:"",
      }
    },
    watch:{
      errorPrice:{
        handler:function(val,oldval){
             var _this = this;
            _this.errorPrice=(_this.errorPrice.match(/\d+(\.\d{0,2})?/)||[''])[0];
        },
        deep:true
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
        sessionStorage.removeItem("changeCarpeople");
        sessionStorage.removeItem("changeCarFupeople");
        sessionStorage.removeItem("nowOrderCartype");
        self.peopleType = self.$route.query.pt == undefined ? 0 :self.$route.query.pt;
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
          self.logisticsOk = false;
          self.type = curPageData[0].orderType == '10'?1:curPageData[0].orderType == '20'?2:curPageData[0].orderType == '31'?3:curPageData[0].orderType == '32'?4:curPageData[0].orderType == '33'?5:curPageData[0].orderType == '41'?6:curPageData[0].orderType == '42'?7:curPageData[0].orderType == '43'?8:curPageData[0].orderType == '50'?9:0;
          self.mescroll.endSuccess(curPageData.length);
          sessionStorage.setItem("orderPk",self.$route.query.pk);
          sessionStorage.setItem("dispatchPK",self.$route.query.pk);
          self.$nextTick(function () {
            if(self.type == 3 || self.type == 6){
              self.setTimeStart();
            }else{
              if(self.setTimeGoF){
                clearInterval(self.setTimeGoF);
              }
            }
            if(self.pdlist[0].errorBiglist.length > 0){
              var htmlFont = document.getElementsByTagName("html");
              var errorBiglist = document.getElementById("errorBiglist");
              var errorBiglistFont = errorBiglist.firstChild.offsetHeight / htmlFont[0].style.fontSize.replace("px","");
              errorBiglist.style.height = errorBiglistFont + "rem";
            }
            if(self.type < 8 ){
              var sss = setInterval(function () {
                if((_this.carList.length == 1 && $(".amap-lib-marker-to").length == _this.carList.length) || (_this.carList.length>1&&$(".amap-lib-marker-to").length - 2  == _this.carList.length) ){
                  clearInterval(sss);
                  for(var i = 0 ;i < $(".amap-lib-marker-to").length ;i++){
                    var dd = 0;
                    if( _this.carList.length > 1 ){
                      if(i == 0){
                        dd = _this.carList.length - 1;
                      }else if(i == ($(".sw-slides li").length -1)){
                        dd = 0 ;
                      }else{
                        dd = i -1;
                      }
                    }else{
                      dd = i ;
                    }
                    var ordertype = _this.carList[dd].ordertype;
                    if(ordertype == '20' || ordertype == '31' || ordertype == '32'){
                      $(".amap-lib-marker-to").eq(i).addClass("amaplibmarkertos");
                      $(".amap-lib-marker-from").eq(i).addClass("amaplibmarkerfroms");
                    }else{
                      $(".amap-lib-marker-to").eq(i).addClass("amaplibmarkerto");
                      $(".amap-lib-marker-from").eq(i).addClass("amaplibmarkerfrom");
                    }
                  }
                }
              },100);
            }
            if ((self.type == 1) && self.peopleType == 2) {
              $("#erweimaLook").hide();
            } else if (self.peopleType == 1) {
              $("#erweimaLook").show();
              document.getElementById("erweimaLook").onclick = function () {
                androidIos.addPageList();
                self.$router.push({path: '/track/qrcode', query: {ty: 2}});
              }
            } else {
              $("#erweimaLook").hide();
            }
            if(self.type >0 && self.type < 8 ){
              if($(".sw-bullet").length == 0 && self.carList.length > 1){
                $('#full_feature').swipeslider();
              }
            }
            if(self.type >0 && self.type <8){
              for(var i = 0; i<$(".sw-slides li").length;i++){
                var price = self.carList.length > 1 ?(i == 0 ? self.carList[self.carList.length-1].price:i ==$(".sw-slides li").length - 1?self.carList[0].price:self.carList[i-1].price):self.carList[i].price;
                var id =  self.carList.length > 1 ? ( i == 0?self.carList.length - 1+'000':i ==$(".sw-slides li").length - 1?'0111' :i-1):i;
                $("#star_grade"+id).html("");
                $("#star_grade"+id).markingSystem({
                  num: 5,
                  havePoint: true,
                  haveGrade: true,
                  backgroundImageInitial:require('../../images/star_hollow.png'),
                  backgroundImageOver:require('../../images/star_solid.png'),
                  unit: '星',
                  grade:price,
                  height: 0.4* $("html").css("font-size").replace("px", ""),
                  width: 0.4* $("html").css("font-size").replace("px", ""),
                });
                var _this = self;
                var cc = 0;
                var dd = 0;
                if( self.carList.length > 1 ){
                  if(i == 0){
                    cc = (self.carList.length-1)+"000";
                    dd = self.carList.length - 1;
                  }else if(i == ($(".sw-slides li").length -1)){
                    cc = "0111"
                    dd = 0 ;
                  }else{
                    cc = i - 1 ;
                    dd = i -1;
                  }
                }else{
                  cc = i ;
                  dd = i ;
                }
                var ee = i;
                var ordertype = _this.carList[dd].ordertype;
                if(ordertype == '20' || ordertype == '31' || ordertype == '32' || ordertype == '33' || ordertype == '41'|| ordertype == '42' ){
                  var map = new AMap.Map("container"+cc, {
                    resizeEnable: true,
                    center: [_this.carList[dd].startJ, _this.carList[dd].startW],//地图中心点
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
                    panel: "panel"+cc
                  });
                  var marker;
                  var ordertyper = _this.carList[dd].ordertype;
                  if(ordertyper ==  "33"  || ordertyper == '41'|| ordertype == '42' ){
                    var lnglat = new AMap.LngLat(_this.carList[dd].endJ, _this.carList[dd].endW);
                    _this.compareDistanc(lnglat,dd);
                    driving.search([_this.carList[dd].startJ, _this.carList[dd].startW], [_this.carList[dd].endJ, _this.carList[dd].endW], function(status, result) {});
                      /*if (marker) {
                        marker.setMap(null);
                        marker = null;
                      }*/
                      marker = new AMap.Marker({
                        icon:require('../../images/start1.png'),
                        position: [_this.carList[dd].peopleJ, _this.carList[dd].peopleW]
                      });
                      marker.setMap(map);
                  }else{
                    var lnglat = new AMap.LngLat(_this.carList[dd].startJ, _this.carList[dd].startW);
                    _this.compareDistanc(lnglat,dd);
                    driving.search([_this.carList[dd].peopleJ, _this.carList[dd].peopleW],[_this.carList[dd].startJ, _this.carList[dd].startW], function(status, result) {});
                  }
                }
              }
            }
            for(var x = 0 ; x < $(".imgBoxOverFllow").length;x++){
              var className = document.getElementsByClassName("peopleImg")[x];
              className.onload = function () {
                for (var i = 0; i < $(".imgBoxOverFllow").length; i++) {
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
          });
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      compareDistanc: function(lnglat,dd) {
        var _this = this;
        var myDistance = lnglat.distance([_this.carList[dd].peopleJ, _this.carList[dd].peopleW]);//这里测量距离
        _this.carList[dd].length = (myDistance/1000).toFixed(3);
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
      logisticsBoxDown:function () {
        var _this = this;
        _this.logisticsOk = !_this.logisticsOk;
      },
      errorBiglistBoxDown:function(){
        var _this = this;
        _this.errorBiglistOk = !_this.errorBiglistOk;
      },
      errorAbnormalChangeImg:function () {
        if(bomb.hasClass("errorAbnormalChangeImg","gray")){
          bomb.removeClass("errorAbnormalChangeImg","gray");
        }else{
          bomb.addClass("errorAbnormalChangeImg","gray");
        }
      },
      mapGo:function(order){
         var _this = this;
         androidIos.addPageList();
         sessionStorage.setItem("carOrder",JSON.stringify(order));
        _this.$router.push({ path: '/track/map'});
      },
      errorFirst:function () {
         var _this = this;
         _this.errorAbnormalBox = true;
         if(_this.errorAbnormal.length == 0){
           $.ajax({
             type: "GET",
             url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
             data:{str:"exception_feedback",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
             dataType: "json",
             timeout: 10000,
             success: function (getSysConfigList) {
               _this.errorAbnormal = getSysConfigList;
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
      },
      errorSecond:function () {
        var _this = this;
        _this.errorPriceBox = true;
        if(_this.errorPriceList.length == 0){
          $.ajax({
            type: "GET",
            url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
            data:{str:"cost_Feedback",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
            dataType: "json",
            timeout: 10000,
            success: function (getSysConfigList) {
              _this.errorPriceList = getSysConfigList;
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
      },
      errorAbnormalChange:function () {
        var _this = this;
        if(bomb.hasClass("gogogo2","gogogo")){
          var list = [];
          for(var i = 0 ;i<_this.errorAbnormal.length;i++){
            if($(".errorUl li").eq(i).hasClass("errorPriceBoxLi")){
              list.push(_this.errorAbnormal[i])
            }
          }
          if((list.length == 0  || list[0].value == 0 )&& _this.errorabnormal == ''){
            bomb.first("请选择或填写异常");
            return false;
          }
          var json = {
            userCode : sessionStorage.getItem("token"),
            source : sessionStorage.getItem("source"),
            expType : list[0] == undefined || (list[0] != undefined && list[0].displayName == "其他") ? "" : list[0].displayName,
            trackingMemo : _this.errorabnormal,
            entrustVbillno : _this.pdlist[0].number == undefined ? "" : _this.pdlist[0].number
          }
          bomb.removeClass("gogogo2","gogogo");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/driver/abnormalFeedback",
            data:JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (abnormalFeedback) {
              if(abnormalFeedback.success == "1"){
                _this.errorAbnormalBox = false;
                _this.errorabnormal = "";
                $("#errorAbnormalBox .errorUl li").removeClass("errorPriceBoxLi");
                _this.$cjj("反馈成功");
                setTimeout(function () {
                  _this.mescroll.resetUpScroll();
                },500)
              }else{
                androidIos.second(abnormalFeedback.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo2","gogogo");
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
      errorAbnormalClosed:function () {
        var _this = this;
        _this.errorAbnormalBox = false;
        _this.errorabnormal = "";
        $("#errorAbnormalBox .errorUl li").removeClass("errorPriceBoxLi");
      },
      errorPriceChange:function () {
        var _this = this;
        if(bomb.hasClass("gogogo4","gogogo")){
          var list = [];
          for(var i = 0 ;i<_this.errorPriceList.length;i++){
            if($("#errorPriceBox .errorUl li").eq(i).hasClass("errorPriceBoxLi")){
              list.push(_this.errorPriceList[i].value)
            }
          }
          if(list.length == 0){
            bomb.first("请选择费用类型");
            return false;
          }
          if( _this.errorPrice == ''){
            bomb.first("请填写费用");
            return false;
          }
          var json = {
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
            costType:list[0]==undefined?'':list[0],
            memo:_this.errorPricetype,
            amount:_this.errorPrice,
            entrustVbillno:_this.pdlist[0].number
          }
          bomb.removeClass("gogogo4","gogogo");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/driver/costFeedback",
            data:JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (abnormalFeedback) {
              if(abnormalFeedback.success == "1"){
                _this.errorPriceBox = false;
                _this.errorPricetype = "";
                _this.errorPrice = "";
                $("#errorPriceBox .errorUl li").removeClass("errorPriceBoxLi");
                _this.$cjj("反馈成功");
                setTimeout(function () {
                  _this.mescroll.resetUpScroll();
                },500)
              }else{
                androidIos.second(abnormalFeedback.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo4","gogogo");
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
      errorPriceClosed:function(){
        var _this = this;
        _this.errorPriceBox = false;
        _this.errorPricetype = "";
        _this.errorPrice = "";
        $("#errorPriceBox .errorUl li").removeClass("errorPriceBoxLi");
      },
      errorPriceListListClick:function (e) {
        if(!this.hasClass(e.target,"errorPriceBoxLi")){
          $("#errorPriceBox .errorUl li").removeClass("errorPriceBoxLi");
          this.addClass(e.target,"errorPriceBoxLi");
        }else{
          $("#errorPriceBox .errorUl li").removeClass("errorPriceBoxLi");
        }
      },
      errorAbnormalClick:function(e){
        if(!this.hasClass(e.target,"errorPriceBoxLi")){
          $("#errorAbnormalBox .errorUl li").removeClass("errorPriceBoxLi");
          this.addClass(e.target,"errorPriceBoxLi");
        }else{
          $("#errorAbnormalBox .errorUl li").removeClass("errorPriceBoxLi");
        }
      },
      mapSClick:function(){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/track/map'});
      },
      qianshou:function(type){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/track/qrcode',query:{ty:type}});
      },
      uploadbill:function (type) {
        var _this = this;
        androidIos.addPageList();
        if(type == 1){
          _this.$router.push({ path: '/track/uploadImg',query:{pk:_this.$route.query.pk,expSign:_this.pdlist[0].exp_sign}});
        }else if(type == 0){
          _this.$router.push({ path: '/track/uploadBill',query:{pk:_this.$route.query.pk,expSign:_this.pdlist[0].exp_sign}});
        }
      },
      genghuan:function () {
        var _this = this;
        if(_this.pdlist[0].pkCarHang == ""){
          sessionStorage.setItem("LABELTOP",JSON.stringify({
             number:_this.pdlist[0].pkTransType,
             type:0,
             serach:""
          }))
          sessionStorage.setItem("carsure",JSON.stringify([{
            pkcar:_this.pdlist[0].pkCar,
            carModel:"整车",
            cartype:0
          }]))
        }else{
          sessionStorage.setItem("LABELTOP",JSON.stringify({
            number:0,
            type:1,
            serach:"",
            top:0,
          }))
          sessionStorage.setItem("carsureListS",JSON.stringify({
            pkcar:_this.pdlist[0].pkCar,
            carModel:"车头",
            cartype:1
          }))
          sessionStorage.setItem("GUALABELTOP",JSON.stringify({
            number:_this.pdlist[0].pkTransType,
            type:0,
            serach:"",
          }))
          sessionStorage.setItem("carsure",JSON.stringify([{
            pkcar:_this.pdlist[0].pkCar,
            carModel:"车头",
            cartype:0
          },{
            pkcar:_this.pdlist[0].pkCarHang,
            carModel:"车挂",
            cartype:0
          }]))
        }
        sessionStorage.setItem("carPKlistGo",_this.pdlist[0].pkCar + "," + _this.pdlist[0].pkCarHang);
        androidIos.addPageList();
        _this.$router.push({ path: '/site/car'});
      },
      dayVsDay:function () {
        var _this = this;
        var nowTime = (new Date()).getTime();
        var startTime = (new Date(_this.pdlist[0].goodsmessage.startTime)).getTime();
        var startTime2 = (new Date(_this.pdlist[0].trackingTime)).getTime();
        var startTimeyes = startTime - startTime2 > 0 ? startTime : startTime2;
        var time = nowTime - startTimeyes;
        if(time <0){
          time = 0 ;
        }
        return time
      },
      setTimeStart:function () {
        var _this = this;
        var time = _this.dayVsDay();
        var day = Math.floor(time / (24*60*60*1000));
        var hour =  Math.floor((time - day * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
        var min =  Math.floor((time - day * 24 * 60 * 60 * 1000 - hour * 60 * 60 * 1000) / (60*1000));
        var sec =  Math.floor((time - day * 24 * 60 * 60 * 1000 - hour * 60 * 60 * 1000 - min *60 *1000) / (1000));
        if(_this.setTimeGoF){
          clearInterval(_this.setTimeGoF);
        }
        _this.dayShow(day,hour,min,sec);
        _this.setTimeGoF = setInterval(function () {
          if(_this.dayVsDay() > 0){
            sec++;
          }
          if(sec == 60){
            sec = 0;
            min++;
          }
          if(min == 60){
            min = 0;
            hour++;
          }
          if(hour == 24){
            hour = 0;
            day ++;
          }
          _this.dayShow(day,hour,min,sec);
        },1000)
      },
      dayShow:function (day,hour,min,sec) {
        var _this = this;
        if( day > 0 ){
          _this.timeShowF = "等待中：" + day + "天" + _this.ten(hour)  + "时" + _this.ten(min) + "分" + _this.ten(sec)+ "秒";
        }else{
          if(hour > 0){
            _this.timeShowF = "等待中：" + _this.ten( hour)  + "时" + _this.ten(min) + "分" + _this.ten(sec)+ "秒";
          }else{
            if(min > 0){
              _this.timeShowF = "等待中：" + _this.ten(min) + "分" + _this.ten(sec)+ "秒";
            }else{
              if(sec > 0){
                _this.timeShowF = "等待中：" + _this.ten(sec)+ "秒";
              }else{
                _this.timeShowF = "";
              }
            }
          }
        }
      },
      ten:function (number) {
        if(number < 10){
          number = "0" + number;
        }
        return number
      },
      chufa:function(){
        var _this = this;
        if(bomb.hasClass("gogogo","gogogo")){
          androidIos.loading("正在出发");
          bomb.removeClass("gogogo","gogogo");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/driverOut",
            data:JSON.stringify({pk:_this.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (driverOut) {
              bomb.addClass("gogogo","gogogo");
              $("#common-blackBox").remove();
              if(driverOut.success=="1" ||driverOut.success == ""){
                _this.$cjj("出发成功");
                setTimeout(function () {
                  _this.mescroll.resetUpScroll();
                },500)
              }else{
                androidIos.second(driverOut.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo","gogogo");
              if(status=='timeout'){//超时,status还有success,error等值的情况
                $("#common-blackBox").remove();
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                $("#common-blackBox").remove();
                androidIos.errorwife();
              }
            }
          })
        }else{
          bomb.first("请不要频繁点击");
        }

      },
      daoda:function(type){
        var _this = this;
        if(bomb.hasClass("gogogo","gogogo")){
          if(type == 31 || type == 32 || type == 42 || type == 41){
            for(var i = 0 ; i < _this.carList.length; i++){
              if(_this.carList[i].length == ""){
                androidIos.first("请提醒" + _this.carList[i].name +"("+_this.carList[i].tel+")打开定位系统");
                $(".tanBox-yes").html("联系");
                $(".tanBox-yes").unbind('click').click(function(){
                  $(".tanBox-bigBox").remove();
                  bridge.invoke("callTelephone",_this.carList[i].tel);
                });
                return false;
              }
              if(_this.carList[i].length - 0.5 >= 0 ){
                if(type == 31 || type == 32){
                  androidIos.second(_this.carList[i].name +"("+_this.carList[i].tel+")还未到达" + _this.pdlist[0].pickMessage.address+ "附近,请稍后再试");
                }else if(type == 42 || type == 41){
                  androidIos.second(_this.carList[i].name +"("+_this.carList[i].tel+")还未到达" + _this.pdlist[0].endMessage.address+ "附近,请稍后再试");
                }
                return false;
              }
            }
          }
          var message = type == '31'?'提货达到':type == '32'?'开始装货':type == '33'?'装货完毕':type == '41'?'运输到达':type == '42'?'开始卸货':'卸货完毕';
          var http = type == '33' || type == '41' ? '/order/arriveOrDelivery':'/order/updateStatus';
          type = type == '33'?'1': type == '41' ?'2':type;
          androidIos.loading(message);
          bomb.removeClass("gogogo","gogogo");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+http,
            data:JSON.stringify({pk:_this.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source"),type:type}),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (arriveOrDelivery) {
              $("#common-blackBox").remove();
              bomb.addClass("gogogo","gogogo");
              if(arriveOrDelivery.success=="1" ||arriveOrDelivery.success == ""){
                _this.$cjj(message);
                setTimeout(function () {
                  /*bridge.invoke('gobackfrom');*/
                  _this.mescroll.resetUpScroll();
                },500)
              }else{
                androidIos.second(arriveOrDelivery.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo","gogogo");
              if(status=='timeout'){//超时,status还有success,error等值的情况
                $("#common-blackBox").remove();
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                $("#common-blackBox").remove();
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
      if(thisThat.setTimeGoF){
        clearInterval(thisThat.setTimeGoF);
      }
      thisThat.carList = [];
      thisThat.$nextTick(function () {
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/order/loadEntrustDetail",
          data:JSON.stringify({pk:thisThat.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 20000,
          success: function (loadSegmentDetail) {
            thisThat.carloading = false;
            if (loadSegmentDetail.success == "1") {
              thisThat.type = thisThat.$route.query.type;
              var list=[];
              var weh = 0;
              for(var i =0;i<loadSegmentDetail.invPackDao.length;i++){
                var weight = loadSegmentDetail.invPackDao[i].weigthUnit==3?loadSegmentDetail.invPackDao[i].weight*1000:loadSegmentDetail.invPackDao[i].weight*1;
                var listJson = {
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
              var tracking=[];
              for(var i =0 ;i<loadSegmentDetail.tracking.length;i++){
                var trackingJson = {
                  memo:loadSegmentDetail.tracking[i].tackingMemo,
                  createTime:loadSegmentDetail.tracking[i].tackingTime,
                }
                loadSegmentDetail.abnormalaEventVo.push(trackingJson);
              }
              loadSegmentDetail.abnormalaEventVo.sort(function(a,b){
                return  (new Date(b.createTime)).getTime()- (new Date(a.createTime)).getTime()});
              thisThat.endtype = loadSegmentDetail.type;
              sessionStorage.setItem("dataStart",loadSegmentDetail.delivery.addressLatAndLon);
              sessionStorage.setItem("dataEnd",loadSegmentDetail.arrival.addressLatAndLon);
              var pdlist = [{
                orderType:loadSegmentDetail.trackingStatusValue,
                orderValue:loadSegmentDetail.trackingStatus == null ? "已确认" : loadSegmentDetail.trackingStatus,
                logistics:tracking,
                errorBiglist:loadSegmentDetail.abnormalaEventVo == undefined ? [] : loadSegmentDetail.abnormalaEventVo,
                goodsmessage:{
                  startAddress:loadSegmentDetail.delivery != null ? ( loadSegmentDetail.delivery.province /*+ loadSegmentDetail.delivery.city */+ loadSegmentDetail.delivery.area ) : "" ,
                  endAddress:loadSegmentDetail.arrival!=null?(loadSegmentDetail.arrival.province/*+loadSegmentDetail.arrival.city*/+loadSegmentDetail.arrival.area):"",
                  distance:"0",
                  tranType:loadSegmentDetail.transType,
                  productList:list,
                  money:loadSegmentDetail.price*1,
                  startTime:loadSegmentDetail.deliDate,
                  endTime:loadSegmentDetail.arriDate
                },
                pickMessage:{
                  name:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.contact:"",
                  tel:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.mobile:"",
                  company:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.addrName:"",
                  address:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.province/*+loadSegmentDetail.delivery.city*/+loadSegmentDetail.delivery.area+loadSegmentDetail.delivery.detailAddr:"",
                  addresspk:loadSegmentDetail.delivery!=null?loadSegmentDetail.delivery.pkAddress:"",
                },
                endMessage:{
                  name:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.contact:"",
                  tel:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.mobile:"",
                  company:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.addrName:"",
                  address:loadSegmentDetail.arrival!=null?loadSegmentDetail.arrival.province/*+loadSegmentDetail.arrival.city*/+loadSegmentDetail.arrival.area+loadSegmentDetail.arrival.detailAddr:"",
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
                  logo:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.customerImg:"",
                  company:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.customerName:"",
                  year:loadSegmentDetail.customerDto!=null?((((new Date()).getTime()-(new Date(loadSegmentDetail.customerDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 -0.5)<0?"不到半年":androidIos.fixed(((new Date()).getTime()-(new Date(invoiceDetail.customerDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 ,1)+"年"):"",
                  phone:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.mobile:"",
                },
                tranNumber:"123321334343",
                number:loadSegmentDetail.entrustNo,
                time:loadSegmentDetail.createTime,
                pkCar:loadSegmentDetail.pkCar,
                trackingTime:loadSegmentDetail.trackingTime,
                pkCar: loadSegmentDetail.pkCar,
                pkCarHang:loadSegmentDetail.pkCarHang,
                pkTransType:loadSegmentDetail.pkTransType,
                exp_sign:loadSegmentDetail.expSign == undefined || loadSegmentDetail.expSign == "N" ? "0" : "1",
              }]
              thisThat.carList = [];
              thisThat.actFlag = loadSegmentDetail.actFlag;
              for(var i = 0; i < loadSegmentDetail.driverDto.length ; i++ ){
                var json = {
                  logo:loadSegmentDetail.driverDto[i].driverImg,
                  name:loadSegmentDetail.driverDto[i].driverName,
                  year:loadSegmentDetail.driverDto[i].driverAge*1 < 1 ? "小于1" : loadSegmentDetail.driverDto[i].driverAge,
                  tel:loadSegmentDetail.driverDto[i].mobile,
                  startJ :loadSegmentDetail.delivery.addressLatAndLon == ""||loadSegmentDetail.delivery.addressLatAndLon == null ? "" :loadSegmentDetail.delivery.addressLatAndLon.split(",")[0],
                  startW : loadSegmentDetail.delivery.addressLatAndLon == ""||loadSegmentDetail.delivery.addressLatAndLon == null ? "" :loadSegmentDetail.delivery.addressLatAndLon.split(",")[1],
                  endJ:loadSegmentDetail.arrival.addressLatAndLon == "" ||loadSegmentDetail.arrival.addressLatAndLon == null ? "" :loadSegmentDetail.arrival.addressLatAndLon.split(",")[0],
                  endW:loadSegmentDetail.arrival.addressLatAndLon == "" ||loadSegmentDetail.arrival.addressLatAndLon == null ? "" :loadSegmentDetail.arrival.addressLatAndLon.split(",")[1],
                  pkDriver:loadSegmentDetail.driverDto[i].pkDriver,
                  peopleJ:loadSegmentDetail.driverDto[i].driverPosition.split(",")[0],
                  peopleW:loadSegmentDetail.driverDto[i].driverPosition.split(",")[1],
                  ordertype:loadSegmentDetail.trackingStatusValue*1,
                  price:loadSegmentDetail.driverDto[i].score*1,
                  length:"",
                }
                thisThat.carList.push(json);
              }
              var data=pdlist;
              var listData=data;//模拟分页数据
              successCallback&&successCallback(listData);//成功回调
            }else{
              if(thisThat.pdlist.length ==0){
                androidIos.second(loadSegmentDetail.message);
              }else{
                successCallback&&successCallback(thisThat.pdlist);
              }

            }

          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            thisThat.carloading = false;
            if(status=='timeout'){//超时,status还有success,error等值的情况
              if(thisThat.pdlist.length ==0){
                androidIos.second("网络请求超时");
              }else{
                successCallback&&successCallback(thisThat.pdlist);
              }
            }else if(status=='error'){
              if(thisThat.pdlist.length ==0){
                androidIos.errorwife();
              }else{
                successCallback&&successCallback(thisThat.pdlist);
              }
            }
          }
        })
      })
    },500)
  }
</script>

<style scoped>
  #trackMore #dataList{
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
  #trackMore .mescroll{
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
    font-size: 0.36rem;
    min-height: 0.7rem;
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
    /*padding: 0 0.2rem 0.1rem 0.2rem;
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
  .thirdBox {
    width: 20%;
    float: right;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.56rem;
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
    background:#3492ff;
    color:white;
    font-size: 0.4rem;
    letter-spacing: 0.0625rem;
    line-height: 1.21rem;
    float: left;
  }
  #sure button span{
    color:white;
    font-size: 0.4rem;
  }
  .noYes{
    width:50%!important;
    float: left;
  }
  .colorBottom{
    background: #88c4ff!important;
  }
  .waitForTime{
    width:90%;
    margin:0.2rem auto 0 auto;
    background: white;
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    padding: 0rem 2%;
    line-height: 1rem;
    font-size: 0.4rem;
  }
  .logisticsBox{
    min-height:0.7rem;
    overflow: hidden;
    background: white;
    margin: 0.3rem auto 0 auto;
    padding-top: 0.3rem;
    width: 94%;
    border-radius: 0.12rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
  }
  .logisticsBoxDown{
    height: auto!important;
    max-height: none!important;
  }
  .logisticsBox li{
    width: 97%;
    margin-left: 3%;
    position: relative;
    min-height: 0.7rem;
  }
  .logisticsBox li .logisticsL{
    float: left;
    width:10%;
    position: absolute;
    height: 100%;
  }
  .logisticsR{
    float: left;
    min-width:44%;
    max-width: 80%;
    margin-left: 10%;
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
    min-height:0.4rem;
    margin:0 auto;
    position: absolute;
    top:0.3rem;
    bottom: 0;
    height: auto;
    left: 50%;
    margin-left: -0.5px;
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
    width: 90%;
    padding: 0.2rem 2%;
    margin: 0.4rem auto;
    background: white;
    box-shadow: 0 0.1rem 10px #d8d8d8;
    border-radius: 0.2rem;
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
  #errorAbnormalBox,#errorPriceBox,#cancelReasonBox{
     width:100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
    z-index:12;
    background-color:rgba(0,0,0,0.5);
  }
  #errorAbnormal,#errorPrice,#cancelReason{
    position: absolute;
    bottom:0;
    background: white;
    width:100%;
  }
  #errorabnormalTitle p,#errorpriceTitle p,#cancelReasonTitle p{
    width:100%;
    text-align: center;
    line-height: 1rem;
    font-size: 0.375rem;
    color:#999;
    position: relative;
  }
  #errorabnormalTitle img,#errorpriceTitle img,#cancelReasonTitle img{
    position: absolute;
    width:1rem;
    z-index: 1;
  }
  #errorAbnormal ul,.errorUl{
    width:90%;
    margin: 0.3rem auto;
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
  .errorAbnormalLeft{
    float:left;
  }
  .errorAbnormalRight{
    float: right;
  }
  .meBottom{
    bottom: 0!important;
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
    font-size: 0.3125rem;
    color:#666;
    line-height: 0.8rem;
  }
  #errorAbnormalChange img,#errorPriceChange img{
     width:0.6rem;
    float: right;
    margin-top: 0.1rem;
  }
  #errorAbnormal button,#errorPrice button,#cancelReason button{
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
  #carPeopleMessage .imgBoxOverFllow{
    width:1.2rem;
    height:1.2rem;
    overflow: hidden;
    float: left;
    border-radius: 50%;
    line-height: 1.2rem;
    margin-top: 0.2rem;
  }
  #carPeopleMessage .imgBoxOverFllow img{
    display: inline-block;
    vertical-align: middle;
  }
  #carPeopleMessage .carPeopleMessage{
    float: left;
    margin-left: 0.3rem;
    margin-top: 0.1rem;
    position: relative;
    width:70%;
  }
  #carPeopleMessage .carPeopleMessage h2{
    font-size: 0.3125rem;
    color:#999;
    position: absolute;
    right:0;
    top:0;
  }
  #carPeopleMessage .carPeopleMessage h2 span{
    font-size: 0.3125rem;
    color:#999;
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
  #full_feature {
    padding-top: 0!important;
    width: 94%;
    margin: 0.1rem auto 0 auto!important;
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
</style>
