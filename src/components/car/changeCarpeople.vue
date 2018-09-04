<template>
  <div id="changeCarpeople">
    <div id="title" v-title data-title="司机列表"></div>
    <div id="mescroll" class="mescroll" :style="{bottom : manage && productPk == ''?'1.2rem':0}">
      <ul id="dataList" class="data-list">
        <li v-for="(item,index) in pdlist">
          <div id="peopleMessage">
            <div class="imgBoxOverFllow">
              <img :src="item.pic" :onerror="errorlogo" class="peopleImg">
            </div>
            <div class="peoplemessage">
              <p>{{item.name}}</p>
              <h1>驾龄：{{item.year}}年 </h1>
              <h1> 驾驶证等级：{{item.licType}}</h1>
            </div>
            <div v-if="!manage">
              <div class="tel replace" @click="change(item,1)" v-if="carPeoplePk!='' && !item.pkTrue">
                <img src="../../images/replace.png">
              </div>
              <div class="tel" @click="change(item,2)" v-if="carPeoplePk!='' && item.pkTrue">
                <img src="../../images/checked.png">
              </div>
              <div class="tel" @click="change(item,1)" v-if="carpk!= ''&&carPeoplePk==''">
                <img src="../../images/add.png">
              </div>
              <div class="tel" @click="telPhone(item.tel)">
                <img src="../../images/tel.png">
              </div>
            </div>
            <div v-if="manage">
              <div class="tel" @click="cleanLine(index)" >
                <img src="../../images/clean.png">
              </div>
              <div class="tel" @click="newdriver(item)">
                <img src="../../images/edit.png">
              </div>
            </div>
            <div class="clearBoth"></div>
          </div>
        </li>
      </ul>
    </div>
    <button v-if="productPk == ''" id="newCar" @click="newdriver()">新增司机</button>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import bridge from '../../js/bridge';
  import {bomb} from "../../js/zujian";
  var thisThat;
  export default {
    name: "changeCarpeople",
    data(){
      return{
        pdlist:[],
        carPeoplePk:"",
        carpk:"",
        productPk:"",
        size:"",
        number:"",
        manage:false,
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
        thisThat = this;
        self.carPeoplePk = self.$route.query.driverPk==undefined?"":self.$route.query.driverPk;
        self.productPk = sessionStorage.getItem("dispatchPK")==undefined?"":sessionStorage.getItem("dispatchPK");
        self.carpk =  self.$route.query.carPk==undefined?"":self.$route.query.carPk;
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            page: {
              size: 12, //每页数据的数量
            },
            empty:{
              warpId:'mescroll',
              icon:require('../../images/nojilu.png'),
              tip:"暂无司机~"
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", ""),
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
          self.number = page.num;
          self.size = page.size;
          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);
          self.$nextTick(function () {
            for(var x = (page.num - 1)*page.size ; x < ((page.num-1)*page.size +curPageData.length);x++){
              var className = document.getElementsByClassName("peopleImg")[x];
              className.onload = function () {
                for (var i = (page.num - 1) * page.size; i < ((page.num - 1) * page.size + curPageData.length); i++) {
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
            $("#manage span").unbind("click").click(function () {
              if(!self.manage){
                if(self.pdlist.length > 0){
                  $(this).text("取消");
                }
              }else{
                if(self.pdlist.length > 0){
                  $(this).text("管理");
                }
              }
                self.manage  = !self.manage;
            })
          })

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      telPhone:function(tel){
        bridge.invoke('callTelephone',tel);
      },
      change:function (item,type) {
        var _this = this;
        if(type == 2){
           item = {
              carPeoplePk:"",
              name:"",
              pic:"",
              pkTrue:"",
              tel:"",
              year:"",
           }
        }
        item = JSON.stringify(item);
        if(_this.$route.query.driverType == '0'){
          sessionStorage.setItem("changeCarpeople",item);
        }else{
          sessionStorage.setItem("changeCarFupeople",item);
        }
        androidIos.gobackFrom(_this);
      },
      cleanLine:function (index) {
        var _this = this;
        androidIos.first("确定删除吗？");
        $("#tanBox-yes").unbind("click").click(function () {
          $(".tanBox-bigBox").remove();
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/driver/deleteDriver",
            data:JSON.stringify({
              pk:_this.pdlist[index].carPeoplePk,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            async:false,
            success: function (deleteDriver) {
              if(deleteDriver.success=="1"){
                _this.pdlist.splice(index,1);
                _this.$cjj("删除成功");
              }else{
                androidIos.second(deleteDriver.message)
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
            _this.$nextTick(function () {
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/driver/getDriverPage",
                data: JSON.stringify({
                  pk: _this.$route.query.driverPk,
                  page:_this.size*_this.number,
                  size:1,
                  userCode: sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source")
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 30000,
                async:false,
                success: function (getDriverPage) {
                  if(getDriverPage.success=="1"){
                    var listData=[];
                    for(var i = 0 ; i < getDriverPage.list.length ; i++){
                      var list = getDriverPage.list[i];
                      var pkTrue = false;
                      if(list.pkDriver == thisThat.$route.query.driverPk){
                        pkTrue = true;
                      }
                      var json = {
                        pkTrue:pkTrue,
                        carPeoplePk:list.pkDriver,
                        tel:list.mobile,
                        name:list.driverName,
                        year:list.driverAge*1<1?"小于1":list.driverAge*1,
                        pic:list.driverImg,
                      }
                      listData.push(json)
                    }
                    if(listData.length>0){
                      _this.pdlist.push(listData[0]);
                      _this.$nextTick(function () {
                        for(var x = _this.size*_this.number ; x < _this.size*_this.number + 1;x++){
                          var className = document.getElementsByClassName("peopleImg")[x-1];
                          className.onload = function () {
                            for(var i = _this.size*_this.number ; i < _this.size*_this.number + 1;i++){
                              var heightImg = $(".peopleImg").eq(i-1).height();
                              var heightBox = $(".imgBoxOverFllow").eq(i-1).height();
                              var widthBox = $(".imgBoxOverFllow").eq(i-1).width();
                              var htmlSize = $("html").css("fontSize").replace("px", "");
                              if (heightImg > heightBox) {
                                $(".peopleImg").eq(i-1).css("marginTop", (heightBox - heightImg) / 2 / htmlSize + "rem");
                              } else {
                                $(".peopleImg").eq(i-1).height(heightBox / htmlSize + "rem");
                                $(".peopleImg").eq(i-1).width("auto");
                                var widthImg = $(".peopleImg").eq(i-1).width();
                                $(".peopleImg").eq(i-1).css("marginLeft", (widthBox - widthImg) / 2 / htmlSize + "rem");
                              }
                            }
                          }
                        }
                      })
                    }
                  }else{
                    androidIos.second(getDriverPage.message)
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

        })
      },
      newdriver:function (item) {
        var _this = this;
        item = JSON.stringify(item);
        if(item != undefined){
          sessionStorage.setItem("driver",item);
        }
        androidIos.addPageList();
        _this.$router.push({ path: '/car/newdriver'});
      }
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/driver/getDriverPage",
        data: JSON.stringify({
          pk: thisThat.$route.query.driverPk,
          page:pageNum,
          size:pageSize,
          userCode: sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source")
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        success: function (getDriverPage) {
          var listData = [];
          if(getDriverPage.success == "1" || getDriverPage.success == ""){
            for(var i = 0 ; i < getDriverPage.list.length ; i++){
              var list = getDriverPage.list[i];
              if(list.pkDriver == thisThat.$route.query.driverZ ){
                continue;
              }
              var pkTrue = false;
              if(list.pkDriver == thisThat.$route.query.driverPk){
                 pkTrue = true;
              }
              var json = {
                pkTrue:pkTrue,
                carPeoplePk:list.pkDriver,
                tel:list.mobile,
                name:list.driverName,
                licType:list.licType == "" || list.licType == undefined || list.licType == null ? "暂无" : list.licType + "级别",
                year:list.driverAge*1<1?"小于1":list.driverAge*1,
                pic:list.driverImg,
              }
              listData.push(json)
            }
            successCallback&&successCallback(listData);//成功回调
          }else{
             androidIos.second(getDriverPage.message);
            successCallback&&successCallback(listData);//成功回调
          }
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
          var listData = thisThat.pdlist;
          if(status=='timeout'){//超时,status还有success,error等值的情况
            androidIos.second("网络请求超时");
            successCallback&&successCallback(listData);//成功回调
          }else if(status=='error'){
            androidIos.errorwife();
            successCallback&&successCallback(listData);//成功回调
          }
        }
      })
    },500)
  }
</script>

<style scoped>
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #changeCarpeople ul{
    width:100%;
    background: white;
    margin-top: 0.2rem;
  }
  #changeCarpeople #newCar{
    width:100%;
    height: 1.2rem;
    color:white;
    background: #31b6e7;
    position: fixed;
    bottom:0;
    left:0;
    font-size: 0.4rem;
  }
  #changeCarpeople li{
    width: 100%;
    border-bottom: 1px solid #dadada;
  }
  #changeCarpeople #peopleMessage{
    width:94%;
    padding:0.2rem 3%;
    background: white;
    margin-top: 0.2rem;
  }
  #changeCarpeople #peopleMessage .peopleImg{
    width:100%;
  }
  #changeCarpeople #peopleMessage .peoplemessage{
    float: left;
    margin-left: 0.3rem;
    margin-top: 0.1rem;
  }
  #changeCarpeople #peopleMessage .peoplemessage p{
    font-size: 0.3125rem;
    color:#333;
  }
  #changeCarpeople #peopleMessage .peoplemessage h1{
    font-size: 0.3125rem;
    color:#999;
  }
  #changeCarpeople  #peopleMessage .tel{
    width:1.2rem;
    float: right;
    margin-top: 0.3rem;
  }
  #changeCarpeople #peopleMessage .tel img{
    display: block;
    margin: 0 auto;
    width:0.6rem;
  }
  #changeCarpeople .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 0;
    height: auto;
  }
  #changeCarpeople .imgBoxOverFllow{
    width:1.2rem;
    height:1.2rem;
    overflow: hidden;
    float: left;
    border-radius: 50%;
    line-height: 1.2rem
  }
  #changeCarpeople .imgBoxOverFllow img{
    display: inline-block;
    vertical-align: middle;
  }
</style>
