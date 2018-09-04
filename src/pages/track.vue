<template>
  <div id="track">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: "track"
  }
</script>

<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #track{
    width:100%;
    height:auto;
    top:1.3rem;
    bottom:0;
    position: absolute;
    overflow: scroll;
    margin-top: 0.03125rem;
  }
  #track .set_image_all {
    cursor: pointer;
    position: relative;
  }
  #track .set_image_top div{
    position: relative;
  }
  #track .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:0.4rem!important;
  }
  #track .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #track .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 15;
  }

  #track .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #track .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #track .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
  }
  #track .mescroll-upwarp{
    height:0.2rem!important;
    overflow: hidden;
  }
  #track .amap-logo{
    display: none!important;
  }
  #track .amap-copyright{
    display: none!important;
  }
  #track .amap-scalecontrol{
    bottom: 0.3rem !important;
  }
  #trackMore .amap-zoomcontrol{
    display: none;
  }
  #track .amap-icon{
    width:19px;
  }
  @media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-resolution: 144dpi){
    #track .amap-lib-marker-to{
      background-image: none;
    }
    #track .amap-lib-marker-from {
      background-image:none;
    }
  }
  #track .amap-lib-marker-from {
    background-image:none;
  }
  #track .amap-lib-marker-to{
    background-image: none;
  }
  #track .amaplibmarkerto{
    background-image: url("../images/end.png")!important;
    background-size:cover!important;
  }
  #track .amaplibmarkerfrom{
    background-image: url("../images/start.png")!important;
    background-size:cover!important;
  }
  #track .amaplibmarkertos{
    background-image: url("../images/end1.png")!important;
    background-size:cover!important;
  }
  #track .amaplibmarkerfroms{
    background-image: url("../images/start1.png")!important;
    background-size:cover!important;
  }

</style>
