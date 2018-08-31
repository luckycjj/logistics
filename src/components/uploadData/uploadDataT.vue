<template>
  <div id="uploadDataT">
    <div class="hello">
      <div id="title" v-title data-title="用户资料"></div>
      <div class="labelBox" v-if="(!(( type == 1 && letterType == 1 )|| type==2))">
        <p>公司信息<span style="margin-left:0.2rem;font-size:0.35rem;color:#999;" v-if="companyType!=0">（{{companyType | companyTypeName}}）</span></p>
        <div style="border-top: 1px solid #dcdcdc;border-bottom: 1px solid #dcdcdc;">
          <div class="label" style="border:none;">
            <span style="float: left;">公司名称</span>
            <div id="companyNameBigBox">{{water.company}}</div>
          </div>
          <div class="label" v-if="creator == 0 && companyType != 2 "  style="border-bottom: none; border-top: 0.03125rem solid #dcdcdc;">
            <span><span style="font-size: 0.375rem;color:#ff803c;">*</span>运输类型</span>
            <div @click="tranTypeLook()" :class="water.tranType == '' ? 'tranTypeSize' : ''" v-html="water.tranType == '' ? '请选择运输类别' : water.tranType" id="tranTypeBigBox"></div>
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
            <span style="float: left;"><span style="font-size: 0.375rem;color:#ff803c;">*</span>邀请码</span>
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
                <div @click="cleanIDcode(0)" v-if="water.Licensepic != ''" style="position:absolute;right:0rem;top:0rem;font-size: 0.3125rem;border-radius: 50%;color:white;width:0.5rem;height: 0.5rem;text-align: center;line-height: 0.45rem;z-index: 3;background: rgba(0,0,0,0.5);">x</div>
                <img id="Licensepic" :src="httpurl + water.Licensepic"  :onerror="errorlogo"  v-if="water.Licensepic != ''">
                <div id="box" @click="recognition(0)" style=" width: 4rem; height: 2.6rem; "  class="imgUpload" v-show="water.Licensepic == ''">
                  <div class="cjjimgbox" style="display: none;">
                    <h1 class="h5u_options_hiddenP">{{water.Licensepic}}</h1>
                  </div>
                </div>
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
          <input type="text" placeholder="输入统一社会信用代码" v-model="water.creditCode" maxlength="18">
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
            <div class="imgBoxBigs" style="float: left;margin-left: 0.18rem; ">
              <div class="imgBox">
                <div @click="cleanIDcode(1)" v-if="water.IDpic != ''" style="position:absolute;right:0rem;top:0rem;font-size: 0.3125rem;border-radius: 50%;color:white;width:0.5rem;height: 0.5rem;text-align: center;line-height: 0.45rem;z-index: 3;background: rgba(0,0,0,0.5);">x</div>
                <img id="IDCODEIMG" :src="httpurl + water.IDpic"  :onerror="errorlogo"  v-if="water.IDpic != ''">
                <div id="box2"  @click="recognition(1)" style=" width: 4rem; height: 2.6rem; " class="imgUpload" v-show="water.IDpic == ''">
                  <div class="cjjimgbox" style="display: none;">
                    <h1 class="h5u_options_hiddenP">{{water.IDpic}}</h1>
                  </div>
                </div>
              </div>
              <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;"><span style="font-size: 0.3125rem;color:#ff803c;">*</span>正面</h5>
            </div>
            <div class="imgBoxBigs" style="float: right;margin-right: 0.18rem; ">
              <div class="imgBox">
                <div id="box5" class="imgUpload"></div>
              </div>
              <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;"><span style="font-size: 0.3125rem;color:#ff803c;">*</span>反面</h5>
            </div>
            <div class="clearBoth"></div>
          </div>
        </div>
        <div class="label" style="border:none;">
          <span style="float: left;"><span style="font-size: 0.375rem;color:#ff803c;">*</span>身份证号码</span>
          <input type="text" placeholder="输入身份证号码" maxlength="18"   v-model="water.peopleNumber">
        </div>
        <div class="label" style="height: auto;border-bottom:none;border-top:0.03125rem solid #dcdcdc;" v-if="type == 1 && letterType == 2">
          <h1 ><h5 style="margin-left: 0;">授权函</h5></h1>
          <div style="margin-left: 0.18rem;margin-top: 0.3rem;">
            <div class="imgBoxBigs" style="float: left;margin-left: 0.18rem; ">
              <div class="imgBox">
                <div id="box6" class="imgUpload"></div>
              </div>
              <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;"><span style="font-size: 0.3125rem;color:#ff803c;">*</span>授权函</h5>
            </div>
            <div class="clearBoth"></div>
          </div>
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
          <div class="imgBoxBig"  v-if=" type == 1 && letterType == 1 ">
            <div class="imgBox">
              <div id="box1" class="imgUpload"></div>
            </div>
            <h4><span style="font-size: 0.3125rem;color:#ff803c;">*</span>道路运输许可证</h4>
          </div>
          <div class="clearBoth"></div>
        </div>
        <div class="label" style="border-bottom:none;border-top:0.03125rem solid #dcdcdc;" v-if="type == 2">
          <span style="float: left;"><span style="font-size: 0.375rem;color:#ff803c;">*</span>驾驶证等级</span>
          <div class="chooseLicType" id="Z02" v-html="water.licType == '' ? '请选择驾驶证等级' : water.licType " :class="water.licType==''?'carnumber':''"></div>
          <div class="clearBoth"></div>
        </div>
      </div>
    </div>
    <button id="submit" @click="submit()" class="letgo">提交审核</button>
    <div id="tranTypeBox" v-if="tranTypeBox">
      <div id="tranType">
        <img src="../../images/closed.png" @click="tranTypeClosed()">
        <p>运输类型</p>
        <div class="tranTypeBox">
          <div class="tranType" v-if="tranTypeList.length > 0">
            <h6>运输类型</h6>
            <ul>
              <li  @click="choosetranType(index)" :class="item.choose ? 'chooseTrue' : '' " v-for="(item,index) in tranTypeList">{{item.displayName}}</li>
              <div class="clearBoth"></div>
            </ul>
          </div>
        </div>
        <button @click="tranTypeSure()">确定</button>
      </div>
    </div>
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
      tranTypeList:[],
      tranTypeBox:false,
      water: {
        userCode:"",
        nvitationodeIC:"",
        company: "",
        tranType:"",
        tranTypeNumber:"",
        bank: "",
        bankNumber: "",
        creditCode:"",
        name: "",
        IDpic: "",
        IDpicfan:"",
        authorization:"",
        Licensepic: "",
        Roadpic: "",
        Travelpic: "",
        Drivepic: "",
        licType:"",
        licTypeCode:"",
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
        if(_this.$route.query.type != undefined){
          if(sessionStorage.getItem("source") == 2){
            var UPMESSA = localStorage.getItem("UPMESSA");
            if(UPMESSA != undefined || UPMESSA != null){
              UPMESSA = JSON.parse(UPMESSA);
              _this.water.IDpicfan = UPMESSA.IDpicfan;
              _this.water.authorization = UPMESSA.authorization;
              _this.water.Drivepic = UPMESSA.Drivepic;
              _this.water.Roadpic = UPMESSA.Roadpic;
              _this.water.Travelpic = UPMESSA.Travelpic;
            }
            localStorage.setItem("UPMESSA",JSON.stringify(_this.water));
          }else if(sessionStorage.getItem("source") == 3){
            var DRIVERMESSA = localStorage.getItem("DRIVERMESSA");
            if(DRIVERMESSA != undefined || DRIVERMESSA != null){
              DRIVERMESSA = JSON.parse(DRIVERMESSA);
              _this.water.IDpicfan = DRIVERMESSA.IDpicfan;
              _this.water.authorization = DRIVERMESSA.authorization;
              _this.water.Drivepic = DRIVERMESSA.Drivepic;
              _this.water.Roadpic = DRIVERMESSA.Roadpic;
              _this.water.Travelpic = DRIVERMESSA.Travelpic;
            }
            localStorage.setItem("DRIVERMESSA",JSON.stringify(_this.water));
          }
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
      if(localStorage.getItem("UPMESSA") != null && _this.$route.query.type == 1){
        var user = JSON.parse(localStorage.getItem("UPMESSA")).userCode;
        if(user != sessionStorage.getItem("token")){
          localStorage.removeItem("UPMESSA");
        }
      }else if(localStorage.getItem("DRIVERMESSA") != null && _this.$route.query.type == 2){
        var user = JSON.parse(localStorage.getItem("DRIVERMESSA")).userCode;
        if(user != sessionStorage.getItem("token")){
          localStorage.removeItem("DRIVERMESSA");
        }
      }
      _this.water.userCode = sessionStorage.getItem("token");
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
                  water.IDpicfan =  getCarrAndCompanyInfo.idCardNeg;
                  water.Licensepic = getCarrAndCompanyInfo.businessLicense;
                  water.Roadpic = getCarrAndCompanyInfo.roadTransLicense;
                  water.Drivepic = getCarrAndCompanyInfo.drivingLicence;
                  water.Travelpic = getCarrAndCompanyInfo.driverLicense;
                  water.peopleNumber = getCarrAndCompanyInfo.idCardNum == null ? "" :getCarrAndCompanyInfo.idCardNum ;
                  water.creditCode = getCarrAndCompanyInfo.socialCreditCode == null ? "" :getCarrAndCompanyInfo.socialCreditCode ;
                  water.authorization = getCarrAndCompanyInfo.certification == null ? "" :getCarrAndCompanyInfo.certification ;
                  var tranType = [];
                  var tranTypeNumber = [];
                  if(getCarrAndCompanyInfo.transType == null){
                    getCarrAndCompanyInfo.transType = [];
                  }
                  for(var i = 0; i < getCarrAndCompanyInfo.transType.length ; i++){
                    tranType.push(getCarrAndCompanyInfo.transType[i].displayName);
                    tranTypeNumber.push(getCarrAndCompanyInfo.transType[i].value);
                  }
                  water.tranType = tranType.join(",");
                  water.tranTypeNumber = tranTypeNumber.join(",");
                }else{
                  _this.type = 2;
                  _this.httpurl = getCarrAndCompanyInfo.ftpUrl;
                  water.name = getCarrAndCompanyInfo.driverName.replace(/[0-9]/g,'');
                  water.Drivepic = getCarrAndCompanyInfo.driverLic;
                  water.IDpic = getCarrAndCompanyInfo.idCardPos;
                  water.IDpicfan =  getCarrAndCompanyInfo.idCardNeg;
                  water.nvitationodeIC = getCarrAndCompanyInfo.inviteCode;
                  water.peopleNumber = getCarrAndCompanyInfo.idCardNum == null ? "" :getCarrAndCompanyInfo.idCardNum ;
                  water.licType =  getCarrAndCompanyInfo.licType == null ? "" :getCarrAndCompanyInfo.licType ;
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
      if(_this.type == 2){
          $.ajax({
            type: "GET",
            url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
            data:{str:"lic_type",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
            dataType: "json",
            timeout: 10000,
            success: function (getCarType) {
              var list = [];
              for(var i = 0; i<getCarType.length;i++){
                var json = {
                  "code":getCarType[i].displayName,
                  "region":getCarType[i].value,
                }
                list.push(json)
              }
              var x = 0;
              for(var i = 0;i<list.length;i++){
                if(list[i].region == _this.water.licType){
                  _this.water.licTypeCode = list[i].code;
                  x = i;
                }
              }
              var area = new LArea();
              area.init({
                'trigger': '#Z02',
                'valueTo': '#Z02',
                'keys': {
                  id: 'id',
                  name: 'name'
                },
                'type': 1,
                'data': list
              });
              area.value = [x];
              area.addPointer = function (name) {
                name = JSON.parse(name);
                _this.water.licType =  name.firstVal;
                _this.water.licTypeCode = name.firstCode;
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
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
        if(_this.type == 1 && _this.letterType == 2  && _this.companyType != 2 && _this.creator == 0 ){
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
        if(_this.type == 1 && _this.letterType == 1){
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
        if(_this.type == 1 && _this.letterType == 2){
          $("#box6").aiiUpload({
            action: androidIos.ajaxHttp() + "/uploadFile",
            max_w: 1000,
            max_h: 1000
          });
          if (_this.water.authorization != null && _this.water.authorization != "") {
            $("#box6 img").attr("src", _this.httpurl + _this.water.authorization);
            $("#box6 img").show();
            $("#box6 .closed").show();
            $("#box6 .cjjimgbox").css("display", "none");
            $("#box6 .cjjimgbox").html(
              "<p class='h5u_options_hiddenP'>" + _this.water.authorization + "</p>"
            );
          }
        }
        $("#box5").aiiUpload({
          action: androidIos.ajaxHttp() + "/uploadFile",
          max_w: 1000,
          max_h: 1000
        });
        if (_this.water.IDpicfan != null && _this.water.IDpicfan != "") {
          $("#box5 img").attr("src", _this.httpurl + _this.water.IDpicfan);
          $("#box5 img").show();
          $("#box5 .closed").show();
          $("#box5 .cjjimgbox").css("display", "none");
          $("#box5 .cjjimgbox").html(
            "<p class='h5u_options_hiddenP'>" + _this.water.IDpicfan + "</p>"
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
        $(document).on('click','.label input',function () {
          var $Val = $.trim($(this).val())
          $(this).val('').focus().val($Val)
        })
        $(document).on("click",".imgBox img",function (even) {
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
    tranTypeLook:function () {
      var _this = this;
      _this.tranTypeBox = true;
      if(_this.tranTypeList == 0){
        $.ajax({
          type: "GET",
          url: androidIos.ajaxHttp() + "/settings/getSysConfigList",
          data: {
            str: "trans_type",
            userCode: sessionStorage.getItem("token"),
            source: sessionStorage.getItem("source")
          },
          dataType: "json",
          timeout: 30000,
          success: function (getSysConfigList) {
            for(var i = 0 ;i < getSysConfigList.length ; i++){
              getSysConfigList[i].choose = false;
            }
            _this.tranTypeList = getSysConfigList;
            var list = _this.water.tranTypeNumber.split(",");
            for(var x = 0 ; x < _this.tranTypeList.length ; x++){
              _this.tranTypeList[x].choose = false;
              for(var i = 0; i < list.length ; i++){
                if(_this.tranTypeList[x].value - list[i] == 0){
                  _this.tranTypeList[x].choose = true;
                }
              }
            }
          },
          complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
            if (status == 'timeout') {//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            } else if (status == 'error') {
              androidIos.errorwife();
            }
          }
        })
      }else{
          var list = _this.water.tranTypeNumber.split(",");
          for(var x = 0 ; x < _this.tranTypeList.length ; x++){
              _this.tranTypeList[x].choose = false;
              for(var i = 0; i < list.length ; i++){
                if(_this.tranTypeList[x].value - list[i] == 0){
                  _this.tranTypeList[x].choose = true;
                }
              }
          }
      }
    },
    choosetranType:function (number) {
      var _this = this;
      _this.tranTypeList[number].choose = !_this.tranTypeList[number].choose;
    },
    tranTypeClosed:function () {
      var _this = this;
      _this.tranTypeBox = false;
    },
    tranTypeSure:function () {
      var _this = this;
      var list = [];
      var list2 = [];
      for(var x = 0 ; x < _this.tranTypeList.length ; x++){
       if(_this.tranTypeList[x].choose){
         list.push(_this.tranTypeList[x].value);
         list2.push(_this.tranTypeList[x].displayName);
       }
      }
      _this.water.tranType = list2.join(",");
      _this.water.tranTypeNumber = list.join(",");
      _this.tranTypeBox = false;
    },
    cleanIDcode:function (type) {
      var _this = this;
      androidIos.first("确定删除吗？");
      $(".tanBox-yes").unbind('click').click(function(){
        $(".tanBox-bigBox").remove();
        if(type == 1){
          _this.water.IDpic = "";
        }else{
          _this.water.Licensepic = "";
        }
      });
    },
    recognition:function (type) {
      var _this = this;
      bridge.invoke("recognition",type,function () {
      });
      WebViewJavascriptBridge.registerHandler('recognitioncallback', function (data, responseCallback) {
        $("#common-blackBox").remove();
        var json = JSON.parse(data);
        if(json.success == "-1"){
           bomb.first("识别失败");
        }
        if(type == 1){
          _this.water.peopleNumber = json.IdCode;
          _this.water.name = json.IdName;
        }else{
           _this.water.creditCode = json.code == "无"  ? "" : json.code ;
        }
        androidIos.loading("正在上传");
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/uploadFile",
          data:JSON.stringify({
            type:type == 1 ? "SFZ" : "YY",
            name:"",
            file:type == 1 ? json.Photo : json.photo,
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (uploadFile) {
            if (uploadFile.success == "1") {
              if(type == 1){
                _this.water.IDpic = uploadFile.path;
              }else{
                _this.water.Licensepic = uploadFile.path;
              }
              _this.$cjj("上传成功");
            } else{
              androidIos.second(uploadFile.message);
            }
          },
          complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
            $("#common-blackBox").remove();
            if (status == 'timeout') { //超时,status还有success,error等值的情况
              androidIos.second("当前状况下网络状态差，请检查网络！")
            } else if (status == "error") {
              androidIos.errorwife();
            }
          }
        });
        responseCallback('js执行过了');
      });
    },
    submit: function() {
      var _this = this;
      if (bomb.hasClass("submit", "letgo")) {
        var water;
        if(_this.$route.query.type == 1){
          if(localStorage.getItem("UPMESSA") !=  undefined){
            water = JSON.parse(localStorage.getItem("UPMESSA"));
          }else{
            water = _this.water;
          }
        }else if(_this.$route.query.type == 2){
          if(localStorage.getItem("DRIVERMESSA") !=  undefined){
            water = JSON.parse(localStorage.getItem("DRIVERMESSA"));
          }else{
            water = _this.water;
          }
        }else{
          water = _this.water;
          var idF = $("#box .cjjimgbox .h5u_options_hiddenP");
          var idS = $("#box1 .cjjimgbox .h5u_options_hiddenP");
          var idT = $("#box2 .cjjimgbox .h5u_options_hiddenP");
          var idFo = $("#box3 .cjjimgbox .h5u_options_hiddenP");
          var idFi = $("#box4 .cjjimgbox .h5u_options_hiddenP");
          var idSi = $("#box5 .cjjimgbox .h5u_options_hiddenP");
          var idSe = $("#box6 .cjjimgbox .h5u_options_hiddenP");
          water.Licensepic = idF.text();
          water.Roadpic = idS.text();
          water.IDpic = idT.text();
          water.Drivepic = idFo.text();
          water.Travelpic = idFi.text();
          water.IDpicfan = idSi.text();
          water.authorization = idSe.text();
        }
        if (_this.type == "1") {
          if (_this.letterType == "1") {
            if (water.Drivepic == "") {
              bomb.first("请上传驾驶证！");
              return false;
            }
            if (water.Travelpic == "") {
              bomb.first("请上传行驶证！");
              return false;
            }
            if (water.Roadpic == "") {
              bomb.first("请上传道路运输许可证！");
              return false;
            }
          } else if (_this.letterType == "2") {
            if(water.tranType == '' && _this.creator == '0' &&  _this.companyType != 2){
              bomb.first("请选择运输类别！");
              return false;
            }
            if( _this.creator == '0' && water.creditCode.length <18  &&  _this.companyType != 2){
              bomb.first("请输入统一社会信用代码！");
              return false;
            }
            if (water.Licensepic == "" && _this.creator == '0' &&  _this.companyType != 2) {
              bomb.first("请上传营业执照！");
              return false;
            }
            if (water.Roadpic == "" && _this.creator == '0' &&  _this.companyType != 2) {
              bomb.first("请上传道路运输许可证！");
              return false;
            }
            if (water.authorization == "") {
              bomb.first("请上传授权函！");
              return false;
            }
          }
        }else if(_this.type == 2){
          if(water.nvitationodeIC.length < 4){
            bomb.first("请输入完整的邀请码！");
            return false;
          }
          if (water.Drivepic == "") {
            bomb.first("请上传驾驶证！");
            return false;
          }
          if (water.licTypeCode == "") {
            bomb.first("请选择驾驶证等级！");
            return false;
          }
        }
        if (
          _this.type == 1 && _this.letterType == 2 && _this.creator == 0 && water.bank != "" &&
          water.bank != null &&
          !/^[\u4e00-\u9fa5]+$/.test(water.bank)
        ) {
          bomb.first("请输入正确的开户行");
          return false;
        }
        if(_this.type == 1 && _this.letterType == 2 && _this.creator == 0 && water.creditCode != "" && water.creditCode != null && !androidIos.CheckSocialCreditCode(water.creditCode)){
          bomb.first("信用代码格式不正确");
          return false;
        }
        if(_this.type == 2 && water.nvitationodeIC != "" && water.nvitationodeIC != null && !/^[\a-z\A-Z\0-9]+$/.test(water.nvitationodeIC)){
          bomb.first("请输入正确的邀请码");
          return false;
        }
        if (water.IDpic == "") {
          bomb.first("请上传身份证正面照！");
          return false;
        }
        if (water.IDpicfan == "") {
          bomb.first("请上传身份证反面照！");
          return false;
        }
        if(water.peopleNumber == ""){
          bomb.first("请输入身份证号码！");
          return false;
        }
        if(water.peopleNumber != "" && water.peopleNumber != null && !androidIos.idCardCheck((water.peopleNumber).toUpperCase())){
          bomb.first("身份证号码格式不对");
          return false;
        }
        if (_this.type == 1 && _this.letterType == 2 && _this.creator == 0 && water.bankNumber != "" && water.bankNumber != null) {
          var regu = /^[1-9]\d*$/;
          if (water.bankNumber.length < 16 || !regu.test(water.bankNumber)) {
            bomb.first("请输入正确的开户行账号");
            return false;
          }
        }
        if (water.name == "") {
          bomb.first("请输入姓名！");
          return false;
        }
        if (
          water.name != "" &&
          (water.name.length < 2 || !/^[\a-z\A-Z\u4e00-\u9fa5]+$/.test(water.name))
        ) {
          bomb.first("请输入正确的姓名");
          return false;
        }
        var json = {
          companyName : _this.type == 1 && _this.letterType == 2 ? water.company  : "",
          bank :  _this.type == 1 && _this.letterType == 2 && _this.creator == 0  &&  _this.companyType != 2  ? water.bank : "",
          bankAccount :  _this.type == 1 && _this.letterType == 2 && _this.creator == 0  &&  _this.companyType != 2 ? water.bankNumber  : "",
          userName : water.name,
          idCardPos :water.IDpic,
          idCardNeg:water.IDpicfan,
          certification:_this.type == 1 && _this.letterType == 2 ? water.authorization : "",
          socialCreditCode:_this.type == 1 && _this.letterType == 2 && _this.creator == 0  &&  _this.companyType != 2 ? (water.creditCode).toUpperCase() : "",
          transType:_this.type == 1 && _this.letterType == 2 && _this.creator == 0  &&  _this.companyType != 2 ? water.tranTypeNumber : "",
          businessLicense :_this.type == 1 && _this.letterType == 2  && _this.creator == 0  &&  _this.companyType != 2 ?  water.Licensepic : "",
          roadTransLicense :  (_this.type == 1 && _this.letterType == 2  && _this.creator == 0  &&  _this.companyType != 2) || (_this.type == 1 && _this.letterType == 1) ? water.Roadpic : "",
          driverLicense : _this.type == 1 && _this.letterType == 1 ? water.Travelpic : "" ,
          drivingLicence : _this.type == 1 && _this.letterType == 1 ? water.Drivepic : "",
          type : _this.type == 1 && _this.letterType == 1? 3 : _this.type == 1 && _this.letterType == 2 ? 2:1,
          companyStatus: _this.type == 1 && _this.letterType == 1 ? "" : _this.companyType,
          isYourSelf:_this.creator == 0 ? 1 : 0 ,
          idCardNum:water.peopleNumber,
          source :sessionStorage.getItem("source"),
          userCode:sessionStorage.getItem("token")
        };
        var data = {
          inviteCode:(water.nvitationodeIC).toUpperCase(),
          driverName:water.name,
          idCardNum:water.peopleNumber,
          driverLic:$("#box3 .h5u_options_hiddenP").text(),
          idCardPos:water.IDpic,
          idCardNeg:water.IDpicfan,
          licType:water.licTypeCode,
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
#companyNameBigBox,#tranTypeBigBox{
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
  height: 0.45rem;
  margin-top: 0.29rem;
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
.carnumber{
  color:#d2d2d2!important;
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
  #IDCODEIMG,#Licensepic,#IDCODEIMGFan{
    width:4rem;
    height: 2.6rem;
  }
  .tranTypeSize{
    color: #BCBCBC!important;
  }
#tranTypeBox{
  position: fixed;
  width:100%;
  top:0;
  bottom:0;
  height: auto;
  z-index: 44;
  background: rgba(0,0,0,0.3);
}
#tranType{
  width: 100%;
  background: white;
  position: absolute;
  bottom:0;
}
#tranType button{
  width:90%;
  line-height: 1rem;
  background: #2c9cff;
  color:white;
  display: block;
  margin: 0.8rem auto 0.3rem auto;
  font-size: 0.375rem;
  border-radius: 0.2rem;
}
#tranType p{
  text-align: center;
  font-size: 0.375rem;
  color:#333;
  line-height: 1rem;
  border-bottom: 1px solid #e6e6e6;
}
.tranTypeBox{
  width:93%;
  margin: 0 auto;
  max-height: 10rem;
}
.tranType{
  margin-top: 0.3rem;
}
.chooseTrue{
  background:#2C9CFF!important;
  color:white!important;
}
.chooseLicType{
   float: right;
  font-size: 0.375rem;
  color:#333;
}
.tranTypeBox h6{
  font-size: 0.375rem;
  color:#333;
}
.tranTypeBox h6 span{
  color:#999;
  font-size: 0.35rem;
}
.tranType li{
  float: left;
  display: block;
  width: 18.5%;
  padding:0 1.375% ;
  text-align: center;
  line-height: 0.8rem;
  font-size: 0.35rem;
  background-color: #f3f3f3;
  color:#666;
  border-radius: 0.2rem;
  margin-top: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 3%;
}
.chooseTrue{
  background-color: #2c9cff!important;
  color:white!important;
}
#tranType img{
  position: absolute;
  width:1rem;
  z-index: 1;
}
</style>
