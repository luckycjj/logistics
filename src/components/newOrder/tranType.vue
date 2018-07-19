<template>
  <div id="tranType">
    <div id="title" v-title data-title="运输类别"></div>
    <ul>
      <li v-for="item in list" @click="choose(item)">
         {{item.displayName}}
          <img src="../../images/checked.png"  v-if="item.checked">
      </li>
    </ul>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  export default {
        name: "tranType",
      data(){
          return{
             list:[]
          }
      },
      mounted:function(){
        var _this = this;
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/settings/getTransType",
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 10000,
          success: function (getTransType) {
            for(var i = 0;i<getTransType.length;i++){
              getTransType[i].checked = false;
              if(getTransType[i].value == _this.$route.query.tranpk && _this.$route.query.tranpk!=""){
                getTransType[i].checked = true;
              }
            }
              _this.list = getTransType;
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        })
      },
      methods:{
        choose:function (item) {
          var _this = this;
          item = JSON.stringify(item);
          sessionStorage.setItem("tranType",item);
          androidIos.gobackFrom(_this);
        }
      }
    }
</script>

<style scoped>
   ul{
     width:100%;
     border-top:1px solid #dbdbdb;
     background: white;
     margin-top: 0.3rem;
   }
  li{
    font-size: 0.375rem;
    color:#333;
    line-height: 1.4rem;
    width:90%;
    padding: 0 5%;
    border-bottom: 1px solid #dbdbdb;
    position: relative;
  }
  li img{
    position: absolute;
    width:0.5rem;
    right:0.5rem;
    top:50%;
    margin-top: -0.25rem;
  }
</style>
