<template>
  <div id="remark">
    <div id="title" v-title data-title="备注"></div>
    <ul>
      <li v-for="(item,index) in remarkList" class="ulli" :class="item.show ? 'chooseTrue': ''" @click="chooseLine(item,index,$event)">{{item.displayName}}</li>
      <div class="clearBoth"></div>
    </ul>
    <textarea placeholder="请填写备注" v-model="remark" @keyup="remarkKeyUp()"></textarea>
    <button @click="save()">保存</button>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from "../../js/bridge";
  import Debounce from '../../js/Debounce.js'
    export default {
        name: "remark",
        data(){
           return{
             remark:"",
             remarkList:[],
             suremend: new Debounce(this.keyUp, 500)
           }
        },
      watch:{
        remark:{
          handler:function(val,oldval){
            var _this = this;
            _this.remark = androidIos.checkText(_this.remark);
          },
          deep:true
        }
      },
      mounted:function(){
        var _this = this;
        androidIos.bridge(_this);
      },
      methods: {
          go:function () {
            var _this = this;
            $.ajax({
              type: "GET",
              url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
              data:{str:"remarks",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
              dataType: "json",
              timeout: 20000,
              async:false,
              success: function (getSysConfigList) {
                _this.remarkList = getSysConfigList;
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                }else if(status=='error'){
                  androidIos.errorwife();
                }
              }
            })
            var newOrder = sessionStorage.getItem("newOrder");
            if(newOrder != undefined){
                newOrder = JSON.parse(newOrder);
                _this.remark = newOrder.remark;
                _this.$nextTick(function () {
                  _this.keyUp();
                })
            }
          },
          keyUp:function () {
             var _this = this;
             var list = _this.remark.split(",");
             for(var x = 0 ; x < _this.remarkList.length ; x++ ){
               var jjj = 0;
               for(var i = 0 ; i < list.length; i++) {
                 if(list[i] === _this.remarkList[x].displayName){
                   _this.remarkList[x].show = true;
                   _this.addClass(document.getElementsByClassName("ulli")[x],"chooseTrue");
                   jjj++;
                 }
               }
               if(jjj == 0){
                 _this.remarkList[x].show = false;
                 _this.removeClass(document.getElementsByClassName("ulli")[x],"chooseTrue");
               }
             }
          },
        remarkKeyUp:function () {
            var _this = this;
           _this.suremend();
        },
          chooseLine:function (item,index,e) {
            var _this = this;
            if( !item.show){
              _this.addClass(e.target,"chooseTrue");
              _this.remarkList[index].show = !_this.remarkList[index].show;
              if(_this.remark == ""){
                _this.remark = item.displayName + "," ;
              }else if(_this.remark != ""){
                var re = _this.remark[_this.remark.length - 1];
                if( re == ","){
                  _this.remark = _this.remark + item.displayName + "," ;
                }else if(re != ","){
                  _this.remark = _this.remark + "," + item.displayName + "," ;
                }
              }
            }else{
              _this.removeClass(e.target,"chooseTrue");
              _this.remarkList[index].show = !_this.remarkList[index].show;
              var list = _this.remark.split(",");
              for(var i = 0; i < list.length; i++){
                 if(item.displayName == list[i]){
                   list.splice(i,1);
                    break;
                 }
              }
              _this.remark = "";
              for(var i = 0 ; i < list.length ; i++){
                if(list[i] != ""){
                  _this.remark += list[i] + ",";
                }
              }
            }
          },
        save:function () {
            var _this = this;
           sessionStorage.setItem("remark",_this.remark);
           androidIos.gobackFrom(_this);
        },
        addClass:function(obj,cls){//增加class
          var idJson = obj.className.split(" ");
          for(var i=0;i<idJson.length;i++){
            if(idJson[i]==cls){
              return false;
            }
          }
          idJson.push(cls);
          obj.className = idJson.join(" ");
          return true;
        },
        removeClass:function(obj,cls){//删除class
          var idJson = obj.className.split(" ");
          for(var i=0;i<idJson.length;i++){
            if(idJson[i]==cls){
              idJson.splice(i,1)
            }
          }
          obj.className = idJson.join(" ");
        },
        hasClass:function(obj,cls){//判断是不是有这个class
          var idJson = obj.className.split(" ");
          for(var i=0;i<idJson.length;i++){
            if(idJson[i]==cls){
              return true;
            }
          }
          return false;
        },
        }
    }
</script>

<style scoped>
  ul{
    width:100%;
    margin: 0 auto;
  }
  ul li{
    float: left;
    display: block;
    width: 18.5%;
    padding:0 1.375% ;
    text-align: center;
    line-height: 0.8rem;
    font-size: 0.35rem;
    background: #7e7e7e;
    color:white;
    border-radius: 0.2rem;
    margin-top: 0.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 3%;
  }
  .chooseTrue{
    background: #2c9cff!important;
  }
  textarea{
     width:88%;
     padding: 3%;
     margin: 0.5rem auto;
     display: block;
     height: 4rem;
    border: 1px solid #dadada;
    font-size: 0.375rem;
    color:#666;
    resize:none;
  }
  button{
    width:94%;
    background: #2c9cff;
    color:white;
    display: block;
    margin: 0 auto;
    line-height: 1.2rem;
    font-size: 0.4rem;
    border-radius: 0.2rem;
  }
</style>
