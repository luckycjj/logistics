<template>
  <div id="uploadDataT">
    <div class="hello">
      <div id="title" v-title data-title="用户资料"></div>
      <div class="labelBox" v-if="(!(( type == 1 && letterType == 1 )|| type==2))">
        <p>公司信息<span style="margin-left:0.2rem;font-size:0.35rem;color:#999;" v-if="companyType!=0">（{{companyType | companyTypeName}}）</span></p>
        <div style="border-top: 1px solid #dcdcdc;border-bottom: 1px solid #dcdcdc;">
          <div class="label" style="border:none;">
            <span style="float: left;">公司名称</span>
            <div v-if="water.company!=''" id="companyNameBigBox">{{water.company}}</div>
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
      <div class="labelBox" v-if="type==2">
        <p>承运商</p>
        <div style="border-top: 1px solid #dcdcdc;border-bottom: 1px solid #dcdcdc;">
          <div class="label" style="border:none;">
            <span style="float: left;">邀请码</span>
            <div v-if="nvitationodeICRevise == 2"  id="nvitationodeIC">{{water.nvitationodeIC}}</div>
            <input v-else type="text" placeholder="请输入邀请码"  v-model="water.nvitationodeIC" maxlength="6">
          </div>
        </div>
      </div>
      <div class="labelBox" style="border-bottom: 0.03125rem solid #dcdcdc"  v-if="!(( type == 1 && letterType == 1 )|| type==2) && (creator == 0 && companyType != 2 )">
        <h1><h5>证件信息</h5>
          <div class="clearBoth"></div>
          <div class="imgBoxBig">
              <div class="imgBox">
                <div @click="cleanIDcode()" v-if="water.Licensepic != ''" style="position:absolute;right:0rem;top:0rem;font-size: 0.3125rem;border-radius: 50%;color:white;width:0.5rem;height: 0.5rem;text-align: center;line-height: 0.45rem;z-index: 3;background: rgba(0,0,0,0.5);">x</div>
                <div id="box" class="imgUpload" v-if="water.Licensepic == ''"></div>
                <img id="Licensepic" :src="httpurl + water.Licensepic"  :onerror="errorlogo"  v-else>
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
        <div class="label" v-if="creator == 0 && companyType != 2" style="border-bottom: none;">
          <span><span style="font-size: 0.3125rem;color:#ff803c;">*</span>信用代码</span>
          <input type="tel" placeholder="输入统一社会信用代码" v-model="water.creditCode" maxlength="18">
        </div>
      </div>
      <div class="labelBox">
        <p>个人信息</p>
        <div class="label">
          <span style="float: left;"><span style="font-size: 0.375rem;color:#ff803c;">*</span>您的姓名</span>
          <input type="text" placeholder="输入姓名" maxlength="10"   v-model="water.name">
        </div>
        <div class="label" style="height: auto;border: none;">
          <h1 ><h5 style="margin-left: 0;">身份证</h5></h1>
          <div style="margin-left: 0.18rem;margin-top: 0.3rem;">
            <div class="imgBox">
              <div @click="cleanIDcode()" v-if="water.IDpic != ''" style="position:absolute;right:0rem;top:0rem;font-size: 0.3125rem;border-radius: 50%;color:white;width:0.5rem;height: 0.5rem;text-align: center;line-height: 0.45rem;z-index: 3;background: rgba(0,0,0,0.5);">x</div>
              <div id="box2" class="imgUpload" v-if="water.IDpic == ''"></div>
              <img id="IDCODEIMG" :src="httpurl + water.IDpic"  :onerror="errorlogo"  v-else>
            </div>
            <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;"><span style="font-size: 0.3125rem;color:#ff803c;">*</span>正面</h5>
          </div>
        </div>
        <div class="label" style="border:none;">
          <span style="float: left;"><span style="font-size: 0.375rem;color:#ff803c;">*</span>身份证号码</span>
          <input type="text" placeholder="输入身份证号码" maxlength="18"   v-model="water.peopleNumber">
        </div>
        <div class="label" style="height: auto;border-bottom:none;border-top:0.03125rem solid #dcdcdc;" v-if="( type == 1 && letterType == 1 )|| type==2">
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
      nvitationodeICRevise:1,
      water: {
        nvitationodeIC:"",
        company: "",
        bank: "",
        bankNumber: "",
        creditCode:"",
        name: "",
        IDpic: "",
        Licensepic: "",
        Roadpic: "",
        Travelpic: "",
        Drivepic: "",
        peopleNumber:""
      },
      tanBox: false,
      tanBoxmessage: "",
      httpurl: "",
      errorlogo: 'this.src="' + require('../../images/timg.jpg') + '"',
    };
  },
  watch:{
    water:{
      handler:function(val,oldval){
        var _this = this;
        if(sessionStorage.getItem("source") == 2){
          var UPMESSA = localStorage.getItem("UPMESSA");
          if(UPMESSA != undefined || UPMESSA != null){
            UPMESSA = JSON.parse(UPMESSA);
            _this.water.IDpic = UPMESSA.IDpic;
            _this.water.Drivepic = UPMESSA.Drivepic;
            _this.water.Licensepic = UPMESSA.Licensepic;
            _this.water.Roadpic = UPMESSA.Roadpic;
            _this.water.Travelpic = UPMESSA.Travelpic;
          }
          localStorage.setItem("UPMESSA",JSON.stringify(_this.water));
        }else if(sessionStorage.getItem("source") == 3){
          var DRIVERMESSA = localStorage.getItem("DRIVERMESSA");
          if(DRIVERMESSA != undefined || DRIVERMESSA != null){
            DRIVERMESSA = JSON.parse(DRIVERMESSA);
            _this.water.IDpic = DRIVERMESSA.IDpic;
            _this.water.Drivepic = DRIVERMESSA.Drivepic;
            _this.water.Licensepic = DRIVERMESSA.Licensepic;
            _this.water.Roadpic = DRIVERMESSA.Roadpic;
            _this.water.Travelpic = DRIVERMESSA.Travelpic;
          }
          localStorage.setItem("DRIVERMESSA",JSON.stringify(_this.water));
        }
      },
      deep:true
    }
  },
  mounted: function() {
    var _this = this;
    androidIos.bridge(_this);
  },
  methods: {
    go: function() {
      var _this = this;
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/settings/findParamValueByName ",
        data: JSON.stringify({
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source"),
          paramName:"resourcePath"
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async:false,
        timeout:30000,
        success: function(findParamValueByName){
          if(findParamValueByName.success == "1"){
            _this.httpurl = findParamValueByName.paramValue;
          }else{
            androidIos.second(findParamValueByName.message);
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
      //revise 1修改 2不修改
      _this.nvitationodeICRevise = _this.$route.query.revise == undefined ? 1 : _this.$route.query.revise ;

        if (_this.$route.query.type != undefined) {
          _this.type = _this.$route.query.type;
          if(_this.$route.query.type == "2"){
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/driver/getInviteCode",
              data: JSON.stringify({
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source")
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              async:false,
              timeout:10000,
              success: function(getInviteCode){
                if(getInviteCode.success == "1"){
                  var water = _this.water;
                  water.nvitationodeIC = getInviteCode.inviteCode;
                }else{
                  androidIos.second(getInviteCode.message);
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
          if(localStorage.getItem("UPMESSA") != null && _this.$route.query.type == 1){
             _this.water = JSON.parse(localStorage.getItem("UPMESSA"));
          }else if(localStorage.getItem("DRIVERMESSA") != null && _this.$route.query.type == 2){
            _this.water = JSON.parse(localStorage.getItem("DRIVERMESSA"));
          }
        }else{
          if(sessionStorage.getItem("source") == 2){
            localStorage.removeItem("UPMESSA");
          }else if(sessionStorage.getItem("source") == 3){
            localStorage.removeItem("DRIVERMESSA");
          }
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
                  water.name = getCarrAndCompanyInfo.userName.replace(/[0-9]/g,'');
                  water.IDpic = getCarrAndCompanyInfo.idCardPos;
                  water.Licensepic = getCarrAndCompanyInfo.businessLicense;
                  water.Roadpic = getCarrAndCompanyInfo.roadTransLicense;
                  water.Drivepic = getCarrAndCompanyInfo.drivingLicence;
                  water.Travelpic = getCarrAndCompanyInfo.driverLicense;
                }else{
                  _this.type = 2;
                  _this.httpurl = getCarrAndCompanyInfo.ftpUrl;
                  water.name = getCarrAndCompanyInfo.driverName.replace(/[0-9]/g,'');
                  water.Drivepic = getCarrAndCompanyInfo.driverLic;
                  water.IDpic = getCarrAndCompanyInfo.idCardPos;
                  water.nvitationodeIC = getCarrAndCompanyInfo.inviteCode;
                  water.peopleNumber = getCarrAndCompanyInfo.idCardNum == null ? "" :getCarrAndCompanyInfo.idCardNum ;
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
        $(document).on('click','.label input',function () {
          var $Val = $.trim($(this).val())
          $(this).val('').focus().val($Val)
        })
        $(document).on("click",".upbox img",function (even) {
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
    cleanIDcode:function () {
      var _this = this;
      androidIos.first("确定删除吗？");
      $(".tanBox-yes").unbind('click').click(function(){
        $(".tanBox-bigBox").remove();
        _this.water.IDpic = "";
      });
    },
    submit: function() {
      var _this = this;
      if (bomb.hasClass("submit", "letgo")) {
        var water = _this.water;
        if(_this.$route.query.type == 1){
          water = JSON.parse(localStorage.getItem("UPMESSA"));
        }else if(_this.$route.query.type == 2){
          water = JSON.parse(localStorage.getItem("DRIVERMESSA"));
        }
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
            if( _this.creator == '0' && water.creditCode.length <18 ){
              bomb.first("请输入统一社会信用代码！");
              return false;
            }
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
          if(water.nvitationodeIC.length < 4){
            bomb.first("请输入完整的邀请码！");
            return false;
          }
          if (water.name == "") {
            bomb.first("请输入姓名！");
            return false;
          }
          if(water.peopleNumber == ""){
            bomb.first("请输入身份证号码！");
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
        if(water.nvitationodeIC != "" && water.nvitationodeIC != null && !/^[\a-z\A-Z\0-9]+$/.test(water.nvitationodeIC)){
          bomb.first("请输入正确的邀请码");
          return false;
        }
        if(water.peopleNumber != "" && water.peopleNumber != null && !androidIos.idCardCheck(water.peopleNumber )){
          bomb.first("身份证号码格式不对");
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
          idCardPos :water.IDpic,
          businessLicense : _this.type == 1 && _this.letterType == 1 ? undefined : water.Licensepic,
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
          inviteCode:(_this.water.nvitationodeIC).toUpperCase(),
          driverName:water.name,
          idCardNum:water.peopleNumber,
          driverLic:$("#box3 .h5u_options_hiddenP").text(),
          idCardPos:water.IDpic,
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
              if(sessionStorage.getItem("source") == 2){
                localStorage.removeItem("UPMESSA");
              }else if(sessionStorage.getItem("source") == 3){
                localStorage.removeItem("DRIVERMESSA");
              }
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
#companyNameBigBox{
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
#nvitationodeIC{
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
  height: 0.4rem;
  margin-top: 0.3rem;
  margin-left: 0.3rem;
  font-size: 0.375rem;
  float: right;
  text-align: right;
  width: 6.5rem;
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
  #IDCODEIMG,#Licensepic{
    width:4rem;
    height: 2.6rem;
  }
</style>
