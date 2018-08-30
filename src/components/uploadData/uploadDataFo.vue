<template>
  <div class="hello">
    <p class="title">公司名称</p>
    <input type="text" placeholder="请输入公司名称(需与营业执照上一致)" v-model="companyName" maxlength="20">
    <button @click="letGo()">下一步</button>
    <div id="title" v-title data-title="公司资料"></div>
  </div>
</template>

<script>
  import bridge from '../../js/bridge';
  import  {androidIos} from '../../js/app';
   import  {bomb} from '../../js/zujian.js';
export default {
  name: 'uploadDataFo',
  data () {
    return {
      type:'',
      letterType:'',
      companyName:''
    }
  },
  watch:{
    companyName:{
      handler:function(val,oldval){
        var _this = this;
        if(sessionStorage.getItem("source") == 2){
          var UPMESSA = localStorage.getItem("UPMESSA");
          if(UPMESSA != undefined || UPMESSA != null){
            UPMESSA = JSON.parse(UPMESSA);
            UPMESSA.company = _this.companyName;
          }else{
            UPMESSA = {
              userCode : sessionStorage.getItem("token"),
              nvitationodeIC:"",
              company:_this.companyName,
              tranType:"",
              tranTypeNumber:"",
              bank: "",
              bankNumber: "",
              creditCode:"",
              name: "",
              IDpic: "",
              IDpicfan:"",
              authorization:"",
              Licensepic: "",
              Roadpic: "",
              Travelpic: "",
              Drivepic: "",
              licType:"",
              licTypeCode:"",
              peopleNumber:""
            }
          }
          localStorage.setItem("UPMESSA",JSON.stringify(UPMESSA));
        }
      },
      deep:true
    }
  },
  mounted: function() {
    var _this = this;
    androidIos.bridge(_this);
  },
  methods:{
    go:function () {
      var _this =this;
      _this.type =_this.$route.query.type;
      _this.letterType = _this.$route.query.letterType;
      if(localStorage.getItem("UPMESSA") != null && _this.$route.query.type == 1){
        var user = JSON.parse(localStorage.getItem("UPMESSA")).userCode;
        if(user != sessionStorage.getItem("token")){
          localStorage.removeItem("UPMESSA");
        }
      }
      var UPMESSA = localStorage.getItem("UPMESSA");
      if(UPMESSA != undefined){
        _this.companyName = JSON.parse(UPMESSA).company;
      }
    },
    letGo:function () {
        var _this = this;
        var china =  /^[\u4e00-\u9fa5\a-z/A-Z\(\)\（\）]+$/;
        if(_this.companyName==""){
           bomb.first("请填写公司名称");
           return false;
        }
        if(china.test(_this.companyName)==false){
          bomb.first("公司名称不能带有特殊字符");
          return false;
        }
        var json = {
          "companyName":_this.companyName,
          "userCode":sessionStorage.getItem("token"),
          "source": sessionStorage.getItem("source")
        }
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/company/findStatusAndNameByName",
          data: JSON.stringify(json),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout:30000,
          success: function(findStatusAndNameByName){
            if(findStatusAndNameByName.success=="1"){
              androidIos.addPageList();
              _this.$router.push({ path: '/uploadData/uploadDataT',query:{type: _this.type,letterType:_this.letterType,companyName:_this.companyName,companyType:findStatusAndNameByName.status,creator:findStatusAndNameByName.isYourSelf==undefined || findStatusAndNameByName.isYourSelf==1 ? 0 :1}})
            }else if(findStatusAndNameByName.success=="-1"){
              androidIos.second(findStatusAndNameByName.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("当前状况下网络状态差，请检查网络！")
            }else if(status=="error"){
              androidIos.errorwife();
            }
          }
        });
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    width:93% ;
    margin-left: 3.5%;
  }
  .title{
    width:100%;
    line-height: 1rem;
    font-size: 0.375rem;
    margin-top: 0.3rem;
  }
  input{
    width:95%;
    height: 0.375rem;
    padding: 0.4rem 0 0.4rem 5%;
    font-size: 0.4rem;
  }
  h6{
    width:100%;
    line-height: 1rem;
    font-size: 0.375rem;
    text-align: right;
  }
  button{
    width: 100%;
    color:white;
    background: #3399FF;
    height: 1rem;
    margin-top: 0.5rem;
    font-size: 0.375rem;
    letter-spacing: 0.0625rem;
    box-shadow: 0 0.1rem 0.1rem #ccc;
    border-radius: 0.5rem;
  }
</style>
