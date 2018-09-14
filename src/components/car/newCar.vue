<template>
  <div class="carAdministrationSBox" id="newCar">
    <div id="title" v-title data-title="车辆信息"></div>
    <div class="box">
      <span>车辆类型</span>
      <p id="Z03":class="message.carmodel=='请选择车辆类型'?'carnumber':''">{{message.carmodel}}</p>
      <div class="clearBoth"></div>
    </div>
    <div class="box" style="margin-top: 0px;" v-show="message.carmodelNumber == '5de1912471af4c2d839a27f268cd8ca7' || message.carmodelNumber == '41efd612fc2e4067a1debc30a1c36383' || message.carmodelNumber == ''">
      <span>运输类型</span>
      <p id="Z04" :class="message.cartrantype=='请选择运输类型'?'carnumber':''">{{message.cartrantype}}</p>
      <div class="clearBoth"></div>
    </div>
    <div class="box" style="margin-top: 0px;"  v-show="message.carmodelNumber == '5de1912471af4c2d839a27f268cd8ca7' || message.carmodelNumber == '41efd612fc2e4067a1debc30a1c36383' || message.carmodelNumber == ''">
      <span>车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型</span>
      <p id="Z00":class="message.type=='请选择车型'?'carnumber':''">{{message.type}}</p>
      <div class="clearBoth"></div>
    </div>
    <div class="box" style="margin-top: 0px;" v-show="message.carmodelNumber == '5de1912471af4c2d839a27f268cd8ca7' || message.carmodelNumber == '41efd612fc2e4067a1debc30a1c36383' || message.carmodelNumber == ''">
      <span>车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长</span>
      <p id="Z02" :class="message.carlength=='请选择车长'?'carnumber':''">{{message.carlength}}</p>
      <div class="clearBoth"></div>
    </div>
    <div class="box" style="margin-top: 0px;">
      <span>车牌号码</span>
      <h6 @click="carList=true" >{{message.plateName}}</h6>
      <p @click="keyboardshow()" :class="message.carNumber=='请输入车牌号'?'carnumber':(message.carNumber!='请输入车牌号'&&message.carNumber.length==7)?'carGreen':(message.carNumber!='请输入车牌号'&&message.carNumber.length==6)?'carBrown':''">{{message.carNumber}}</p>
      <div class="clearBoth"></div>
    </div>
    <div class="box" style="margin-top: 0px;"  v-show="message.carmodelNumber == '5de1912471af4c2d839a27f268cd8ca7' || message.carmodelNumber == '41efd612fc2e4067a1debc30a1c36383' || message.carmodelNumber == ''">
      <span>载&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量</span>
      <p style="width:auto">吨</p>
      <input type="tel" maxlength="10" @keyup="weightKey()" v-model="message.weight" placeholder="请输入载量" />
      <div class="clearBoth"></div>
    </div>
    <div class="box" style="margin-top: 0px;height: auto"  v-show="message.carmodelNumber == '5de1912471af4c2d839a27f268cd8ca7' || message.carmodelNumber == '2ba6da2fd9cd4689965afe5abc8f9df4' || message.carmodelNumber == ''">
      <span>行驶证</span>
      <div class="clearBoth"></div>
      <div class="imgBoxBigs" style="float: left;margin:0 5% 0.5rem 5%; ">
        <div class="imgBox">
          <div id="box4" class="imgUpload"></div>
        </div>
      </div>
      <div class="clearBoth"></div>
    </div>
    <button id="ok" class="okgo gogogo" @click="ok()">确定</button>
    <div v-if="carList" id="carListBox" @click="carListHideAgain($event)">
      <div id="carList">
        <p v-for="(item,index) in carTypeList" @click="carClick(index,item.region)" :class="item.code==2?'carCode':''">{{item.region}}</p>
        <button @click="carList=false"> 完成</button>
      </div>
    </div>
    <div v-if="keyboard" id="keyboardBox" @click="keyboardHideAgain($event)">
      <div id="keyboard">
        <p v-for="item in keyboardNumber" @click="carkeyboard(item.name)">{{item.name}}</p>
        <div class="clearBoth"></div>
        <p v-for="item in keyboardLetter.first" @click="carkeyboard(item.name)">{{item.name}}</p>
        <div class="clearBoth"></div>
        <div style="margin-left:0.500115rem" ><p v-for="item in keyboardLetter.second"   @click="carkeyboard(item.name)">{{item.name}}</p></div>
        <div class="clearBoth"></div>
        <div style="margin-left:1.500345rem" ><p v-for="item in keyboardLetter.third"   @click="carkeyboard(item.name)">{{item.name}}</p></div>
        <p class="keyRemove" @click="keyremove()"></p>
        <div class="clearBoth"></div>
        <p class="keyBlack"></p>
        <p class="keyBlack"></p>
        <p class="keySpace">space</p>
        <p class="keyOk" @click="keyboard=false">down</p>
      </div>
    </div>
  </div>
