<template>
  <div id="chooseSite">
    <div id="title" v-title data-title="站点"></div>
    <div id="mescroll" class="mescroll" :style="{bottom:!chooseManage && pk==''?'0':'1.2rem'}">
      <ul id="dataList" class="data-list">
        <li v-for="(item,index) in pdlist" @click="chooseLine(index)">
          <div class="firstBox">
            <p>{{item.name}}</p>
            <h1>{{item.people}}&nbsp;{{item.phone}}</h1>
            <h1>{{item.address}}</h1>
          </div>
          <div class="second">
            <img src="../../images/checked.png" v-if="item.choose && !chooseManage">
            <img src="../../images/edit.png" @click="edit(item)" v-if="chooseManage">
            <img src="../../images/clean.png" @click="clean(index)" v-if="chooseManage">
            <div class="clearBoth"></div>
          </div>
          <div class="clearBoth"></div>
        </li>
      </ul>
    </div>
    <button id="push" @click="pushChoose()" v-if="!chooseManage && pk!=''">确认选择</button>
    <button id="push" class="colorfull" @click="newSite()" v-if="chooseManage">新建站点</button>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  var thisThat;
  export default {
    name: "chooseSite",
    data(){
      return{
        pdlist:[],
        chooseManage:false,
        size:10,
        page:1,
        pk:"",
      }
    },
    watch:{
      pdlist:{
        handler:function(val,oldval){
          var _this = this;
          if(!_this.chooseManage){
            for(var i=0;i<_this.pdlist.length;i++) {
              if(_this.pdlist[i].choose){
                bomb.addClass("push","colorfull");
                return false;
              }
            }
            bomb.removeClass("push","colorfull");
          }
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
        sessionStorage.removeItem("lastSure");
        self.pk = sessionStorage.getItem("dispatchPK")==undefined?'':sessionStorage.getItem("dispatchPK");
        $(document).on("click","#manage span",function () {
          self.chooseManage = !self.chooseManage;
          if(self.chooseManage){
            $(this).text("取消");
          }else{
            $(this).text("管理");
            self.$nextTick(function () {
              for(var i=0;i<self.pdlist.length;i++) {
                if(self.pdlist[i].choose){
                  bomb.addClass("push","colorfull");
                  return false;
                }
              }
              bomb.removeClass("push","colorfull");
            })
          }
        });
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            empty:{
              warpId:'mescroll',
              icon:require('../../images/nojilu.png'),
              tip:"暂无站点~"
            }
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
          self.number = page.num;
          self.size = page.size;
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      chooseLine:function (index) {
          var _this = this;
          if(!_this.chooseManage){
            var x =0;
            for(var i=0;i<_this.pdlist.length;i++){
              if(_this.pdlist[i].choose){
                x++;
              }
            }
            if(x < 3){
              _this.pdlist[index].choose = !_this.pdlist[index].choose;
            }else{
              if(!_this.pdlist[index].choose){
                androidIos.second("最多拆段三次！");
              }else{
                _this.pdlist[index].choose = false;
              }
            }
          }
      },
      pushChoose:function () {
        var _this = this;
        if(bomb.hasClass("push","colorfull")){
          androidIos.addPageList();
          var json = [];
          for(var i=0;i<_this.pdlist.length;i++){
             if(_this.pdlist[i].choose){
                json.push(_this.pdlist[i]);
             }
          }
          sessionStorage.setItem("siteSure",JSON.stringify(json));
          _this.$router.push({ path: '/site/siteSure'});
        }
      },
      edit:function (item) {
        var _this = this;
        androidIos.addPageList();
        sessionStorage.setItem("editSite",JSON.stringify(item));
        _this.$router.push({ path: '/site/editSite'});
      },
      newSite:function () {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/site/editSite'});
      },
      clean:function (index) {
        var _this = this;
        androidIos.first("确认删除吗？");
        $("#tanBox-yes").unbind('click').click(function(){
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
            timeout: 30000,
            async:false,
            success: function (deleteAddres) {
              if(deleteAddres.success=="1"){
                _this.pdlist.splice(index,1);
                androidIos.firstblack("删除成功");
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
            url: androidIos.ajaxHttp()+"/address/getCarrAddres",
            data:JSON.stringify({
              page:_this.size*_this.number,
              size:1,
              keyword:"",
              pk:"",
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            async:false,
            success: function (getAddres) {
              if(getAddres.success=="1"){
                if(getAddres.list.length>0){
                  var json = {
                    name:getAddres.list[0].province+"-"+getAddres.list[0].city+"-"+getAddres.list[0].area,
                    people:getAddres.list[0].contact,
                    phone:getAddres.list[0].mobile,
                    address:getAddres.list[0].detailAddr,
                    pkAddress:getAddres.list[0].pkAddress,
                    company:getAddres.list[0].addrName,
                    choose:false,
                  }
                  var siteSure = sessionStorage.getItem("siteSure");
                  if(siteSure != undefined){
                    siteSure = JSON.parse(siteSure);
                    for(var x = 0 ; x<siteSure.length;x++){
                      if(siteSure[x].pkAddress == json.pkAddress){
                        json.choose = true;
                      }
                    }
                  }
                  if(json.length>0) {
                    _this.pdlist.push(json)
                  }
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
        });
      }
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      var json = {
        page:pageNum,
        size:pageSize,
        keyword:"",
        pk:"",
        userCode:sessionStorage.getItem("token"),
        source:sessionStorage.getItem("source")
      }
      var listData=[];
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp()+"/address/getCarrAddres",
        data:JSON.stringify(json),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        success: function (getAddres) {
          if(getAddres.success=="1"){
            for(var i =0 ;i<getAddres.list.length;i++){
              var list = getAddres.list[i];
              var json = {
                name:list.province+"-"+list.city+"-"+list.area,
                people:list.contact,
                phone:list.mobile,
                address:list.detailAddr,
                pkAddress:list.pkAddress,
                company:list.addrName,
                choose:false,
              };
              var siteSure = sessionStorage.getItem("siteSure");
              if(siteSure != undefined){
                siteSure = JSON.parse(siteSure);
                for(var x = 0 ; x<siteSure.length;x++){
                   if(siteSure[x].pkAddress == json.pkAddress){
                     json.choose = true;
                   }
                }
              }
              listData.push(json);
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
  #chooseSite ul{
    width:100%;
    margin-top: 0.2rem;
  }
  #chooseSite li{
    width: 92%;
    background: white;
    margin: 0 auto 0.2rem auto;
    display: block;
    position: relative;
    border-radius: 0.2rem;
    overflow: hidden;
    box-shadow: 0 0.1rem 0.2rem #d4d4d4;
  }
  #chooseSite .second{
    float: right;
    position: absolute;
    right:0;
    top:50%;
    margin-top: -0.3rem;
  }
  #chooseSite .second img{
    float: left;
    width: 0.6rem;
    margin-right: 0.3rem;
  }
  #chooseSite .firstBox{
    width:60%;
    padding: 0.3rem 5%;
    float: left;
  }
  #chooseSite .firstBox p,#chooseSite .secondBox p{
    font-size: 0.375rem;
    color:#333;
    line-height: 0.8rem;
  }
  #chooseSite .firstBox h1{
    font-size: 0.3125rem;
    color:#666;
    line-height: 0.6rem;
  }
  #chooseSite .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 1.2rem;
    height: auto;
  }
  #chooseSite button{
    position: fixed;
    bottom:0;
    width:100%;
    line-height: 1.2rem;
    background: #dbdbdb;
    color:white;
    display: block;
    font-size: 0.38rem;
    letter-spacing: 0.0625rem;
  }
  #chooseSite .colorfull{
    background: #3399FF!important;
  }
</style>
