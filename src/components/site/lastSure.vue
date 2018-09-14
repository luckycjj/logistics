<template>
  <div id="lastSure">
    <div id="title" v-title data-title="确认拆段信息" ></div>
    <ul id="editSiteBox">
      <li v-for="(item,index) in list">
        <div class="firstBox">
          <p v-html="item.address.split('@')[0]"></p>
          <p v-html="item.address.split('@')[1]"></p>
          <h1 v-for="pro in item.productBox">
            <h3>{{pro.trantype}}</h3>
            <h4>{{pro.product}}</h4>
            <h5>{{pro.number}}件/{{pro.weight}}/{{pro.volume}}</h5>
            <div class="clearBoth"></div>
          </h1>
          <h2 v-html="item.pickTime + '&nbsp; - &nbsp;'+ item.arrivalTime">{</h2>
        </div>
        <div class="clearBoth"></div>
      </li>
    </ul>
    <button  @click="pushChoose()">确认</button>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  export default {
    name: "lastSure",
    data(){
      return{
        listBox:{
          list:[]
        },
        list:[],
        productMessage:{
          pickTime:"",
          arrivalTime:"",
          startAddress:"",
          startAddresspk:"",
          endAddress:"",
          endAddresspk:"",
          productBox:[]
        },
        success:false
      }
    },
    mounted:function(){
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var _this = this;
        var lastSure = sessionStorage.getItem("lastSure");
        var Sitechoosesite = sessionStorage.getItem("Sitechoosesite");
        if(Sitechoosesite!=undefined){
          Sitechoosesite  = JSON.parse(Sitechoosesite);
          _this.productMessage.pickTime = Sitechoosesite.startTime;
          _this.productMessage.arrivalTime = Sitechoosesite.endTime;
          _this.productMessage.startAddress = Sitechoosesite.startAddress;
          _this.productMessage.endAddress = Sitechoosesite.endAddress;
          _this.productMessage.startAddresspk = Sitechoosesite.startAddresspk;
          _this.productMessage.endAddresspk = Sitechoosesite.endAddresspk;
          var list = [];
          for(var i = 0 ; i<Sitechoosesite.product.length;i++){
            var json = {
              trantype:Sitechoosesite.product[i].tranType,
              product:Sitechoosesite.product[i].goods,
              number:Sitechoosesite.product[i].number,
              weight:Sitechoosesite.product[i].weight,
              volume:Sitechoosesite.product[i].volume,
            }
            list.push(json);
          }
          _this.productMessage.productBox = list;
        }
        if(lastSure!=undefined){
          _this.listBox.list = JSON.parse(lastSure);
          for(var i=0;i<(_this.listBox.list.length+1);i++){
            var list =[];
            for(var x = 0; x<_this.productMessage.productBox.length;x++){
              var listjson={
                trantype:_this.productMessage.productBox[x].trantype,
                product:_this.productMessage.productBox[x].product,
                number:_this.productMessage.productBox[x].number,
                weight:_this.productMessage.productBox[x].weight,
                volume:_this.productMessage.productBox[x].volume,
              }
              list.push(listjson);
            }
            var json = {
              address:"",
              startAddressPk:"",
              endAddresspk:"",
              productBox:list,
              pickTime:"",
              arrivalTime:"",
            };
            if(i == 0){
              json.address = _this.productMessage.startAddress + '@' +_this.listBox.list[i].name;
              json.startAddressPk = _this.productMessage.startAddresspk;
              json.endAddressPk = _this.listBox.list[i].pkAddress;
              json.pickTime = _this.productMessage.pickTime;
              json.arrivalTime = _this.listBox.list[i].startTime;
            }else if(i > 0 && i < (_this.listBox.list.length) ){
              json.address = _this.listBox.list[i-1].name + '@' + _this.listBox.list[i].name;
              json.startAddressPk = _this.listBox.list[i-1].pkAddress;
              json.endAddressPk = _this.listBox.list[i].pkAddress;
              json.pickTime = _this.listBox.list[i-1].endTime;
              json.arrivalTime = _this.listBox.list[i].startTime;
            }else{
              json.address = _this.listBox.list[i-1].name + '@' + _this.productMessage.endAddress;
              json.startAddressPk = _this.listBox.list[i-1].pkAddress;
              json.endAddressPk = _this.productMessage.endAddresspk;
              json.pickTime = _this.listBox.list[i-1].endTime;
              json.arrivalTime = _this.productMessage.arrivalTime;
            }
            _this.list.push(json);
          }
        }
      },
      pushChoose:function () {
        var _this =this;
        var list = [];
        for(var i = 0 ; i < _this.list.length;i++) {
          var json = {
            delivery: _this.list[i].startAddressPk,
            arrival: _this.list[i].endAddressPk,
            deliDate: _this.list[i].pickTime,
            arriDate: _this.list[i].arrivalTime
          }
          list.push(json);
        }
        androidIos.loading("正在拆段");
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/order/demolitionSegment",
          data: JSON.stringify({pk: sessionStorage.getItem("dispatchPK"), userCode: sessionStorage.getItem("token"), source:sessionStorage.getItem("source"),pkCar:JSON.stringify({demolitionSegmentList:list})}),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (demolitionSegment) {
            $("#common-blackBox").remove();
            if(demolitionSegment.success == "1" || demolitionSegment.success == ""){
              _this.$cjj("拆段成功");
              setTimeout(function () {
                sessionStorage.removeItem("lastSure");
                sessionStorage.removeItem("siteSure");
                bridge.invoke('gobackfrom');
              },500)
            }else{
              androidIos.second(demolitionSegment.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            $("#common-blackBox").remove();
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
</script>

<style scoped>
  #lastSure ul{
    width:100%;
    margin-top: 0.2rem;
    position: fixed;
    top:1.3rem;
    bottom: 1.2rem;
    height: auto;
    overflow: scroll;
  }
  #lastSure li{
    width: 93%;
    margin: 0 auto 0.2rem auto;
    background: white;
    border-radius: 0.2rem;
    box-shadow: 0rem 0.1rem 0.4rem #c3c3c3;
    overflow: hidden;
  }
  #lastSure li .second{
    float: right;
    width:2rem;
    margin: 0.8rem 1rem 0 0;
    text-align: right;
    font-size: 0.35rem;
  }
  #lastSure .firstBox{
    width:90%;
    padding: 0.3rem 5%;
    float: left;
  }
  #lastSure .firstBox p,#lastSure .secondBox p{
    font-size: 0.375rem;
    color:#333;
    line-height: 0.8rem;
    padding-left: 0.4rem;
  }
  #lastSure .firstBox h1{
    font-size: 0.3125rem;
    color:#666;
    line-height: 0.6rem;
  }
  #lastSure .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 1.2rem;
    height: auto;
  }
  #lastSure button{
    position: fixed;
    bottom:0;
    width:100%;
    line-height: 1.2rem;
    background: #3399FF;
    color:white;
    display: block;
    font-size: 0.38rem;
    letter-spacing: 0.0625rem;
  }
  li p:nth-child(1){
    background-image: url("../../images/pickmessage.png");
  }
  li p{
    background-image: url("../../images/arrmessage.png");
    background-size: 0.267rem;
    background-repeat: no-repeat;
    background-position: 0 0.27rem;
  }
  li h3,li h2{
    width: 100%;
    padding-left: 8%;
    font-size: 0.3125rem;
    line-height: 0.6rem;
    margin-top: 0.1rem;
    background-repeat: no-repeat;
    background-size: 0.45rem 0.45rem;
    background-position: 0 0.07rem;
    color:#666;
  }
  li h3{
    margin-bottom: 0.2rem;
  }
  li h3{
    background-image: url("../../images/trantype.png");
  }
  li h2{
    background-image: url("../../images/time.png");
  }
  h1 h4, h1 h5{
    width: 42%;
    padding-left: 8%;
    font-size: 0.3125rem;
    line-height: 0.6rem;
    float: left;
    margin-top: 0.1rem;
    background-repeat: no-repeat;
    background-size: 0.45rem 0.45rem;
    background-position: 0 0.07rem;
    color:#666;
  }
  li h4{
    background-image: url("../../images/product.png");
  }
  li h5{
    background-image: url("../../images/weight.png");
  }
</style>
