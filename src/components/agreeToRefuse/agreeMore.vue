<template>
  <div id="agreeMore">
    <div class="hello">
      <div id="title" v-title data-title="申请详情"></div>
      <div class="labelBox">
        <p>申请司机信息</p>
        <div class="label">
          <span style="float: left;">姓名</span>
          <div class="companyNameBox" >{{name}}</div>
        </div>
        <div class="label">
          <span style="float: left;">手机</span>
          <div class="companyNameBox" >{{phone}}</div>
        </div>
          <div class="label">
            <span style="float: left;">身份证号码</span>
            <div class="companyNameBox" >{{IDpicCode}}</div>
          </div>
        <div class="label" style="height: auto;border:none">
          <h1><h5 style="margin-left: 0;">身份证</h5></h1>
          <div style="float:left;margin-left: 0.18rem;margin-top: 0.3rem;">
            <img :src="IDpic" :onerror="errorImg">
            <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;">正面</h5>
          </div>
          <div style="float:right;margin-right: 0.18rem;margin-top: 0.3rem;">
            <img :src="IDpicfan" :onerror="errorImg">
            <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;">反面</h5>
          </div>
          <div class="clearBoth"></div>
        </div>
        <div class="label" style="height: auto;">
          <span>证件</span>
          <div class="clearBoth"></div>
          <div class="imgBoxBigs" style="float: left;margin-left: 0.18rem; ">
            <img :src="Drivepic" :onerror="errorImg">
            <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;">驾驶证</h5>
          </div>
          <div class="clearBoth"></div>
        </div>
        <div class="label" style="border:none">
          <span style="float: left;">驾驶证等级</span>
          <div class="companyNameBox" >{{licType}}</div>
        </div>
    </div>
    </div>
    <div id="bottomButton">
      <button class="yes" @click="agresRefuse(1)">同意</button>
      <button class="no" @click="agresRefuse(2)">拒绝</button>
      <div class="clearBoth"></div>
    </div>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import PinchZoom from "../../js/pinchzoom";
  import bridge from "../../js/bridge";
  import {bomb} from "../../js/zujian";
  export default {
      name: "agree-more",
      data(){
          return{
             name:"",
             phone:"",
             IDpic: "",
             IDpicfan:"",
             Drivepic: "",
             ftpUrl:"",
             refuseResule:"",
             IDpicCode:"",
             licType:"",
             errorImg: 'this.src="' + require('../../images/timg.jpg') + '"'
          }
      },
      mounted:function () {
         var _this = this ;
         androidIos.bridge(_this);
      },
      methods:{
        go:function () {
          var _this = this;
          _this.phone = _this.$route.query.ph;
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/driver/findDriverInfo",
            data: JSON.stringify({
              userCode:_this.phone,
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout:30000,
            success: function(findDriverInfo){
              if(findDriverInfo.success == "1"){
                _this.ftpUrl = findDriverInfo.ftpUrl;
                _this.name = findDriverInfo.driverName;
                _this.Drivepic = findDriverInfo.ftpUrl + findDriverInfo.driverLic;
                _this.IDpic = findDriverInfo.ftpUrl + findDriverInfo.idCardPos;
                _this.IDpicfan =  findDriverInfo.ftpUrl + findDriverInfo.idCardNeg;
                _this.IDpicCode = findDriverInfo.idCardNum;
                _this.licType = findDriverInfo.licType;
              }else{
                androidIos.second(findDriverInfo.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！")
              }else if(status=="error"){
                androidIos.errorwife();
              }
            }
          });
          $(document).unbind("click").on("click",".label img",function (even) {
            if (even.target.className != "closed" ) {
              var img = $(this).attr("src");
              $("#imgBigbox").remove();
              $("body").append(
                "<div id='imgBigbox'><div class='pinch-zoom'><img id='zoomimg'  src=" +
                img +
                " '></div><div id='zhezhaoImg'></div></div>"
              );
              $("#imgBigbox").css({
                width: "100%",
                height: "100%",
                position: "fixed",
                top: "0",
                left: "0",
                background: "rgb(0,0,0)",
                "z-index": "999",
                display: "block"
              });
              $("#zhezhaoImg").css({
                width: "100%",
                height: "100%",
                position: "absolute",
                background: "rgba(0,0,0,0)",
                "z-index": "999",
                top: "0",
                left: "0"
              });
              $("#imgBigbox img").css({ width: "100%", position: "absolute" });
              var image = document.getElementById("zoomimg");
              image.onload = function() {
                var height = $("#imgBigbox img").height();
                $("div.pinch-zoom").each(function() {
                  new PinchZoom($(this), {});
                });
                $(".pinch-zoom-container").css({
                  width: "100%",
                  height: "100%"
                });
                $("#imgBigbox img").css("top", "50%");
                $(".pinch-zoom").css({ width: "100%", height: "100%" });
                $("#imgBigbox img").css("margin-top", -height / 2 + "px");
                var setImgBox;
                var setImgBoxNumber = 10;
                setImgBox = setInterval(function() {
                  setImgBoxNumber--;
                  if (setImgBoxNumber < 9) {
                    clearInterval(setImgBox);
                    setImgBoxNumber = 10;
                    $("#zhezhaoImg").remove();
                  }
                }, 100);
              };
            }
          });
        },
        agresRefuse:function (type) {
          var _this = this;
          var message = type == 1 ? "同意" : "拒绝" ;
          var http = type == 1 ? "/carrier/acceptApplication" : "/carrier/rejectApplication";
          if(type == 1){
            androidIos.first( "确定" + message + "吗？");
          }else if(type == 2){
            androidIos.third("拒绝理由");
            var refuse = new LArea();
            refuse.init({
              'trigger': '#Z01',
              'valueTo': '#Z01',
              'keys': {
                id: 'id',
                name: 'name'
              },
              'type': 1,
              'data':[{
                "code":"0",
                "region":"无"
              },{
                "code":"1",
                "region":"司机不认识"
              },{
                "code":"2",
                "region":"司机违约次数太多"
              },{
                "code":"3",
                "region":"司机已解除劳动关系"
              }]
            });
            refuse.value = [0];
            refuse.addPointer = function (name) {
              name = JSON.parse(name);
              if(name.firstCode == "0"){
                _this.refuseResule = "";
                $("#Z01").html("请选择拒绝理由");
                $("#Z01").css("color","#999");
              }else{
                _this.refuseResule = name.firstVal;
                $("#Z01").html(name.firstVal);
                $("#Z01").css("color","#333");
              }
            }
          }
          $(".tanBox-yes").unbind('click').click(function() {
            if(type == 2 && _this.refuseResule == ""){
               bomb.first("请选择拒绝理由");
               return false;
            }
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + http,
              data: JSON.stringify({
                userCode: sessionStorage.getItem("token"),
                source: sessionStorage.getItem("source"),
                pkDriver: _this.$route.query.pk,
                memo:type == 1 ? undefined : _this.refuseResule
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (http) {
                $(".tanBox-bigBox").remove();
                if (http.success == "1") {
                  _this.$cjj(message + "成功");
                  setTimeout(function () {
                    androidIos.gobackFrom(_this);
                  },500)
                } else {
                  androidIos.second(http.message);
                }
              },
              complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                  androidIos.second("当前状况下网络状态差，请检查网络！")
                } else if (status == "error") {
                  androidIos.errorwife();
                }
              }
            })
          })
        }
      }
    }
