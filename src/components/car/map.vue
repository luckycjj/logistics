<template>
  <div id="carmap">
    <div id="title" v-title data-title="地图" v-if="navShow"></div>
    <div id="container"></div>
    <div id="panel"></div>
  </div>
</template>
<script>
  import AMap from 'AMap'
  import {androidIos} from "../../js/app";
  export default {
    data(){
      return{
        navShow:false,
        startJ :"",
        startW : "",
        peopleJ:120.40,
        peopleW:30.26,
        setTime:"",
        json:{
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source"),
          pk:sessionStorage.getItem("driverPk"),
        }
      }
    },
    mounted: function () {
      var _this = this;
      var http = window.location.href;
      if(http.indexOf("/car/map")!=-1){
        _this.navShow = true;
        $("#carmap .amap-zoomcontrol").show();
      }
      _this.init()
    },
    methods: {
      init: function () {
        var _this = this;
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/order/getLocation",
          data:JSON.stringify(_this.json),
          dataType: "json",
          contentType: "application/json;charset=utf-8",
          async:false,
          timeout: 10000,
          success: function (getLocation) {
            if(getLocation.success == "1"){
              _this.peopleJ = getLocation.driverPosition == undefined ? "121.56303" : getLocation.driverPosition.split(",")[0];
              _this.peopleW = getLocation.driverPosition == undefined ? "31.20641" : getLocation.driverPosition.split(",")[1];
            }else{
              androidIos.second(getLocation.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            _this.cancelReasonBox = false;
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        });
        var dataStart = sessionStorage.getItem("dataStart");
        var dataEnd = sessionStorage.getItem("dataEnd");
        geocoder(dataStart,1);
        geocoder(dataEnd,2);
        //地理编码,返回地理编码结果
        function geocoder(message,type){
          var geocoder = new AMap.Geocoder({});
          geocoder.getLocation(message, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if(type == 1){
                _this.startJ = (result.geocodes[0].location.lng).toString();
                _this.startW = result.geocodes[0].location.lat.toString();
              }else if(type == 2){
                _this.endJ = result.geocodes[0].location.lng.toString();
                _this.endW = result.geocodes[0].location.lat.toString();
              }
            }
          });
        }
        var ttttt = setInterval(function () {
          if(_this.startJ!=""&&_this.startW!=""&&_this.peopleJ!=""&&_this.peopleW!=""){
            clearInterval(ttttt);
            var map = new AMap.Map("container", {
              resizeEnable: true,
              center: [_this.startJ, _this.startW],//地图中心点
              zoom: 13 //地图显示的缩放级别
            });
            AMap.plugin(['AMap.ToolBar','AMap.Scale'],
              function(){
                map.addControl(new AMap.ToolBar());
                map.addControl(new AMap.Scale());
              });
            //构造路线导航类
            var driving = new AMap.Driving({
              map: map,
              panel: "panel"
            });
            var marker;
            driving.search([_this.peopleJ, _this.peopleW],[_this.startJ, _this.startW], function(status, result) {
              $("#carMessageBox .km").text("相距"+$(".planTitle p").text().split("公里")[0].split("(")[1] +"km");
              var sss = setInterval(function () {
                if($(".amap-lib-marker-to").length>0){
                  clearInterval(sss);
                  $(".amap-lib-marker-to").addClass("amaplibmarkertos");
                  $(".amap-lib-marker-from").addClass("amaplibmarkerfroms");
                }
              },100)

            });
            var http = window.location.href;
            if(http.indexOf("/car/map")!=-1){
              _this.navShow = true;
              $("#carBox .amap-zoomcontrol").show();
            }
            _this.setTime = setInterval(function () {
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp()+"/order/getLocation",
                data:JSON.stringify(_this.json),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                async:false,
                timeout: 10000,
                success: function (getLocation) {
                  if(getLocation.success == "1"){
                    _this.peopleJ = getLocation.driverPosition == undefined ? "121.56303" : getLocation.driverPosition.split(",")[0];
                    _this.peopleW = getLocation.driverPosition == undefined ? "31.20641" : getLocation.driverPosition.split(",")[1];
                  }else{
                    androidIos.second(getLocation.message);
                  }
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                  _this.cancelReasonBox = false;
                  if(status=='timeout'){//超时,status还有success,error等值的情况
                    androidIos.second("网络请求超时");
                  }else if(status=='error'){
                    androidIos.errorwife();
                  }
                }
              });
                driving.search([_this.peopleJ,_this.peopleW],[_this.startJ, _this.startW], function(status, result) {
                  $("#carMessageBox .km").text("相距"+$(".planTitle p").text().split("公里")[0].split("(")[1] +"km");
                  var sss = setInterval(function () {
                    if($(".amap-lib-marker-to").length>0){
                      clearInterval(sss);
                      $(".amap-lib-marker-to").addClass("amaplibmarkertos");
                      $(".amap-lib-marker-from").addClass("amaplibmarkerfroms");
                    }
                  },100)
                });
            },20000)
          }
        },1000)
      },
      lnglat:function(lnglat){
        var _this = this;
        var myDistance = lnglat.distance([_this.startJ, _this.startW]);//这里测量距离
        return myDistance
      },
    },
    updated:function () {
      var _this = this;
      var http = window.location.href;
      if(http.indexOf("/car/map")!=-1){
        _this.navShow = true;
        $("#carmap .amap-zoomcontrol").show();
      }
    },
    destroyed:function () {
      var _this = this;
      clearInterval(_this.setTime);
    }
  }
</script>
<style scoped>
  #panel {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
    display: none!important;
  }
</style>
