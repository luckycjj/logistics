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
                icon:"data:image/png;base64,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",
                tip:"暂无司机申请~"
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
    width: 100%;
    background: white;
    margin-bottom: 0.2rem;
  }
  #agreeList .firstBox{
     width:70%;
     float: left;
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
    width:30%;
    float: right;
  }
  #agreeList .secondBox button{
     width:100%;
     color:white;
     font-size: 0.375rem;
     line-height: 1.2rem;
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