</template>
<script>
  import  {androidIos} from '../../js/app';
  import {myScroll} from "../../js/myScroll"
  import {shujvyuan} from '../../js/shujv'
  import {bomb} from '../../js/zujian.js'
  import Debounce from '../../js/Debounce.js'
  export default {
    name: 'newCar',
    data () {
      return {
        message:{
          type: '请选择车型',
          carlength:'请选择车长',
          carmodel:"请选择车辆类型",
          cartrantype:"请选择运输类型",
          carmodelNumber:"",
          carCode:"",
          carlengthCode:"",
          cartrantypeCode:"",
          carNumber:"请输入车牌号",
          plateName:"沪",
          weight:"",
          /*driver:"请选择司机",
          driverPk:"",*/
          carpk:"",
          Travelpic:"",
        },
        carTypeList:[],
        minWeight:"",
        maxWeight:"",
        keyboardNumber:[],
        keyboardLetter:{
          first:[],
          second:[],
          third:[]
        },
        carList:false,
        keyboard:false,
        httpurl:"",
        areaList:"",
        suremend: new Debounce(this.ajaxWeight, 1000),
      }
    },
    watch:{
      message:{
        handler:function(val,oldval){
          var _this = this;
          _this.message.weight=(_this.message.weight.match(/\d+(\.\d{0,2})?/)||[''])[0];
        },
        deep:true
      }
    },
    mounted: function() {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      weightKey:function () {
        var _this = this;
        /*_this.suremend();*/
      },
      ajaxWeight:function () {
        var _this = this;
        if(_this.message.weight*1 > 0 && _this.minWeight*1 >0 && _this.maxWeight > 0){
          if(_this.message.weight - _this.minWeight < 0 ){
            _this.message.weight = _this.minWeight;
          }else if(_this.message.weight - _this.maxWeight > 0){
            _this.message.weight = _this.maxWeight;
          }
        }
      },
      go:function () {
        var _this = this;
        _this.carTypeList = shujvyuan.first();
        _this.keyboardNumber = shujvyuan.forth();
        _this.keyboardLetter.first = shujvyuan.fifth().first;
        _this.keyboardLetter.second = shujvyuan.fifth().second;
        _this.keyboardLetter.third = shujvyuan.fifth().third;
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
        var carchange = sessionStorage.getItem("carchange");
        if(carchange != undefined){
          carchange = JSON.parse(carchange);
          carchange.carmodel = carchange.carmodel == "" ? "请选择车辆类型" : carchange.carmodel;
          carchange.type = carchange.type == "" ? "请选择车型" : carchange.type;
          carchange.carlength = carchange.carlength == "" ? "请选择车长" : carchange.carlength;
          carchange.cartrantype = carchange.cartrantype == "" ? "请选择运输类型" : carchange.cartrantype;
          _this.message = carchange;
          sessionStorage.removeItem("carchange");
        }
        var LABELTOP = sessionStorage.getItem("LABELTOP");
        if(LABELTOP != undefined){
          LABELTOP = JSON.parse(LABELTOP);
          _this.message.carmodel =  LABELTOP.type == "0" ? "整车" : LABELTOP.type == "1" ? "车头" : LABELTOP.type == "2" ? "车挂" :"";
        }
        for(var i = 0;i<_this.carTypeList.length;i++){
          if(_this.carTypeList[i].region == _this.message.plateName){
            _this.carTypeList[i].code = 2;
          }
        }
        $("#box4").aiiUpload({
          action: androidIos.ajaxHttp() + "/uploadFile",
          max_w: 1000,
          max_h: 1000
        });
        if (_this.message.Travelpic != null && _this.message.Travelpic != "") {
          $("#box4 img").attr("src", _this.httpurl + _this.message.Travelpic);
          $("#box4 img").show();
          $("#box4 .closed").show();
          $("#box4 .cjjimgbox").css("display", "none");
          $("#box4 .cjjimgbox").html(
            "<p class='h5u_options_hiddenP'>" + _this.message.Travelpic + "</p>"
          );
        }
        $.ajax({
          type: "GET",
          url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
          data:{str:"car_length",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
          dataType: "json",
          timeout: 10000,
          success: function (getCarType) {
            var list = [];
            for(var i = 0; i<getCarType.length;i++){
              var json = {
                "code":getCarType[i].memo.replace(/吨/g,""),
                "region":getCarType[i].value + "米",
              }
              list.push(json)
            }
            var x = 0;
            for(var i = 0;i<list.length;i++){
              if(list[i].region == _this.message.carlength){
                _this.message.carlengthCode = list[i].code;
                if(list[i].code.indexOf("-") == -1){
                  _this.minWeight = list[i].code;
                  _this.maxWeight = list[i].code;
                }else{
                  _this.minWeight = list[i].code.split("-")[0];
                  _this.maxWeight = list[i].code.split("-")[1];
                }
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
              _this.message.carlength =  name.firstVal;
              _this.message.carlengthCode = name.firstVal.replace(/米/g,"");
              if(name.firstCode.indexOf("-") == -1){
                _this.minWeight = name.firstCode;
                _this.maxWeight = name.firstCode;
                _this.message.weight = name.firstCode;
              }else{
                _this.minWeight = name.firstCode.split("-")[0];
                _this.maxWeight = name.firstCode.split("-")[1];
                _this.message.weight = name.firstCode.split("-")[1];
              }

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
          success: function (getCarType) {
            var list = [];
            for(var i = 0; i<getCarType.length;i++){
              var json = {
                "code":getCarType[i].value,
                "region":getCarType[i].displayName,
              }
              list.push(json)
            }
            var x = 0;
            for(var i = 0;i<list.length;i++){
              if(list[i].region == _this.message.cartrantype){
                _this.message.cartrantypeCode = list[i].code;
                x = i;
              }
            }
            var area = new LArea();
            area.init({
              'trigger': '#Z04',
              'valueTo': '#Z04',
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
              _this.message.cartrantype =  name.firstVal;
              _this.message.cartrantypeCode = name.firstCode;
            }
          },
          complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
            if (status == 'timeout') {//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            } else if (status == 'error') {
              androidIos.errorwife();
            }
          }
        });
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/settings/getCarType",
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          async:false,
          success: function (getCarType) {
            var list = [];
            for(var i = 0; i<getCarType.length;i++){
              var json = {
                "code":getCarType[i].value,
                "region":getCarType[i].displayName,
              }
              list.push(json)
            }
            var x = 0;
            for(var i = 0;i<list.length;i++){
              if(list[i].region == _this.message.carmodel){
                _this.message.carmodelNumber = list[i].code;
                x = i;
              }
            }
            var area = new LArea();
            area.init({
              'trigger': '#Z03',
              'valueTo': '#Z03',
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
              _this.message.carmodel =  name.firstVal;
              _this.message.carmodelNumber = name.firstCode;
              var ajaxName = "";
              if(name.firstCode == "41efd612fc2e4067a1debc30a1c36383"){
                ajaxName = "headstock";
              }else{
                ajaxName = "car_type";
              }
              _this.message.type = "请选择车型";
              _this.message.carCode = "";
              _this.areaList.data = [];
              _this.areaList.value[0] = 0 ;
              $.ajax({
                type: "GET",
                url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
                data:{str:ajaxName,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
                dataType: "json",
                timeout: 10000,
                success: function (getCarType) {
                  var list = [];
                  for(var i = 0; i<getCarType.length;i++){
                    var json = {
                      "code":getCarType[i].value,
                      "region":getCarType[i].displayName,
                    }
                    list.push(json);
                  }
                  _this.areaList.data = list;
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
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        });
        var ajaxBothHtml = "";
        if(_this.message.carmodelNumber == "41efd612fc2e4067a1debc30a1c36383"){
          ajaxBothHtml = "headstock";
        }else{
          ajaxBothHtml = "car_type";
        }
        $.ajax({
          type: "GET",
          url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
          data:{str:ajaxBothHtml,userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
          dataType: "json",
          timeout: 10000,
          success: function (getCarType) {
            var list = [];
            for(var i = 0; i<getCarType.length;i++){
              var json = {
                "code":getCarType[i].value,
                "region":getCarType[i].displayName,
              }
              list.push(json)
            }
            var x = 0;
            for(var i = 0;i<list.length;i++){
              if(list[i].region == _this.message.type){
                _this.message.carCode = list[i].code;
                x = i;
              }
            }
            var area = new LArea();
            _this.areaList = area;
            area.init({
              'trigger': '#Z00',
              'valueTo': '#Z00',
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
              _this.message.type =  name.firstVal;
              _this.message.carCode = name.firstCode;
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
        $(document).unbind("touchstart").on("touchstart","#keyboardBox p",function () {
          $(this).css("background","#abb4bd");
          $(this).css("color","white");
        })
        $(document).unbind("touchend").on("touchend","#keyboardBox p",function () {
          $(this).css("background","white");
          $(this).css("color","#333");
        })
      },
      keyboardshow:function () {
        var _this = this;
        _this.keyboard = true;
      },
      carClick:function (number,carname) {
        var _this = this;
        _this.message.plateName = carname;
        for(var i=0;i<_this.carTypeList.length;i++){
          _this.carTypeList[i].code=1;
        }
        _this.carTypeList[number].code=2;
      },
      carListHideAgain:function (even) {
        var el = even.target.id;
        if(el=="carListBox"){
          this.carList = false;
        }
      },
      keyboardHideAgain:function (even) {
        var el = even.target.id;
        if(el=="keyboardBox"){
          this.keyboard = false;
        }
      },
      ok:function () {
        var _this = this;
        if(_this.message.carpk != ""){
           androidIos.first("确定要修改车辆信息吗？");
          $(".tanBox-yes").unbind('click').click(function(){
            $(".tanBox-bigBox").remove();
            _this.gogo();
          });
        }else{
          _this.gogo();
        }
      },
      gogo:function () {
        var _this = this;
        if(bomb.hasClass("ok","okgo")){
          if(_this.message.carmodel == "请选择车辆类型"){
            bomb.first("请选择车辆类型");
            return false;
          }
          if(_this.message.cartrantype == "请选择运输类型" && (_this.message.carmodelNumber == "5de1912471af4c2d839a27f268cd8ca7" || _this.message.carmodelNumber == "41efd612fc2e4067a1debc30a1c36383")){
            bomb.first("请选择运输类型");
            return false;
          }
          if(_this.message.type == "请选择车型" && (_this.message.carmodelNumber == '5de1912471af4c2d839a27f268cd8ca7' || _this.message.carmodelNumber == '41efd612fc2e4067a1debc30a1c36383') ){
            bomb.first("请选择车型");
            return false;
          }
          if(_this.message.carlength == "请选择车长" && (_this.message.carmodelNumber == "5de1912471af4c2d839a27f268cd8ca7" || _this.message.carmodelNumber == "41efd612fc2e4067a1debc30a1c36383")){
            bomb.first("请选择车长");
            return false;
          }
          if(_this.message.carNumber == "请输入车牌号" || _this.message.carNumber.length < 6 ){
            bomb.first("请输入正确的车牌号");
            return false;
          }
          if(_this.message.carNumber.length==6){
            var type = /^[A-Z][0-9,A-Z]{5}$/;
            if(!type.test(_this.message.carNumber)){
              bomb.first("请填写正确的车牌号");
              return false;
            }
          }else if(_this.message.carNumber.length==7){
            var type = /^[A-Z][0-9,A-Z]{6}$/;
            if(!type.test(_this.message.carNumber)){
              bomb.first("请填写正确的车牌号");
              return false;
            }
          }
          if(this.message.weight == "" && (_this.message.carmodelNumber == "5de1912471af4c2d839a27f268cd8ca7" || _this.message.carmodelNumber == "41efd612fc2e4067a1debc30a1c36383") ){
            bomb.first("请输入载量");
            return false;
          }
          var idFi = $("#box4 .cjjimgbox .h5u_options_hiddenP");
          _this.message.Travelpic = idFi.text();
          if(_this.message.Travelpic == "" && (_this.message.carmodelNumber == "5de1912471af4c2d839a27f268cd8ca7" || _this.message.carmodelNumber == "2ba6da2fd9cd4689965afe5abc8f9df4")){
            bomb.first("请上传行驶证");
            return false;
          }
          var carJson={
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
            carNo:_this.message.plateName + _this.message.carNumber,
            carModel:_this.message.carmodelNumber == "5de1912471af4c2d839a27f268cd8ca7" || _this.message.carmodelNumber == "41efd612fc2e4067a1debc30a1c36383" ?_this.message.carCode : "" ,
            carType:_this.message.carmodelNumber ,
            loadWeight:_this.message.carmodelNumber == "5de1912471af4c2d839a27f268cd8ca7" || _this.message.carmodelNumber == "41efd612fc2e4067a1debc30a1c36383" ? _this.message.weight*1000 : "",
            pkDriver:_this.message.driverPk,
            pkCar:_this.message.carpk,
            drivingLicense:_this.message.carmodelNumber == "5de1912471af4c2d839a27f268cd8ca7" || _this.message.carmodelNumber == "2ba6da2fd9cd4689965afe5abc8f9df4" ? _this.message.Travelpic : "",
            length :_this.message.carmodelNumber == "5de1912471af4c2d839a27f268cd8ca7" || _this.message.carmodelNumber == "41efd612fc2e4067a1debc30a1c36383" ? _this.message.carlengthCode : "",
            transType :_this.message.carmodelNumber == "5de1912471af4c2d839a27f268cd8ca7" || _this.message.carmodelNumber == "41efd612fc2e4067a1debc30a1c36383" ? _this.message.cartrantypeCode : "",
          }
          bomb.removeClass("ok","okgo");
          var messageNow = _this.message.carpk == "" ? "正在新增" : "正在修改";
          androidIos.loading(messageNow);
          var jax = _this.message.carpk == "" ? '/driver/addCar':'/driver/modifyCar';
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + jax,
            data: JSON.stringify(carJson),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout:30000,
            success: function (addCar) {
              if(addCar.success=="1"){
                _this.$cjj("保存成功");
                setTimeout(function () {
                  androidIos.gobackFrom(_this);
                },500);
              }else{
                androidIos.second(addCar.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              $("#common-blackBox").remove();
              bomb.addClass("ok","okgo");
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！")
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }else{
          bomb.first("请不要频繁点击");
        }
      },
      carkeyboard:function (name) {
        var _this = this;
        if(_this.message.carNumber=="请输入车牌号"){
          _this.message.carNumber="";
        }
        if(_this.message.carNumber.length<7){
          _this.message.carNumber = _this.message.carNumber+name;
        }
      },
      keyremove:function () {
        var _this = this;
        if(_this.message.carNumber!="请输入车牌号"){
          var lenth = _this.message.carNumber.length;
          if(lenth>0){
            _this.message.carNumber = _this.message.carNumber.substr(0,lenth-1);
          }
          if(_this.message.carNumber.length==0){
            _this.message.carNumber="请输入车牌号";
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .box{
    width:100%;
    background: white;
    line-height: 1.5rem;
    height: 1.5rem;
    margin-top: 0.3rem;
    border-bottom: 1px solid #dbdbdb;
  }
  .box span{
    font-size: 0.375rem;
    margin-left: 5%;
    float: left;
  }
  .box p{
    float: right;
    margin-right: 5%;
    width:3.5rem;
    height: 1rem;
    padding-left: 0.2rem;
    font-size: 0.35rem;
    line-height: 1rem;
    margin-top: 0.25rem;
    text-align: right;
  }
  .box input{
    float: right;
    margin-right: 5%;
    width: 3.5rem;
    height: 0.35rem;
    padding:0.325rem 0 0.325rem 0.2rem;
    font-size: 0.35rem;
    line-height: 0.35rem;
    border-bottom: 1px solid #bcbcbc;
    margin-top: 0.25rem;
  }
  #ok{
    width:90%;
    display: block;
    margin:0.5rem auto;
    background: #3399FF;
    color:white;
    line-height: 1.2rem;
    border-radius: 0.2rem;
    font-size: 0.4rem;
    letter-spacing: 0.09375rem;
  }
  .box h6{
    float: left;
    font-size: 0.375rem;
    margin-left:28%;
    padding-left: 0.5rem;
    background-image: url("../../images/addCar.png");
    background-size: 0.375rem 0.375rem;
    background-repeat: no-repeat;
    background-position: 0 50%;
  }
  #carListBox,#keyboardBox{
    position: fixed;
    bottom:0;
    width:100%;
    top:0;
    height:auto;
    background: rgba(0,0,0,0);
    z-index: 10;
  }
  #carList,#keyboard{
    position: fixed;
    bottom:0;
    width:100%;
    height:5.2rem;
    overflow: hidden;
    background:#d4d9dc ;
    border-top: 1px solid #e9ebea;
  }
  #keyboard{
    height: 6.5rem;
  }
  #carList p,#keyboard p{
    float: left;
    width:0.87rem;
    height: 1.0687rem;
    text-align: center;
    line-height: 1.0687rem;
    background: white;
    box-shadow: 0 0.03125rem 0rem #999;
    margin: 0.1832rem 0.065rem 0 0.065rem;
    font-size: 0.375rem;
    border-radius: 0.18rem;
    color:#333;
  }
  #carList button{
    width: 2.8rem;
    height:1.1rem;
    margin: 0.1832rem 0.065rem 0 0.065rem;
    float: right;
    border-radius: 0.18rem;
    color:white;
    background: #3399FF;
    font-size: 0.375rem;
    letter-spacing: 0.0625rem;
  }
  .carCode{
    background: #3399FF!important;
    color:white!important;
  }
  .carnumber{
    color:#d2d2d2;
  }
  .carGreen{
    color:#5ad85a;
  }
  .carBrown{
    color:brown;
  }
  .keyRemove{
    background-color:#abb4bd!important;
    width: 1.0687rem!important;
    height: 1.0687rem!important;
    float: right!important;
    background-image: url("../../images/clone.png")!important;
    background-size:0.62977rem  0.458rem!important;
    background-repeat: no-repeat!important;
    background-position: 45% 50%!important;
  }
  .keyBlack{
    background:#abb4bd!important;
    width: 1.0687rem!important;
    height: 1.0687rem!important;
    line-height: 1.0687rem!important;
  }
  .keySpace{
    width: 4.86641rem!important;
    height: 1.0687rem!important;
    line-height: 1.0687rem!important;
  }
  .keyOk{
    background:#abb4bd!important;
    width: 2.309rem!important;
    height: 1.0687rem!important;
    line-height: 1.0687rem!important;
  }
  .addColor{
    background: red!important;
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
</style>
