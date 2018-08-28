<template>
  <div id="chooseStart">
    <div id="title" v-title data-title="司机信息"></div>
    <div id="inputKeyup">
      <div class="company inputUp">
        <input type="text" maxlength="20" placeholder="请输入姓名" v-model="start.name"/>
      </div>
      <div class="company inputUp">
        <input type="tel" maxlength="11" placeholder="请输入手机号码" v-model="start.phone"/>
      </div>
      <div class="company inputUp" v-if="start.driverPk == ''">
        <input :type="lookPassWord ? 'text' : 'password' " maxlength="40"  placeholder="请输入司机密码" v-model="start.password"/>
        <div id="lookPassWord" :class="lookPassWord ? 'lookPassWord' : '' " @click="lookpass()"></div>
      </div>
      <div class="company inputUp">
        <p id="Z00" :class="start.time!=''?'blackColor':''" v-html="start.time==''?'选择驾龄':start.time"></p>
      </div>
    </div>
    <button :class="start.name!=''&&start.phone!=''&&start.time!=''?'colorful':''" @click="save()" id="save">保存</button>
  </div>
</template>

<script>
  import {myScroll} from "../../js/myScroll"
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  export default {
    name: "chooseStart",
    data () {
      return {
        start:{
          name:"",
          phone:"",
          password:"",
          time:"",
          driverPk:"",
          timeValue:"",
        },
        lookPassWord:false,

      }
    },
    mounted:function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var _this = this;
        var x = 0;
        var driverAge = [{
          "code":"0",
          "region":"小于1年"
        },{
          "code":"1",
          "region":"1年"
        },{
          "code":"2",
          "region":"2年"
        },{
          "code":"3",
          "region":"3年"
        },{
          "code":"4",
          "region":"4年"
        },{
          "code":"5",
          "region":"5年"
        },{
          "code":"6",
          "region":"6年"
        },{
          "code":"7",
          "region":"7年"
        },{
          "code":"8",
          "region":"8年"
        },{
          "code":"9",
          "region":"9年"
        },{
          "code":"10",
          "region":"10年"
        },{
          "code":"11",
          "region":"11年"
        },{
          "code":"12",
          "region":"12年"
        },{
          "code":"13",
          "region":"13年"
        },{
          "code":"14",
          "region":"14年"
        },{
          "code":"15",
          "region":"15年"
        },{
          "code":"16",
          "region":"16年"
        },{
          "code":"17",
          "region":"17年"
        },{
          "code":"18",
          "region":"18年"
        },{
          "code":"19",
          "region":"19年"
        },{
          "code":"20",
          "region":"20年"
        },{
          "code":"21",
          "region":"21年"
        },{
          "code":"22",
          "region":"22年"
        },{
          "code":"23",
          "region":"23年"
        },{
          "code":"24",
          "region":"24年"
        },{
          "code":"25",
          "region":"25年"
        },{
          "code":"26",
          "region":"26年"
        },{
          "code":"27",
          "region":"27年"
        },{
          "code":"28",
          "region":"28年"
        },{
          "code":"29",
          "region":"29年"
        },]
        var driver = sessionStorage.getItem("driver");
        if(driver!=undefined){
          driver = JSON.parse(driver);
          _this.start.driverPk = driver.carPeoplePk;
          _this.start.name = driver.name;
          _this.start.phone = driver.tel;
          _this.start.time = driver.year+"年";
          _this.start.timeValue = driver.year=='小于1'?'0':driver.year;
          sessionStorage.removeItem("driver");
          for(var i = 0; i< driverAge.length;i++){
            if(driverAge[i].region == _this.start.time){
              x = i;
            }
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
          'data': driverAge
        });
        area.value = [x];
        area.addPointer = function (name) {
          name = JSON.parse(name);
          _this.start.time = name.firstVal;
          _this.start.timeValue = name.firstCode;
        }
      },
      lookpass:function () {
        var _this = this;
        _this.lookPassWord = !_this.lookPassWord;
      },
      save:function () {
        var _this = this;
        if(_this.start.name == ""){
          bomb.first("请输入司机姓名");
          return false;
        }
        if(_this.start.phone.length < 11 || _this.start.phone == ""){
          bomb.first("请输入正确的手机号码");
          return false;
        }
        var reg = /^1([3|5|8][0-9]|4[5|7|9]|66|7[0|1|3|5|6|7|8]|9[8|9])[0-9]{8}$/;
        if(!reg.test(_this.start.phone)){
          bomb.first("手机号码格式不对");
          return false;
        }
        if(_this.start.password == "" && _this.start.driverPk == ''){
          bomb.first("请输入司机密码");
          return false;
        }
        if(_this.start.timeValue == ""){
          bomb.first("请选择司机驾龄");
          return false;
        }
        if(bomb.hasClass("save","colorful")){
            var json = {
              pk: _this.start.driverPk == ""? undefined: _this.start.driverPk,
              driverName  : _this.start.name,
              mobile : _this.start.phone,
              password : _this.start.password,
              driverAge: _this.start.timeValue,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }
            var jiekou = "";
            if(_this.start.driverPk == ""){
              jiekou = "/driver/addDriver";
            }else{
              jiekou = "/driver/modifyDriver";
            }
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + jiekou,
            data:JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (addDriver) {
              if(addDriver.success == "1"){
                var message = _this.start.driverPk == ""?"新增":"修改";
                _this.$cjj(message + "成功");
                setTimeout(function () {
                  androidIos.gobackFrom(_this);
                },400)
              }else{
                androidIos.second(addDriver.message);
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
        }
      }
    }
  }
</script>

<style scoped>
  .chooseNormal{
    width:94%;
    padding: 0 3%;
    font-size: 0.35rem;
    line-height: 1rem;
    background-image: url("../../images/lookMore.png");
    background-size: 0.22rem  0.4rem;
    background-position: 96% 50%;
    background-repeat: no-repeat;
    background-color:white;
    margin-top: 0.3rem;
    color:#333;
  }
  #inputKeyup{
    margin-top: 0.25rem;
    background: white;
  }
  .lineBox{
    width:4%;
    float:left;
  }
  .line{
    width:1px;
    margin: 0.25rem auto;
    height: 0.5rem;
    background: #dadada;
  }
  .name,.address,.company{
    width:94%;
    padding: 0 3%;
    border-bottom:1px solid #dadada;
    position: relative;
  }
  .name input{
    width:48%;
    height: 0.35rem;
    margin: 0.325rem 0;
    font-size: 0.3125rem;
    float: left;
    color:#333;
  }
  .inputUp input{
    width:90%;
    padding: 0.325rem 0;
    font-size: 0.3125rem;
    color:#333;
  }
  #Z00{
    width:90%;
    height: 0.35rem;
    padding: 0.325rem 0;
    font-size: 0.3125rem;
    color:#bcbcbc;
  }
  .blackColor{
    color:#333!important;
  }
  #lookPassWord{
     width: 10%;
    position: absolute;
    right: 3%;
    top:0;
     height: 100%;
    background-image: url("../../images/passwordNolock.png");
    background-repeat: no-repeat;
    background-size: 0.6rem;
    background-position: 50% 50%;
  }
  .lookPassWord{
    background-image: url("../../images/passwordLock.png")!important;
  }
  button{
    width:96%;
    color:white;
    background: #999;
    display: block;
    margin: 0.3rem auto;
    font-size: 0.4rem;
    line-height: 1.2rem;
    border-radius: 0.2rem;
    letter-spacing: 0.03125rem;
  }
  .colorful{
    background: #3399FF!important;
  }
</style>

