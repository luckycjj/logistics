<template>
  <div id="dismantlingTrue">
    <div id="title" v-title data-title="确认拆量信息" ></div>
    <ul>
        <li v-for="(item,index) in productBox.productsList">
          <p>{{productBox.address}}</p>
          <div class="product">
            <h1 v-for = "(items) in item.list">{{productBox.trantype}}/{{items.products}}/{{items.number*1}}件/{{items.weight*1}}{{items.weightUnit}}/{{items.volume*1}}{{items.volumeUnit}}</h1>
          </div>
          <h2>提货 {{productBox.pickTime}}</h2>
          <h2>到货 {{productBox.arrivTime}}</h2>
        </li>
    </ul>
    <button @click="sure()">确认拆量</button>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import bridge from "../../js/bridge";
  export default {
        name: "dismantlingTrue",
       data(){
           return{
              productBox:""
           }
       },
       mounted:function () {
         var _this = this;
         androidIos.bridge(_this);
       },
      methods:{
          go:function () {
            var _this = this;
            var dismantling =   sessionStorage.getItem("dismantling");
            if(dismantling!=undefined){
              dismantling = JSON.parse(dismantling);
              var listBox = [];
              for(var i = 0 ; i<dismantling.productsList.length;i++){
                var productsList = dismantling.productsList[i];
                var num = 0;
                var list= [];
                for(var x = 0;x< productsList.list.length;x++){
                  var number = 0;
                  number = productsList.list[x].weight*1 + productsList.list[x].volume*1;
                  num = num*1 + number*1;
                  list.push(productsList.list[x]);
                }
                if(num*1 != 0){
                  listBox.push({list:list});
                }
              }
              var json ={
                productsList:listBox,
                type:dismantling.type,
                address:dismantling.address,
                trantype:dismantling.trantype,
                pickTime:dismantling.pickTime,
                arrivTime:dismantling.arrivTime,
              }
              _this.productBox =json;
            }
          },
          sure:function () {
              var _this = this;
              var listBox = [];
              var weightBox = [];
              var volumeBox = [];
              var goodpkBox = [];
              var numberBox = [];
              for(var i = 0 ; i<_this.productBox.productsList.length;i++){
                 var list = [];
                 var productsList = _this.productBox.productsList[i];
                 for(var x = 0;x< productsList.list.length;x++){
                     var weight = productsList.list[x].weightUnit == "吨"  ? productsList.list[x].weight*1000 :  productsList.list[x].weight*1;
                     var volume = productsList.list[x].volumeUnit == "立方米"  ? productsList.list[x].volume*1 : productsList.list[x].volume/1000;
                     var number = productsList.list[x].number;
                     weightBox.push(weight);
                     volumeBox.push(volume);
                     numberBox.push(number);
                     if(i == 0){
                       var goodpk = productsList.list[x].productPk;
                       goodpkBox.push(goodpk);
                     }
                     var json = {
                       product:productsList.list[x].products,
                       productCode:productsList.list[x].productsCode,
                       num: productsList.list[x].number*1,
                       weight:productsList.list[x].weightUnit == "吨"  ? productsList.list[x].weight*1000 :  productsList.list[x].weight*1,
                       volume:productsList.list[x].volumeUnit == "立方米"  ? productsList.list[x].volume*1 : productsList.list[x].volume/1000,
                     }
                     list.push(json)
                 }
                 var data = {
                     car:"车辆"+(i*1+1),
                     list:list
                 }
                 listBox.push(data);
              }
              var json = {
                pk_segment:sessionStorage.getItem("dispatchPK"),
                pk_seg_pack_b:goodpkBox.join(","),
                dist_pack_num:"",
                dist_num:numberBox.join(","),
                dist_weight:weightBox.join(","),
                dist_volume:volumeBox.join(","),
              }
              var data = {
                pkCar:(JSON.stringify(json)).toString(),
                source: sessionStorage.getItem("source"),
                userCode:sessionStorage.getItem("token"),
              }
              androidIos.loading("正在拆量");
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/order/disassembledAmount",
                data:JSON.stringify(data),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 50000,
                success: function (disassembledAmount) {
                    if(disassembledAmount.success == "1"){
                        _this.$cjj("拆量成功");
                        setTimeout(function () {
                          bridge.invoke('gobackfrom');
                        },500)
                    }else{
                     androidIos.second(disassembledAmount.message);
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
   li{
     width:90%;
     padding: 0.3rem 5%;
     margin-bottom: 0.2rem;
     background: white;
   }
  li p{
    font-size: 0.35rem;
    color:#333;
  }
  li h1{
     font-size: 0.3125rem;
    color:#666;
  }
  li h2{
    font-size: 0.3125rem;
    color:#999;
  }
  .product{
    margin: 0.2rem 0 ;
  }
   button{
     width:96%;
     margin:0.4rem auto;
     line-height: 1.2rem;
     background: #3399FF;
     color:white;
     border-radius: 0.2rem;
     display: block;
     font-size: 0.38rem;
     letter-spacing: 0.0625rem;
   }
</style>
