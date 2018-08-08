<template>
  <div id="editSite">
    <div id="title" v-title data-title="确认拆段日期" ></div>
    <p id="titleTime">订单时间：  {{pickTime}} - {{arrivalTime}}</p>
    <ul id="editSiteBox">
      <li v-for="(item,index) in listBox.list">
        <div class="firstBox">
          <p>{{item.name}}</p>
          <h1>{{item.people}}&nbsp;{{item.phone}}</h1>
          <h1>{{item.address}}</h1>
          <h1 v-if="item.startTime != '' ">到达时间：{{item.startTime}}</h1>
          <h1 v-if="item.endTime != '' ">离开时间：{{item.endTime}}</h1>
        </div>
        <div class="second" @click="chooseTime(index)">
            选择时间
        </div>
        <div class="clearBoth"></div>
      </li>
    </ul>
    <button id="push" @click="pushChoose()">确认</button>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "siteSure",
       data(){
           return{
              listBox:{
                list:[]
              },
              pickTime:"",
              arrivalTime:""
           }
       },
      watch:{
        listBox:{
          handler:function(val,oldval){
            var _this = this;
            for(var i=0;i<_this.listBox.list.length;i++) {
              if(_this.listBox.list[i].startTime==""||_this.listBox.list[i].endTime==""){
                bomb.removeClass("push","colorfull");
                return false;
              }
            }
            bomb.addClass("push","colorfull");
          },
          deep:true
        }
      },
      mounted:function(){
            var _this = this;
            androidIos.bridge(_this);

      },
       methods:{
          go:function () {
            var _this = this;
            var siteSure = sessionStorage.getItem("siteSure");
            var timeSite = sessionStorage.getItem("timeSite");
            var timeSure = sessionStorage.getItem("timeSure");
            var lastSure = sessionStorage.getItem("lastSure");
            var Sitechoosesite = sessionStorage.getItem("Sitechoosesite");
            if(siteSure!=undefined) {
              _this.listBox.list = JSON.parse(siteSure);
              for (var i = 0; i < _this.listBox.list.length; i++) {
                _this.listBox.list[i].startTime = "";
                _this.listBox.list[i].endTime = "";
                _this.listBox.list[i].timeF = 0;
                _this.listBox.list[i].timeS = 0;
              }
              /*sessionStorage.removeItem("siteSure");*/
            }
            if(Sitechoosesite!=undefined){
              Sitechoosesite = JSON.parse(Sitechoosesite);
              _this.pickTime = Sitechoosesite.startTime;
              _this.arrivalTime =Sitechoosesite.endTime;
            }
            if(timeSite!=undefined){
              timeSite = JSON.parse(timeSite);
              _this.listBox = timeSite.list;
              sessionStorage.removeItem("timeSite");
            }
            if(lastSure!=undefined){
              lastSure = JSON.parse(lastSure);
              _this.listBox.list = lastSure;
            }
            if(timeSure!=undefined){
              timeSure = JSON.parse(timeSure);
              _this.listBox.list[timeSure.number].startTime = timeSure.message.timeBeforeS + ' ' + timeSure.message.timeBeforeF;
              _this.listBox.list[timeSure.number].endTime = timeSure.message.timeAfterS + ' ' + timeSure.message.timeAfterF;
              _this.listBox.list[timeSure.number].timeF = new Date(_this.listBox.list[timeSure.number].startTime.replace('-','/').replace('-','/')).getTime();
              _this.listBox.list[timeSure.number].timeS = new Date(_this.listBox.list[timeSure.number].endTime.replace('-','/').replace('-','/')).getTime();
              sessionStorage.removeItem("timeSure");
            }
            var asc = function(x,y){
              return (x['timeF'] > y['timeF']) ? 1 : -1
            }
            _this.listBox.list.sort(asc);
          },
         chooseTime:function (index) {
           var _this = this;
           var json = {
                number:index,
                list:_this.listBox
           }
           sessionStorage.setItem("timeSite",JSON.stringify(json));
           androidIos.addPageList();
           _this.$router.push({ path: '/site/timeSite'});
         },
         pushChoose:function () {
           var _this = this;
           if(bomb.hasClass("push","colorfull")){
              var pick = new Date(_this.pickTime.replace('-','/').replace('-','/')).getTime();
              var arrival = new Date(_this.arrivalTime.replace('-','/').replace('-','/')).getTime();
              for(var i =0;i<_this.listBox.list.length;i++){
                 if(i == 0){
                    if(pick/_this.listBox.list[i].timeF > 1){
                        androidIos.second("请在" + _this.listBox.list[i].name + "站点处选择正确的到达离开时间");
                        return false;
                    }
                 }else{
                    if(_this.listBox.list[i-1].timeS / _this.listBox.list[i].timeF > 1){
                      androidIos.second("请在" + _this.listBox.list[i].name + "站点处选择正确的到达离开时间");
                      return false;
                    }
                 }
                 if(i == (_this.listBox.list.length-1)){
                   if(_this.listBox.list[i].timeS / arrival > 1){
                     androidIos.second("请在" + _this.listBox.list[i].name + "站点处选择正确的到达离开时间");
                     return false;
                   }
                 }
              }
             androidIos.addPageList();
             sessionStorage.setItem("lastSure",JSON.stringify(_this.listBox.list));
             _this.$router.push({ path: '/site/lastSure'});
           }else{
             for(var i=0;i<_this.listBox.list.length;i++) {
               if(_this.listBox.list[i].startTime==""||_this.listBox.list[i].endTime==""){
                 bomb.first("请选择" + _this.listBox.list[i].name + "站点的到达离开时间");
                 break;
               }
             }
           }
         }
       }
    }
</script>

<style scoped>
  #titleTime{
    width:92%;
    margin:0 auto;
    display: block;
    line-height:1rem;
    font-size: 0.3125rem;
    color:#333;
  }
  #editSite ul{
    width:100%;
    margin-top: 0.2rem;
    position: fixed;
    top:2rem;
    bottom: 1.2rem;
    height: auto;
    overflow: scroll;
  }
  #editSite li{
    width: 93%;
    margin: 0 auto 0.2rem auto;
    background: white;
    border-radius: 0.2rem;
    box-shadow: 0rem 0.1rem 0.4rem #c3c3c3;
    overflow: hidden;
  }
  #editSite li .second{
    width:100%;
    text-align: center;
    font-size: 0.35rem;
    background: #3399FF;
    line-height: 1rem;
    color:white;
    letter-spacing: 2px;
  }
  #editSite .firstBox{
    width:90%;
    padding: 0.3rem 5%;
  }
  #editSite .firstBox p,#editSite .secondBox p{
    font-size: 0.375rem;
    color:#333;
    line-height: 0.8rem;
  }
  #editSite .firstBox h1{
    font-size: 0.3125rem;
    color:#999;
    line-height: 0.6rem;
  }
  #editSite .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 1.2rem;
    height: auto;
  }
  #editSite button{
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
  #editSite .colorfull{
    background: #3399FF!important;
  }
</style>
