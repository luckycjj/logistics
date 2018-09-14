<template>
  <div id="dismantling">
    <div id="title" v-title data-title="拆量" ></div>
    <ul>
      <li v-for="(item,index) in productBox.productsList" >
        <p>拆量{{index+1}}</p>
        <div class="clearBoth"></div>
          <div v-for="(items,indexs) in item.list">
            <p>{{items.products}}</p>
            <div class="clearBoth"></div>
            <div class="divBoth">
            <div style="border-bottom: 1px solid #dbdbdb;" class="liDiv">
              <h1>货物件数</h1>
              <h2><span>{{items.number}}</span>件</h2>
              <div class="clearBoth"></div>
            </div>
            <div style="border-bottom: 1px solid #dbdbdb;" class="liDiv" v-if="items.weightBoth*1 > 0 ">
              <h1>货物重量</h1>
              <h2><span v-if="productBox.productsList.length == 1">{{items.weight*1}}</span>{{items.weightUnit}}</h2>
              <input v-if="productBox.productsList.length > 1" @keyup="weightKeyup(index,indexs)" type="number" maxlength="100" v-model="items.weight" placeholder="请输入拆量吨位"/>
              <div class="clearBoth"></div>
            </div>
            <div class="liDiv"  v-if="items.volumeBoth*1 > 0 ">
              <h1>货物体积</h1>
              <h2><span v-if="productBox.productsList.length == 1">{{items.volume*1}}</span>{{items.volumeUnit}}</h2>
              <input v-if="productBox.productsList.length > 1" @keyup = "volumekeyup(index,indexs)" type="number" v-model="items.volume" placeholder="请输入拆量体积"/>
              <div class="clearBoth"></div>
            </div>
            </div>
          </div>
          <div class="clearBoth"></div>
      </li>
    </ul>
    <button id="push" @click="push()" class="colorfull">提交</button>
  </div>
</template>

