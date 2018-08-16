<template>
  <div id="goods">
    <div id="title" v-title data-title="货物类别"></div>
    <ul v-if="list.length>0">
      <li v-for="(item,index) in list" @click="choose(item)">
        {{item.text}}
      </li>
    </ul>
    <div id="nogoods" v-if="list.length == 0">
      <img src="../../images/nojilu.png">
      <p>已选中所有类别</p>
    </div>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  export default {
    name: "goods",
    data(){
      return{
        parentcode:"",
        parentName:"",
        list:[]
      }
    },
    mounted:function(){
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var _this = this;
        var productList = JSON.parse(sessionStorage.getItem("newOrder")).productList;
        var list =[];
        for(var i = 0; i<productList.length;i++){
          if(productList[i].goodstypenumber != "" && i != _this.$route.query.index){
            list.push(productList[i].goodstypenumber.split("-")[1])
          }
        }
        _this.parentcode = _this.$route.query.code;
        _this.parentName = _this.$route.query.name;
        var json = {
          value:_this.parentcode,
        }
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/getGoodsType",
          data:json,
          dataType: "json",
          timeout: 10000,
          success: function (getGoodsType) {
            if(getGoodsType.success){
              if(list.length == 0){
                _this.list = getGoodsType.data;
              }else{
                var json =[];
                for(var i = 0; i < getGoodsType.data.length ; i++ ){
                  for(var x = 0 ; x <list.length ;x++){
                    if(getGoodsType.data[i].value == list[x]){
                      break;
                    }
                    if(x - list.length +1 == 0){
                      json.push(getGoodsType.data[i])
                    }
                  }
                }
                _this.list = json;
              }
            }else{
              androidIos.second(getGoodsType.msg);
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
      choose:function (item) {
        var _this = this;
        var json = {
           parentName:_this.parentName,
           parentcode:_this.parentcode,
           name:item.text,
           code:item.value,
           tranpk:item.def,
           index: _this.$route.query.index,
           protype:item.def-1
        }
        sessionStorage.setItem("goodsType",JSON.stringify(json));
        var addPageList = sessionStorage.getItem("addPageList");
        var number = addPageList * 1 - 2;
        sessionStorage.setItem("addPageList", number);
        _this.$router.go(-2);
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
  #nogoods{
     width:40%;
    margin: 1rem auto;
  }
  #nogoods img{
    display: block;
    width:100%;
  }
  #nogoods p{
    font-size: 0.375rem;
    text-align: center;
    color:#333;
    margin-top:0.3rem;
    letter-spacing: 2px;
  }
</style>

