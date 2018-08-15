<template>
  <div id="orderLogisticsMore">
    <div id="title" v-title data-title="订单详情"></div>
    <div v-if="carloading" style="position: fixed;top:1.3rem;bottom:0;height:auto;width:100%;">
      <img src="../../images/carloading.gif" style="width:4rem;position: absolute;top:50%;left:50%;margin-left: -2rem;margin-top: -4rem">
      <p style="font-size: 0.4rem;top:50%;text-align: center;line-height: 1rem;color:#e8551b;width:100%;position: absolute">正在加载中...</p>
    </div>
    <div id="mescroll" class="mescroll">
      <ul id="dataList" class="data-list">
        <li v-for="item in pdlist">
          <div class="top" v-if="type != '10000'">
            <div style="width:100%;position: relative;top:0;left:0;">
              <span v-html="item.orderTypeName"></span>
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
          </div>
          <div id="evaluate" v-if="type == '1001'">
            <span>评价</span>
            <div id="star_gradeS" class="star_grade"></div>
            <span style="font-size: 0.4rem">{{item.evaluate.grade}}分</span>
            <!--<img src="../../images/lookMore.png" @click="lookScore()">-->
            <div class="clearBoth"></div>
          </div>
          <div style="width:94%;background: white;height:3rem;box-shadow: 0 0.1rem 10px #d8d8d8;overflow:hidden;position: relative;margin:0.4rem auto 0 auto;border-top-left-radius: 0.2rem;border-top-right-radius: 0.2rem;"  v-if="type == '20' || type == '40' ">
            <router-view/>
            <div style="width:100%;height:3rem;position: absolute;top:0;left:0;background: transparent;z-index:180;border-top-left-radius: 0.2rem;border-top-right-radius: 0.2rem;" @click="mapSClick()">
            </div>
          </div>
          <div id="carPeopleMessage"  v-if=" item.carPeople.yes  && ( type == '20' || type == '40') " :class="type != '20' && type != '40' ? 'carPeopleMessageTitle' : '' ">
            <div class="imgBoxOverFllow">
              <img :src="item.carPeople.logo" :onerror="errorlogo2" class="peopleImg">
            </div>
            <div class="carPeopleMessage">
              <p>{{item.carPeople.name}}</p>
              <div id="star_grade" class="star_grade"></div>
              <h1>驾龄：{{item.carPeople.year}}</h1>
            </div>
            <div class="tel" @click="telphone(item.carPeople.tel)">
              <img src="../../images/tel.png">
            </div>
            <div class="clearBoth"></div>
          </div>
          <div class="message">
            <div class="goodsmessage">
              <p :data-start="item.pickMessage.address" :data-end="item.endMessage.address" class="startEnd"><span style="float: left;font-size: 0.4rem;color:#333;font-weight: bold;">{{item.goodsmessage.startAddress}}</span><img style="float: left;margin:0.3rem 0.3rem;width:0.41rem;" src="../../images/addressImg.png"><span style="float: left;font-size: 0.4rem;color:#333;font-weight: bold;">{{item.goodsmessage.endAddress}}</span><span  v-if="type == '20' || type == '40' " class="distance">{{item.goodsmessage.distance}}km</span><div class="clearBoth"></div></p>
              <h1>{{item.goodsmessage.tranType}}</h1>
              <h4>{{item.goodsmessage.money}}元</h4>
              <div class="clearBoth"></div>
              <div v-for="itemS in item.goodsmessage.productList ">
                <h2>{{itemS.goods}}</h2>
                <h3>{{itemS.number}}件<span v-if="itemS.weight.replace(/[^0-9]/g,'')*1 > 0">/{{itemS.weight}}</span><span v-if="(itemS.volume).replace(/[^0-9]/g,'')*1 > 0">/{{itemS.volume}}</span></h3>
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
          <div class="carrier" v-if="item.carrier.pkCarrier!=''">
            <div class="firstBox">
              <img :src="item.carrier.logo" :onerror="errorlogo" class="companyImg">
            </div>
            <div class="secondBox">
              <p><span>{{item.carrier.company}}</span></p>
              <div id="star_gradeF" class="star_grade"></div>
              <h2>{{item.carrier.tranType}}&nbsp;&nbsp;入驻：<span>{{item.carrier.year}}</span></h2>
            </div>
            <div class="thirdBox" @click="telphone(item.carrier.phone)">
              <h6 style="margin-top: 0.22rem;"></h6>
            </div>
            <div class="clearBoth"></div>
          </div>
          <div class="number">
            订单编号：{{item.number}}<br>
            下单时间：{{item.time}}
          </div>
          <div id="sure">
            <div class="go" v-if="type=='10000'">
              <button style="width:94%;margin:0 3%;display: block;" @click="payOrder()">支付</button>
              <div class="clearBoth"></div>
            </div>
            <div class="go" v-else-if="(type == '10') && orderSource == 1">
              <button style="background: transparent;color:#3492ff;" @click="closedOrder()">取消订单</button>
              <button @click="changeOrder()">修改订单</button>
              <div class="clearBoth"></div>
            </div>
            <div class="go" v-else-if=" type == '0' && orderSource == 1">
              <button style="background: transparent;color:#3492ff;" @click="closedOrder()">关闭</button>
              <button >发布</button>
              <div class="clearBoth"></div>
            </div>
            <div class="go" v-else-if="type=='1000' && orderSource == 1">
              <button style="background: transparent;color:#3492ff;" @click="scoreYes(1)">评价</button>
              <button @click="orderAgain()">再下一单</button>
              <div class="clearBoth"></div>
            </div>
            <div class="go" v-else-if="type=='1001' && orderSource == 1">
              <button style="width:94%;margin:0 3%;display: block;" @click="orderAgain()">再下一单</button>
              <div class="clearBoth"></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div id="scoreBox" v-show="scoreBox">
      <div id="score">
        <div id="scoreTitle">
          <img src="../../images/closed.png" @click="scoreClosed()">
          <p>评价</p>
        </div>
        <ul>
          <li v-for="(item,index) in scoreList">
            <p>{{item.name}}</p>
            <div :id="'star_grade00'+index" class="star_grade scorelistscore"></div>
            <div class="clearBoth"></div>
          </li>
          <textarea placeholder="详细描述" v-model="scorereason" style="width:95%;height:2rem;border: 1px solid #dcdcdc;margin: 0.1rem auto;padding: 0.1rem 2.5%;font-size: 0.375rem;color:#333;"></textarea>
        </ul>
        <button @click="scoreChange()" id="gogogo" class="gogogo">提交</button>
      </div>
    </div>
    <div id="cancelReasonBox" v-if="cancelReasonBox">
      <div id="cancelReason">
        <div id="cancelReasonTitle">
          <img src="../../images/closed.png" @click="cancelReasonClosed()">
          <p>选择关闭订单的理由</p>
        </div>
        <ul class="errorUl">
          <li v-for="(item,index) in cancelReason" :class="index%2==0?'errorAbnormalLeft':'errorAbnormalRight'" @click="cancelReasonClick($event)">
            {{item.displayName}}
          </li>
          <div class="clearBoth"></div>
          <input type="text" maxlength="30" placeholder="其他原因" v-model="cancelreason">
        </ul>
        <button @click="cancelReasonChange()" id="gogogo" class="gogogo">提交</button>
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
    name: "robbingMore",
    data(){
      return{
        orderSource:1,
        carloading:true,
        type:"",
        pick:true,
        logisticsOk:false,
        pdlist:[],
        cancelReasonBox:false,
        scoreBox:false,
        cancelReason:[],
        scoreList:"",
        scorereason:"",
        cancelreason:"",
        errorlogo: 'this.src="' + require('../../images/chengyunshang.png') + '"',
        errorlogo2: 'this.src="' + require('../../images/carpeople.png') + '"',
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var self = this;
        thisThat = this;
        self.orderSource = self.$route.query.type;
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
          $(document).on("click",".scorelistscore .set_image_item",function () {
            var idname = $(this).parents(".scorelistscore").attr("id");
            var x = $(this).index("#"+idname+"  .set_image_item");
            $("#"+idname).html("");
            $("#"+idname).markingSystem({
              num: 5,
              havePoint: true,
              haveGrade: true,
              backgroundImageInitial: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEUAAAD9dyr9VDr8SD/9ZjP9YDb9cS78TT39bDH9aTH9XDf9dSv9YzT9XDf9bi/9cC79aTL9cy78QkJ+hTheAAAAEnRSTlMAH/T+wNxw+5yv5zzP5odurld/oABPAAAA1klEQVQ4y62RS5LDIAxE0Q/J2Elm+v6HnUwIKRsKVtEGmu56KqH07Qr3WPkkgNAioDCDLgG/+wqh4JQKdAHIKeU5YoP/H4xtEnC8Rszwgf0IvTGawQDfNB6t0yGo1f4oO2rJUYkQNr3nMzPf1ViA/ArYbCpGri1t5nO72MSnz9Vo4Tcx+oNcP5SzLgNyu+5Qh30ciLMMHF2Acf1JcBcQXDWkmwpeTzN6r57SiCQVQJRay36ITZ6uCuRnHEMR4U+bKsYjoB1BANur2A2QjkCl2S1SKH2p/gDnoAlDysm60AAAAABJRU5ErkJggg==',
              backgroundImageOver: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAMAAAC+oj0CAAAAYFBMVEUAAAD8QkL9UVH9eHj9VFT/wsL/zc3/19f/2dn/4eH/7+///f39R0f9TU39Tk79ZWX9YmL9a2v+lJT+oaH+paX+sLD+urr/1NT/3d3/5+f//v7+goL+g4P8QkL+u7v9bGzZkjZpAAAAHXRSTlMA7d+q105ANDEoFQPs5ePGxbuIeXNlWjgsHgOioFw9/yIAAACSSURBVBjTbdDZDoQgDEDRsggC7rvOVP//LycQU3TgvjQ5adKkEJsmyLQytmZYIIpUNUNkOrecWS+ZZ1YSuF3Ng5AYkmKY1e4ArMQkacHWKdcWQDf/2uhwjb+V33c3/tIN7gx/qAGqjdxGdVXkyhEbfGSIiycXxKN/R69U7x8zEn8Qu7BUdIhf4uU6Dwgd57X4+QMzcxYilqvWAwAAAABJRU5ErkJggg==',
              unit: '星',
              grade:x*1+1,
              height: 0.6* $("html").css("font-size").replace("px", ""),
              width: 0.6* $("html").css("font-size").replace("px", ""),
            });
            $("#"+idname+" .set_image_top").css("z-index",10);
          })
        })
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
          self.type = curPageData[0].orderType;
          self.mescroll.endSuccess(curPageData.length);
          sessionStorage.setItem("orderType",self.pdlist[0].orderType);
          sessionStorage.setItem("orderPk",self.$route.query.pk);
          self.$nextTick(function () {
            if(curPageData[0].orderType>3){
              $("#star_grade").html("");
              $("#star_grade").markingSystem({
                num: 5,
                havePoint: true,
                haveGrade: true,
                backgroundImageInitial: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEUAAAD9dyr9VDr8SD/9ZjP9YDb9cS78TT39bDH9aTH9XDf9dSv9YzT9XDf9bi/9cC79aTL9cy78QkJ+hTheAAAAEnRSTlMAH/T+wNxw+5yv5zzP5odurld/oABPAAAA1klEQVQ4y62RS5LDIAxE0Q/J2Elm+v6HnUwIKRsKVtEGmu56KqH07Qr3WPkkgNAioDCDLgG/+wqh4JQKdAHIKeU5YoP/H4xtEnC8Rszwgf0IvTGawQDfNB6t0yGo1f4oO2rJUYkQNr3nMzPf1ViA/ArYbCpGri1t5nO72MSnz9Vo4Tcx+oNcP5SzLgNyu+5Qh30ciLMMHF2Acf1JcBcQXDWkmwpeTzN6r57SiCQVQJRay36ITZ6uCuRnHEMR4U+bKsYjoB1BANur2A2QjkCl2S1SKH2p/gDnoAlDysm60AAAAABJRU5ErkJggg==',
                backgroundImageOver: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAMAAAC+oj0CAAAAYFBMVEUAAAD8QkL9UVH9eHj9VFT/wsL/zc3/19f/2dn/4eH/7+///f39R0f9TU39Tk79ZWX9YmL9a2v+lJT+oaH+paX+sLD+urr/1NT/3d3/5+f//v7+goL+g4P8QkL+u7v9bGzZkjZpAAAAHXRSTlMA7d+q105ANDEoFQPs5ePGxbuIeXNlWjgsHgOioFw9/yIAAACSSURBVBjTbdDZDoQgDEDRsggC7rvOVP//LycQU3TgvjQ5adKkEJsmyLQytmZYIIpUNUNkOrecWS+ZZ1YSuF3Ng5AYkmKY1e4ArMQkacHWKdcWQDf/2uhwjb+V33c3/tIN7gx/qAGqjdxGdVXkyhEbfGSIiycXxKN/R69U7x8zEn8Qu7BUdIhf4uU6Dwgd57X4+QMzcxYilqvWAwAAAABJRU5ErkJggg==',
                unit: '星',
                grade:self.pdlist[0].carPeople.grade,
                height: 0.4* $("html").css("font-size").replace("px", ""),
                width: 0.4* $("html").css("font-size").replace("px", ""),
              });
            }
            if(curPageData[0].orderType == 10){
              $("#star_gradeS").html("");
              $("#star_gradeS").markingSystem({
                num: 5,
                havePoint: true,
                haveGrade: true,
                backgroundImageInitial: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEUAAAD9dyr9VDr8SD/9ZjP9YDb9cS78TT39bDH9aTH9XDf9dSv9YzT9XDf9bi/9cC79aTL9cy78QkJ+hTheAAAAEnRSTlMAH/T+wNxw+5yv5zzP5odurld/oABPAAAA1klEQVQ4y62RS5LDIAxE0Q/J2Elm+v6HnUwIKRsKVtEGmu56KqH07Qr3WPkkgNAioDCDLgG/+wqh4JQKdAHIKeU5YoP/H4xtEnC8Rszwgf0IvTGawQDfNB6t0yGo1f4oO2rJUYkQNr3nMzPf1ViA/ArYbCpGri1t5nO72MSnz9Vo4Tcx+oNcP5SzLgNyu+5Qh30ciLMMHF2Acf1JcBcQXDWkmwpeTzN6r57SiCQVQJRay36ITZ6uCuRnHEMR4U+bKsYjoB1BANur2A2QjkCl2S1SKH2p/gDnoAlDysm60AAAAABJRU5ErkJggg==',
                backgroundImageOver: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAMAAAC+oj0CAAAAYFBMVEUAAAD8QkL9UVH9eHj9VFT/wsL/zc3/19f/2dn/4eH/7+///f39R0f9TU39Tk79ZWX9YmL9a2v+lJT+oaH+paX+sLD+urr/1NT/3d3/5+f//v7+goL+g4P8QkL+u7v9bGzZkjZpAAAAHXRSTlMA7d+q105ANDEoFQPs5ePGxbuIeXNlWjgsHgOioFw9/yIAAACSSURBVBjTbdDZDoQgDEDRsggC7rvOVP//LycQU3TgvjQ5adKkEJsmyLQytmZYIIpUNUNkOrecWS+ZZ1YSuF3Ng5AYkmKY1e4ArMQkacHWKdcWQDf/2uhwjb+V33c3/tIN7gx/qAGqjdxGdVXkyhEbfGSIiycXxKN/R69U7x8zEn8Qu7BUdIhf4uU6Dwgd57X4+QMzcxYilqvWAwAAAABJRU5ErkJggg==',
                unit: '星',
                grade:self.pdlist[0].evaluate.grade,
                height: 0.4* $("html").css("font-size").replace("px", ""),
                width: 0.4* $("html").css("font-size").replace("px", ""),
              });
              $("#star_gradeS .grade").remove();
            }
            if(curPageData[0].orderType >2){
              $("#star_gradeF").html("");
              $("#star_gradeF").markingSystem({
                num: 5,
                havePoint: true,
                haveGrade: true,
                backgroundImageInitial: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEUAAAD9dyr9VDr8SD/9ZjP9YDb9cS78TT39bDH9aTH9XDf9dSv9YzT9XDf9bi/9cC79aTL9cy78QkJ+hTheAAAAEnRSTlMAH/T+wNxw+5yv5zzP5odurld/oABPAAAA1klEQVQ4y62RS5LDIAxE0Q/J2Elm+v6HnUwIKRsKVtEGmu56KqH07Qr3WPkkgNAioDCDLgG/+wqh4JQKdAHIKeU5YoP/H4xtEnC8Rszwgf0IvTGawQDfNB6t0yGo1f4oO2rJUYkQNr3nMzPf1ViA/ArYbCpGri1t5nO72MSnz9Vo4Tcx+oNcP5SzLgNyu+5Qh30ciLMMHF2Acf1JcBcQXDWkmwpeTzN6r57SiCQVQJRay36ITZ6uCuRnHEMR4U+bKsYjoB1BANur2A2QjkCl2S1SKH2p/gDnoAlDysm60AAAAABJRU5ErkJggg==',
                backgroundImageOver: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAMAAAC+oj0CAAAAYFBMVEUAAAD8QkL9UVH9eHj9VFT/wsL/zc3/19f/2dn/4eH/7+///f39R0f9TU39Tk79ZWX9YmL9a2v+lJT+oaH+paX+sLD+urr/1NT/3d3/5+f//v7+goL+g4P8QkL+u7v9bGzZkjZpAAAAHXRSTlMA7d+q105ANDEoFQPs5ePGxbuIeXNlWjgsHgOioFw9/yIAAACSSURBVBjTbdDZDoQgDEDRsggC7rvOVP//LycQU3TgvjQ5adKkEJsmyLQytmZYIIpUNUNkOrecWS+ZZ1YSuF3Ng5AYkmKY1e4ArMQkacHWKdcWQDf/2uhwjb+V33c3/tIN7gx/qAGqjdxGdVXkyhEbfGSIiycXxKN/R69U7x8zEn8Qu7BUdIhf4uU6Dwgd57X4+QMzcxYilqvWAwAAAABJRU5ErkJggg==',
                unit: '星',
                grade:self.pdlist[0].carrier.grade,
                height: 0.4* $("html").css("font-size").replace("px", ""),
                width: 0.4* $("html").css("font-size").replace("px", ""),
              });
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
          })
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      closedOrder:function () {
        var self = this;
        self.cancelReasonBox = true;
        if(self.cancelReason.length == 0){
          $.ajax({
            type: "GET",
            url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
            data:{str:"order_closed",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
            dataType: "json",
            timeout: 10000,
            success: function (getSysConfigList) {
              self.cancelReason = getSysConfigList;
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
        $("#errorwifeBox").remove();
      },
      pickMessage:function (m) {
        var _this = this;
        if(m != (_this.pick).toString()){
          _this.pick = !_this.pick;
        }
      },
      logisticsBoxDown:function () {
        var _this = this;
        _this.logisticsOk = !_this.logisticsOk;
      },
      errorAbnormalChangeImg:function () {
        if(bomb.hasClass("errorAbnormalChangeImg","gray")){

          bomb.removeClass("errorAbnormalChangeImg","gray");

        }else{

          bomb.addClass("errorAbnormalChangeImg","gray");
        }
      },
      cancelReasonClosed:function(){
        var _this = this;
        _this.cancelReasonBox = false;
        $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
      },
      scoreYes:function(type){
        var _this = this;
        if(type == 1){
          _this.scoreList = [{
            name:"货物",
            score:"0"
          },{
            name:"司机",
            score:"0"
          },{
            name:"承运商",
            score:"0"
          }]
        }else if(type == 3){
          _this.scoreList = [{
            name:"货物",
            score:"0"
          }]
        }
        _this.$nextTick(function () {
          for(var i =0 ;i<_this.scoreList.length;i++){
            $("#star_grade00"+i).html("");
            $("#star_grade00"+i).markingSystem({
              num: 5,
              havePoint: false,
              haveGrade: false,
              backgroundImageInitial: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEUAAAD9dyr9VDr8SD/9ZjP9YDb9cS78TT39bDH9aTH9XDf9dSv9YzT9XDf9bi/9cC79aTL9cy78QkJ+hTheAAAAEnRSTlMAH/T+wNxw+5yv5zzP5odurld/oABPAAAA1klEQVQ4y62RS5LDIAxE0Q/J2Elm+v6HnUwIKRsKVtEGmu56KqH07Qr3WPkkgNAioDCDLgG/+wqh4JQKdAHIKeU5YoP/H4xtEnC8Rszwgf0IvTGawQDfNB6t0yGo1f4oO2rJUYkQNr3nMzPf1ViA/ArYbCpGri1t5nO72MSnz9Vo4Tcx+oNcP5SzLgNyu+5Qh30ciLMMHF2Acf1JcBcQXDWkmwpeTzN6r57SiCQVQJRay36ITZ6uCuRnHEMR4U+bKsYjoB1BANur2A2QjkCl2S1SKH2p/gDnoAlDysm60AAAAABJRU5ErkJggg==',
              backgroundImageOver: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAMAAAC+oj0CAAAAYFBMVEUAAAD8QkL9UVH9eHj9VFT/wsL/zc3/19f/2dn/4eH/7+///f39R0f9TU39Tk79ZWX9YmL9a2v+lJT+oaH+paX+sLD+urr/1NT/3d3/5+f//v7+goL+g4P8QkL+u7v9bGzZkjZpAAAAHXRSTlMA7d+q105ANDEoFQPs5ePGxbuIeXNlWjgsHgOioFw9/yIAAACSSURBVBjTbdDZDoQgDEDRsggC7rvOVP//LycQU3TgvjQ5adKkEJsmyLQytmZYIIpUNUNkOrecWS+ZZ1YSuF3Ng5AYkmKY1e4ArMQkacHWKdcWQDf/2uhwjb+V33c3/tIN7gx/qAGqjdxGdVXkyhEbfGSIiycXxKN/R69U7x8zEn8Qu7BUdIhf4uU6Dwgd57X4+QMzcxYilqvWAwAAAABJRU5ErkJggg==',
              unit: '星',
              grade:0,
              height: 0.6* $("html").css("font-size").replace("px", ""),
              width: 0.6* $("html").css("font-size").replace("px", ""),
            });
            $("#star_grade00"+i+" .set_image_top").css("z-index",10);
          }
          _this.scoreBox = true;
          _this.scorereason = "";
        })
      },
      scoreClosed:function(){
        var _this = this;
        _this.scoreBox = false;
        _this.cancelreason = "";
      },
      cancelReasonClick:function(e){
        if(!this.hasClass(e.target,"errorPriceBoxLi")){
          $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
          this.addClass(e.target,"errorPriceBoxLi");
        }else{
          $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
        }
      },
      cancelReasonChange:function(){
        var _this = this;
        if(bomb.hasClass("gogogo","gogogo")){
          var list =[];
          for(var i =0;i<$("#cancelReasonBox .errorUl li").length;i++){
            if($("#cancelReasonBox .errorUl li").eq(i).hasClass("errorPriceBoxLi")){
              list.push(_this.cancelReason[i].value);
            }
          }
          if(list.length == 0 && _this.cancelreason == ""){
            bomb.first("请选择关闭订单的理由！");
            return false;
          }
          bomb.removeClass("gogogo","gogogo");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/order/closeOrder",
            data:JSON.stringify({
              reason:list[0],
              cancelreason:_this.cancelreason,
              pk:_this.$route.query.pk,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            timeout: 10000,
            success: function (closeOrder) {
              bomb.addClass("gogogo","gogogo");
              if(closeOrder.success == "1"){
                _this.cancelReasonBox = false;
                $("#cancelReasonBox .errorUl li").removeClass("errorPriceBoxLi");
                _this.cancelreason = "";
                _this.$cjj("关闭成功");
                setTimeout(function () {
                  bridge.invoke('gobackfrom');
                },500);
              }else{
                androidIos.second(closeOrder.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              bomb.addClass("gogogo","gogogo");
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
          bomb.first("请不要频繁点击");
        }

      },
      scoreChange:function(){
        var _this = this;
        var orderTypeList = _this.$route.query.type;
        if(bomb.hasClass("gogogo","gogogo")){
          var list = [];
          var zongNumber = 0;
          for(var i =0;i<_this.scoreList.length;i++){
            var json = {
              name:_this.scoreList[i].name,
              score: $("#star_grade00"+i).find(".grade").text().replace("分","")
            }
            zongNumber = zongNumber + json.score*1
            list.push(json)
          }
          var remark = "";
          for(var i = 0 ;i < list.length ; i++){
            remark += list[i].name + "(" + list[i].score + "分" + ")" + " ";
          }
          var cjJson = orderTypeList == 1 ?{
            scoreList:JSON.stringify(list),
            average:(zongNumber/_this.scoreList.length).toFixed(1),
            scorereason:_this.scorereason,
            pk:_this.$route.query.pk,
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }:{
            pk:_this.$route.query.pk,
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
            remark:remark + " " + _this.scorereason,
          }
          bomb.removeClass("gogogo","gogogo");
          if(orderTypeList == 1){
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp()+"/order/clientAppraisal",
              data:JSON.stringify(cjJson),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 10000,
              success: function (clientAppraisal) {
                bomb.addClass("gogogo","gogogo");
                if(clientAppraisal.success == "1"){
                  _this.scoreBox = false;
                  _this.mescroll.resetUpScroll();
                }else{
                  androidIos.second(clientAppraisal.message);
                  _this.mescroll.resetUpScroll();
                }
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                _this.cancelReasonBox = false;
                bomb.addClass("gogogo","gogogo");
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                }else if(status=='error'){
                  androidIos.errorwife();
                }
              }
            })
          }else{
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp()+"/order/signInv",
              data:cjJson,
              dataType: "json",
              timeout: 10000,
              success: function (signInv) {
                bomb.addClass("gogogo","gogogo");
                if(signInv.success == "1"){
                  _this.scoreBox = false;
                  _this.mescroll.resetUpScroll();
                }else{
                  androidIos.second(signInv.message);
                }
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                _this.cancelReasonBox = false;
                bomb.addClass("gogogo","gogogo");
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                }else if(status=='error'){
                  androidIos.errorwife();
                }
              }
            })
          }

        }else{
          bomb.first("请不要频繁点击");
        }

      },
      mapSClick:function(){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/orderLogistics/map'});
      },
      telphone:function(tel){
        bridge.invoke('callTelephone',tel);
      },
      payOrder:function () {
        var _this = this;
        bridge.invoke('payOrder',_this.$route.query.pk);
      },
      lookScore:function(){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/orderLogistics/score',query:{pk:_this.$route.query.pk}});
      },
      changeOrder:function(){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/newOrder',query:{pk:_this.$route.query.pk,type:1}});
      },
      orderAgain:function(){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/newOrder',query:{pk:_this.$route.query.pk,type:2}});
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
        url: androidIos.ajaxHttp()+"/order/invoiceDetail",
        data:JSON.stringify({pk:thisThat.$route.query.pk,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        timeout: 10000,
        success: function (invoiceDetail) {
          thisThat.carloading = false;
          if(invoiceDetail.success == "" || invoiceDetail.success == "1"){
            var list=[];
            for(var i =0;i<invoiceDetail.invPackDao.length;i++){
              var weight = invoiceDetail.invPackDao[i].weigthUnit==3?invoiceDetail.invPackDao[i].weight*1000:invoiceDetail.invPackDao[i].weight*1;
              var listJson = {
                goods:invoiceDetail.invPackDao[i].goodsName+"-"+invoiceDetail.invPackDao[i].goodsTypeName,
                number:invoiceDetail.invPackDao[i].num,
                weight : weight/1000 - 1 <0 ? weight + "千克" : weight/1000 + "吨",
                volume:invoiceDetail.invPackDao[i].volume*1 - 1 < 0 ? invoiceDetail.invPackDao[i].volume*1000 + "升" : invoiceDetail.invPackDao[i].volume*1 + "立方米",
              }
              list.push(listJson);
            }
            var tracking=[];
            for(var i =0 ;i<invoiceDetail.tracking.length;i++){
              var trackingJson = {
                type:invoiceDetail.tracking[i].tackingMemo,
                time:invoiceDetail.tracking[i].tackingTime,
              }
              tracking.push(trackingJson);
            }
            // 新建=0 已确认=10 司机发车=20 部分提货=30 已提货=40 部分到货=50 已到货=60 部分签收=70 已签收=80 已回单=90 关闭=100
            // thisThat.$route.query.type 1发货方2付款3收货方
            var trackingStatusValue = "";
            if(thisThat.$route.query.type == "1" || thisThat.$route.query.type == "3"){
              if(invoiceDetail.trackingStatusValue == "80" && invoiceDetail.ifAppraise == "N"){
                trackingStatusValue = 1000;
              }else if(invoiceDetail.trackingStatusValue == "80" && invoiceDetail.ifAppraise == "Y"){
                trackingStatusValue = 1001;
              }else{
                trackingStatusValue = invoiceDetail.trackingStatusValue;
              }
            }else if(thisThat.$route.query.type == "2"){
              if(invoiceDetail.payStatus != "30"){
                trackingStatusValue = 10000;
              }
            }
            sessionStorage.setItem("dataStart",invoiceDetail.delivery.addressLatAndLon);
            sessionStorage.setItem("dataEnd",invoiceDetail.arrival.addressLatAndLon);
            var pdlist = [{
              orderType:trackingStatusValue,
              orderTypeName:invoiceDetail.trackingStatus,
              logistics:tracking,
              evaluate:{
                grade:invoiceDetail.appraiseScore==""?0:invoiceDetail.appraiseScore
              },
              goodsmessage:{
                startAddress:invoiceDetail.delivery!=null?(invoiceDetail.delivery.province/*+invoiceDetail.delivery.city*/+invoiceDetail.delivery.area):"",
                endAddress:invoiceDetail.arrival!=null?(invoiceDetail.arrival.province/*+invoiceDetail.arrival.city*/+invoiceDetail.arrival.area):"",
                distance:"0",
                tranType:invoiceDetail.transType,
                productList:list,
                money:invoiceDetail.price*1,
                startTime:invoiceDetail.deliDate,
                endTime:invoiceDetail.arriDate
              },
              pickMessage:{
                name:invoiceDetail.delivery!=null?invoiceDetail.delivery.contact:"",
                tel:invoiceDetail.delivery!=null?invoiceDetail.delivery.mobile:"",
                company:invoiceDetail.delivery!=null?invoiceDetail.delivery.addrName:"",
                address:invoiceDetail.delivery!=null?invoiceDetail.delivery.province/*+invoiceDetail.delivery.city*/+invoiceDetail.delivery.area+invoiceDetail.delivery.detailAddr:"",
              },
              endMessage:{
                name:invoiceDetail.arrival!=null?invoiceDetail.arrival.contact:"",
                tel:invoiceDetail.arrival!=null?invoiceDetail.arrival.mobile:"",
                company:invoiceDetail.arrival!=null?invoiceDetail.arrival.addrName:"",
                address:invoiceDetail.arrival!=null?invoiceDetail.arrival.province/*+invoiceDetail.arrival.city*/+invoiceDetail.arrival.area+invoiceDetail.arrival.detailAddr:"",
              },
              insurance:{
                name:"",
                price:"200"
              },
              pickPay:{
                people:"发货方",
                type:invoiceDetail.balatype == null?"":invoiceDetail.balatype
              },
              carPeople:{
                logo:"data:image/png;base64,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",
                year:invoiceDetail.driverDto!=null&&invoiceDetail.driverDto.length != 0?(invoiceDetail.driverDto[0].driverAge*1 < 1 ?"小于一年":invoiceDetail.driverDto[0].driverAge*1+'年'):"",
                grade:invoiceDetail.driverDto!=null&&invoiceDetail.driverDto.length != 0?invoiceDetail.driverDto[0].score*1:"",
                name:invoiceDetail.driverDto!=null&&invoiceDetail.driverDto.length != 0?invoiceDetail.driverDto[0].driverName:"",
                tel:invoiceDetail.driverDto!=null&&invoiceDetail.driverDto.length != 0?invoiceDetail.driverDto[0].mobile:"",
                yes:invoiceDetail.driverDto!=null&&invoiceDetail.driverDto.length != 0?true:false,
              },
              carrier:{
                logo:invoiceDetail.carrierDto!=null?invoiceDetail.carrierDto.carrierImg:"",
                company:invoiceDetail.carrierDto!=null?invoiceDetail.carrierDto.carrierName:"",
                tranType: invoiceDetail.carrierDto!=null ? (invoiceDetail.carrierDto.tranType == "" ||  invoiceDetail.carrierDto.tranType == null ? "陆运" : invoiceDetail.carrierDto.tranType):"",
                year:invoiceDetail.carrierDto!=null?((((new Date()).getTime()-(new Date(invoiceDetail.carrierDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 -0.5)<0?"不到半年":androidIos.fixed(((new Date()).getTime()-(new Date(invoiceDetail.carrierDto.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365 ,1)+"年"):"",
                grade:invoiceDetail.carrierDto!=null?(invoiceDetail.carrierDto.score == null || invoiceDetail.carrierDto.score == "" ? 0:invoiceDetail.carrierDto.score*1):"0",
                phone:invoiceDetail.carrierDto!=null?invoiceDetail.carrierDto.mobile:"",
                pkCarrier:invoiceDetail.carrierDto!=null?invoiceDetail.carrierDto.pkCarrier:"",
              },
              tranNumber:"123321334343",
              number:invoiceDetail.orderNo,
              time:invoiceDetail.createTime
            }]
            if(invoiceDetail.driverDto != null && invoiceDetail.driverDto.length != 0){
               sessionStorage.setItem("driverPk",invoiceDetail.driverDto[0].pkDriver);
            }
            var data=pdlist;
            var listData=data;//模拟分页数据
            successCallback&&successCallback(listData);//成功回调
          }else{
            androidIos.second(invoiceDetail.message);
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
    margin-top: 0.2rem;
  }
  #sure button{
    width:4.2rem;
    background: #3492ff;
    border:1px solid #3492ff;
    margin-left: 0.53333rem;
    /*background: -webkit-linear-gradient(left,#3da4ff, #3492ff); !* Safari 5.1 - 6.0 *!
    background: -o-linear-gradient(left,#3da4ff, #3492ff); !* Opera 11.1 - 12.0 *!
    background: -moz-linear-gradient(left,#3da4ff, #3492ff); !* Firefox 3.6 - 15 *!
    background: linear-gradient(left,#3da4ff, #3492ff); !* 标准的语法 *!*/
    color:white;
    font-size: 0.4rem;
    letter-spacing: 0.0625rem;
    line-height: 1.2rem;
    border-radius: 0.2rem;
    margin-bottom: 0.4rem;
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
#scoreBox,#cancelReasonBox{
     width:100%;
    height: 100%;
    position: fixed;
    top:0;
    left:0;
    z-index:188;
    background-color:rgba(0,0,0,0.5);
  }
#score,#cancelReason{
    position: absolute;
    bottom:0;
    background: white;
    width:100%;
  }
  #scoreTitle p,#cancelReasonTitle p{
    width:100%;
    text-align: center;
    line-height: 1rem;
    font-size: 0.375rem;
    color:#999;
    position: relative;
  }
  #scoreTitle img,#cancelReasonTitle img{
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
    font-size: 0.3125rem;
    border-radius: 0.2rem;
    margin: 0.2rem 0;
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
  #score button,#cancelReason button{
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
    width: 88%;
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
    float: right;
    margin-top: 0.35rem;
    margin-left: 0.2rem;
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
</style>
