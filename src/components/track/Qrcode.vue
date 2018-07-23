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
           var json;
           if(this.$route.query.ty == 0){
              json = {
                 pk:this.QueryDetail,
                 type:this.$route.query.ty
              }
              json = JSON.stringify(json);
           }else{
             json = this.QueryDetail;
           }
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
