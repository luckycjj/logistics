<template>
  <div id="goodsType">
    <div id="title" v-if="newordertrantype == '0'" v-title data-title="全部货物类别"></div>
    <div id="title" v-if="newordertrantype == '1'" v-title data-title="冷链池货物类别"></div>
    <div id="title" v-if="newordertrantype == '2'" v-title data-title="普货池货物类别"></div>
    <div id="title" v-if="newordertrantype == '3'" v-title data-title="危险品池货物类别"></div>
    <div id="title" v-if="newordertrantype == '4'" v-title data-title="集装箱池货物类别"></div>
    <ul v-if="list.length > 0 && listSure">
      <li v-for="item in list" @click="choose(item)">
        {{item.displayName}}
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
  export default {
        name: "goodsType",
      data(){
        return{
          list:[],
          nowId:"",
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
              if(productList[i].goodsType != ""){
                list.push(productList[i].goodsType.split("-")[0])
              }
            }
            if(list.length>0){
              _this.nowId = list[0];
            }
            //0全部 1冷链 2普货 3危险品 4集装箱
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp()+"/settings/getGoodClassByTransType",
              data:{
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source"),
                type:sessionStorage.getItem("NEWORDERTRANTYPE"),
              },
              dataType: "json",
              timeout: 10000,
              success: function (getGoodsClass) {
                _this.listSure = true;
                if(getGoodsClass.success || getGoodsClass.success == "1"){
                  if(_this.nowId == ""||(list.length == 1 && productList[_this.$route.query.index].goodsType!="")){
                    _this.list = getGoodsClass.list;
                  }else{
                    var json =[];
                    for(var i = 0; i<getGoodsClass.list.length;i++){
                      if(getGoodsClass.list[i].displayName == _this.nowId){
                        json.push(getGoodsClass.list[i])
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
          choose:function (item) {
            var _this = this;
            androidIos.addPageList();
            _this.$router.push({ path: '/newOrder/goods',query:{name: item.displayName,code:item.value,index:_this.$route.query.index}});
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

