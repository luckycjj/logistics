<template>
  <div class="carAdministrationSBox" id="newCar">
    <div id="title" v-title data-title="车辆信息"></div>
    <div class="box">
      <span>车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型</span>
      <p id="Z00":class="message.type=='请选择车型'?'carnumber':''">{{message.type}}</p>
      <div class="clearBoth"></div>
    </div>
    <div class="box" style="margin-top: 0px;">
      <span>车牌号码</span>
      <h6 @click="carList=true" >{{message.plateName}}</h6>
      <p @click="keyboardshow()" :class="message.carNumber=='请输入车牌号'?'carnumber':(message.carNumber!='请输入车牌号'&&message.carNumber.length==7)?'carGreen':(message.carNumber!='请输入车牌号'&&message.carNumber.length==6)?'carBrown':''">{{message.carNumber}}</p>
      <div class="clearBoth"></div>
    </div>
    <div class="box" style="margin-top: 0px;">
      <span>载&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量</span>
      <p style="width:auto">吨</p>
      <input type="number" maxlength="10" v-model="message.weight" placeholder="请输入载量" />
      <div class="clearBoth"></div>
    </div>
    <div class="box" style="margin-top: 0px;">
      <span>司 机</span>
      <p id="Z01" :class="message.driver=='请选择司机'?'carnumber':''">{{message.driver}}</p>
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
  export default {
    name: 'newCar',
    data () {
      return {
        message:{
          type: '请选择车型',
          carCode:"",
          carNumber:"请输入车牌号",
          plateName:"沪",
          weight:"",
          driver:"请选择司机",
          driverPk:"",
          carpk:""
        },
        carTypeList:[],
        keyboardNumber:[],
        keyboardLetter:{
          first:[],
          second:[],
          third:[]
        },
        carList:false,
        keyboard:false,
      }
    },
    watch:{
      message:{
        handler:function(val,oldval){
          this.message.weight=(this.message.weight.match(/\d+(\.\d{0,3})?/)||[''])[0];
          if(this.message.carNumber!="请输入车牌号"&&this.message.type!="请选择车型"&&this.message.carNumber.length>5&&this.message.weight!=""){
            bomb.addClass("ok","upColor");
          }else{
            bomb.removeClass("ok","upColor");
          }
        },
        deep:true
      }
    },
    mounted: function() {
      this.$nextTick(function () {
        this.go();
      })
    },
    methods:{
      go:function () {
        var _this = this;
        _this.carTypeList = shujvyuan.first();
        _this.keyboardNumber = shujvyuan.forth();
        _this.keyboardLetter.first = shujvyuan.fifth().first;
        _this.keyboardLetter.second = shujvyuan.fifth().second;
        _this.keyboardLetter.third = shujvyuan.fifth().third;
        var carchange = sessionStorage.getItem("carchange");
        if(carchange != undefined){
          carchange = JSON.parse(carchange);
          carchange.driver = carchange.driver == "" ? "请选择司机" : carchange.driver;
          _this.message = carchange;
          sessionStorage.removeItem("carchange");
        }
        for(var i = 0;i<_this.carTypeList.length;i++){
          if(_this.carTypeList[i].region == _this.message.plateName){
            _this.carTypeList[i].code = 2;
          }
        }
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/settings/getCarType",
          contentType: "application/json;charset=utf-8",
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
               if(list[i].region == _this.message.type){
                 _this.message.carCode = list[i].code;
                 x = i;
               }
            }
            var area = new LArea();
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
        })
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/driver/getDriverPage",
          data: JSON.stringify({
            pk:"",
            page:1,
            size:10000,
            userCode: sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (getCarType) {
            if(getCarType.success == "1" || getCarType.success == ""){
              var list = [{
                "code":"",
                "region":"请选择司机"
              }];
              for(var i = 0; i<getCarType.list.length;i++){
                var json = {
                  "code":getCarType.list[i].pkDriver,
                  "region":getCarType.list[i].driverName+' '+getCarType.list[i].mobile,
                }
                list.push(json)
              }
              var x = 0;
              for(var i = 0;i<list.length;i++){
                if(list[i].code == _this.message.driverPk){
                  x = i;
                }
              }
              var area = new LArea();
              area.init({
                'trigger': '#Z01',
                'valueTo': '#Z01',
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
                _this.message.driver =  name.firstVal.split(" ")[0];
                _this.message.driverPk = name.firstCode;
              }
            }else{
              androidIos.second(getCarType.message)
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        })
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
        if(bomb.hasClass("ok","okgo")){
          if(bomb.hasClass("ok","upColor")){
            if(_this.message.carNumber.length==6){
              var type = /^[A-Z][0-9,A-Z]{5}$/;
              if(!type.test(_this.message.carNumber)){
                bomb.first("请填写正确的车牌号！")
                return false;
              }
            }else if(_this.message.carNumber.length==7){
              var type = /^[A-Z][0-9,A-Z]{6}$/;
              if(!type.test(_this.message.carNumber)){
                bomb.first("请填写正确的车牌号！")
                return false;
              }
            }
            var carJson={
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
              carNo:_this.message.plateName+_this.message.carNumber,
              carType:_this.message.carCode,
              loadWeight:_this.message.weight,
              pkDriver:_this.message.driverPk,
              pkCar:_this.message.carpk
            }
            bomb.removeClass("ok","okgo");
            var jax = _this.message.carpk == "" ? '/driver/addCar':'/driver/modifyCar';
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + jax,
              data: JSON.stringify(carJson),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout:30000,
              success: function (addCar) {
                bomb.addClass("ok","okgo");
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
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  bomb.addClass("ok","okgo");
                  androidIos.second("当前状况下网络状态差，请检查网络！")
                }else if(status=='error'){
                  bomb.addClass("ok","okgo");
                  androidIos.errorwife();
                }
              }
            })
          }else if(!bomb.hasClass("ok","upColor")){
            bomb.first("请填写完整相关信息！")
          }
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
    background: #d2d2d2;
    color:white;
    line-height: 1rem;
    border-radius: 0.6rem;
    font-size: 0.375rem;
    letter-spacing: 0.09375rem;
  }
  .upColor{
   background: #3399FF!important;
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

</style>
