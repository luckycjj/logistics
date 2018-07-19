<template>
  <div class="hello">
    <p class="title">请选择您的类型</p>
    <div id="title" v-title data-title="汽运类型"></div>
    <ul>
      <li v-for="item in firstType" @click="typeClick(item.type)">
        <p>{{item.typeName}}</p>
        <h6>{{item.typeMessage}}</h6>
      </li>
    </ul>
  </div>
</template>

<script>
  import  {androidIos} from '../../js/app';
export default {
  name: 'uploadDataS',
  data () {
    return {
      type:"1",
      firstType:[{
         type:1,
         typeName:"个体司机",
         typeMessage:"需提供驾驶证、行驶证以及个人信息"
      },{
        type:2,
        typeName:"车队",
        typeMessage:"需提供公司营业执照、道路运输许可证、个人信息"
      }]
    }
  },
  mounted: function() {
    var _this =this;
    _this.type = _this.$route.query.type;
  },
  methods:{
    typeClick:function(type){
      var _this = this;
      androidIos.addPageList();
        if(type == 1){
           _this.$router.push({ path: '/uploadData/uploadDataT',query:{type: _this.type,letterType:type} })
        }else if(type == 2){
           _this.$router.push({ path: '/uploadData/uploadDataFo',query:{type: _this.type,letterType:type}  })
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
  .title{
    width:93% ;
    margin-left:3.5%;
    line-height: 1rem;
    font-size: 0.375rem;
    margin-top: 0.3rem;
  }
  ul{
    width:93%;
    margin-left: 3.5%;
  }
  ul li{
    width: 100%;
    margin: 0.21rem auto 0 auto;
    background: white;
    height: 2.853rem;
    overflow: hidden;
    border-radius: 0.1rem;
  }
ul li:nth-child(1){
  background-image: url("../../images/cartypeF.png");
  background-repeat: no-repeat;
  background-size: cover;
}
ul li:nth-child(2){
  background-image: url("../../images/cartypeS.png");
  background-repeat: no-repeat;
  background-size: cover;
}
  ul li p{
    font-size: 0.5rem;
    margin-top: 0.62rem;
    margin-left:2.5rem;
    color:white;
  }
  ul li h6{
    font-size: 0.32rem;
    margin-left:2.5rem;
    margin-top: 0.26rem;
    color:white;
    width:6rem;
  }
</style>
