<template>
  <div id="uploadDataT">
    <div class="hello">
      <div id="title" v-title data-title="用户资料"></div>
      <div class="labelBox" v-if="(!(( type == 1 && letterType == 1 )|| type==2))">
        <p>公司信息<span style="margin-left:0.2rem;font-size:0.35rem;color:#999;" v-if="companyType!=0">（{{companyType | companyTypeName}}）</span></p>
        <div style="border-top: 1px solid #dcdcdc;border-bottom: 1px solid #dcdcdc;">
          <div class="label" style="border:none;">
            <span style="float: left;">公司名称</span>
            <div v-if="water.company!=''" id="companyNameBox" >{{water.company}}</div>
            <input v-else type="text" placeholder="请输入公司名称"  v-model="water.company" maxlength="20">
          </div>
          <div class="label" v-if="creator == 0 && companyType != 2 "  style="border-bottom: none; border-top: 0.03125rem solid #dcdcdc;">
            <span>开户行</span>
            <input type="text" placeholder="输入公司账户开户行" v-model="water.bank" maxlength="20">
          </div>
          <div class="label" v-if="creator == 0 && companyType != 2" style="border-bottom: none; border-top: 0.03125rem solid #dcdcdc;">
            <span>银行账号</span>
            <input type="tel" placeholder="输入公司银行账号" v-model="water.bankNumber" maxlength="19">
          </div>
        </div>
      </div>
      <div class="labelBox" style="border-bottom: 0.03125rem solid #dcdcdc"  v-if="!(( type == 1 && letterType == 1 )|| type==2) && (creator == 0 && companyType != 2 )">
        <h1><h5>证件信息</h5>
          <div class="clearBoth"></div>
          <div class="imgBoxBig">
              <div class="imgBox">
                  <div id="box" class="imgUpload"></div>
              </div>
            <h4><span style="font-size: 0.3125rem;color:#ff803c;">*</span>营业执照</h4>
          </div>
          <div class="imgBoxBig">
            <div class="imgBox">
              <div id="box1" class="imgUpload"></div>
            </div>
            <h4><span style="font-size: 0.3125rem;color:#ff803c;">*</span>道路运输许可证</h4>
          </div>
          <div class="clearBoth"></div>
        </h1>
      </div>
      <div class="labelBox">
        <p>个人信息</p>
        <div class="label">
          <span style="float: left;"><span style="font-size: 0.375rem;color:#ff803c;">*</span>您的姓名</span>
          <input type="text" placeholder="输入姓名" maxlength="10"   v-model="water.name">
        </div>
        <div class="label" style="height: auto;border:none">
          <h1><h5 style="margin-left: 0;">身份证</h5></h1>
          <div style="margin-left: 0.18rem;margin-top: 0.3rem;">
            <div class="imgBox">
              <div id="box2" class="imgUpload"></div>
            </div>
            <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;"><span style="font-size: 0.3125rem;color:#ff803c;">*</span>正面</h5>
          </div>
        </div>
        <div class="label" style="height: auto;border:none" v-if="( type == 1 && letterType == 1 )|| type==2">
          <span>证件</span>
          <div class="clearBoth"></div>
          <div class="imgBoxBigs" style="float: left;margin-left: 0.18rem; ">
            <div class="imgBox">
              <div id="box3" class="imgUpload"></div>
            </div>
            <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;"><span style="font-size: 0.3125rem;color:#ff803c;">*</span>驾驶证</h5>
          </div>
          <div class="imgBoxBigs" style="float: right;margin-right: 0.18rem;" v-if=" type == 1 && letterType == 1 ">
            <div class="imgBox">
              <div id="box4" class="imgUpload"></div>
            </div>
            <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;"><span style="font-size: 0.3125rem;color:#ff803c;">*</span>行驶证</h5>
          </div>
          <div class="clearBoth"></div>
        </div>
      </div>
    </div>
    <button id="submit" @click="submit()" class="letgo">提交审核</button>
    <div class='tanBox-bigBoxS' v-if="tanBox">
      <div class='tanBoxS-box'>
        <div class='tanBoxS-class'>
          <img src='../../images/okgoyes.png'>
          <p>提交成功</p>
          <h4>{{tanBoxmessage}}</h4>
        </div>
        <div class='tanBoxS-button'><button  class='okokgo' @click="iknow()">我知道了</button></div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../js/images";
