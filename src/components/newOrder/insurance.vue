<template>
  <div id="insurance">
    <div id="title" v-title data-title="保险"></div>
    <div id="mescroll" class="mescroll">
      <ul id="dataList" class="data-list">
        <li v-for="item in pdlist" @click="chooseLine(item)">
          <span class="name">{{item.name}}</span>
          <span class="price">¥{{item.price}}/次</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  var pdlist1 = [{
    name:"保险名称1",
    price:"200"
  },{
    name:"保险名称2",
    price:"200"
  },{
    name:"保险名称3",
    price:"200"
  },{
    name:"保险名称4",
    price:"200"
  },{
    name:"保险名称5",
    price:"200"
  }]
  export default {
    name: "insurance",
    data(){
      return{
        pdlist:[]
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
              tip:"暂无保险~"
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
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      chooseLine:function (item) {
        var _this = this;
        item = JSON.stringify(item);
        sessionStorage.setItem("insurance",item);
        androidIos.gobackFrom(_this);
      }
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      var data=pdlist1; // 模拟数据: ../res/pdlist1.js
      var listData=[];//模拟分页数据
      for (var i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
        if(i==data.length) break;
        listData.push(data[i]);
      }
      successCallback&&successCallback(listData);//成功回调
    },500)
  }
</script>

<style >
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #insurance ul{
    width:100%;
    background: white;
    margin-top: 0.2rem;
  }
  #insurance li{
    width: 100%;
    border-bottom: 1px solid #dadada;
  }
 #insurance .name{
    font-size: 0.35rem;
   line-height: 1rem;
   color:#333;
   margin-left: 5%;
 }
  #insurance .price{
    font-size: 0.35rem;
    line-height: 1rem;
    color:#999;
    margin-left:0.5rem;
  }
  #insurance .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 0;
    height: auto;
  }
</style>
