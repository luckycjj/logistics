<template>
   <div id="qrcode">
     <div id="title" v-title data-title="扫描二维码"></div>
     <canvas id="canvas"></canvas>
   </div>
</template>

<script>
  import QRCode from 'qrcode'
  export default {
        name: "qrcode",
    data(){
      return{
        QueryDetail:sessionStorage.getItem("orderPk")
      }
    },
    mounted:function () {
       this.useqrcode();
    },
       methods:{
         useqrcode:function(){
           //生成的二维码内容，可以添加变量
           var canvas = document.getElementById('canvas');
           QRCode.toCanvas(canvas, this.QueryDetail, function (error) {
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
