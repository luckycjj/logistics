<template>
    <div id="orderLogistics">
      <router-view/>
    </div>
</template>

<script>
    export default {
        name: "orderLogistics"
    }
</script>

<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #orderLogistics{
    width:100%;
    height:auto;
    top:1.3rem;
    bottom:0;
    position: absolute;
    overflow: scroll;
    margin-top: 0.03125rem;
  }
  #orderLogistics .set_image_all {
    cursor: pointer;
    position: relative;
  }
  #orderLogistics .set_image_top div{
    position: relative;
  }
  #orderLogistics .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
  }
  #orderLogistics .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #orderLogistics .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 13;
  }

  #orderLogistics .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #orderLogistics .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #orderLogistics .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
  }
  #orderLogistics .mescroll-upwarp{
    height:0.2rem!important;
    overflow: hidden;
  }
  #orderLogistics .amap-logo{
    display: none!important;
  }
  #orderLogistics .amap-copyright{
    display: none!important;
  }
  #orderLogistics .amap-scalecontrol{
    bottom: 0.3rem !important;
  }
  #orderLogisticsMore .amap-zoomcontrol{
    display: none!important;
  }
  #orderLogistics .amap-icon{
    width:19px;
  }
  #orderLogisticsMore .amap-controls{
    display: none!important;
  }
  #orderLogisticsMore  #star_grade .set_image_top img,#orderLogisticsMore  #star_gradeF .set_image_top img,#orderLogisticsMore  #star_gradeS .set_image_top img{
    width:0.4rem;
  }
  @media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-resolution: 144dpi){
    #orderLogistics .amap-lib-marker-to{
      background-image: none;
    }
    #orderLogistics  .amap-lib-marker-from {
      background-image:none;
    }
  }
  #orderLogistics .amap-lib-marker-from {
    background-image:none;
  }
  #orderLogistics  .amap-lib-marker-to{
    background-image: none;
  }
  #orderLogistics .amaplibmarkerto{
    background-image: url("../images/end.png")!important;
    background-size:cover!important;
  }
  #orderLogistics .amaplibmarkerfrom{
    background-image: url("../images/start.png")!important;
    background-size:cover!important;
  }
  #orderLogistics .amaplibmarkertos{
    background-image: url("../images/end1.png")!important;
    background-size:cover!important;
  }
  #orderLogistics .amaplibmarkerfroms{
    background-image: url("../images/start1.png")!important;
    background-size:cover!important;
  }
</style>
