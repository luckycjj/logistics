<template>
   <div id="qrcode">
     <div id="title" v-if="ty == '0'" v-title data-title="交接二维码"></div>
     <div id="title" v-if="ty == '1'" v-title data-title="签收二维码"></div>
     <div id="title" v-if="ty == '2'" v-title data-title="订单二维码"></div>
     <canvas id="canvas"></canvas>
   </div>
</template>

<script>
  import QRCode from 'qrcode'
  import {androidIos} from "../../js/app";
  export default {
        name: "qrcode",
    data(){
      return{
        QueryDetail:sessionStorage.getItem("orderPk"),
        ty:0,
      }
    },
    beforeMount:function () {
      var _this = this;
      _this.ty = _this.$route.query.ty;
    },
    mounted:function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var _this = this;
        _this.ty = _this.$route.query.ty;
        _this.useqrcode();
      },
     useqrcode:function(){
       //生成的二维码内容，可以添加变量
       // 0 交接二维码 1签收二维码 2订单二维码
       var json = {
         pk:this.QueryDetail,
         type:this.$route.query.ty
       };
       json = JSON.stringify(json);
       var canvas = document.getElementById('canvas');
       QRCode.toCanvas(canvas, json, function (error) {
       })
     }
   }
  }
</script>

<style scoped>
  #canvas{
    width: 80%!important;
    height: auto!important;
    margin: 1rem auto;
  }
</style>