<script>
  import {bomb} from "../../js/zujian";
  import  {androidIos} from "../../js/app";
  import Debounce from '../../js/Debounce.js';
  export default {
        name: "dismantling",
       data(){
           return{
             productBox:{
               productsList:[{
                 list:[]
               }],
               type:1,
               address:"",
               trantype:"",
               pickTime:"",
               arrivTime:"",
               orderList:[{
                 list:[]
               }]
             },
             suremend: new Debounce(this.matchWeightVolume, 1000),
           }
       },
      watch:{
        productBox:{
          handler:function(val,oldval){
             var _this = this;
             for(var x = 0;x<_this.productBox.productsList.length;x++){
               for(var i=0;i<_this.productBox.productsList[x].list.length;i++){
                 _this.productBox.productsList[x].list[i].number=(_this.productBox.productsList[x].list[i].number.toString().match(/\d+(\d{0,0})?/)||[''])[0];
                 if(_this.productBox.productsList[x].list[i].weight*1 != 0){
                   _this.productBox.productsList[x].list[i].weight=(_this.productBox.productsList[x].list[i].weight.toString().match(/\d+(\.\d{0,2})?/)||[''])[0];
                 }
                 if(_this.productBox.productsList[x].list[i].volume*1 != 0){
                   _this.productBox.productsList[x].list[i].volume=(_this.productBox.productsList[x].list[i].volume.toString().match(/\d+(\.\d{0,2})?/)||[''])[0];
                 }
               }
             }
          },
          deep:true
        }
      },
    mounted:function(){
          var _this = this;
          androidIos.bridge(_this);
     },
      methods:{
        go:function () {
            var _this = this;
            var dismantling =   sessionStorage.getItem("dismantling");
            var Sitedismantling = sessionStorage.getItem("Sitedismantling");
            if(Sitedismantling!=undefined){
              Sitedismantling = JSON.parse(Sitedismantling);
              _this.productBox.address = Sitedismantling.startAddress +"  -  "+ Sitedismantling.endAddress;
              _this.productBox.trantype = Sitedismantling.product[0].tranType;
              _this.productBox.pickTime = Sitedismantling.startTime;
              _this.productBox.arrivTime = Sitedismantling.endTime;
              var list =[];
              for(var i = 0 ; i < Sitedismantling.product.length; i++){
                var json ={
                  productPk:Sitedismantling.product[i].goodPk,
                  products:Sitedismantling.product[i].goods,
                  productsCode:Sitedismantling.product[i].goodsCode,
                  number:Sitedismantling.product[i].number,
                  weight:Sitedismantling.product[i].weight.indexOf("吨") !=  -1 ? Sitedismantling.product[i].weight.split("吨")[0] : Sitedismantling.product[i].weight.split("千克")[0] ,
                  weightUnit:Sitedismantling.product[i].weight.indexOf("吨") !=  -1 ? "吨" : "千克",
                  volume:Sitedismantling.product[i].volume.indexOf("升") !=  -1 ? Sitedismantling.product[i].volume.split("升")[0] : Sitedismantling.product[i].volume.split("立方米")[0] ,
                  volumeUnit:Sitedismantling.product[i].volume.indexOf("升") !=  -1 ? "升" : "立方米",
                  numberBoth:Sitedismantling.product[i].number,
                  weightBoth:Sitedismantling.product[i].weightBoth,
                  volumeBoth:Sitedismantling.product[i].volumeBoth,
                  density:Sitedismantling.product[i].density,
                }
                list.push(json);
              }
              _this.productBox.productsList[0].list = list;
              _this.productBox.orderList[0].list = list;
              var listSS =[];
              for(var i = 0;i< _this.productBox.productsList[0].list.length;i++){
                var json ={
                  productPk:_this.productBox.productsList[0].list[i].goodPk,
                  products:_this.productBox.productsList[0].list[i].products,
                  productsCode:_this.productBox.productsList[0].list[i].productsCode,
                  number:1,
                  weight:_this.productBox.productsList[0].list[i].weightBoth - _this.productBox.productsList[0].list[i].weight,
                  weightUnit:_this.productBox.productsList[0].list[i].weightUnit,
                  volume:_this.productBox.productsList[0].list[i].volumeBoth - _this.productBox.productsList[0].list[i].volume,
                  volumeUnit:_this.productBox.productsList[0].list[i].volumeUnit,
                  numberBoth:_this.productBox.productsList[0].list[i].number,
                  weightBoth:_this.productBox.productsList[0].list[i].weightBoth,
                  volumeBoth:_this.productBox.productsList[0].list[i].volumeBoth,
                }
                listSS.push(json)
              }
              _this.productBox.productsList.push({list:listSS});
            }
            if(dismantling!=undefined){
              dismantling = JSON.parse(dismantling);
              _this.productBox =dismantling;
              sessionStorage.removeItem("dismantling");
            }
            $(document).on('click','.liDiv input',function () {
              var $Val = $.trim($(this).val())
              $(this).val('').focus().val($Val)
            })
          },
        remove:function (index) {
          var _this = this;
          _this.productBox.productsList.splice(index,1);
        },
        push:function () {
           var _this = this;
           if(bomb.hasClass("push","colorfull")){
             var weight = [];
             var volume = [];
             if(_this.productBox.productsList.length == 1){
               androidIos.second("货物请拆量！")
               return false;
             }
             for(var i =0;i<_this.productBox.productsList.length;i++){
               var num = 0;
               var productsList = _this.productBox.productsList[i];
               for(var x = 0; x<productsList.list.length;x++){
                 num += productsList.list[x].weight*1 + productsList.list[x].volume*1 ;
                 if(i == 0){
                   var w = productsList.list[x].weight*1;
                   var v = productsList.list[x].volume*1;
                   weight.push(w);
                   volume.push(v);
                 }else{
                   weight[x] = weight[x]*1 + productsList.list[x].weight*1;
                   volume[x] = volume[x]*1 + productsList.list[x].volume*1;
                 }
               }
               if(num == 0){
                 bomb.first("拆量"+ (i + 1) + "请填写货物重量或体积");
                 return false;
               }
             }
             for(var i =0;i<weight.length;i++){
               if(_this.productBox.productsList[0].list[i].weightBoth - weight[i] > 0.01 ){
                 bomb.first(_this.productBox.productsList[0].list[i].products +"重量拆分有误");
                 return false;
               }else if(_this.productBox.productsList[0].list[i].volumeBoth - volume[i] > 0.01){
                 bomb.first(_this.productBox.productsList[0].list[i].products +"体积拆分有误");
                 return false;
               }
             }
             sessionStorage.setItem("dismantling",JSON.stringify(_this.productBox));
             androidIos.addPageList();
             _this.$router.push({ path: '/robbing/dismantlingTrue'});
           }
        },
        weightKeyup:function (item,items) {
          var _this = this;
          _this.suremend(item,items,"w");
        },
        volumekeyup:function (item,items) {
          var _this = this;
          _this.suremend(item,items,"v");
        },
        matchWeightVolume:function (item,items,type) {
          var _this = this;
          if(_this.productBox.productsList.length > 1){
              if(type == "w"){
                _this.productBox.productsList[item].list[items].weight = _this.productBox.productsList[0].list[items].weightBoth - _this.productBox.productsList[item].list[items].weight > 0 ?  _this.productBox.productsList[item].list[items].weight*1 : _this.productBox.productsList[0].list[items].weightBoth*1;
                _this.productBox.productsList[1-item].list[items].weight = _this.productBox.productsList[0].list[items].weightBoth - _this.productBox.productsList[item].list[items].weight;
                if(_this.productBox.productsList[0].list[items].density != null){
                  _this.productBox.productsList[item].list[items].volume =   (_this.productBox.productsList[item].list[items].weight / _this.productBox.productsList[0].list[items].density).toFixed(2)*1;
                  _this.productBox.productsList[1-item].list[items].volume = _this.productBox.productsList[0].list[items].volumeBoth - _this.productBox.productsList[item].list[items].volume;
                }
              }else if(type == "v"){
                _this.productBox.productsList[item].list[items].volume = _this.productBox.productsList[0].list[items].volumeBoth - _this.productBox.productsList[item].list[items].volume > 0 ?  _this.productBox.productsList[item].list[items].volume*1 : _this.productBox.productsList[0].list[items].volumeBoth*1;
                _this.productBox.productsList[1-item].list[items].volume = _this.productBox.productsList[0].list[items].volumeBoth - _this.productBox.productsList[item].list[items].volume;
                if(_this.productBox.productsList[0].list[items].density != null){
                  _this.productBox.productsList[item].list[items].weight =   (_this.productBox.productsList[1-item].list[items].volume * _this.productBox.productsList[0].list[items].density).toFixed(2)*1;
                  _this.productBox.productsList[1-item].list[items].weight = _this.productBox.productsList[0].list[items].weightBoth - _this.productBox.productsList[item].list[items].weight;
                }
              }
          }
        },
      }
    }