</script>

<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
  }
  a {
    color: #42b983;
  }
  #uploadDataT{
    position: fixed;
    left: 0;
    top:1.3rem;
    bottom:0;
    height: auto;
    overflow-y: scroll;
  }
  .hello {
    background: white;
    border-bottom: 0.03125rem solid #dcdcdc;
  }
  .labelBox {
    width: 100%;
  }
  .companyNameBox {
    line-height: 1rem;
    float: right;
    text-align: right;
    width: 7rem;
    font-size: 0.375rem;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .labelBox p {
    width: 9.68rem;
    padding-left: 0.32rem;
    line-height: 1rem;
    font-size: 0.4rem;
    background: #ececec;
    color: #333;
  }
  .labelBox h1 h5 {
    width: 9.36rem;
    margin-left: 0.32rem;
    padding-right: 0.32rem;
    line-height: 1rem;
    font-size: 0.375rem;
    color: #666;
  }
  .labelBox .label {
    width: 9.36rem;
    margin-left: 0.32rem;
    padding-right: 0.32rem;
    line-height: 1rem;
    height: 1rem;
    font-size: 0.375rem;
    border-bottom: 0.03125rem solid #dcdcdc;
  }
  .labelBox .label span {
    font-size: 0.375rem;
    color: #666;
  }
  .labelBox .label input {
    height: 1rem;
    margin-left: 0.3rem;
    font-size: 0.375rem;
    float: right;
    text-align: right;
    width: 7.3rem;
  }
  .label img{
    width: 4rem;
    height: 2.6rem;
    border: 1px solid #d8d8d8;
  }
  #bottomButton{
      position: fixed;
      bottom: 0;
     left: 0;
     width:100%;
  }
  #bottomButton button{
     width:50%;
    height: 1.2rem;
    color:white;
    float: left;
    font-size: 0.4rem;
  }
  .yes{
    background: #2c9cff;
  }
  .no{
     background: #c7c7c7;
  }
</style>
