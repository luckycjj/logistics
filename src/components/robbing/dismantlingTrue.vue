<template>
  <div id="dismantlingTrue">
    <div id="title" v-title data-title="确认拆量信息" ></div>
    <ul>
        <li v-for="(item,index) in productBox.productsList">
          <p v-html="productBox.address.split('-')[0]"></p>
          <p v-html="productBox.address.split('-')[1]"></p>
          <h3>{{productBox.trantype}}</h3>
          <div class="product">
            <h1 v-for = "(items) in item.list" v-if="items.weight*1 + items.volume*1 != 0">
              <h4>{{items.products}}</h4>
              <h5>{{items.number*1}}件/{{items.weight*1}}{{items.weightUnit}}/{{items.volume*1}}{{items.volumeUnit}}</h5>
              <div class="clearBoth"></div>
            </h1>
          </div>
          <h2>{{productBox.pickTime}} - {{productBox.arrivTime}}</h2>
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
     width:84%;
     padding: 0.3rem 5%;
     display: block;
     margin:0.2rem auto 0 auto;
     border-radius: 0.2rem;
     box-shadow: 0 0.1rem 0.2rem #d4d4d4;
     overflow: hidden;
     background: white;
   }
  li p{
    font-size: 0.36rem;
    color:#333;
    padding-left: 0.5rem;
    margin-bottom: 0.2rem;
  }
  li h1{
     font-size: 0.3125rem;
    color:#666;
  }
  li h2{
    font-size: 0.3125rem;
    color:#999;
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
   li p:nth-child(1){
     background-image: url("../../images/pickmessage.png");
   }
   li p{
     background-image: url("../../images/arrmessage.png");
     background-size: 0.267rem;
     background-repeat: no-repeat;
     background-position: 0 0.13rem;
   }
  li h3,li h2{
     width: 100%;
     padding-left: 8%;
     font-size: 0.3125rem;
     margin-top: 0.1rem;
     background-repeat: no-repeat;
     background-size: 0.45rem 0.45rem;
     background-position: 0 0.01rem;
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
   .product h1 h4,.product h1 h5{
     width: 42%;
     padding-left: 8%;
     font-size: 0.3125rem;
     float: left;
     margin-top: 0.1rem;
     background-repeat: no-repeat;
     background-size: 0.45rem 0.45rem;
     background-position:0 0.02rem;
     color:#666;
   }
   li h4{
     background-image: url("../../images/product.png");
   }
   li h5{
     background-image: url("../../images/weight.png");
   }
</style>
