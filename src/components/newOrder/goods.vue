<template>
  <div id="goods">
    <div id="title" v-if="newordertrantype == '0'" v-title data-title="全部货物类别"></div>
    <div id="title" v-if="newordertrantype == '1'" v-title data-title="冷链池货物类别"></div>
    <div id="title" v-if="newordertrantype == '2'" v-title data-title="普货池货物类别"></div>
    <div id="title" v-if="newordertrantype == '3'" v-title data-title="危险品池货物类别"></div>
    <div id="title" v-if="newordertrantype == '4'" v-title data-title="集装箱池货物类别"></div>
    <ul v-if="list.length > 0 && listSure">
      <li v-for="(item,index) in list" @click="choose(item)">
        {{item.text}}
      </li>
    </ul>
    <div id="nogoods" v-if="list.length == 0 && listSure">
      <img src="../../images/nojilu.png">
      <p>暂无货物</p>
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
        list:[],
        tranType:"",
        listSure:false,
        newordertrantype:0,
      }
    },
    beforeMount:function () {
      var _this = this;
      if(sessionStorage.getItem("NEWORDERTRANTYPE") != undefined){
        _this.newordertrantype = sessionStorage.getItem("NEWORDERTRANTYPE");
      }else{
        _this.newordertrantype = 0;
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
            list.push({
              goodstypenumber:productList[i].goodstypenumber.split("-")[1],
              tranType:productList[i].tranpk
            });
            _this.tranType = productList[i].tranpk;
          }
        }
        _this.parentcode = _this.$route.query.code;
        _this.parentName = _this.$route.query.name;
        var json = {
          value:_this.parentcode,
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source"),
          type:sessionStorage.getItem("NEWORDERTRANTYPE") == '0' ? '' :sessionStorage.getItem("NEWORDERTRANTYPE"),
        }
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/getGoodsType",
          data:json,
          dataType: "json",
          timeout: 10000,
          success: function (getGoodsType) {
            if(getGoodsType.success || getGoodsType.success == "1" || getGoodsType.success == ""){
              _this.listSure = true;
              if(list.length == 0){
                _this.list = getGoodsType.data;
              }else{
                var json =[];
                for(var i = 0; i < getGoodsType.data.length ; i++ ){
                  for(var x = 0 ; x <list.length ;x++){
                    if(getGoodsType.data[i].value == list[x].goodstypenumber){
                      break;
                    }
                    if(getGoodsType.data[i].transType != _this.tranType){
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
           tranpk:item.transType,
           index: _this.$route.query.index,
           protype:item.def
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