import bridge from "../../js/bridge";
import { androidIos } from "../../js/app";
import { bomb } from "../../js/zujian.js";
import PinchZoom from "../../js/pinchzoom";
export default {
  name: "uploadDataT",
  data() {
    return {
      type: "",
      letterType: "",
      companyType: 1,
      creator: 1,
      water: {
        company: "",
        bank: "",
        bankNumber: "",
        name: "",
        IDpic: "",
        Licensepic: "",
        Roadpic: "",
        Travelpic: "",
        Drivepic: ""
      },
      tanBox: false,
      tanBoxmessage: "",
      httpurl: "",
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      this.go();
    });
  },
  methods: {
    go: function() {
      var _this = this;
      if (_this.$route.query.type != undefined) {
        _this.type = _this.$route.query.type;
      }else{
        var json = {
           userCode:sessionStorage.getItem("token"),
           source:sessionStorage.getItem("source")
        }
        var http = sessionStorage.getItem("source") == "2" ? "/getCarrAndCompanyInfo" :"/driver/findDriverInfo";
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + http,
          data: JSON.stringify(json),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          async:false,
          timeout:10000,
          success: function(getCarrAndCompanyInfo){
            if(getCarrAndCompanyInfo.success == "1"){
              var water = _this.water;
              if(sessionStorage.getItem("source") == "2"){
                _this.type = 1 ;
                _this.letterType = getCarrAndCompanyInfo.type == 3 ? 1: 2;
                _this.companyType = getCarrAndCompanyInfo.status;
                _this.httpurl = getCarrAndCompanyInfo.ftpUrl;
                _this.creator = getCarrAndCompanyInfo.isYourSelf == "1" ? 0 : 1 ;
                water.bank = getCarrAndCompanyInfo.bank;
                water.bankNumber = getCarrAndCompanyInfo.bankAccount;
                water.company = getCarrAndCompanyInfo.corpName;
                water.name = getCarrAndCompanyInfo.userName;
                water.IDpic = getCarrAndCompanyInfo.idCardPos;
                water.Licensepic = getCarrAndCompanyInfo.businessLicense;
                water.Roadpic = getCarrAndCompanyInfo.roadTransLicense;
                water.Drivepic = getCarrAndCompanyInfo.drivingLicence;
                water.Travelpic = getCarrAndCompanyInfo.driverLicense;
              }else{
                _this.type = 2;
                _this.httpurl = getCarrAndCompanyInfo.ftpUrl;
                water.name = getCarrAndCompanyInfo.driverName;
                water.Drivepic = getCarrAndCompanyInfo.driverLic;
                water.IDpic = getCarrAndCompanyInfo.idCardPos;
              }
            }else{
              androidIos.second(getCarrAndCompanyInfo.message);
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
      }
      if (_this.$route.query.letterType != undefined) {
        _this.letterType = _this.$route.query.letterType;
      }
      if (_this.$route.query.companyName != undefined) {
        _this.water.company = _this.$route.query.companyName;
      }
      if (_this.$route.query.creator != undefined) {
        _this.creator = _this.$route.query.creator;
      }
      if (_this.$route.query.companyType != undefined) {
        _this.companyType = _this.$route.query.companyType;
      } else {
        if (_this.companyType == "") {
          _this.companyType = 1;
        }
      }
      _this.$nextTick(function() {
        if(!(( _this.type == 1 && _this.letterType == 1 )|| _this.type==2) && ( _this.companyType == 0 || _this.creator == 0 )){
          $("#box").aiiUpload({
            action: androidIos.ajaxHttp() + "/uploadFile",
            max_w: 1000,
            max_h: 1000
          });
          if (_this.water.Licensepic != null && _this.water.Licensepic != "") {
            $("#box img").attr("src", _this.httpurl + _this.water.Licensepic);
            $("#box img").show();
            $("#box .closed").show();
            $("#box .cjjimgbox").css("display", "none");
            $("#box .cjjimgbox").html(
              "<p class='h5u_options_hiddenP'>" + _this.water.Licensepic + "</p>"
            );
          }
          $("#box1").aiiUpload({
            action: androidIos.ajaxHttp() + "/uploadFile",
            max_w: 1000,
            max_h: 1000
          });
          if (_this.water.Roadpic != null && _this.water.Roadpic != "") {
            $("#box1 img").attr("src", _this.httpurl + _this.water.Roadpic);
            $("#box1 img").show();
            $("#box1 .closed").show();
            $("#box1 .cjjimgbox").css("display", "none");
            $("#box1 .cjjimgbox").html(
              "<p class='h5u_options_hiddenP'>" + _this.water.Roadpic + "</p>"
            );
          }
        }
        $("#box2").aiiUpload({
          action: androidIos.ajaxHttp() + "/uploadFile",
          max_w: 1000,
          max_h: 1000
        });
        if (_this.water.IDpic != null && _this.water.IDpic != "") {
          $("#box2 img").attr("src", _this.httpurl + _this.water.IDpic);
          $("#box2 img").show();
          $("#box2 .closed").show();
          $("#box2 .cjjimgbox").css("display", "none");
          $("#box2 .cjjimgbox").html(
            "<p class='h5u_options_hiddenP'>" + _this.water.IDpic + "</p>"
          );
        }
        if( ( _this.type == 1 && _this.letterType == 1 )|| _this.type==2 ){
          $("#box3").aiiUpload({
            action: androidIos.ajaxHttp() + "/uploadFile",
            max_w: 1000,
            max_h: 1000
          });
          if (_this.water.Drivepic != null && _this.water.Drivepic != "") {
            $("#box3 img").attr("src", _this.httpurl + _this.water.Drivepic);
            $("#box3 img").show();
            $("#box3 .closed").show();
            $("#box3 .cjjimgbox").css("display", "none");
            $("#box3 .cjjimgbox").html(
              "<p class='h5u_options_hiddenP'>" + _this.water.Drivepic + "</p>"
            );
          }
          if(_this.type == 1 && _this.letterType == 1){
            $("#box4").aiiUpload({
              action: androidIos.ajaxHttp() + "/uploadFile",
              max_w: 1000,
              max_h: 1000
            });
            if (_this.water.Travelpic != null && _this.water.Travelpic != "") {
              $("#box4 img").attr("src", _this.httpurl + _this.water.Travelpic);
              $("#box4 img").show();
              $("#box4 .closed").show();
              $("#box4 .cjjimgbox").css("display", "none");
              $("#box4 .cjjimgbox").html(
                "<p class='h5u_options_hiddenP'>" + _this.water.Travelpic + "</p>"
              );
            }
          }
        }
        $(document).unbind("click").on("click",".upbox img",function (even) {
            if (even.target.className != "closed") {
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
      });
    },
    submit: function() {
      var _this = this;
      if (bomb.hasClass("submit", "letgo")) {
        var water = _this.water;
        var idF = $("#box .cjjimgbox .h5u_options_hiddenP");
        var idS = $("#box1 .cjjimgbox .h5u_options_hiddenP");
        var idT = $("#box2 .cjjimgbox .h5u_options_hiddenP");
        var idFo = $("#box3 .cjjimgbox .h5u_options_hiddenP");
        var idFi = $("#box4 .cjjimgbox .h5u_options_hiddenP");
        water.Licensepic = idF.text();
        water.Roadpic = idS.text();
        water.IDpic = idT.text();
        water.Drivepic = idFo.text();
        water.Travelpic = idFi.text();
        if (_this.type == "1") {
          if (_this.letterType == "1") {
            if (water.name == "") {
              bomb.first("请输入姓名！");
              return false;
            }
            if (water.IDpic == "") {
              bomb.first("请上传身份证正面照！");
              return false;
            }
            if (water.Drivepic == "") {
              bomb.first("请上传驾驶证！");
              return false;
            }
            if (water.Travelpic == "") {
              bomb.first("请上传行驶证！");
              return false;
            }
          } else if (_this.letterType == "2") {
            if (water.Licensepic == "" && _this.creator == '0') {
              bomb.first("请上传营业执照！");
              return false;
            }
            if (water.Roadpic == "" && _this.creator == '0') {
              bomb.first("请上传道路运输许可证！");
              return false;
            }
            if (water.name == "") {
              bomb.first("请输入姓名！");
              return false;
            }
            if (water.IDpic == "") {
              bomb.first("请上传身份证正面照！");
              return false;
            }
          }
        }else if(_this.type == 2){
          if (water.name == "") {
            bomb.first("请输入姓名！");
            return false;
          }
          if (water.IDpic == "") {
            bomb.first("请上传身份证正面照！");
            return false;
          }
          if (water.Drivepic == "") {
            bomb.first("请上传驾驶证！");
            return false;
          }
        }
        if (
          water.bank != "" &&
          water.bank != null &&
          !/^[\u4e00-\u9fa5]+$/.test(water.bank)
        ) {
          bomb.first("请输入正确的开户行");
          return false;
        }
        if (water.bankNumber != "" && water.bankNumber != null) {
          var regu = /^[1-9]\d*$/;
          if (water.bankNumber.length < 16 || !regu.test(water.bankNumber)) {
            bomb.first("请输入正确的开户行账号");
            return false;
          }
        }
        if (
          water.name != "" &&
          (water.name.length < 2 || !/^[\u4e00-\u9fa5]+$/.test(water.name))
        ) {
          bomb.first("请输入正确的姓名");
          return false;
        }
        var json = {
          companyName : _this.type == 1 && _this.letterType == 1 ? undefined  : water.company,
          bank :  _this.type == 1 && _this.letterType == 1 ? undefined : water.bank,
          bankAccount :  _this.type == 1 && _this.letterType == 1 ? undefined  : water.bankNumber,
          userName : water.name,
          idCardPos : $("#box2 .h5u_options_hiddenP").text(),
          businessLicense : _this.type == 1 && _this.letterType == 1 ? undefined : $("#box .h5u_options_hiddenP").text(),
          roadTransLicense : _this.type == 1 && _this.letterType == 1 ? undefined : $("#box1 .h5u_options_hiddenP").text(),
          driverLicense : !(this.type == 1 && _this.letterType == 1) ? undefined:$("#box4 .h5u_options_hiddenP").text(),
          drivingLicence :  !( _this.type == 1 && _this.letterType == 1) ? undefined : $("#box3 .h5u_options_hiddenP").text(),
          type : _this.type == 1 && _this.letterType == 1? 3 : _this.type == 1 && _this.letterType == 2 ? 2:1,
          companyStatus: _this.type == 1 && _this.letterType == 1 ? undefined : _this.companyType,
          isYourSelf:_this.creator == 0 ? 1 : 0 ,
          source :sessionStorage.getItem("source"),
          userCode:sessionStorage.getItem("token")
        };
        var data = {
          driverName:water.name,
          driverLic:$("#box3 .h5u_options_hiddenP").text(),
          idCardPos:$("#box2 .h5u_options_hiddenP").text(),
          source :sessionStorage.getItem("source"),
          userCode:sessionStorage.getItem("token")
        }
        var http = _this.type == 1 ? "/uploadCarrCertification" : "/driver/uploadDriverInfo" ;
        androidIos.loading("正在上传");
        bomb.removeClass("submit", "letgo");
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+http,
          data: _this.type == 1 ? JSON.stringify(json) :JSON.stringify(data),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout:20000,
          success: function(data){
            bomb.addClass("submit", "letgo");
            if(data.success=="1"){
              $("#common-blackBox").remove();
              _this.tanBox = true;
              _this.tanBoxmessage =
                "请等待运维专员审核";
            }else if(data.success=="-1"){
              androidIos.second(data.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            $("#common-blackBox").remove();
            bomb.addClass("submit", "letgo");
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("当前状况下网络状态差，请检查网络！")
            }else if(status=="error"){
              androidIos.errorwife();
            }
          }
        });
      } else {
        bomb.first("请不要频繁点击");
      }
    },
    iknow: function() {
      var _this = this;
      _this.tanBox = false;
      bridge.invoke('gobackfrom');
    }
  }
};
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
  top:1.21875rem;
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
#companyNameBox {
  line-height: 1rem;
  float: right;
  text-align: right;
  width: 7.7rem;
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
  border-bottom: 0.03125rem solid #dcdcdc;
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
.imgBox {
  width: 4rem;
  height: 2.6rem;
  background: #c9c9c9;
  overflow: hidden;
  position: relative;
}
.imgBox img {
  width: 4rem;
  height: 2rem;
}
.imgBoxBig {
  float: left;
  width: 50%;
  margin-bottom: 0.2rem;
  overflow: hidden;
}
.imgBoxBig .imgBox {
  margin: 0.3125rem auto;
}
.imgBoxBig h4 {
  font-size: 0.3125rem;
  text-align: center;
}
#submit {
  width: 93%;
  display: block;
  margin: 0.86rem auto 0.1rem auto;
  height: 1rem;
  background: #3399FF;
  color: white;
  font-size: 0.375rem;
  letter-spacing: 0.03125rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.1rem 0.1rem #ccc;
}
.file {
  position: absolute;
  width: 4rem;
  height: 2rem;
  opacity: 0;
  z-index: 11;
}
.tanBox-bigBoxS {
  width: 100%;
  position: fixed;
  z-index: 1199;
  left: 0;
  top: 0;
  bottom: 0;
  height: auto;
  background: rgba(0, 0, 0, 0.5);
}
.tanBoxS-box {
  width: 8rem;
  position: absolute;
  z-index: 1199;
  left: 50%;
  margin-left: -4rem;
  background: white;
  top: 30%;
  overflow: hidden;
  padding-bottom: 0.56rem;
}
.tanBoxS-box p {
  text-align: center;
  font-size: 0.5rem;
  color: #000;
  width: 80%;
  margin-left: 10%;
}
.tanBoxS-box img {
  display: block;
  width: 1.74rem;
  margin: 0.5rem auto;
}
.tanBoxS-box h4 {
  text-align: center;
  font-size: 0.375rem;
  color: #666;
  width: 80%;
  padding: 0.4rem 0;
  margin-left: 10%;
}
.tanBoxS-button button {
  background: white;
  display: block;
  border-radius: 0.445rem;
  height: 0.89rem;
  width: 2.67rem;
  margin: 0 auto;
  font-size: 0.375rem;
  border: 1px solid #3399FF;
  color: #3399FF;
}
</style>
