<template>
  <div>
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
        endJ :"",
        endW :"",
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
      if(http.indexOf("/orderLogistics/map") != -1){
        _this.navShow = true;
        $("#orderLogistics .amap-zoomcontrol").show();
      }
      _this.init()
    },
    methods: {
      init: function () {
        var _this = this;
        var ordertype = sessionStorage.getItem("orderType");
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
              _this.peopleJ = getLocation.errorCode == "" ? "12" : getLocation.errorCode.split(",")[0];
              _this.peopleW = getLocation.errorCode == "" ? "3" : getLocation.errorCode.split(",")[1];
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
        if(ordertype!=undefined){
          if(ordertype == '20' || ordertype == '40'){
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
                if(_this.startJ!=""&&_this.startW!=""&&_this.endJ!=""&&_this.endW!=""&&_this.peopleJ!=""&&_this.peopleW!=""){
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
                  if(ordertype ==  "40" ){
                    driving.search([_this.startJ, _this.startW], [_this.endJ, _this.endW], function(status, result) {
                      $(".goodsmessage p .distance").text("相距"+$(".planTitle p").text().split("公里")[0].split("(")[1] +"km");
                      var sss = setInterval(function () {
                        if($(".amap-lib-marker-to").length>0){
                          clearInterval(sss);
                          $(".amap-lib-marker-to").addClass("amaplibmarkerto");
                          $(".amap-lib-marker-from").addClass("amaplibmarkerfrom");
                        }
                      },100)
                    });
                    if (marker) {
                      marker.setMap(null);
                      marker = null;
                    }
                    marker = new AMap.Marker({
                      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAA8CAMAAAA9rjhhAAAAk1BMVEUAAABCkf9ClvxCl/xCl/xCl/1ClvxCl/1Dlf9Emv9ClvxCl/xCl/1ClvxBl/tCl/9Cl/xDlvxDlv1Dl/1Cl/xDk/9DlvxDlv1DlvxDl/tDl/tDl/xCl/1Cl/1Dlv1Bl/xGmf9CmP9Alv9Dl/3////s8/+30v6Svv6rzP6Ftv7N4P5np/1Wn/32+f/i7f/Y5v52r/3nvH34AAAAI3RSTlMABPri6rrxghkKyv6fW00yY9ysiW8T1bRUR0DRwKWTdCgmD7Pu0p0AAAGHSURBVEjHjdVXdsIwFEXRK1nujRYIaZQHmJI2/9GFgHB7luz9pY+zbBUXNASjJFJSqigZBTBZLmIqxYsluuRv1PKWs0j4khjpCzRsXerkblHzFJFB9ISSqCreVfdNyCKBlpJVqiem7Jl3n94H9fjAVaA37HJoO+pMBgB8uit2bXvSfAAOGVSZA+TUn1GO1ZBshYkenfYNx0Y2weuQ7BVqyE0V5JBMwivHl6L0ybJxOT7sSkUrc+DWsmNxc2aZC7+WFXrAMh8vQ7IXCK8/8wTwXmXnw813O3sHkPWvNAMgVN/2KoGraV82xb9NzIrTdYbn3Y/+6Gxw4/Jsd/X1SzcL3C2J0QerN02bk0WEh5Ete8aDcMzVWKA0M2czVEJlqlSImpntYpXQMDsnhGZd7AhNYmxfpvWTmaJNzHk1B5fxLAPHHxQXXfK4WcU5OP57SNAt8OqVF8DAr2c+uOrI+DFxzx1Po3VTXNis5b2Sa1hNqzfYJnSM8+dHm6HXhGiCfoHnBRggTcH8AUtJx3fNHCAxAAAAAElFTkSuQmCC",
                      position: [_this.peopleJ, _this.peopleW]
                    });
                    marker.setMap(map);
                  }else{
                    driving.search([_this.peopleJ, _this.peopleW],[_this.startJ, _this.startW], function(status, result) {
                      $(".goodsmessage p .distance").text("相距"+$(".planTitle p").text().split("公里")[0].split("(")[1] +"km");
                      var sss = setInterval(function () {
                        if($(".amap-lib-marker-to").length>0){
                          clearInterval(sss);
                          $(".amap-lib-marker-to").addClass("amaplibmarkertos");
                          $(".amap-lib-marker-from").addClass("amaplibmarkerfroms");
                        }
                      },100)

                    });
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
                          _this.peopleJ = getLocation.errorCode == "" ? "12" : getLocation.errorCode.split(",")[0];
                          _this.peopleW = getLocation.errorCode == "" ? "3" : getLocation.errorCode.split(",")[1];
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
                    if(ordertype ==  "40"){
                      if (marker) {
                        marker.setMap(null);
                        marker = null;
                      }
                      marker = new AMap.Marker({
                        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAA8CAMAAAA9rjhhAAAAk1BMVEUAAABCkf9ClvxCl/xCl/xCl/1ClvxCl/1Dlf9Emv9ClvxCl/xCl/1ClvxBl/tCl/9Cl/xDlvxDlv1Dl/1Cl/xDk/9DlvxDlv1DlvxDl/tDl/tDl/xCl/1Cl/1Dlv1Bl/xGmf9CmP9Alv9Dl/3////s8/+30v6Svv6rzP6Ftv7N4P5np/1Wn/32+f/i7f/Y5v52r/3nvH34AAAAI3RSTlMABPri6rrxghkKyv6fW00yY9ysiW8T1bRUR0DRwKWTdCgmD7Pu0p0AAAGHSURBVEjHjdVXdsIwFEXRK1nujRYIaZQHmJI2/9GFgHB7luz9pY+zbBUXNASjJFJSqigZBTBZLmIqxYsluuRv1PKWs0j4khjpCzRsXerkblHzFJFB9ISSqCreVfdNyCKBlpJVqiem7Jl3n94H9fjAVaA37HJoO+pMBgB8uit2bXvSfAAOGVSZA+TUn1GO1ZBshYkenfYNx0Y2weuQ7BVqyE0V5JBMwivHl6L0ybJxOT7sSkUrc+DWsmNxc2aZC7+WFXrAMh8vQ7IXCK8/8wTwXmXnw813O3sHkPWvNAMgVN/2KoGraV82xb9NzIrTdYbn3Y/+6Gxw4/Jsd/X1SzcL3C2J0QerN02bk0WEh5Ete8aDcMzVWKA0M2czVEJlqlSImpntYpXQMDsnhGZd7AhNYmxfpvWTmaJNzHk1B5fxLAPHHxQXXfK4WcU5OP57SNAt8OqVF8DAr2c+uOrI+DFxzx1Po3VTXNis5b2Sa1hNqzfYJnSM8+dHm6HXhGiCfoHnBRggTcH8AUtJx3fNHCAxAAAAAElFTkSuQmCC",
                        position: [_this.peopleJ, _this.peopleW]
                      });
                      marker.setMap(map);
                    }else{
                      driving.search([_this.peopleJ,_this.peopleW],[_this.startJ, _this.startW], function(status, result) {
                        $(".goodsmessage p .distance").text("相距"+$(".planTitle p").text().split("公里")[0].split("(")[1] +"km");
                        var sss = setInterval(function () {
                          if($(".amap-lib-marker-to").length>0){
                            clearInterval(sss);
                            $(".amap-lib-marker-to").addClass("amaplibmarkertos");
                            $(".amap-lib-marker-from").addClass("amaplibmarkerfroms");
                          }
                        },100)

                      });
                    }
                  },30000)
                }
            },1000)
          }
        }
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
      if(http.indexOf("/orderLogistics/map")!=-1){
        _this.navShow = true;
        $("#orderLogistics .amap-zoomcontrol").show();
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
