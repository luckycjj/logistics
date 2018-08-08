<template>
  <div id="carBox">
    <router-view/>
  </div>
</template>

<script>
    export default {
        name: "car",
    }
</script>

<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #carBox{
    width:100%;
    height:auto;
    top:1.3rem;
    bottom:0;
    position: absolute;
    margin-top: 0.03125rem;
  }
  #carBox .set_image_all {
    cursor: pointer;
    position: relative;
  }
  #carBox .set_image_top div{
    position: relative;
  }
  #carBox .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:0.4rem!important;
  }
  #carBox .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #carBox .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
  }

  #carBox .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #carBox .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #carBox .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
  }
  #carBox #carMessage .mescroll-upwarp{
    height:0.2rem!important;
    overflow: hidden;
  }
  #carBox .amap-logo{
    display: none!important;
  }
  #carBox  .amap-copyright{
    display: none!important;
  }
  #carBox .amap-scalecontrol{
    bottom: 0.3rem !important;
  }
  #carBox .amap-zoomcontrol{
    display: none;
  }
  @media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-resolution: 144dpi){
    .amap-lib-marker-to{
      background-image: none;
    }
    .amap-lib-marker-from {
      background-image:none;
    }
  }
  .amap-lib-marker-from {
    background-image:none;
  }
  .amap-lib-marker-to{
    background-image: none;
  }
  .amaplibmarkertos{
    background-image: url("../images/end1.png")!important;
    background-size:cover!important;
  }
  .amaplibmarkerfroms{
    background-image: url("../images/start1.png")!important;
    background-size:cover!important;
  }


</style>
