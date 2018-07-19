<template>
  <div class="hello">
    <div id="title" v-title data-title="选择运输类型"></div>
    <img :src="imgurl" id="imgBox">
    <p id="typeP">账号还未提交审核，选择运输方式并上传资料，审核完成可进行抢单(可在“我的”个人资料中查看审核状态)</p>
    <ul id="typeUl">
      <li v-for="(item,index) in type" @click="typeClick(item.letterType)" :class="index%2==0?'left':'right'">
        <p>{{item.type}}</p>
        <h6>{{item.message}}</h6>
      </li>
      <div class="clearBoth"></div>
    </ul>
  </div>
</template>

<script>
  import  {androidIos} from '../../js/app';
 export default {
  name: 'uploadDataF',
  data () {
    return {
      type:[{
         letterType:"1",
         type:"汽运类型",
         message:"提供公路运输方式"
      }],
      imgurl:""
    }
  },
   mounted: function() {
   },
  methods:{
    typeClick:function(type){
         var _this = this;
         androidIos.addPageList();
          if(type==1){
            _this.$router.push({ path: '/uploadData/uploadDataS',query:{type: 1}})
          }else if(type==2){
            _this.$router.push({ path: '/uploadData/uploadDataFo',query:{type: 2} })
          }else if(type==3){
            _this.$router.push({ path: '/uploadData/uploadDataFo',query:{type: 3} })
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
}
a {
  color: #42b983;
}
  #imgBox{
    width:100%;
  }
  #typeP{
    width:94%;
    margin-left: 3%;
    font-size: 0.375rem;
    margin-top: 0.5rem;
    line-height: 0.5rem;
  }
#typeUl{
  width: 94%;
  margin-left: 3%;
  margin-top: 0.5rem;
}
  #typeUl li{
     width:4.53rem;
    background: white;
    margin-bottom: 0.375rem;
    height: 2.9333rem;
    border-radius: 0.1rem;
  }
  #typeUl li:nth-child(1){
     background-image: url("../../images/transportF.jpg");
    background-repeat: no-repeat;
    background-size: cover;
  }
#typeUl li p {
  font-size: 0.5rem;
  line-height: 0.8rem;
  margin-left: 0.4rem;
  margin-top: 0.77rem;
  color:white;
}
#typeUl li h6 {
  font-size: 0.32rem;
  margin-left: 0.4rem;
  line-height: 0.8rem;
  color:white;
}
  .left{
    float: left;
  }
  .right{
    float: right;
  }
</style>
