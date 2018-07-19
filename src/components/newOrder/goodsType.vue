<template>
  <div id="goodsType">
    <div id="title" v-title data-title="货物类别"></div>
    <ul>
      <li v-for="item in list" @click="choose(item)">
        {{item.text}}
      </li>
    </ul>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  export default {
        name: "goodsType",
      data(){
        return{
          list:[],
          nowId:""
        }
      },
      mounted:function(){
          var _this = this;
           var productList = JSON.parse(sessionStorage.getItem("newOrder")).productList;
          var list =[];
          for(var i = 0; i<productList.length;i++){
            if(productList[i].goodsType != ""){
              list.push(productList[i].goodsType.split("-")[0])
            }
          }
          if(list.length>0){
            _this.nowId = list[0];
          }
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp()+"/getGoodsClass",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (getGoodsClass) {
              if(getGoodsClass.success){
                if(_this.nowId == ""||(list.length == 1 && productList[_this.$route.query.index].goodsType!="")){
                  _this.list = getGoodsClass.data;
                }else{
                  var json =[];
                  for(var i = 0; i<getGoodsClass.data.length;i++){
                     if(getGoodsClass.data[i].text == _this.nowId){
                        json.push(getGoodsClass.data[i])
                     }
                  }
                  _this.list = json;
                }
              }else{
                androidIos.second(getGoodsClass.msg);
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
      },
      methods:{
        choose:function (item) {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({ path: '/newOrder/goods',query:{name: item.text,code:item.value,index:_this.$route.query.index}});
        }
      }
    }
</script>


<style scoped>
  ul{
    width:100%;
    border-top:1px solid #dbdbdb;
    margin-top: 0.3rem;
  }
  li{
    font-size: 0.375rem;
    background: white;
    color:#333;
    line-height: 1.4rem;
    width:90%;
    padding: 0 5%;
    border-bottom: 1px solid #dbdbdb;
  }
</style>

