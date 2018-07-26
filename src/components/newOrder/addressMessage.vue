<template>
  <div id="addressMessage">
    <div id="title" v-title data-title="地址簿"></div>
    <div id="carTitleBox"   @click="event($event)">
      <div class="carTitleBox">
        <div class="carTitleback" @click="goback()"></div>
        <input placeholder="请输入详细地址" maxlength="100" id="carNumber" v-model="address"  @focus="aaa()">
        <p @click="sousuo()" id="sousuo">管理</p>
      </div>
    </div>
    <div id="mescroll" class="mescroll">
      <ul id="dataList" class="data-list">
        <li v-for="(item,index) in pdlist" @click="chooseLine(item)">
          <div class="firstBox">
            <p>{{item.contact}}<span>{{item.mobile}}</span></p>
            <h1>{{item.province}}-{{item.city}}-{{item.area}}&nbsp;&nbsp;{{item.detailAddr}}</h1>
          </div>
          <div class="secondBox">
             <img src="../../images/edit.png" @click="editLine(item)" v-if="manage">
             <img src="../../images/clean.png" @click="cleanLine(index)" v-if="manage">
            <img src="../../images/checked.png"  v-if="!manage&&item.checked == '1'">
             <div class="clearBoth"></div>
          </div>
          <div class="clearBoth"></div>
        </li>
      </ul>
    </div>
    <button id="addNew" @click="addNew()">新增地址</button>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  var thisthatsecond;
  export default {
    name: "addressMessage",
    data(){
      return{
        pdlist:[],
        address:"",
        pk:"",
        size:"",
        number:"",
        manage:false
      }
    },
    mounted:function () {
      var self = this;
      thisthatsecond = this;
      var type = self.$route.query.type;
      if(type!=undefined){
         if(type == "1"){
           var startAddressmessage = sessionStorage.getItem("startAddressmessage");
           if(startAddressmessage!= undefined){
             self.pk =JSON.parse(startAddressmessage).pk;
           }
         }else if(type == "2"){
           var endAddressmessage = sessionStorage.getItem("endAddressmessage");
           if(endAddressmessage!= undefined){
             self.pk =JSON.parse(endAddressmessage).pk;
           }
         }
      }
      self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
        up: {
          callback: self.upCallback, //上拉回调
          isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
          empty:{
            warpId:'mescroll',
            icon:"data:image/png;base64,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",
          }
        },
        down: {
          offset: 2.1 * $("html").css("font-size").replace("px", ""),
        }
      });
    },
    methods:{
      aaa:function(){
        $("#addressMessage #carTitleBox").css("z-index","100");
        document.getElementById("sousuo").innerText = "搜索";
      },
      event:function (e) {
        var _this = this;
        if($("#addressMessage #carTitleBox").css("z-index")=="100"){
          if(e.target.id=="carTitleBox"){
            $("#addressMessage #carTitleBox").css("z-index","0");
            if(_this.manage){
              document.getElementById("sousuo").innerText = "取消";
            }else{
              document.getElementById("sousuo").innerText = "管理";
            }
            _this.pdlist = [];
            _this.mescroll.resetUpScroll();
          }
        }
      },
      sousuo:function(){
        var _this = this;
        var text = document.getElementById("sousuo").innerText;
        if(text == "搜索"){
          $("#addressMessage #carTitleBox").css("z-index","0");
          if(_this.manage){
            document.getElementById("sousuo").innerText = "取消";
          }else{
            document.getElementById("sousuo").innerText = "管理";
          }
          _this.pdlist = [];
          _this.mescroll.resetUpScroll();
        }else if(text == "管理"){
          if(_this.pdlist.length > 0){
            document.getElementById("sousuo").innerText = "取消";
            _this.manage = true;
          }
        }else if(text == "取消"){
          if(_this.pdlist.length > 0){
            document.getElementById("sousuo").innerText = "管理";
            _this.manage = false;
          }
        }
      },
      upCallback: function(page) {
        //联网加载数据
        var self = this;
        getListDataFromNet(page.num, page.size, function(curPageData) {
          //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

          //如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if(page.num == 1) self.pdlist = [];
          self.number = page.num;
          self.size = page.size;
          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);
          self.$nextTick(function () {
            $("#addressMessage .secondBox").css("height","50%");
          })

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      goback:function () {
        androidIos.gobackFrom(this);
        sessionStorage.removeItem("startAddressmessage");
        sessionStorage.removeItem("endAddressmessage");
      },
      addNew:function(){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/newOrder/chooseStart'});
      },
      chooseLine:function (item) {
        var _this = this;
        var type = _this.$route.query.type;
        if(!_this.manage && type != undefined){
          var json = {
            name:item.contact,
            phone:item.mobile,
            company:item.addrName,
            address:item.detailAddr,
            province:item.province,
            city:item.city,
            area:item.area,
            pk:item.pkAddress
          }
          if(type == "1"){
            sessionStorage.setItem("startAddress",JSON.stringify(json));
          }else if(type == "2"){
            sessionStorage.setItem("endAddress",JSON.stringify(json));
          }
          sessionStorage.removeItem("startAddressmessage");
          sessionStorage.removeItem("endAddressmessage");
          androidIos.gobackFrom(_this);
        }
      },
      cleanLine:function (index) {
        var _this = this;
        androidIos.first("确定删除吗？");
        $("#tanBox-yes").unbind("click").click(function () {
          $(".tanBox-bigBox").remove();
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/address/deleteAddres",
            data:JSON.stringify({
              pk:_this.pdlist[index].pkAddress,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            async:false,
            success: function (deleteAddres) {
              if(deleteAddres.success=="1"){
                _this.pdlist.splice(index,1);
                _this.$cjj("删除成功");
              }else{
                androidIos.second(getAddres.message)
              }
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
            url: androidIos.ajaxHttp()+"/address/getAddres",
            data:JSON.stringify({
              page:_this.size*_this.number,
              size:1,
              keyword:$("#addressMessage #carTitleBox input").val(),
              pk:_this.pk,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            async:false,
            success: function (getAddres) {
              if(getAddres.success=="1"){
                if(getAddres.list.length > 0){
                  _this.pdlist.push(getAddres.list[0])
                }
              }else{
                androidIos.second(getAddres.message)
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
        })
      },
      editLine:function (pk) {
        var _this = this;
        androidIos.addPageList();
        sessionStorage.setItem("addresspk",JSON.stringify(pk));
        _this.$router.push({ path: '/newOrder/chooseStart',query:{"pk":pk.pkAddress}});
      }
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      var json = {
        page:pageNum,
        size:pageSize,
        keyword:$("#addressMessage #carTitleBox input").val(),
        pk:thisthatsecond.pk,
        userCode:sessionStorage.getItem("token"),
        source:sessionStorage.getItem("source")
      }
      var listData=[];
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/address/getAddres",
          data:JSON.stringify(json),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 10000,
          success: function (getAddres) {
            if(getAddres.success=="1"){
              listData = getAddres.list;
              successCallback&&successCallback(listData);//成功回调
            }else{
              androidIos.second(getAddres.message);
              successCallback&&successCallback([]);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
              successCallback&&successCallback([]);
            }else if(status=='error'){
              androidIos.errorwife();
              successCallback&&successCallback([]);
            }
          }
        })
    },500)
  }
</script>

<style >
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #addressMessage .carTitleBox{
    width: 100%;
    position: absolute;
    top: 0;
    height: 1.25rem;
    background: white;
  }
  #addressMessage .carTitleback{
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
  #addressMessage #carTitleBox{
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
  #addressMessage .carTitleBox p {
    position: absolute;
    right:0;
    top:0;
    line-height: 1.25rem;
    color:#333;
    margin-right: 2%;
    font-size: 0.35rem;
  }
  #addressMessage .carTitleBox input{
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
  #addressMessage ul{
    width:100%;
    background: white;
    margin-top: 0.2rem;
  }
  #addressMessage li{
    width: 100%;
    border-bottom: 1px solid #dadada;
    position: relative;
  }
  #addressMessage .firstBox{
    width:55%;
    padding: 0.3rem 0 0.1rem 8%;
    float: left;
  }
  #addressMessage .secondBox{
    width:30%;
    right:0;
    position: absolute;
    margin-top: -0.25rem;
    top:50%;
  }
  #addressMessage .secondBox img{
    float: right;
    width:0.5rem;
    margin-right: 0.3rem;
  }
  #addressMessage .firstBox p,#addressMessage .secondBox p{
    font-size: 0.35rem;
    color:#333;
    line-height: 0.6rem;
  }
  #addressMessage .firstBox p span{
    font-size: 0.35rem;
    color:#333;
    margin-left: 0.1rem;
  }
  #addressMessage .firstBox h1{
    font-size: 0.3125rem;
    color:#666;
    line-height: 0.6rem;
  }
  #addressMessage .mescroll{
    position: fixed;
    top:1.21875rem;
    bottom: 1.2rem;
    height: auto;
    background-color: rgb(245, 245, 249)!important;
  }
  #addNew{
    width:100%;
    height: 1.2rem;
    color:white;
    background: #31b6e7;
    position: fixed;
    bottom:0;
    left:0;
    font-size: 0.4rem;
  }
</style>
