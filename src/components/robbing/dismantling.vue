<template>
  <div id="dismantling">
    <div id="title" v-title data-title="拆量" ></div>
    <ul>
      <li v-for="(item,index) in productBox.productsList" >
        <h5 @click="remove(index)" v-if="productBox.productsList.length>1">删除</h5>
        <p>拆量{{index+1}}</p>
        <div class="clearBoth"></div>
        <div v-for="(items) in item.list">
          <p>{{items.products}}</p>
          <div class="clearBoth"></div>
          <div style="border-bottom: 1px solid #dbdbdb;" class="liDiv">
            <h1>货物件数</h1>
            <h2>件</h2>
            <input type="tel" maxlength="100" v-model="items.number" placeholder="请输入拆量件数"/>
            <div class="clearBoth"></div>
          </div>
          <div style="border-bottom: 1px solid #dbdbdb;" class="liDiv">
            <h1>货物重量</h1>
            <h2>吨</h2>
            <input type="number" maxlength="100" v-model="items.weight" placeholder="请输入拆量吨位"/>
            <div class="clearBoth"></div>
          </div>
          <div class="liDiv">
            <h1>货物体积</h1>
            <h2>立方米</h2>
            <input type="number" v-model="items.volume" placeholder="请输入拆量体积"/>
            <div class="clearBoth"></div>
          </div>
        </div>
        <div class="clearBoth"></div>
      </li>
      <p id="add" @click="add()" v-if=" productBox.productsList.length < 2">新增拆量</p>
    </ul>
    <button id="push" @click="push()" class="colorfull">提交</button>
  </div>
</template>

<script>
  import {bomb} from "../../js/zujian";
  import  {androidIos} from "../../js/app";
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
             }
           }
       },
      watch:{
        productBox:{
          handler:function(val,oldval){
             var _this = this;
             for(var x = 0;x<_this.productBox.productsList.length;x++){
               for(var i=0;i<_this.productBox.productsList[x].list.length;i++){
                 _this.productBox.productsList[x].list[i].number=(_this.productBox.productsList[x].list[i].number.toString().match(/\d+(\d{0,0})?/)||[''])[0];
                 _this.productBox.productsList[x].list[i].weight=(_this.productBox.productsList[x].list[i].weight.toString().match(/\d+(\.\d{0,4})?/)||[''])[0];
                 _this.productBox.productsList[x].list[i].volume=(_this.productBox.productsList[x].list[i].volume.toString().match(/\d+(\.\d{0,4})?/)||[''])[0];
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
                  products:Sitedismantling.product[i].goods,
                  productsCode:Sitedismantling.product[i].goodsCode,
                  number:Sitedismantling.product[i].number,
                  weight:Sitedismantling.product[i].weight,
                  volume:Sitedismantling.product[i].volume,
                  numberBoth:Sitedismantling.product[i].number,
                  weightBoth:Sitedismantling.product[i].weight,
                  volumeBoth:Sitedismantling.product[i].volume,
                }
                list.push(json);
              }
              _this.productBox.productsList[0].list = list;
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
        add:function () {
           var _this = this;
           var list =[];
           for(var i = 0;i< _this.productBox.productsList[0].list.length;i++){
              var json ={
                products:_this.productBox.productsList[0].list[i].products,
                productsCode:_this.productBox.productsList[0].list[i].productsCode,
                number:"",
                weight:"",
                volume:"",
                numberBoth:_this.productBox.productsList[0].list[i].number,
                weightBoth:_this.productBox.productsList[0].list[i].weight,
                volumeBoth:_this.productBox.productsList[0].list[i].volume,
              }
              list.push(json)
           }
           _this.productBox.productsList.push({list:list});
        },
        remove:function (index) {
          var _this = this;
          _this.productBox.productsList.splice(index,1);
        },
        push:function () {
           var _this = this;
           if(bomb.hasClass("push","colorfull")){
             var number = [];
             var weight = [];
             var volume = [];
             if(_this.productBox.productsList.length == 1){
               androidIos.second("货物请拆量！")
               return false;
             }
             for(var i =0;i<_this.productBox.productsList.length;i++){
               var productsList = _this.productBox.productsList[i];
               for(var x = 0; x<productsList.list.length;x++){
                 if(i == 0){
                   var n = productsList.list[x].number*1;
                   var w = productsList.list[x].weight*1;
                   var v = productsList.list[x].volume*1;
                   number.push(n);
                   weight.push(w);
                   volume.push(v);
                 }else{
                    number[x] = number[x]*1 + productsList.list[x].number*1;
                   weight[x] = weight[x]*1 + productsList.list[x].weight*1;
                   volume[x] = volume[x]*1 + productsList.list[x].volume*1;
                 }
               }
             }
             for(var i =0;i<number.length;i++){
               if(_this.productBox.productsList[0].list[i].numberBoth - number[i] != 0 ){
                 bomb.first(_this.productBox.productsList[0].list[i].products +"件数拆分有误！");
                 return false;
               }else if(_this.productBox.productsList[0].list[i].weightBoth - weight[i] != 0 ){
                 bomb.first(_this.productBox.productsList[0].list[i].products +"重量拆分有误！");
                 return false;
               }else if(_this.productBox.productsList[0].list[i].volumeBoth - volume[i] != 0){
                 bomb.first(_this.productBox.productsList[0].list[i].products +"体积拆分有误！");
                 return false;
               }
             }
             sessionStorage.setItem("dismantling",JSON.stringify(_this.productBox));
             androidIos.addPageList();
             _this.$router.push({ path: '/robbing/dismantlingTrue'});
           }
        }
      }
    }
</script>

<style scoped>
  li{
    width:100%;
    margin-top: 0.2rem;
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
</style>
