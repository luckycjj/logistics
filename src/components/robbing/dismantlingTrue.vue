<template>
  <div id="dismantlingTrue">
    <div id="title" v-title data-title="确认拆量信息" ></div>
    <ul>
        <li v-for="(item,index) in productBox.productsList">
          <p>{{productBox.address}}</p>
          <div class="product">
            <h1 v-for = "(items) in item.list">{{productBox.trantype}}/{{items.products}}/{{items.number*1}}件/{{items.weight*1}}吨/{{items.volume*1}}立方米</h1>
          </div>
          <h2>提货 {{productBox.pickTime}}</h2>
          <h2>到货 {{productBox.arrivTime}}</h2>
        </li>
    </ul>
    <button @click="sure()">确认拆量</button>
  </div>
</template>

<script>
    export default {
        name: "dismantlingTrue",
       data(){
           return{
              productBox:""
           }
       },
       mounted:function () {
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
               number = productsList.list[x].number*1 +  productsList.list[x].weight*1 + productsList.list[x].volume*1;
               num = num*1 + number*1;
               if(number*1 != 0){
                 list.push(productsList.list[x]);
               }
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
      methods:{
        sure:function () {
            var _this = this;
            var listBox = [];
            for(var i = 0 ; i<_this.productBox.productsList.length;i++){
               var list = [];
               var productsList = _this.productBox.productsList[i];
               for(var x = 0;x< productsList.list.length;x++){
                   var json = {
                     product:productsList.list[x].products,
                     productCode:productsList.list[x].productsCode,
                     num: productsList.list[x].number*1,
                     weight:productsList.list[x].weight*1000,
                     volume:productsList.list[x].volume*1,
                   }
                   list.push(json)
               }
               var data = {
                   car:"车辆"+(i*1+1),
                   list:list
               }
               listBox.push(data);
            }
            console.log(JSON.stringify(listBox));
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
