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
        startJ :sessionStorage.getItem("dataStart") == "" || sessionStorage.getItem("dataStart") == null || sessionStorage.getItem("dataStart") == "null" ? "" :sessionStorage.getItem("dataStart").split(",")[0],
        startW :sessionStorage.getItem("dataStart") == "" || sessionStorage.getItem("dataStart") == null || sessionStorage.getItem("dataStart") == "null" ? "" :sessionStorage.getItem("dataStart").split(",")[1],
        endJ:sessionStorage.getItem("dataEnd") == "" || sessionStorage.getItem("dataEnd") == null || sessionStorage.getItem("dataEnd") == "null" ? "" :sessionStorage.getItem("dataEnd").split(",")[0],
        endW:sessionStorage.getItem("dataEnd") == "" || sessionStorage.getItem("dataEnd") == null || sessionStorage.getItem("dataEnd") == "null" ? "" :sessionStorage.getItem("dataEnd").split(",")[1],
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
      androidIos.bridge(_this);
    },
    methods: {
      go:function () {
        var _this = this;
        var http = window.location.href;
        if(http.indexOf("/orderLogistics/map") != -1){
          _this.navShow = true;
          $("#orderLogistics .amap-zoomcontrol").show();
        }
        _this.init();
      },
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
          if(ordertype == '20' || ordertype == '40'  || ordertype ==  "60"){
                if(_this.startJ!=""&&_this.startW!=""&&_this.endJ!=""&&_this.endW!=""&&_this.peopleJ!=""&&_this.peopleW!=""){
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
                  if(ordertype ==  "40"  || ordertype ==  "60"){
                    driving.search([_this.startJ, _this.startW], [_this.endJ, _this.endW], function(status, result) {
                      var ssss = setInterval(function () {
                        if($(".amap-lib-marker-to").length>0){
                          clearInterval(ssss);
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
                      icon:require('../../images/start1.png'),
                      position: [_this.peopleJ, _this.peopleW]
                    });
                    marker.setMap(map);
                  }else{
                    driving.search([_this.peopleJ, _this.peopleW],[_this.startJ, _this.startW], function(status, result) {
                      var ssss = setInterval(function () {
                        if($(".amap-lib-marker-to").length>0){
                          clearInterval(ssss);
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
                    if(ordertype ==  "40" || ordertype ==  "60"){
                      driving.search([_this.startJ, _this.startW], [_this.endJ, _this.endW], function(status, result) {
                        var ssss = setInterval(function () {
                          if($(".amap-lib-marker-to").length>0){
                            clearInterval(ssss);
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
                        icon: require('../../images/start1.png'),
                        position: [_this.peopleJ, _this.peopleW]
                      });
                      marker.setMap(map);
                    }else{
                      driving.search([_this.peopleJ, _this.peopleW],[_this.startJ, _this.startW], function(status, result) {
                        var ssss = setInterval(function () {
                          if($(".amap-lib-marker-to").length>0){
                            clearInterval(ssss);
                            $(".amap-lib-marker-to").addClass("amaplibmarkertos");
                            $(".amap-lib-marker-from").addClass("amaplibmarkerfroms");
                          }
                        },100)
                      });
                    }
                  },30000)
                }
          }
        }
      },
      lnglat:function(lnglat){
        var _this = this;
        var myDistance = lnglat.distance([_this.startJ, _this.startW]);//这里测量距离
        myDistance = (myDistance/1000).toFixed(3);
        myDistance = myDistance-1 > 0 ? myDistance+'千米':myDistance*1000+'米';
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
