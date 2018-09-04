<template>
  <div id="agreeList">
    <div id="title" v-title data-title="申请列表"></div>
    <div id="mescroll" class="mescroll">
      <ul id="dataList" class="data-list">
        <li v-for="(item,index) in pdlist">
          <div class="firstBox" @click="lookagresRefuseMore(item)">
             <p>姓名：{{item.driverName}}</p>
             <h1>联系方式：{{item.mobile}}</h1>
          </div>
          <div class="secondBox gogogo" id="gogogo" >
             <button class="yes" @click="agresRefuse(1,index)">同意</button>
             <button class="no" @click="agresRefuse(2,index)">拒绝</button>
          </div>
          <div class="clearBoth"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  var thisThat;
  export default {
      name: "agree-list",
      data(){
        return{
          pdlist:[],
          number:"",
          size:"",
          refuseResule:""
        }
      },
      mounted: function () {
        var _this = this;
        androidIos.bridge(_this);
      },
      methods: {
        go:function () {
          var self = this;
          thisThat = self;
          self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
            up: {
              callback: self.upCallback, //上拉回调
              isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
              empty:{
                warpId:'mescroll',
                icon:require('../../images/nojilu.png'),
                tip:"暂无司机申请"
              }
            },
            down: {
              offset: 2.1 * $("html").css("font-size").replace("px", ""),
            }
          });
        },
        upCallback: function (page) {
          //联网加载数据
          var self = this;
          getListDataFromNet(page.num, page.size, function (curPageData) {
            //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

            //如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
            if (page.num == 1) self.pdlist = [];

            //更新列表数据
            self.pdlist = self.pdlist.concat(curPageData);
            self.mescroll.endSuccess(curPageData.length);

          }, function () {
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            self.mescroll.endErr();
          });
        },
        agresRefuse:function (type,number) {
          var _this = this;
          if(bomb.hasClass("gogogo","gogogo")){
            var message = type == 1 ? "同意" : "拒绝" ;
            var http = type == 1 ? "/carrier/acceptApplication" : "/carrier/rejectApplication";
            if(type == 1){
              androidIos.first( "确定" + message + "吗？");
            }else if(type == 2){
              androidIos.third("拒绝理由");
              var refuse = new LArea();
              refuse.init({
                'trigger': '#Z01',
                'valueTo': '#Z01',
                'keys': {
                  id: 'id',
                  name: 'name'
                },
                'type': 1,
                'data':[{
                  "code":"0",
                  "region":"无"
                },{
                  "code":"1",
                  "region":"司机不认识"
                },{
                  "code":"2",
                  "region":"司机违约次数太多"
                },{
                  "code":"3",
                  "region":"司机已解除劳动关系"
                }]
              });
              refuse.value = [0];
              refuse.addPointer = function (name) {
                name = JSON.parse(name);
                if(name.firstCode == "0"){
                  _this.refuseResule = "";
                  $("#Z01").html("请选择拒绝理由");
                  $("#Z01").css("color","#999");
                }else{
                  _this.refuseResule = name.firstVal;
                  $("#Z01").html(name.firstVal);
                  $("#Z01").css("color","#333");
                }
              }
            }
            $(".tanBox-yes").unbind('click').click(function(){
              if(type == 2 && _this.refuseResule == ""){
                bomb.first("请选择拒绝理由");
                return false;
              }
              bomb.removeClass("gogogo","gogogo");
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + http,
                data: JSON.stringify({
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source"),
                  pkDriver:_this.pdlist[number].pkDriver,
                  memo:type == 1 ? undefined : _this.refuseResule
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 10000,
                success: function (http) {
                  $(".tanBox-bigBox").remove();
                  bomb.addClass("gogogo","gogogo");
                  if(http.success == "1"){
                    _this.pdlist.splice(number,1);
                    _this.$cjj(message + "成功");
                  }else{
                    androidIos.second(http.message);
                  }
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                  bomb.addClass("gogogo","gogogo");
                  if(status=='timeout'){//超时,status还有success,error等值的情况
                    androidIos.second("当前状况下网络状态差，请检查网络！")
                  }else if(status=="error"){
                    androidIos.errorwife();
                  }
                }
              })
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/carrier/getDriverApplication",
                data: JSON.stringify({
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source"),
                  page:_this.size*_this.number,
                  size:1
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 10000,
                success: function (getDriverApplication) {
                  if(getDriverApplication.success == "1"){
                    if(getDriverApplication.list.length > 0 ){
                      _this.pdlist.push(getDriverApplication.list[0]);
                    }
                  }else{
                    androidIos.second(getDriverApplication.message);
                  }
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                  if(status=='timeout'){//超时,status还有success,error等值的情况
                    androidIos.second("当前状况下网络状态差，请检查网络！")
                  }else if(status=="error"){
                    androidIos.errorwife();
                  }
                }
              })
            });
          }else{
             bomb.first("请不要频繁点击")
          }


        },
        lookagresRefuseMore:function (item) {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({ path: '/agreeToRefuse/agreeMore',query:{"ph":item.mobile,"pk":item.pkDriver}});
        }
      }
    }
        function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
          //延时一秒,模拟联网
          setTimeout(function () {
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/carrier/getDriverApplication",
              data: JSON.stringify({
                   userCode:sessionStorage.getItem("token"),
                   source:sessionStorage.getItem("source"),
                   page:pageNum,
                   size:pageSize
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 10000,
              success: function (getDriverApplication) {
                if(getDriverApplication.success == "1"){
                  thisThat.number = pageNum;
                  thisThat.size = pageSize;
                  successCallback&&successCallback(getDriverApplication.list);
                }else{
                  androidIos.second(getDriverApplication.message);
                }
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  androidIos.second("当前状况下网络状态差，请检查网络！")
                }else if(status=="error"){
                  androidIos.errorwife();
                }
              }
            })
            //成功回调
          },500)
        }
</script>

<style>
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #agreeList ul{
    width:100%;
    margin-top: 0.2rem;
  }
  #agreeList li{
    width: 94%;
    background: white;
    /* margin-bottom: 0.2rem; */
    margin: 0 auto 0.2rem auto;
    border-radius: 0.2rem;
    box-shadow: 0 5px 10px #cecbcb;
    overflow: hidden;
  }
  #agreeList .firstBox{
     width:100%;
  }
  #agreeList .firstBox p,#agreeList .firstBox h1{
    font-size: 0.4rem;
    margin-left: 0.3rem;
    padding-top: 0.6rem;
    width:auto;
  }
  #agreeList .firstBox h1{
     padding-top: 0.2rem;
  }
  #agreeList .secondBox{
    width:100%;
    margin-top: 0.2rem;
  }
  #agreeList .secondBox button{
     width:50%;
     color:white;
     font-size: 0.375rem;
     line-height: 1.2rem;
    float: left;
  }
  #agreeList .no{
     background: #c7c7c7;
  }
  #agreeList .yes{
    background: #2c9cff;
  }
  #agreeList .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 0;
    height: auto;
    background-color: rgb(245, 245, 249)!important;
  }
</style>
