<template>
  <div id="addressMessage">
    <div id="title" v-title data-title="发货地址" v-if="addressType == 1"></div>
    <div id="title" v-title data-title="收货地址" v-if="addressType == 3"></div>
    <div id="carTitleBox"   @click="event($event)">
      <div class="carTitleBox">
        <div class="carTitleback" @click="goback()"></div>
        <input type="tel" placeholder="请输入电话号码" maxlength="11" id="carNumber" v-model="address"  @focus="aaa()">
        <p @click="sousuo()" id="sousuo">管理</p>
      </div>
    </div>
    <div id="mescroll" class="mescroll">
      <ul id="dataList" class="data-list">
        <li v-for="(item,index) in pdlist" style="overflow: hidden">
          <div class="moveDiv" style="position: relative">
            <div  @click="chooseLine(item)" style="width:10rem;">
            <div class="firstBox">
              <p><span style="color:#31b6e7" v-if="item.ifDefault == '1'">[默认]</span>{{item.contact}}<span>{{item.mobile}}</span></p>
              <h1>{{item.province}}-{{item.city}}-{{item.area}}&nbsp;&nbsp;{{item.detailAddr}}</h1>
            </div>
              <div class="clearBoth"></div>
            <div class="secondBox">
              <img src="../../images/edit.png" @click="editLine(item)" v-if="manage">
              <img src="../../images/clean.png" @click="cleanLine(index)" v-if="(pk != '' && manage && item.checked == '0') || (pk == '' && manage)">
              <img src="../../images/checked.png"  v-if="!manage && item.checked == '1'">
              <div class="clearBoth"></div>
            </div>
            </div>
            <div class="thirdBox" v-if="addressType == 1">
              <p v-if="item.ifDefault==0" @click="moren(1,index)">设置默认</p>
              <p v-else-if="item.ifDefault==1" @click="moren(0,index)">取消默认</p>
            </div>
            <div class="clearBoth"></div>
          </div>
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
        manage:false,
        addressType:"",
        total:100,
      }
    },
    mounted:function () {
      var _this = this;
      _this.addressType = _this.$route.query.type;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var self = this;
        thisthatsecond = self;
        var type = self.$route.query.type;
        if(type!=undefined){
          if(type == "1"){
            var startAddressmessage = sessionStorage.getItem("startAddressmessage");
            if(startAddressmessage!= undefined){
              self.pk =JSON.parse(startAddressmessage).pk;
            }
          }else if(type == "3"){
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
              icon:require('../../images/nojilu.png'),
              tip:"暂无地址~"
            },
            page: {
              num: 0, //当前页码,默认0,回调之前会加1,即callback(page)会从1开始
              size: 15, //每页数据的数量
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", ""),
          }
        });
      },
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
      moren:function (type,number) {
        var _this = this;
        var json ={
          pkAddress:_this.pdlist[number].pkAddress,
          addrName:_this.pdlist[number].addrName,
          mobile:_this.pdlist[number].mobile,
          detailAddr:_this.pdlist[number].detailAddr,
          province:_this.pdlist[number].province,
          city:_this.pdlist[number].city,
          area:_this.pdlist[number].area,
          contact:_this.pdlist[number].contact,
          checked:_this.pdlist[number].checked,
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source"),
          type:_this.$route.query.type,
          ifDefault:type,
        }
        var newtype = type == "1" ? "设置" : "取消" ;
        androidIos.loading("正在" + newtype);
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/address/updateAddres",
          data:JSON.stringify(json),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 10000,
          success: function (addAddress) {
            $("#common-blackBox").remove();
            if(addAddress.success=="1"){
               _this.$cjj(newtype + "成功");
               if(type == 1){
                 for(var i = 0 ;i < _this.pdlist.length;i++){
                   _this.pdlist[i].ifDefault = 0;
                 }
               }
              _this.pdlist[number].ifDefault = type;
            }else{
              androidIos.second(addAddress.message);
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
            if(self.addressType == "1"){
              var lines = $(".moveDiv");
              var len = lines.length;
              var lastX, lastXForMobile;
              // 用于记录被按下的对象
              var pressedObj;  // 当前左滑的对象
              var lastLeftObj; // 上一个左滑的对象
              // 用于记录按下的点
              var start;
              // 网在移动端运行时的监听
              for (var i = 0; i < len; ++i) {
                lines[i].addEventListener('touchstart', function(e){
                  lastXForMobile = e.changedTouches[0].pageX;
                  pressedObj = this; // 记录被按下的对象

                  // 记录开始按下时的点
                  var touches = event.touches[0];
                  start = {
                    x: touches.pageX, // 横坐标
                    y: touches.pageY  // 纵坐标
                  };
                });
                lines[i].addEventListener('touchmove',function(e){
                  // 计算划动过程中x和y的变化量
                  var touches = event.touches[0];
                  var delta = {
                    x: touches.pageX - start.x,
                    y: touches.pageY - start.y
                  };
                  if (Math.abs(delta.x) > Math.abs(delta.y)) {
                    event.preventDefault();
                  }
                });
                lines[i].addEventListener('touchend', function(e){
                  if (lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
                    $(lastLeftObj).animate({left:"0"}, 200); // 右滑
                    lastLeftObj = null; // 清空上一个左滑的对象
                  }
                  var diffX = e.changedTouches[0].pageX - lastXForMobile;
                  if (diffX < -50) {
                    $(pressedObj).animate({left:"-2rem"}, 200); // 左滑
                    lastLeftObj && lastLeftObj != pressedObj &&
                    $(lastLeftObj).animate({left:"0"}, 200); // 已经左滑状态的按钮右滑
                    lastLeftObj = pressedObj; // 记录上一个左滑的对象
                  } else if (diffX > 50) {
                    if (pressedObj == lastLeftObj) {
                      $(pressedObj).animate({left:"0"}, 200); // 右滑
                      lastLeftObj = null; // 清空上一个左滑的对象
                    }
                  }
                });
              }
            }
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
        _this.$router.push({ path: '/newOrder/chooseStart',query:{type:_this.$route.query.type}});
      },
      chooseLine:function (item) {
        var _this = this;
        var type = _this.$route.query.type;
        var newOrder = sessionStorage.getItem("newOrder");
        if(!_this.manage && type != undefined && newOrder != undefined){
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
          }else if(type == "3"){
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
              source:sessionStorage.getItem("source"),
              type:thisthatsecond.$route.query.type
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
              source:sessionStorage.getItem("source"),
              type:thisthatsecond.$route.query.type
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
        _this.$router.push({ path: '/newOrder/chooseStart',query:{pk:pk.pkAddress,type:_this.$route.query.type}});
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
        source:sessionStorage.getItem("source"),
        type:thisthatsecond.$route.query.type
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
              for(var i = 0 ; i < getAddres.list.length;i++){
                 if(getAddres.list[i].checked == 1){
                   var newOrder = sessionStorage.getItem("newOrder");
                   if(newOrder != undefined){
                     newOrder = JSON.parse(newOrder);
                     if(thisthatsecond.$route.query.type == 1){
                       newOrder.startAddress = {
                         address: getAddres.list[i].detailAddr,
                         city: getAddres.list[i].province + "-" + getAddres.list[i].city + "-" + getAddres.list[i].area,
                         company:  getAddres.list[i].addrName,
                         people:  getAddres.list[i].contact,
                         pk:  getAddres.list[i].pkAddress,
                         tel:  getAddres.list[i].mobile,
                       }
                     }else if(thisthatsecond.$route.query.type == 3){
                       newOrder.endAddress = {
                         address: getAddres.list[i].detailAddr,
                         city: getAddres.list[i].province + "-" + getAddres.list[i].city + "-" + getAddres.list[i].area,
                         company:  getAddres.list[i].addrName,
                         people:  getAddres.list[i].contact,
                         pk:  getAddres.list[i].pkAddress,
                         tel:  getAddres.list[i].mobile,
                       }
                     }
                     sessionStorage.setItem("newOrder",JSON.stringify(newOrder));
                   }
                   break;
                 }
              }
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
    top:1.3rem;
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
  #addressMessage .thirdBox{
    position:absolute;
    right:-2rem;
    top: 0;
    width:2rem;
    height: 100%;
    background: #2c9cff;
  }
  #addressMessage .thirdBox p{
    color:white;
    font-size: 0.375rem;
    text-align: center;
    position: absolute;
    top:50%;
    margin-top: -0.5rem;
    line-height: 1rem;
    text-align: center;
    width: 100%;
  }
</style>
