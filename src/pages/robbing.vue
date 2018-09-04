<template>
  <div id="robbing">
    <router-view/>
  </div>
</template>

<script>
    export default {
        name: "robbing",
      data(){
          return{
             cjj:1
          }
      }
    }
</script>

<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #robbing{
    width:100%;
    height:auto;
    top:1.3rem;
    bottom:0;
    position: absolute;
    overflow: scroll;
    margin-top: 0.03125rem;
  }
  #robbing .set_image_all {
    cursor: pointer;
    position: relative;
  }
  #robbing .set_image_top div{
    position: relative;
  }
  #robbing .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:0.4rem!important;
  }
  #robbing .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #robbing .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 13;
  }

  #robbing .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #robbing .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #robbing .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
  }
  #robbing .mescroll-upwarp{
    height:0.2rem!important;
    overflow: hidden;
  }
  #robbing .amap-logo{
    display: none!important;
  }
  #robbing .amap-copyright{
    display: none!important;
  }
  #robbing .amap-scalecontrol{
    bottom: 0.3rem !important;
  }
  #robbing .amap-zoomcontrol{
    display: none;
  }
  #robbing .amap-icon{
    width:19px;
  }
  #robbing .amap-controls{
    display: none;
  }
  @media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-resolution: 144dpi){
    #robbing .amap-lib-marker-to{
      background-image: none;
    }
    #robbing .amap-lib-marker-from {
      background-image:none;
    }
  }
  #robbing .amap-lib-marker-from {
    background-image:none;
  }
  #robbing  .amap-lib-marker-to{
    background-image: none;
  }
  #robbing  .amaplibmarkerto{
    background-image: url("../images/end.png")!important;
    background-size:cover!important;
  }
  #robbing .amaplibmarkerfrom{
    background-image: url("../images/start.png")!important;
    background-size:cover!important;
  }
  #robbing .amaplibmarkertos{
    background-image: url("../images/end1.png")!important;
    background-size:cover!important;
  }
  #robbing  .amaplibmarkerfroms{
    background-image: url("../images/start1.png")!important;
    background-size:cover!important;
  }
</style>
