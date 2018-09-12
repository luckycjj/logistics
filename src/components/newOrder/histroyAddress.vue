<template>
  <div id="histroyAddress">
    <div id="title" v-title data-title="常用路线"></div>
    <div id="carTitleBox"   @click="event($event)">
      <div class="carTitleBox">
        <div class="carTitleback" @click="goback()"></div>
        <input type="tel" placeholder="请输入手机号码" id="carNumber" v-model="address" maxlength="30" @focus="aaa()">
        <p @click="sousuo()">搜索</p>
      </div>
    </div>
    <div id="mescroll" class="mescroll">
      <ul id="dataList" class="data-list">
        <li v-for="item in pdlist" @click="chooseLine(item.pkInvoice)">
          <div class="firstBox">
            <p>{{item.deliContact}}<span>{{item.deliMobile}}</span></p>
            <h1>{{item.deliAddr}}</h1>
            <p>{{item.arriContact}}<span>{{item.arriMobile}}</span></p>
            <h1>{{item.arriAddr}}</h1>
          </div>
          <div class="secondBox">
            <p>{{item.transType}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  export default {
    name: "histroyAddress",
    data(){
      return{
        pdlist:[],
        address:""
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var self = this;
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            empty:{
              warpId:'mescroll',
              icon:require('../../images/nojilu.png'),
              tip:"暂无历史订单~"
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", ""),
          }
        });
      },
      aaa:function(){
        $("#histroyAddress #carTitleBox").css("z-index","100");
      },
      event:function (e) {
        var _this = this;
        if($("#histroyAddress #carTitleBox").css("z-index")=="100"){
          if(e.target.id=="carTitleBox"){
            $("#histroyAddress #carTitleBox").css("z-index","0");
            _this.pdlist = [];
            _this.mescroll.resetUpScroll();
          }
        }
      },
      sousuo:function(){
        var _this = this;
        $("#histroyAddress #carTitleBox").css("z-index","0");
        _this.pdlist = [];
        _this.mescroll.resetUpScroll();
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

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      goback:function () {
        androidIos.gobackFrom(this);
      },
      chooseLine:function (pkInvoice) {
        var _this = this;
        androidIos.loading("正在获取");
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/order/invoiceDetail",
          data:JSON.stringify({pk:pkInvoice,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")}),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 10000,
          success: function (invoiceDetail) {
            $("#common-blackBox").remove();
            if(invoiceDetail.success!="-1"){
              var list=[];
              for(var i =0;i<invoiceDetail.invPackDao.length;i++){
                var protype = 0;
                if(invoiceDetail.invPackDao[i].weight*1 == 0){
                  protype = 1;
                }else{
                  if(invoiceDetail.invPackDao[i].volume ==0){
                    protype = 0;
                  }else{
                    protype = 2;
                  }
                }
                var listJson = {
                  pkInvPackB:invoiceDetail.invPackDao[i].pkInvPackB,
                  goodsType:invoiceDetail.invPackDao[i].goodsName+"-"+invoiceDetail.invPackDao[i].goodsTypeName,
                  protype:protype,
                  goodstypenumber:invoiceDetail.invPackDao[i].goodsCode+"-"+invoiceDetail.invPackDao[i].goodsType,
                  number:invoiceDetail.invPackDao[i].num,
                  unitWight:"吨",
                  wight:invoiceDetail.invPackDao[i].weight/1000,
                  wightTen:"1",
                  unitWeight:"立方米",
                  weight:invoiceDetail.invPackDao[i].volume*1,
                  weightTen:"1",
                  tranpk:invoiceDetail.category,
                }
                list.push(listJson);
              }
              var newOrder = JSON.parse(sessionStorage.getItem("newOrder"));
              var pdlist = {
                histroyAddressLength:true,
                startAddress:{
                  people:invoiceDetail.delivery.contact,
                  tel:invoiceDetail.delivery.mobile,
                  city:invoiceDetail.delivery.province+"-"+invoiceDetail.delivery.city+"-"+invoiceDetail.delivery.area,
                  address:invoiceDetail.delivery.detailAddr,
                  company:invoiceDetail.delivery.addrName,
                  pk:invoiceDetail.delivery.pkAddress,
                },
                endAddress:{
                  people:invoiceDetail.arrival.contact,
                  tel:invoiceDetail.arrival.mobile,
                  city:invoiceDetail.arrival.province+"-"+invoiceDetail.arrival.city+"-"+invoiceDetail.arrival.area,
                  address:invoiceDetail.arrival.detailAddr,
                  company:invoiceDetail.arrival.addrName,
                  pk:invoiceDetail.arrival.pkAddress,
                },
                timeBeforeF:_this.day(60*60*1000).split(" ")[1],
                timeBeforeS:_this.day(60*60*1000).split(" ")[0],
                timeAfterF:"08:00:00",
                timeAfterS:_this.day(24*60*60*1000).split(" ")[0],
                productList:list,
                tranType:"",
                trantypenumber:"",
                appoint:"",
                pk_carrier:"",
                driver_name:"",
                insurance:"",
                pay:0,
                read:true,
                scrollTop:0,
                initialWeight:0,
                price:"",
                carList:newOrder.carList,
                carListSure:"",
                carListSureValue:"",
                carWidthList:newOrder.carWidthList,
                carWidthListSure:"",
                carWidthListSureValue:"",
                cartypeOther:"",
                cartypeOtherSure:"",
                carTypeList:newOrder.carTypeList,
                carTypeListSure:"",
                carTypeListSureValue:"",
                carListMore:newOrder.carListMore,
                carWidthListMore:newOrder.carWidthListMore,
                carTypeListMore:newOrder.carTypeListMore,
              }
              sessionStorage.setItem("histroyAddress",JSON.stringify(pdlist));
              androidIos.gobackFrom(_this);
            }else{
              androidIos.second(invoiceDetail.message);
            }

          },
          error:function () {

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
      day:function (time) {
         var _this = this;
         var newDate = new Date((new Date()).getTime()*1 + time*1);
         return _this.ten(newDate.getFullYear()) + "-" + _this.ten(newDate.getMonth() + 1) + "-" + _this.ten(newDate.getDate()) + " " +  _this.ten(newDate.getHours()) + ":" + _this.ten(newDate.getMinutes()) + ":" + _this.ten(newDate.getSeconds());
      },
      ten:function (min) {
        if(min<10){
          min = "0"+min;
        }else{
          min = min;
        }
        return min;
      }
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      var json = {
        page:pageNum,
        size:pageSize,
        keyword:$("#histroyAddress #carTitleBox input").val(),
        userCode:sessionStorage.getItem("token"),
        source:sessionStorage.getItem("source"),
        type:sessionStorage.getItem("NEWORDERTRANTYPE") == '0' ? '' :sessionStorage.getItem("NEWORDERTRANTYPE"),
      }
      var listData=[]
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp()+"/order/getHistoryOrder",
        data:JSON.stringify(json),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 10000,
        success: function (getHistoryOrder) {
           if(getHistoryOrder.success == "1"){
             listData = getHistoryOrder.list;
           }else{
             androidIos.second(getHistoryOrder.message)
           }
          successCallback&&successCallback(listData);//成功回调
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
          if(status=='timeout'){//超时,status还有success,error等值的情况
            androidIos.second("网络请求超时");
          }else if(status=='error'){
            androidIos.errorwife();
          }
          successCallback&&successCallback(listData);//成功回调
        }
      })
    },500)
  }
</script>

<style >
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #histroyAddress .carTitleBox{
    width: 100%;
    position: absolute;
    top: 0;
    height: 1.25rem;
    background: white;
  }
  #histroyAddress .carTitleback{
    position: absolute;
    left:0;
    top:0;
    bottom: 0;
    height: auto;
    width: 1.5rem;
    background-image: url("../../images/titlejian.png");
    background-position: 35% 50%;
    background-repeat: no-repeat;
    background-size: 0.2rem 0.3714rem;
  }
  #histroyAddress #carTitleBox{
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background: rgba(0,0,0,0.2);
    width:auto;
    height: auto;
    z-index:0;
  }
  #histroyAddress .carTitleBox p {
    position: absolute;
    right:0;
    top:0;
    line-height: 1.25rem;
    color:#333;
    margin-right: 2%;
    font-size: 0.35rem;
  }
  #histroyAddress .carTitleBox input{
    display: block;
    width:50%;
    background-color: #f2f2f2;
    border:1px solid #eaeaea;
    color:#333;
    padding: 0.15rem 0;
    margin-top:0.225rem;
    margin-left:2rem;
    font-size: 0.36rem;
    border-radius: 0.45rem;
    text-align: left;
    padding-left: 10%;
    background-image: url("../../images/sousuo.png");
    background-position: 6% 50%;
    background-repeat: no-repeat;
    background-size: 0.4133rem 0.4rem;
  }
  #histroyAddress ul{
    width:100%;
    margin-top: 0.2rem;
  }
  #histroyAddress li{
    width: 94%;
    margin: 0.3rem auto 0 auto;
    border-radius: 0.3rem;
    background: white;
    box-shadow: 0 0.1rem 10px #d8d8d8;
  }
  #histroyAddress .firstBox{
    width:90%;
    padding: 0.4rem 5% 0 5%;
  }
  #histroyAddress .secondBox{
    width:90%;
    padding: 0.2rem 5%;
  }
  #histroyAddress .firstBox p,#histroyAddress .secondBox p{
    font-size: 0.35rem;
    color:#373737;
    line-height: 0.6rem;
    padding-left: 5%;
  }
  #histroyAddress .firstBox p:nth-child(1){
     background-image: url("../../images/pickmessage.png");
     background-size: 0.267rem;
     background-repeat: no-repeat;
     background-position: 0 0.17rem;
   }
  #histroyAddress .firstBox p{
    background-image: url("../../images/arrmessage.png");
    background-size: 0.267rem;
    background-repeat: no-repeat;
    background-position: 0 0.17rem;
  }
  #histroyAddress .secondBox p{
    background-image: url("../../images/transportpng.png");
    background-size: 0.35rem;
    background-repeat: no-repeat;
    background-position: 0 0.1rem;
  }
  #histroyAddress .firstBox p span{
    font-size: 0.35rem;
    color:#373737;
    margin-left: 0.1rem;
  }
  #histroyAddress .firstBox h1{
    font-size: 0.3125rem;
    color:#999999;
    line-height: 0.6rem;
    padding-left: 5%;
  }
  #histroyAddress .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 0;
    height: auto;
    background-color: rgb(245, 245, 249)!important;
  }
</style>
