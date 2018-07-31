<template>
  <div id="trackMore">
    <div id="title" v-title data-title="订单详情"></div>
    <div v-if="carloading" style="position: fixed;top:1.21875rem;bottom:0;height:auto;width:100%;">
      <img src="../../images/carloading.gif" style="width:4rem;position: absolute;top:50%;left:50%;margin-left: -2rem;margin-top: -4rem">
      <p style="font-size: 0.4rem;top:50%;text-align: center;line-height: 1rem;color:#e8551b;width:100%;position: absolute">正在加载中...</p>
    </div>
    <div id="mescroll" class="mescroll" :class="type==0 || (peopleType == 2 && type !=1 )?'meBottom':''">
      <ul id="dataList" class="data-list">
        <li v-for="item in pdlist">
          <div class="top">
            <div style="width:100%;position: relative;top:0;left:0;">
              <span v-html="item.orderValue"></span>
              <img src="../../images/order2.png" style="height: 1.64rem;">
            </div>
            <div class="clearBoth"></div>
            <ul class="logisticsBox" :class="logisticsOk?'logisticsBoxDown':''"  v-if="item.logistics.length > 0">
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
            <ul class="logisticsBox" :class="errorBiglistOk?'logisticsBoxDown':''"  v-if="item.errorBiglist.length > 0 && type>1 && type < 9 && peopleType==2">
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
          </div>
          <div id="full_feature" class="swipslider" v-if="type >0 && type < 8 && carList.length > 0" :style="{minHeight:type ==1?'2.5rem':'6rem'}">
            <ul class="sw-slides">
              <li class="sw-slide" v-for="(car,index) in carList">
                <div style="width:100%;background: white;height:3rem;box-shadow: 0 0.1rem 10px #d8d8d8;overflow:hidden;position: relative;margin:0.4rem auto 0 auto;border-top-left-radius: 0.2rem;border-top-right-radius: 0.2rem;" v-if="type > 1">
                  <div   v-if="(car.ordertype == '20' || car.ordertype == '31' || car.ordertype == '32' || car.ordertype == '33' || car.ordertype == '41' ) && car.peopleJ != '' && car.peopleW != ''" @click="mapGo(car)">
                    <div :id="'container'+index" class="containerImport"></div>
                    <div :id="'panel'+index" class="panelImport"></div>
                    <div style="width:100%;height:3rem;position: absolute;top:0;left:0;background: transparent;z-index:180;border-top-left-radius: 0.2rem;border-top-right-radius: 0.2rem;"></div>
                  </div>
                  <img style="width:50%;margin: 0 auto;" src="../../images/notransport.png" v-else>
                </div>
                <div id="carPeopleMessage">
                  <img :src="car.logo" class="peopleImg">
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
              <p :data-start="item.pickMessage.address" :data-end="item.endMessage.address" class="startEnd"><span style="float: left;font-size: 0.4rem;color:#333;font-weight: bold;">{{item.goodsmessage.startAddress}}</span><img style="float: left;margin:0.3rem 0.3rem;width:0.41rem;" src="../../images/addressImg.png"><span style="float: left;font-size: 0.4rem;color:#333;font-weight: bold;">{{item.goodsmessage.endAddress}}</span><span  v-if="type == '20' || type == '40' || type == '60' " class="distance">{{item.goodsmessage.distance}}km</span><div class="clearBoth"></div></p>
              <h1>{{item.goodsmessage.tranType}}</h1>
              <h4>{{item.goodsmessage.money}}元</h4>
              <div class="clearBoth"></div>
              <div v-for="itemS in item.goodsmessage.productList ">
                <h2>{{itemS.goods}}</h2>
                <h3>{{itemS.number}}件/{{itemS.weight/1000}}吨/{{itemS.volume}}立方米</h3>
                <div class="clearBoth"></div>
              </div>
              <div class="clearBoth"></div>
              <h5>{{item.goodsmessage.startTime}} - {{item.goodsmessage.endTime}}</h5>
            </div>
            <div class="peoplemessage">
              <p><span :class="pick?'colorFull':''" @click="pickMessage('true')">发货方</span><span :class="!pick?'colorFull':''" @click="pickMessage('false')">收货方</span></p>
              <div style="background: white;box-shadow: 0 0.1rem 10px #d8d8d8;position: relative;margin:0.1rem auto 0 auto;border-radius: 0.2rem;">
                <div class="messageBox" v-if="pick">
                  <h1 style="font-size: 0.38rem; color:#333;font-weight: bold;float: left;margin-left: 4%;margin-top: 0.52rem;">{{item.pickMessage.name}}</h1>
                  <h1 style="font-size: 0.35rem; color:#999;float: left;margin-left: 0.3rem;margin-top: 0.52rem;">{{item.pickMessage.tel}}</h1>
                  <div class="clearBoth"></div>
                  <h1 style="font-size: 0.35rem; color:#666;margin-left: 4%;margin-top: 0.4rem;">{{item.pickMessage.company}}</h1>
                  <h1 style="font-size: 0.35rem; color:#999;margin-left: 4%;margin-top: 0.2rem;">{{item.pickMessage.address}}</h1>
                </div>
                <div class="messageBox" v-if="!pick">
                  <h1 style="font-size: 0.38rem; color:#333;font-weight: bold;float: left;margin-left: 4%;margin-top: 0.52rem;">{{item.endMessage.name}}</h1>
                  <h1 style="font-size: 0.35rem; color:#999;float: left;margin-left: 0.3rem;margin-top: 0.52rem;">{{item.endMessage.tel}}</h1>
                  <div class="clearBoth"></div>
                  <h1 style="font-size: 0.35rem; color:#666;margin-left: 4%;margin-top: 0.4rem;">{{item.endMessage.company}}</h1>
                  <h1 style="font-size: 0.35rem; color:#999;margin-left: 4%;margin-top: 0.2rem;">{{item.endMessage.address}}</h1>
                </div>
                <div class="thirdBox" @click="telphone(pick?item.pickMessage.tel:item.endMessage.tel)">
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
            <p>结算方式</p>
            <h1>{{item.pickPay.type}}</h1>
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
              <img :src="item.owner.logo">
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
        <button v-else-if="type==8 && endtype == '0'" @click="qianshou(endtype)">交接</button>
        <button v-else-if="type==8 && endtype == '1'" @click="qianshou(endtype)">签收</button>
      </div>
      <!--<div class="go"  v-else>
        <button v-if="type==1" @click="genghuan()">更换车辆</button>
      </div>-->
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
          <input type="text" placeholder="其他费用" maxlength="40" style="margin-bottom: 0;" v-model="errorPricetype"/>
          <input type="text" placeholder="金额" maxlength="40" v-model="errorPrice"/>
        </ul>
        <button @click="errorPriceChange()" id="gogogo4" class="gogogo">提交</button>
      </div>
    </div>
    <div id="cancelReasonBox" v-if="cancelReasonBox">
      <div id="cancelReason">
        <div id="cancelReasonTitle">
          <img src="../../images/closed.png" @click="cancelReasonClosed()">
          <p>选择取消订单理由</p>
        </div>
        <ul class="errorUl">
          <li v-for="(item,index) in cancelReason" :class="index%2==0?'errorAbnormalLeft':'errorAbnormalRight'" @click="cancelReasonClick($event)">
            {{item.name}}
          </li>
          <div class="clearBoth"></div>
          <input type="text" placeholder="其他原因" maxlength="40" v-model="cancelreason">
        </ul>
        <button @click="cancelReasonChange()" id="gogogo3" class="gogogo">提交</button>
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
        cancelReasonBox:false,
        errorAbnormal:[],
        cancelReason:[{
          name:"货主联系不上"
        },{
          name:"货物不真实"
        },{
          name:"订单接错"
        },{
          name:"司机临时有事"
        }],
        errorPriceList:[],
        errorabnormal:"",
        cancelreason:"",
        errorPricetype:"",
        errorPrice:"",
        mescroll:"",
        endtype:0,
        carList:[],
        carpeoList:[],
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
      var self = this;
      thisThat = self;
      sessionStorage.removeItem("changeCarpeople");
      sessionStorage.removeItem("changeCarFupeople");
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
      self.$nextTick(function () {
        $(document).on('click','#cancel',function () {
          self.cancelReasonBox = true;
        })
      })
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
          self.pick = true;
          self.logisticsOk = false;
          self.type = curPageData[0].orderType == '10'?1:curPageData[0].orderType == '20'?2:curPageData[0].orderType == '31'?3:curPageData[0].orderType == '32'?4:curPageData[0].orderType == '33'?5:curPageData[0].orderType == '41'?6:curPageData[0].orderType == '42'?7:curPageData[0].orderType == '43'?8:0;
          self.mescroll.endSuccess(curPageData.length);
          sessionStorage.setItem("dataStart",self.pdlist[0].pickMessage.address);
          sessionStorage.setItem("dataEnd",self.pdlist[0].endMessage.address);
          sessionStorage.setItem("orderPk",self.$route.query.pk);
          sessionStorage.setItem("dispatchPK",self.$route.query.pk);
          self.$nextTick(function () {
            if ((self.type == 1 || self.type == 2 || self.type == 3) && self.peopleType == 2) {
              $("#cancel").show();
              $("#erweimaLook").hide();
            } else if (self.peopleType == 1) {
              $("#cancel").hide();
              $("#erweimaLook").show();
              document.getElementById("erweimaLook").onclick = function () {
                androidIos.addPageList();
                self.$router.push({path: '/track/qrcode', query: {ty: 3}});
              }
            } else {
              $("#erweimaLook").hide();
              $("#cancel").hide();
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
                  backgroundImageInitial: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEUAAAD9dyr9VDr8SD/9ZjP9YDb9cS78TT39bDH9aTH9XDf9dSv9YzT9XDf9bi/9cC79aTL9cy78QkJ+hTheAAAAEnRSTlMAH/T+wNxw+5yv5zzP5odurld/oABPAAAA1klEQVQ4y62RS5LDIAxE0Q/J2Elm+v6HnUwIKRsKVtEGmu56KqH07Qr3WPkkgNAioDCDLgG/+wqh4JQKdAHIKeU5YoP/H4xtEnC8Rszwgf0IvTGawQDfNB6t0yGo1f4oO2rJUYkQNr3nMzPf1ViA/ArYbCpGri1t5nO72MSnz9Vo4Tcx+oNcP5SzLgNyu+5Qh30ciLMMHF2Acf1JcBcQXDWkmwpeTzN6r57SiCQVQJRay36ITZ6uCuRnHEMR4U+bKsYjoB1BANur2A2QjkCl2S1SKH2p/gDnoAlDysm60AAAAABJRU5ErkJggg==',
                  backgroundImageOver: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAMAAAC+oj0CAAAAYFBMVEUAAAD8QkL9UVH9eHj9VFT/wsL/zc3/19f/2dn/4eH/7+///f39R0f9TU39Tk79ZWX9YmL9a2v+lJT+oaH+paX+sLD+urr/1NT/3d3/5+f//v7+goL+g4P8QkL+u7v9bGzZkjZpAAAAHXRSTlMA7d+q105ANDEoFQPs5ePGxbuIeXNlWjgsHgOioFw9/yIAAACSSURBVBjTbdDZDoQgDEDRsggC7rvOVP//LycQU3TgvjQ5adKkEJsmyLQytmZYIIpUNUNkOrecWS+ZZ1YSuF3Ng5AYkmKY1e4ArMQkacHWKdcWQDf/2uhwjb+V33c3/tIN7gx/qAGqjdxGdVXkyhEbfGSIiycXxKN/R69U7x8zEn8Qu7BUdIhf4uU6Dwgd57X4+QMzcxYilqvWAwAAAABJRU5ErkJggg==',
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
                var dataStart = sessionStorage.getItem("dataStart");
                var dataEnd = sessionStorage.getItem("dataEnd");
                var ordertype = _this.carList[dd].ordertype;
                if(ordertype == '20' || ordertype == '31' || ordertype == '32' || ordertype == '33' || ordertype == '41' ){
                  geocoder(dataStart,1,cc,dd,ee);
                  //地理编码,返回地理编码结果
                  function geocoder(message,type,cc,dd,ee){
                    var geocoderS = new AMap.Geocoder({});
                    geocoderS.getLocation(message, function(status, result) {
                      if (status === 'complete' && result.info === 'OK') {
                        if(type == 1){
                          _this.carList[dd].startJ = (result.geocodes[0].location.lng).toString();
                          _this.carList[dd].startW = result.geocodes[0].location.lat.toString();
                          geocoder(dataEnd,2,cc,dd,ee);
                        }else if(type == 2){
                          _this.carList[dd].endJ = result.geocodes[0].location.lng.toString();
                          _this.carList[dd].endW = result.geocodes[0].location.lat.toString();
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
                          if(ordertyper ==  "33"  || ordertyper == '41'){
                            var lnglat = new AMap.LngLat(_this.carList[dd].endJ, _this.carList[dd].endW);
                            _this.compareDistanc(lnglat,dd);
                            driving.search([_this.carList[dd].startJ, _this.carList[dd].startW], [_this.carList[dd].endJ, _this.carList[dd].endW], function(status, result) {
                              var sss = setInterval(function () {
                                if($(".amap-lib-marker-to").length>0){
                                  clearInterval(sss);
                                  $("#container"+cc).find(".amap-lib-marker-to").addClass("amaplibmarkerto");
                                  $("#container"+cc).find(".amap-lib-marker-from").addClass("amaplibmarkerfrom");
                                }
                              },100)
                            });
                            if (marker) {
                              marker.setMap(null);
                              marker = null;
                            }
                            marker = new AMap.Marker({
                              icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAA8CAMAAAA9rjhhAAAAk1BMVEUAAABCkf9ClvxCl/xCl/xCl/1ClvxCl/1Dlf9Emv9ClvxCl/xCl/1ClvxBl/tCl/9Cl/xDlvxDlv1Dl/1Cl/xDk/9DlvxDlv1DlvxDl/tDl/tDl/xCl/1Cl/1Dlv1Bl/xGmf9CmP9Alv9Dl/3////s8/+30v6Svv6rzP6Ftv7N4P5np/1Wn/32+f/i7f/Y5v52r/3nvH34AAAAI3RSTlMABPri6rrxghkKyv6fW00yY9ysiW8T1bRUR0DRwKWTdCgmD7Pu0p0AAAGHSURBVEjHjdVXdsIwFEXRK1nujRYIaZQHmJI2/9GFgHB7luz9pY+zbBUXNASjJFJSqigZBTBZLmIqxYsluuRv1PKWs0j4khjpCzRsXerkblHzFJFB9ISSqCreVfdNyCKBlpJVqiem7Jl3n94H9fjAVaA37HJoO+pMBgB8uit2bXvSfAAOGVSZA+TUn1GO1ZBshYkenfYNx0Y2weuQ7BVqyE0V5JBMwivHl6L0ybJxOT7sSkUrc+DWsmNxc2aZC7+WFXrAMh8vQ7IXCK8/8wTwXmXnw813O3sHkPWvNAMgVN/2KoGraV82xb9NzIrTdYbn3Y/+6Gxw4/Jsd/X1SzcL3C2J0QerN02bk0WEh5Ete8aDcMzVWKA0M2czVEJlqlSImpntYpXQMDsnhGZd7AhNYmxfpvWTmaJNzHk1B5fxLAPHHxQXXfK4WcU5OP57SNAt8OqVF8DAr2c+uOrI+DFxzx1Po3VTXNis5b2Sa1hNqzfYJnSM8+dHm6HXhGiCfoHnBRggTcH8AUtJx3fNHCAxAAAAAElFTkSuQmCC",
                              position: [_this.carList[dd].peopleJ, _this.carList[dd].peopleW]
                            });
                            marker.setMap(map);
                          }else{
                            var lnglat = new AMap.LngLat(_this.carList[dd].startJ, _this.carList[dd].startW);
                            _this.compareDistanc(lnglat,dd);
                            driving.search([_this.carList[dd].peopleJ, _this.carList[dd].peopleW],[_this.carList[dd].startJ, _this.carList[dd].startW], function(status, result) {
                              var sss = setInterval(function () {
                                if($(".amap-lib-marker-to").length>0){
                                  clearInterval(sss);
                                  $("#container"+cc).find(".amap-lib-marker-to").addClass("amaplibmarkertos");
                                  $("#container"+cc).find(".amap-lib-marker-from").addClass("amaplibmarkerfroms");
                                }
                              },100)

                            });
                          }
                        }
                      }
                    });
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
            expType : list[0] == undefined ? "" : list[0].displayName,
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
                _this.mescroll.resetUpScroll();
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


       /* if(!bomb.hasClass("errorAbnormalChangeImg","gray")){
          bridge.invoke("replacement",_this.$route.query.pk)
        }*/
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
          if(list.length == 0 && _this.errorPricetype == ''){
            bomb.first("请选择或填写费用类型");
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
                _this.mescroll.resetUpScroll();
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
        $("#errorPriceBox .errorUl li").removeClass("errorPriceBoxLi");
      },
      cancelReasonChange:function(){
        var _this = this;
        if(bomb.hasClass("gogogo3","gogogo")){
          var list = [];
          for(var i = 0 ;i<_this.cancelReason.length;i++){
            if($("#cancelReason .errorUl li").eq(i).hasClass("errorPriceBoxLi")){
              list.push(_this.cancelReason[i].name)
            }
          }
          if(list.length == 0 && _this.cancelreason == ''){
            bomb.first("请选择或填写取消订单的理由");
            return false;
          }
          bomb.removeClass("gogogo3","gogogo");
          androidIos.loading("正在取消");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/closeOrder",
            data:JSON.stringify({
              reason:list[0]==undefined?'':list[0],
              cancelreason:_this.cancelreason,
              pk:_this.$route.query.pk,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            timeout: 10000,
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
      cancelReasonClick:function(e){
        if(!this.hasClass(e.target,"errorPriceBoxLi")){
          $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
          this.addClass(e.target,"errorPriceBoxLi");
        }else{
          $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
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
      genghuan:function () {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/site/car'});
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
                  bridge.invoke('gobackfrom');
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
          /*for(var i = 0 ; i < _this.carList.length; i++){
            if(_this.carList[i].length == ""){
              androidIos.first("请提醒" + _this.carList[i].name +"("+_this.carList[i].tel+")打开定位系统");
              $(".tanBox-yes").html("联系");
              $(".tanBox-yes").unbind('click').click(function(){
                $(".tanBox-bigBox").remove();
                bridge.invoke("callTelephone",_this.carList[i].tel);
              });
              return false;
            }
            if(_this.carList[i].length - 3 > 0 ){
              androidIos.second(_this.carList[i].name +"("+_this.carList[i].tel+")还未到达目的地附近,请稍后再试");
              return false;
            }
          }*/
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
                  bridge.invoke('gobackfrom');
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
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp()+"/order/loadEntrustDetail",
        data:JSON.stringify({pk:thisThat.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 20000,
        success: function (loadSegmentDetail) {
          thisThat.carloading = false;
          if (loadSegmentDetail.success == "" || loadSegmentDetail.success == "1") {
            thisThat.type = thisThat.$route.query.type;
            var list=[];
            for(var i =0;i<loadSegmentDetail.invPackDao.length;i++){
              var listJson = {
                goodsCode:loadSegmentDetail.invPackDao[i].goodsCode+"-"+loadSegmentDetail.invPackDao[i].goodsType,
                goods:loadSegmentDetail.invPackDao[i].goodsName+"-"+loadSegmentDetail.invPackDao[i].goodsTypeName,
                number:loadSegmentDetail.invPackDao[i].num,
                weight:loadSegmentDetail.invPackDao[i].weigthUnit==3?loadSegmentDetail.invPackDao[i].weight*1000:loadSegmentDetail.invPackDao[i].weight*1,
                volume:loadSegmentDetail.invPackDao[i].volume*1,
              }
              list.push(listJson);
            }
            var tracking=[];
            for(var i =0 ;i<loadSegmentDetail.tracking.length;i++){
              var trackingJson = {
                type:loadSegmentDetail.tracking[i].tackingMemo,
                time:loadSegmentDetail.tracking[i].tackingTime,
              }
              tracking.push(trackingJson);
            }
            thisThat.endtype = loadSegmentDetail.type == undefined ? "0" : "1";
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
                type:loadSegmentDetail.payStatus == null||loadSegmentDetail.payStatus ==""?"月结":loadSegmentDetail.payStatus
              },
              owner:{
                logo:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPMAAADICAMAAAAKlSdjAAAAilBMVEUAAAAymf8ymf8wl/8zmP8zmf8ymP8zmP8ymf8ymP8wmv8tnv8ymP8ymf8mmf8ymf8ymf8zmf8ymv8AkP8ymf8ymf8ymP8ymP8ymP8ymf8xmf8umP8ymf8xmf8wmP8xmf8ymf8ymf8ymf8ymP8zmf8ymf8vmf8ymP8ymf8smf8wmv8xmv8xmf8zmf9gs/33AAAALXRSTlMAwIBAajL93XOkNQqL4QbGmKBMAvXvvJC1Y1EW+VooHehH16nQlCyuew8jQzlJ+gi6AAAEPUlEQVR42u3diW7iMBSF4ROgIW1IYMhCNgj71t73f71RVTGinXiUDrZjp/d7g5/FsrL4gjHGGOsrv5jMTqnTjezgbXxotjnF1LH4tAyhz5NDRgiWEfSIBmSMfQ0d/IwMkrxCvSglo7gFlFuQYeIjFCvIOMEFSkUBmWcBpXIykHvFvZ/wNRPtoNAbGSkOoc6EzLSBOlsy0wLqVGSmFMpcyFBbKLMiQyVQ5oUM5eJGZ3OcLZ/KCKqE9ZvnuEY1u4cL1FtlBjWPj9BjnpjSnPnQpd6a0bwPoU+dmNCc1NBpY0KzB7123TcHIfS6up03D6Bb1nnzC3TLu25OoF3ddfMe2kVdN2fQb91x8zP0G3MzN3MzN3MzNwPRtTgP/vBsaX5z7mS5j2942tK9wJbmOX2SzNFaXlEvmqkaoqWhSz1ppqREO1PqTTMt0MqVetQ8RivLPjVXaMXrUzOF3MzN3MzN3MzNLXAzN5vavB5+GJnaTM6H/QPNIsY233DzuwhtjPrUnKCVTZ+aU7QSxj1qXqKdUX+a9xFa2vWleVyjrfC5H80HH9+wmjhfBWY3u5PBZ97wggdd1mY3k+NDtsz43/YMko0s+D8XkKqMLWgOQsi0sGLd9iBRWVnRvA4hz4HskEOaqPODOVqaQppXssUVN707w0BoJHHRsMUzJPHJGltIciVrVPjQ1zf6G5X40MMzSYRWkGNE9njiZm7mZm7mZm42XLfNgfMYG5sneIjPzdzMzdzMzdzMzbwP42ZuNhs3czM3czM3/2/zdPAYG5t/4t6Tm7mZm7mZm+1q3g0fsjG1OXD+2FakVrx3bqZJV83bvMSdcL4jZeLJC+6tBkkHzdUowlcvAamRlvjKf9be7L6iQTkmFXYRGkx0N3totHJJvm0omJimtzkINT7dXqDZSm/zWePYkDVEHK3NR43PPc8g4mlt9iGSkmweRAqtzRFETtL3YSOIbLQ21xCZSt9vDyCSa20uIODH0psziBy0Nu8gsCTpzW6JZuFaa7O7QqNoK7+ZFsJlW2sz7X00GZCCZneIJqtYczOlF/ztTLKbxcN/jwHpbqbxMsJnx5TUNJO7KPGZf447uWYQHPLX4c1yMFV5H6PKvPnwZuPtYiOvDX1Db+5XtcLN3MzN3MzN3MzN3MzN3MzNZA9ZzUuyRw05hmSPEHKUZI0AskzJFgvI4pEt3iCLvyY7ZADws1bu6gjgh50gVkCmyIboESTbBGS2ZA7p/InJJyGuzz5UCIvJc+q8G5NQ4si2/kep8y79NRhGUM0joSlk+0VCM0CMm7mZm7mZm7mZm7mZm7mZm7mZm7mZm7m5CTdz83/ISegE2RYkNIA+LyR0BvR9wAU0GpPIEbKVMQkkF2i0JIEJ5JuQQA6tZtRoH0K+MBUtHXpFi0owxFKB8ER/i70IutXn1LmXzkZHyCWe8Zku8hqMMcZYX/0GEkRPYmJUkM4AAAAASUVORK5CYII=",
                company:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.customerName:"",
                year:loadSegmentDetail.customerDto!=null?((((new Date()).getTime()-(new Date(loadSegmentDetail.customerDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 -0.5)<0?"不到半年":androidIos.fixed(((new Date()).getTime()-(new Date(invoiceDetail.customerDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 ,1)+"年"):"",
                phone:loadSegmentDetail.customerDto!=null?loadSegmentDetail.customerDto.mobile:"",
              },
              tranNumber:"123321334343",
              number:loadSegmentDetail.entrustNo,
              time:loadSegmentDetail.createTime,
              pkCar:loadSegmentDetail.pkCar
            }]
            thisThat.carList = [];
            for(var i = 0; i < loadSegmentDetail.driverDto.length ; i++ ){
              var json = {
                logo:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAC+lBMVEUAAAA2GBMzJh8zJR8zJR8zJR8zJR8zJR//zJk7gPcyJB//z6syJR46NzE0JR8zJR8zJR87gPf/z60zJB41JiE6gfkwIx44gfj/0bFbT0wzJR87gPf/z64zJR//z646gPgzJR8zJB46gPgxHRuNdmr/zq4zJR//zq4zJR87gPczJR85gPn/0K5EOjWZrt5UXHaDbmM7gPdlV1L/z67/z65jVlE7gPj/0K45gfhaTkv/z64zJh8zJR//z67/z647gPddUk7/z65aUEzxsn3/z61aT0v/z68zJR86gPgxJB7/0K3/0K81iP9bT0xgU04oZsD/z65aT0xbUE3/z69aUEz/z64gXKj/z64jYLFRXoA7gPZPY5JYT0rJpYpUW3I6bs7/1ar/z67/zq7/z63/zq1bT03/zq4ra8YmZLwoZsCAZ1hFcL+kiHjkvJ5NZJkrbMYsbc2UfW9TX4FdVE7/0LP/z640JiA8gPdbUE1aVFv9zJvtr4UcVps7JRk2Ih7OztvvrHvpoWv+zav3lF78x6PzxKXxto47KyTkupz1u5P7y6vswKC4lH7+yqbpvJ9qW1P2x6j7wpz3v5r7sINYWW6GaVh/ZFR2WUo6fvQ7fO7cspbRqI7NpIi1j3effmqPbVtFQlZPOS/ws4nBmoBHMyo6eOS4t8buwaL5wJT9uY+ohm74nGmaemdYVmR6aF9qUURBLycvcNSZmKn+x53etpupoJvYrZHGoIjxsoCaeGJJSWE+PFRuVkhrTj1ZRDj////FxdM+bMRIb7z5yqogXKqvjnn5o3I+QmJYUlpiTUE8JyJCeNora8keWaLwxpsuXJrUrpT7vYmrineQcmCOcF5TTlh7YFFkVlGEZFBTPzVGLiE1dN22ralLaKNPZJV1dIeXfnD3lmDn5OM7ZLQiX66HipxwgppRYIRlY3abgnNgST04KCK1rahVc5uCgZPJpY4/UYNuX1hOSVfm4+Krq7qoqLibmJrqvZHnoGrUlWZRT2S+iWKsf110XVL6F5knAAAAdXRSTlMABPrQ1qmJljL3cD85CsO0oZh+VEUqIRoP7ebbwbuPhmdfXhL9993QyKZ9NjAXB/785sGxnpBzcCMi8PDi3tfBqaZ0YmFeVE9ELCggD/79+u7X0ERCFfrp6N7OuTg1LykY8uXk4NvMxsK7ubKwjISCem5TUhvAlgcWAAAKuUlEQVR42uzWUYqDMBgE4EmMCqK2YPFBKFgEKQs9QX0vvdCca4+4lN03V7rbJn8SyHeD8E+YQZIkSZIkyVPq3n2Uu2zgg77OWbvLy+KjuytEQ9VVbjQ3aLM/TQhfX7WaT2XFIejLXKoz/+q6Gy8IU51r/ovOawRHjYYvMGNYEVPjwhctAT1FjQPfMIwIQ234pmMP/y57vu9aec9XPdCKdoJXlaYlyx3+NDnt0Sf40rS0qoAfU0bL9vBhMrQuVxCnznyI/yY5f0T+Tyo6coKoms7UENQsdGZuIKekQyW2xRMs2XBldCqDkBsdu0GGoWMGIjquRXmSM51rIaCngB7uFdwS1+RSAwUMCq4dKOKAtQiTtZmteFpdrN0nCpmwFlkbfuvwi1gGvOSYP1LIEW7NFDLDKaW57ZMWaYUVqaH1xay9tDYRRXEAv4oPUHygGxERXCjiyoUgKC4EUdSNIH4AP8T/bobJIjiZNDOOUUgCeTJNQJBgskop1HRRukiXWsSWrrps3fkFnEemk8mdm4723iG/bYYMJ/eeOeeeifVli8aYy3ZrVl3XAdTKOp02l7X9BuUbwqUxyzKXA64zlK+MsbqQZTlDZLpD+UwcKDZ69KjuEEY6LaNexCSraVPfXFbEi5TrJ6bVN4+SLieJTBcoVw0x8l9G9D9dIIxUAlkBh+XEMn89CrfV2s+DzzDLnTmbpJynHOs4RHW9NJyjoxVvptVEEmu19c0Vey7GjZxAlvEP1qpm9+doaPepS99aKXW7yz09tUD4W6vfxtEZeyltLX6yVwyIUNhLMxD28dsxIUheTzGQk0z50CDMDzrpNmFInD38LEAcaz+9gniK6a9E6snttfjnkeEahGpK/TcH/4SoWxCrJrWN55/Zf0CwosyDFX+Kon+GaFsSz+z8uVYJEcWlRrPbbVhI5LPZ7TYbSxoiVtJ7Q3KLc5IaVDYyvkoVh7LK46s3KpFvKdHQcyIFWxH1AkKbmVC/hkNUO5lQi/PYOkekYMcoI4RamUl9AzMV7YyHjeR7arNf8iyuGA4yUSXM1MxEDRAw5R/Z2TdWmzhQykR1MNMeN+6lFF8inoipIj13P5VNAzAaXtJnMYuTIfuVdcN9dJXcbOnFVcTLRLLTMSvSrrSWshgzfmzYmGm00bIwlq23Km0EqvKH8exLxDJ4tCpmyhvcT2jgKpHt2MNwkCWcJb9lZKemQ4inyU8Rtm/UIV6Bjh0/RyR7+fimTX2fIZ4e7Nt7L4lUT2+G5XcA8TrUZ+LBfSLRJTgKNvW0Id6QevprAO4Raa7D06aeBsTrTRbb60SSp9Fu28QUrV3HP8gzlwffrGvwnCVSvHmFsWyPOixE/VIdX5CQ9s25ens6lO+RkfijK0SG6/B9Wsxlm329iai7v7+qjlbCOL7+/qA62jGlvbfwDr5LRIIrb+Eq5BQlB1ZjZ3W1ozrySGJ5d/WP6rA1RJSp3lUUZSEL1wMZS3Lfj2PRuc0iWHYQyC8koe6u7qpxe7FahOLI+ZE8IeJdg2tB4QSijna+qq5vSKCuftj5oMZvxazi+gRAziP4JhzvFQ8YA/UAEmirHjbu8B4FL92JcG/8RFc8WTZ51YCdbEUCFUx7p0wsCRHuBVw5xfMejO3wJ04grwaWeYEsSColZycDeQdGSx1rIIlv6lge0z4qnpykQF7Dtah4PoKhbTMLkmRv/QLjk9xA/lJ3/z5pRHEAwJ9/gAsTJsQJw0IbAhKjSQkS6WCiqdamizamv4amHZr2m3zHy91hiooIl9RE04UF6CUsEH8M7WJkpi40nWR0Mv4HPQ+qhwf3oPLunp8JcsPle98f773lzm/MSBbM9vVIfiagN9/+6HEkwCTJNpBV402S0EHiaGfnewJ6tX/047epDE0Pi8GxxNSIrOSMfUgG7y1oxFwr7QwZK8tDBs9lHCnATupmwrPZNfqNM2UdmJGNA57Jyf0l6OQ1/T6s6DlfS4EuRFiYgRZRXgeWUtDE7IgYApuNEjaeTYGtfIQV/3Owkc9NmPkcgW7uVRyEPJywKSlTLsKSHsq0bywSmgZGXB6PzxOacRObuIFOLIimvzQRYjcfUImCkLxZEwqCINo/celcQHcoaKFkZBFATmq/c0D3lNjND3RZoY0MVE+I/R4BXVIwyADdOLHfKPQgeyi05GTgsrJatUWXKiSTWb1PgM/KatYWHRe7RGsTMHCzxAnuMRgwD3HGOAzYY+KMWRis16RPvB4ZZ4jt6BNYKcrQSUaBbl4R50xDN0VJqhZFaCNmFFVSuOuQK6vdB1dBlaRGVSkWm4uhXFSqDUmSFO5GFnUPLBZV6RZVKfO2hlyLgAUxo+VBVRsNVa1WFUUGCx+Is1bO8jAA695PxGHv6wdwZ5VSkDgugIFtsFAWAVJlsLB9hvOTxHErabzctQrkl8YqkN00Ypxw4CMinlskJVUupyy64xQRw4QLYURM7/1vdyDiouPvKG8JoiZQg84SlUq+Wxhe1Ixw0CBNQ0G84s2bC+fiLI2auvcATGpe1ON4QbgxFMUr8+db0GYvjddKFTASL0qIfOVDF8amwOaGcay2OTmGfzY2L7FpkbevkMTnsKV0clD7sp3YPU3jLfXzWv54q7bpvbkSHCa8WRrBvs2FeZlXRsNR7NPCMuHT8iL2YSTGYzpa4gs9hxHmrctvWYrOId2bGH9NbvIgtkBJRnSJ3BOTsWAdO5n/+i7O1wL4tx37B00jCuA4/sZIJwfJ4CC4iRBxCW4OXTII2UL+DBnbUmhLlx9PhJdsgQxZrsGDQm9RQsFBqWB1UREUNAkdnCRmSPNnSQih//9A8+5s7qw2Hl5Oz/Y+y81f7n7vjhtkKvr55etX21udF8jWz+0Xb398//pl/T6ZLFNRbie3/ocJDbn2LvePhFzb2cnl1joda5Mc0mWKTBY7xGrubW5Ee+292bxHJsfq04eLu9loX9mFxUfPpon1uby++Zgs27cjJlt44A0RC/N73ADi72Oy472eJ+skpqiIgNvjIpYUkiugKdnP7nVlfNpXO7iDwMoqsZgZbxicWqKknGQ7m9/InvAM2XwcXIleW3pCLGTaE0S3+ZjG+XlMKw1ZIkVlwopV/muFnA70SO/G+qskIBMD9MbSczJ+Lh/6ijf6peym0dGmWo/HeSKrGXpTKuk4OspU6wAO5zhTQj7cKt5qVNSKRgI36lTrFMAYUyJO6BBPtNKNdLolQkNMUQ1BhMJDxsEfxLBK+RpVper4bdlFRm3GiaHtC2eFphpShsoxS0bL78bQjgTGMoUrdehdlkNkdGY8GF6rWmSMJSVJM3SM56a43BhevJphXDEl1ZSh9wiP6Piac8CAS+FbhskOC00+9D6CI9n8LIwo5VlROGSyTKFWRl+OOWI6JwypJvm9EIqMO7vE33hJN6t1JAqMO87zHiaUwOkosVoHApIykI/8mqkCOkustQ+gTZvSBeOS+cNkIYHbmLgTvwOG8E/emnQmD6Qo5I9wq6Bpp3AkCEPqKcpLrpSBXFQxQJiYxAdDRIEqmtIHxviDNcgsMYUfxpxSTik5TuZLGMgRIWZww5ADqqpJ1SPo4CMm8MKQEtUqQx8z9h6GEYkU1WhDJw+5cxEYIQaoRgB6ucmdc8GINtVIidBthty1ORhQplp16OcnNpvNZrPZ/kO/ACOiIA1hxYNGAAAAAElFTkSuQmCC",
                name:loadSegmentDetail.driverDto[i].driverName,
                year:loadSegmentDetail.driverDto[i].driverAge*1 < 1 ? "小于1" : loadSegmentDetail.driverDto[i].driverAge,
                tel:loadSegmentDetail.driverDto[i].mobile,
                startJ :"",
                startW : "",
                endJ :"",
                endW :"",
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
    top:1.21875rem;
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
    margin-bottom: 0.2rem;
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
    padding: 0 0.2rem 0.1rem 0.2rem;
    margin-left: 0.2rem;
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
    width: 20%;
    float: left;
    position: absolute;
    top: 50%;
    margin-top: -0.7rem;
  }
  .firstBox img{
    width:100%;
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
  #carPeopleMessage .peopleImg{
    width:1.2rem;
    float: left;
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
    margin: 0.4rem auto 0 auto!important;
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