</script>

<style scoped>
  li{
    width:94%;
    margin: 0.2rem auto 0 auto;
    display: block;
  }
  li p{
     font-size: 0.35rem;
     line-height: 0.8rem;
      color:#666;
    margin-left: 2%;
    float: left;
  }
  li h5{
    font-size: 0.35rem;
    line-height: 0.8rem;
    color:#999;
    margin-right: 2%;
    float: right;
  }
  .liDiv{
    width:96%;
    padding: 0 2%;
    background: white;
  }
  .liDiv h1{
    float: left;
    font-size: 0.3125rem;
    color:#333;
    line-height: 1rem;
  }
  .liDiv h2{
    float: right;
    font-size: 0.3125rem;
    color:#333;
    line-height: 1rem;
  }
  .liDiv h2 span{
    font-size: 0.3125rem;
    color:#333;
    margin-right: 0.2rem;
  }
  .liDiv input{
     float: right;
    font-size: 0.3125rem;
    color:#333;
    line-height: 1rem;
    width:2.5rem;
    text-align: right;
    margin-right: 0.2rem;
  }
  #add{
    float: right;
    margin:0.2rem 0.2rem;
    font-size: 0.3125rem;
    color:#333;
  }
  button{
    width:96%;
    margin:0.4rem auto;
    line-height: 1.2rem;
    background: #dbdbdb;
    color:white;
    border-radius: 0.2rem;
    display: block;
    font-size: 0.38rem;
    letter-spacing: 0.0625rem;
  }
  .colorfull{
     background: #3399FF!important;
  }
  .divBoth{
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 0.2rem #d4d4d4;
    overflow: hidden;
  }
</style>
