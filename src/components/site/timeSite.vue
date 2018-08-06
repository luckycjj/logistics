<template>
  <div id="timeSite">
    <div id="title" v-title data-title="填写日期" ></div>
    <div id="time" class="label">
      <div class="lablebox">
        <span>到达时间</span>
        <input type="text" style="width:18%;" name="USER_AGE" id="USER_AGE" readonly class="input" placeholder="请选择时分" v-model="both.timeBeforeF"/>
        <input type="text" style="width:25%;" name="USER_AGE" id="USER_AGES" readonly class="input" placeholder="请选择年月日" v-model="both.timeBeforeS"/>
        <div class="clearBoth"></div>
      </div>
      <div class="lablebox borderno">
        <span>离开时间</span>
        <input type="text" style="width:18%;" name="USER_AGES" id="USER_AGET" readonly class="input" placeholder="请选择时分" v-model="both.timeAfterF"/>
        <input type="text" style="width:25%;" name="USER_AGES" id="USER_AGEFo" readonly class="input" placeholder="请选择年月日" v-model="both.timeAfterS"/>
        <div class="clearBoth"></div>
      </div>
    </div>
    <button @click="timego()"  id="push" >确认时间</button>
  </div>
</template>

<script>
  import "../../js/mobiscroll_date"
  import  "../../js/mobiscroll";
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  export default {
        name: "timeSite",
      data(){
          return{
             both:{
               timeBeforeF:"",
               timeBeforeS:"",
               timeAfterF:"",
               timeAfterS:""
             }
          }
      },
      watch:{
        both:{
          handler:function(val,oldval){
            var _this = this;
            if(_this.both.timeBeforeF!=""&&_this.both.timeBeforeS!=""&&_this.both.timeAfterF!=""&&_this.both.timeAfterS!=""){
                bomb.addClass("push","colorfull");
                return false;
            }else{
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
             var _this = this;
             var newTimeCjj = new Date();
             var yearCjj = newTimeCjj.getFullYear();
             var monthCjj = newTimeCjj.getMonth()+1;
             var dateCjj = newTimeCjj.getDate();
             var hourCjj = newTimeCjj.getHours();
             var minCjj = newTimeCjj.getMinutes();
             var secCjj = newTimeCjj.getSeconds();
             var hourCjjS = hourCjj+1;
             var newDateCjj = new Date(yearCjj+"/"+monthCjj+"/"+dateCjj+" "+hourCjjS+":"+minCjj+":"+secCjj);
             var newDataCjj = new Date((new Date()).getTime()+24*60*60*1000);
             var timeSite = JSON.parse(sessionStorage.getItem("timeSite"));
             if(timeSite.list.list[timeSite.number].startTime == ""){
               _this.both.timeBeforeS = _this.ten(newDateCjj.getFullYear())+"-"+ _this.ten((newDateCjj.getMonth()+1))+"-"+_this.ten(newDateCjj.getDate());
               _this.both.timeBeforeF = _this.ten(newDateCjj.getHours())+":"+_this.ten(newDateCjj.getMinutes())+":"+_this.ten(newDateCjj.getSeconds());
               _this.both.timeAfterS = _this.ten(newDataCjj.getFullYear())+"-"+ _this.ten((newDataCjj.getMonth()+1))+"-"+_this.ten(newDataCjj.getDate());
               _this.both.timeAfterF = "08:00:00";
             }else{
               _this.both.timeBeforeS = timeSite.list.list[timeSite.number].startTime.split(" ")[0];
               _this.both.timeBeforeF = timeSite.list.list[timeSite.number].startTime.split(" ")[1];
               _this.both.timeAfterS = timeSite.list.list[timeSite.number].endTime.split(" ")[0];
               _this.both.timeAfterF = timeSite.list.list[timeSite.number].endTime.split(" ")[1];
             }
             var currYear = (new Date()).getFullYear();
             var opt={};
             opt.date = {preset : 'date'};
             opt.datetime = {preset : 'datetime'};
             opt.time = {preset : 'time'};
             opt.default = {
               theme: 'android-ics light', //皮肤样式
               display: 'bottom', //显示方式
               mode: 'scroller', //日期选择模式
               dateFormat: 'yy-mm-dd',
               timeFormat: 'HH:ii',
               lang: 'zh',
               showNow: true,
               nowText: "今天",
               startYear: currYear, //开始年份
               endYear: currYear + 20 ,//结束年份
               onSelect: function (valueText, inst) {//选择时事件（点击确定后），valueText 为选择的时间，
                 var dateF = "";
                 if(inst.settings["0"]==1){
                   dateF = new Date(inst.val.replace(/\-/g, "\/"));
                 }else if(inst.settings["0"]==2){
                   dateF = new Date($("#USER_AGES").val().replace(/\-/g, "\/")+" "+inst.val);
                 }else if(inst.settings["0"]==3){
                   dateF = new Date(inst.val.replace(/\-/g, "\/"));
                 }else if(inst.settings["0"]==4){
                   dateF = new Date($("#USER_AGEFo").val().replace(/\-/g, "\/")+" "+inst.val);
                 }
                 var dateS=""
                 if(inst.settings["0"]==1){
                   dateS = new Date(new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate());
                 }else if(inst.settings["0"]==2){
                   dateS = new Date(new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes());
                 }else if(inst.settings["0"]==3){
                   dateS = new Date($("#USER_AGES").val().replace(/\-/g, "\/"));
                 }else if(inst.settings["0"]==4){
                   dateS = new Date($("#USER_AGES").val().replace(/\-/g, "\/")+" "+$("#USER_AGE").val());
                 }
                 var dateT = "";
                 if(inst.settings["0"]==1){
                   dateT = new Date($("#USER_AGEFo").val().replace(/\-/g, "\/"));
                 }else if(inst.settings["0"]==2){
                   dateT = new Date($("#USER_AGEFo").val().replace(/\-/g, "\/")+" "+$("#USER_AGET").val());
                 }
                 if(dateF-dateS>=0){
                   if(inst.settings["0"]==1){
                     if(dateF-dateT>0){
                       $("#USER_AGEFo").val("");
                       $("#USER_AGET").val("");
                       _this.both.timeAfterF = $("#USER_AGET").val();
                       _this.both.timeAfterS = $("#USER_AGEFo").val();
                     }
                   }else if(inst.settings["0"]==2){
                     if(dateF-dateT>0){
                       $("#USER_AGEFo").val("");
                       $("#USER_AGET").val("");
                       _this.both.timeAfterF = $("#USER_AGET").val();
                       _this.both.timeAfterS = $("#USER_AGEFo").val();
                     }
                   }
                 }else{
                   if(inst.settings["0"]==1){
                     if(dateF - (new Date(new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate()+" "+"00:00:00")).getTime()<=0){
                       bomb.first("请选择正确时间");
                       $("#USER_AGES").val("");
                       $("#USER_AGE").val("");
                       _this.both.timeBeforeF = $("#USER_AGE").val();
                       _this.both.timeBeforeS = $("#USER_AGES").val();
                       return false;
                     }
                   }
                   if(inst.settings["0"]==2){
                     if(dateF - new Date(new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()).getTime()<=0){
                       bomb.first("请选择正确时间");
                       $("#USER_AGE").val("");
                       _this.both.timeBeforeF = $("#USER_AGE").val();
                       return false;
                     }
                   }
                   if(inst.settings["0"]==3||inst.settings["0"]==4){
                     bomb.first("请选择正确时间");
                     $("#USER_AGEFo").val("");
                     $("#USER_AGET").val("");
                     _this.both.timeAfterF = $("#USER_AGET").val();
                     _this.both.timeAfterS = $("#USER_AGEFo").val();
                     return false;
                   }
                   $("#USER_AGEFo").val("");
                   $("#USER_AGET").val("");
                   _this.both.timeAfterF = $("#USER_AGET").val();
                   _this.both.timeAfterS = $("#USER_AGEFo").val();
                 }
                 if(inst.settings["0"]==1){
                   _this.both.timeBeforeS =valueText;
                   _this.both.timeBeforeF  ="";
                 }else if(inst.settings["0"]==2){
                   _this.both.timeBeforeF = valueText+":00";
                 }else if(inst.settings["0"]==3){
                   _this.both.timeAfterS = valueText;
                   _this.both.timeAfterF  ="";
                 }else if(inst.settings["0"]==4){
                   _this.both.timeAfterF = valueText+":00";
                 }
               }
             };
             $("#USER_AGEFo").mobiscroll($.extend(opt['date'], opt['default'],"3"));
             $("#USER_AGET").mobiscroll($.extend(opt['time'], opt['default'],"4"));
             $("#USER_AGE").mobiscroll($.extend(opt['time'], opt['default'],"2"));
             $("#USER_AGES").mobiscroll($.extend(opt['date'], opt['default'],"1"));
             $("#USER_AGES,#USER_AGE,#USER_AGET,#USER_AGEFo").focus(function(){
               document.activeElement.blur();
             });
           },
          ten:function (min) {
            if(min<10){
              min = "0"+min;
            }else{
              min = min;
            }
            return min;
          },
        timego:function () {
          var _this = this;
          if( bomb.hasClass("push","colorfull")){
            var json = {
              message:_this.both,
              number:JSON.parse(sessionStorage.getItem("timeSite")).number
            }
            sessionStorage.setItem("timeSure",JSON.stringify(json));
            androidIos.gobackFrom(_this);
          }
        }
      }
    }
</script>

<style scoped>
  .label{
    width:100%;
    margin:0.2rem auto 0 auto;
    background: white;
  }
  .lablebox{
    width:90%;
    padding:0 5%;
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #dadada;
  }
  .lablebox span{
    line-height: 1rem;
    font-size: 0.3125rem;
    color:#333;
  }
  .lablebox input{
    line-height: 1rem;
    font-size: 0.3125rem;
    color:#333;
    float: right;
    text-align: right;
    width:55%;
  }
  .lablebox p{
    float: right;
    font-size: 0.3125rem;
    color:#bcbcbc;
  }
  button{
    width:94%;
    border-radius: 0.2rem;
    line-height: 1.2rem;
    background: #dbdbdb;
    color:white;
    display: block;
    margin:0.3rem auto;
    font-size: 0.38rem;
    letter-spacing: 0.0625rem;
  }
  .colorfull{
    background: #3399FF!important;
  }
</style>
