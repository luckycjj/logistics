<template>
  <div id="chooseEnd">
    <div id="title" v-title data-title="新建收货方"></div>
    <!--<div class="chooseNormal" @click="gohistroy()">
      选择常用路线
    </div>-->
    <div id="inputKeyup">
      <div class="name">
        <input type="text" maxlength="20" placeholder="请输入姓名" v-model="start.name"/>
        <div class="lineBox"><div class="line"></div></div>
        <input type="tel" maxlength="11" placeholder="请输入手机号码" v-model="start.phone"/>
        <div class="clearBoth"></div>
      </div>
      <div class="company inputUp">
        <input type="text" maxlength="20" placeholder="提货方公司名" v-model="start.company"/>
      </div>
      <div class="company inputUp">
        <p id="X00" :class="start.province!=''?'blackColor':''" v-html="start.province==''?'选择省市区':start.province+'-'+start.city+'-'+start.area"></p>
      </div>
      <div class="address inputUp" style="border:none;">
        <input type="text" maxlength="20" placeholder="详细地址"  v-model="start.address"/>
      </div>
    </div>
    <button :class="start.name!=''&&start.phone!=''&&start.company!=''&&start.address!=''&&start.province!=''?'colorful':''" @click="save()">保存</button>
  </div>
</template>

<script>
  import {myScroll} from "../../js/myScroll"
  import  {provinceCityArea} from "../../js/provinceCityArea"
  import {androidIos} from "../../js/app";
  export default {
    name: "chooseEnd",
    data () {
      return {
        start:{
          name:"",
          phone:"",
          company:"",
          address:"",
          province:"",
          city:"",
          area:"",
          provinceCode:"",
          cityCode:"",
          areaCode:""
        }

      }
    },
    mounted:function () {
      var _this = this;
      var x = 0, y = 0,z = 0;
      var startmessage = sessionStorage.getItem("endAddressmessage");
      if(startmessage != undefined) {
        startmessage = JSON.parse(startmessage);
        _this.start.name = startmessage.people;
        _this.start.phone = startmessage.tel;
        _this.start.address = startmessage.address;
        _this.start.company = startmessage.company;
        _this.start.province = startmessage.city.split("-")[0];
        _this.start.city = startmessage.city.split("-")[1];
        _this.start.area = startmessage.city.split("-")[2];
        sessionStorage.removeItem("endAddressmessage");
        for(var i = 0; i< provinceCityArea.length;i++){
          if(provinceCityArea[i].region == _this.start.province){
            x = i;
            for(var a = 0; a < provinceCityArea[i].child.length;a++){
              if( provinceCityArea[i].child[a].region == _this.start.city){
                y = a;
                for(var b = 0; b < provinceCityArea[i].child[a].child.length;b++){
                  if( provinceCityArea[i].child[a].child[b].region == _this.start.area){
                    z = b;
                  }
                }
              }
            }
          }
        }
      }
      var area = new LArea();
      area.init({
        'trigger': '#X00',
        'valueTo': '#X00',
        'keys': {
          id: 'id',
          name: 'name'
        },
        'type': 1,
        'data': provinceCityArea
      });
      area.value = [x,y,z];
      area.addPointer = function (name) {
        name = JSON.parse(name);
        _this.start.province = name.firstVal;
        _this.start.provinceCode = name.firstCode;
        _this.start.city = name.secondVal;
        _this.start.cityCode = name.secondCode;
        _this.start.area = name.thirdVal;
        _this.start.areaCode = name.thirdCode;
      }
    },
    methods:{
      save:function () {
        var _this = this;
        var start = JSON.stringify(_this.start);
        sessionStorage.setItem("endAddress",start);
        androidIos.gobackFrom(_this);
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
  }
  .name input{
    width:48%;
    height: 0.35rem;
    padding: 0.325rem 0;
    font-size: 0.3125rem;
    float: left;
    color:#333;
  }
  .inputUp input{
    width:100%;
    height: 0.35rem;
    padding: 0.325rem 0;
    font-size: 0.3125rem;
    color:#333;
  }
  #X00{
    width:100%;
    height: 0.35rem;
    padding: 0.325rem 0;
    font-size: 0.3125rem;
    color:#bcbcbc;
  }
  .blackColor{
    color:#333!important;
  }
  .colorful{
    background: #3399FF!important;
  }
</style>

