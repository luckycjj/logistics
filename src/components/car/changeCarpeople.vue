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
              <h1>驾龄：{{item.year}}年</h1>
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
              tip:"暂无司机~",
              warpId:'mescroll',
              icon:"data:image/png;base64,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",
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
