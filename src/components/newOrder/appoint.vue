<template>
  <div id="appoint">
    <div id="title" v-title data-title="选择承运商"></div>
    <div id="carTitleBox"   @click="event($event)">
      <div class="carTitleBox">
        <div class="carTitleback" @click="goback()"></div>
        <input placeholder="请输入信息" id="carNumber" v-model="message" maxlength="8" @focus="aaa()">
        <p @click="sousuo()">搜索</p>
      </div>
    </div>
    <div class="nav">
      <p class="active" i="0">承运商</p>
      <p i="1">司机</p>
    </div>
    <div id="mescroll" class="mescroll">
      <ul id="dataList" class="data-list">
      </ul>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import  "../../js/markingSystem";
  var thisthat;
  export default {
    name: "appoint",
    data(){
      return{
        mescroll:"",
        message:""
      }
    },
    mounted:function () {
      var self = this;
      thisthat = this;
      self.$nextTick(function () {
         self.go();
      })
    },
    methods:{
      aaa:function(){
        $("#appoint #carTitleBox").css("z-index","100");
      },
      event:function (e) {
        var _this = this;
        if($("#appoint #carTitleBox").css("z-index")=="100"){
          if(e.target.id=="carTitleBox"){
            $("#appoint #carTitleBox").css("z-index","0");
            _this.pdlist = [];
            _this.mescroll.resetUpScroll();
          }
        }
      },
      sousuo:function(){
        var _this = this;
        $("#appoint #carTitleBox").css("z-index","0");
        _this.pdlist = [];
        _this.mescroll.resetUpScroll();
      },
      goback:function () {
        androidIos.gobackFrom(this);
      },
      go:function(){
        var _this = this;
        var mescroll = new MeScroll("mescroll", { //id固定"body"
          //上拉加载的配置项
          up: {
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            clearEmptyId: "dataList", //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
            empty:{
              warpId:'mescroll',
              icon:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAGACAMAAACTGUWNAAAAilBMVEUAAADMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz////5+fnw8PDi4uLc3NzS0tLp6ens7Ozf39/19fXW1tbPz8/m5ubZ2dmX0joBAAAAH3RSTlMAzwTtlUUJ9mgj5raEGl0uDjymUd3VFG7F4b10i52vve5P/wAADfJJREFUeNrs3Ad2ozAQANARKghExxS3zP1vufVt1ikGEsqo/CMgM1UGbBLlpSyumWjMyLoT5zzGn2LO+aljo2lEdi1kmUcQrEuV7SBeWIozpexFXNtSQfBdfa3F5YxfdL6IQfYQfEnSZibFFaQmaxMIFqhkZjiuiptMVhBM61vBcCNMtCEgPaPkjeHG2E2G5PyhZDAx7iI2Q8gJj6L61uGuulsd2oW/IilSPEAqZDgDgFpwPAwXNXitzM54sHNWgqcqPSIJo/axQ6ibGMmIG89CUaUZEsM8eg0SwZEgLvzoDqRBsowEx0UFudjziBUu9wZKn5C8k3Z1VqSGFK2QDi4egTWP380jiLRFj/+XVLuUC6LCgtj/1smddCw7tFLnRlFaEq77pxj7B3W9QKsJu5fIkSY5dFiC25yNa+Jt7zzM1klpf0dH3K2MQ4X10ecVL8A2yQWdcrFrVB0NhNZd64gHi5JxQmTZu67RmpdAO/fz/yPWYIPc4s53ismBvNah4uc93gJtyvLJwzRBelNQWjr3XKIjPKArHM2+j2KqXZlyZvQw5U4yDCVOTN7mYQRbAul09fMWJ7csu6JnrkCJatA7DaFEkHsU/l8xMm1xaeGlkzWkRDoCv9Lv/2ISgwk/uq9PDHC4DL12g2NFHpY/j5oIDqQcnv3PZRQcpndy9bjU2MMCofz/zYmGIPe0/H/vlMO08PxfOXECyeFfeaDknMBz4flvLJ04gRB/3rM5CvUeLN+X6nrYTRXqzw+wCnZShf7rQ2MFu1CO3Txfz0XBDqIw//mUiWB73s8/n2ngU2H+v4sMNqYxeErDploMJrSwodLn/e9McQmbyS375swx0hw2okIDPAtT8E8oQOeyoBj17v4tsZu7EoPZJKwu8fYC4lfwBCAk4GWIJ2Jv/v+1ljusqsBgoQIgdMCLEe2IQwI4OA04//2BH+zdi1KbQBTG8YVcEIyV1EuqzfgtsWgQeP/Xa2wnI9tqiGT3nMN4fo/gf8JeWNYwproFOoy0jdELXQEMNLkwPug74MHO9R3YELLej6U6Az1BkppT6SGgk9zrA+izZD2EdAbEPBN6gDrRgy7BBhCyHMszBNU2m8rKUG0eXxBGlsvcAyqbwspSNDVCmJqBlginfrIShUmwNIPEEYLZWqGKFv5FsbQlwLOVq4F/Z7JG4HpjJXuGd1ku6kMA2X//IAXWkjbhJD9//nqEb0kqZw0sdvztaOHbg5iDiLUdgQrezaRMQeU/gMI8hKJYxkGs0o5CUcO3b+YT4msEInMBTPETuI7N8VYIRdr+D+EosDJHm2cIpLVjUcK3bC7gW5jGjsUW3v3k/wGIXwS/eYJ32Zx9BBjNEGDtBv6t2H8AsKNRwb9szrwNPaYABQI4410D4MsHuI55v0b68gGOWg5HCEYDRLzfY2sAzFjPwmmA/vcCKQLSAEDKeRZLA/Se0soTBKQBgCRn/BxAA+yc8c1BoQF2bkhPg7o0wKsl36VkGuDVd74hWAO8SnK2IVgD7Bwahn8gLA3wR2Q+cIng+j9SaUsKbcMYAJd8F6Pbw6oaVMqKL8DCvO8OwfWeR6NT8gW4Y1oEoC9AA0rPbAGwZLsXyx7UgtKWL8DUvCOeIDx70Aso/eILMIl5ribWAHsznieQBtibmv/EGYLTAHtZzDIH0gB778yD1ghPVoAtZ4C1+dcNKPQdCaf0xBnghuw0hMseVIFQXXAGQGpcK5CwcpbCG8saYMVzO6vtsSlBo60sb4B745gnIGH7FRTsDm+AZE6/DIa+kOmYMUxCNUDH2nRFoKABOiLTcQsSGqDrlv5+UA3QdUX/P0o0QNeUfgjQAG+cQSAHDQ3gyMlXARrAMTN7C9DQAI4F9UYQNIDj3OxNQEMDOCbE7wIADeBKqZdhGsB1RT0GawDXgnoM1gBdb6NwBiIawJURb4VCA/xm72700oahMIyflm8UEJwK6vamtAgI3v/tbfttUAxjFUbenMn5X0IesU3aJp57+WkIFgvgGZIPy7MAnjb5vGwL4KmTj+u0AJ5H+WkCFgvgmcgPKWgsgC/lrgRZAF+H+jQGFsDX4N6FWgBfm7sUZwF81yIyAo0F8I1EZAwiV2W+KBjyqY4AY+5aaGWAbAaWt0xDgC53GlAZYAaeNw0BkEoPTFXHhjBNNQToyQA8ujbryDUEGFDnYbq+Ey40BGhIHzwWYE9fnsBjAfY8USfCFmDPtdTBYwH21GUEHl0BFhoCjOQKPLo261hrCHAlYzBVHR/IlGkIMJYETE7PT2CtYikikTswuQrrFThmcxWrobiTCZhcpeWUYankeQAmUgOPPZDZU7MAFkAnWoAWeCzAnpaAyALsswAWQCcLcJz/N4BdhONehO021Nk8QCULcJz/N4C2xTgtWItxypaj9WAtR+t6IKMIKUCi6pGkJqQAY1UP5TVhPZRX9VqKJqQAI1UvZmlCClBX9WqiJqQA16peztWEFOBJ1evpmpAC9FV9oKEJKUBD1SdKmpACDFR9pKcJKUBP12eqipACpLo+1FaEE6CrbqsCNTgBxrZZR/zNOnRtV7N8yRleljoCXCvbsCkrwLJQEaCtbMuyV/AsNARo6Nq0bw6mpYIAHV3bVhbg0bFZR6pr49aL+1B7omzr4osL8Khs8+6LC1BXtn39xQVoKzvA4eICDJUdYXJxAe6VHeJzabehXW3HWF3aROxK3UFub+DJ4y9FXMsvfdA4Ndul5AoW424VHuaZzV8Y5pmG5eiOHWer4zhbO9A5ToArO9Jcy5Hmdqh/5EP9b8BhAd65ka0EFBZgVyKlOigswK66lG5BYQF23UrpHhQWYNe9CPsiYAF2JLLrGQwWYMez7GqAwQLsaMiuZgsEFqDUaso7jyCwAKVHee8BBBag9CDvdUBgAUod8dwhPAuwdSe+Z4RnAbaexTdEeBZgayi+tIvgLMBGN5U9dQRnATbqUiJOhi3ARkP2pTWEZgF+q6UiMf4HWYDf6lJi3gcpCpBNp/O/ekFAQ/mjCQLTEmBerBDTRDys14NUBMgWiO1a/myAwDQEyBHfQA4YI6z4AZYzxJfIIW2EFT3AHBq05ZCbFgJzUa2hQetGDhohMHeUT/n3j5GU6FMBF9ESOgzlLxKE5SLScP2F9yiGfhl28eR4Z1bkB7wiqLaU+JdhF02GHat1Fudge+8SzF+Rc9HkKBWZO2i6QlB18XDfjnDRrLCVu3jjj45U+IaQXCxzbBUxx/+bVGkgJBfLAhurzB20XCGwhlRKEJCLZYaNdczxT6RaHwG5SDJsZRHHH32pln5BOC6SJTZmMcf/Syoe9mTMRTLFRhFx/NGWj2h2EYyLZI6NRcTx7zblQx4QiOIA2QrhPYjE/QnoDZDNEF63KR/0hDDUBqCMP55Eov8EHJ8fINL4lz+AiFcBpQE4448H8fDnAjoDUMbfmwNEmg6rDEAaf/TlGGmCIJaOzg8QafyTVI7SQBBzR+cHiDP+aIgnznOB3NH5AeKM/zc5VqeFAGaOqTrAKzhaHTnaM0JYOp7qAK8geZbj3XQRQO74/AD88e/eyAnaCGCVOZLqAG9gactvCm5Fc8fmB+CPf5LKSYYIYekYqgO8gWYoJ/qKAF4dlx+AP/5f5VT3NQSwcARVAQrQ1O7lnfhLQmtH5wcowNOXf/CIEHJH5gcowPMoO5TMh1E4Kj/AAiyH5sDRH83Mpo7HD7AA0YP8m3SMMIqlI/EDLEA0TkVE4z8hAG9zx+AHyEHk/wNSsyLx22v+MqXIsbECU1vO4ArmRFdyDr0azElqPTmLW5iT3MqZ1GFOUJdzad7BHO2uKWczaMEcqTWQPdpW5T61tvyRqkcDn9lXOa9mAnOEpCln1rHZwBFqHfkAFS8rfk4NOUL872Y+nScJYgTzISMp2YX4Q5RfgDd6XZhK3Z54bEZcRe8M2BZGv7dzb+uNgkAAgAcERfF8jknL+7/ldvvtfklT62aN0Rngv8q1xGEO4LYtUNzzMSsoeLHUeAtSmOOT0QUkEtBb3M+If6Q57CCcjDdrCmEX5Wi8GWMJOyl9STyDlbCb3g+Jv+l62FHWGu+LNoNdxSfj3UhiWOZX4KVOMfyTj0I3iMcfvwIYnj9A5rPRTyyDg/S+Ivsw9nCY0PeFjA7hQNz53mjNYUtYPitExgUONxiHDYBA4+ykPmoAhcLR0ypJAUi4WRCwDNAIHUyG6hAwce7k7hmQkU7dHwgkoBM7tBGwGBAKnblH9oYr/F/lTlQEUQ5oFQ4M6zs02f+c0PqvGgis4eevxupsKEDSfFiSWTwj0IiK3wXK0r04UkBEbOWockSZ/M/jg3UvQTRwoCS27Az7ROjv/0duUToUIK69ftZb05p464Gmyor+HKuALK7Ix6FA0dp87/XEexNko89VQbgy1qgbbw+TRHukHcKx1zo8J7gEXU47+N8vAbHLBK1Vj/83rgjdaToRT33m8YHICbqEWNvncaEiEIhahX3m9QyeIy+OmXWx/xuJuC7Q1iSei2KBcloQCXot57VKha4w6FQJTqlqRK9BVBPueK5WKiSj49G1P/9VkR5enZ1SOxpuq1UiMIcJhIuh5x6XIjEHSIS0Pud/FK8undlVd6n80/8qHqbI7CKaBncy/v8SygszL8Yu0uZez/P6RjDzIkw09Ee8eyhlqgOzqUCn0tlsf524SXViNpDotPExf6VeKjGtXoZkEkr6oPO8sGjO4p09vBAJexfnpvCb7dZ4Vsj8nIpaj6xtgyAwnz5+tC0bdS3Scy6LjFSC/wtv50TeRmiJiQAAAABJRU5ErkJggg==",
              tip:"暂无司机/承运商"
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", "")
          }
        });
        _this.mescroll = mescroll;
        /*初始化菜单*/
        var pdType=0;//全部商品0; 奶粉1; 面膜2; 图书3;
        $(".nav p").click(function(){
          var i=$(this).attr("i");
          if(pdType!=i) {
            //更改列表条件
            pdType=i;
            $(".nav .active").removeClass("active");
            $(this).addClass("active");
            //重置列表数据
            mescroll.resetUpScroll();
          }
        })

        /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
        function getListData(page){
          //联网加载数据
          getListDataFromNet(pdType, page.num, page.size, function(curPageData){
            mescroll.endSuccess(curPageData.length);
            setListData(curPageData, page.num, page.size,pdType);
          }, function(){
            mescroll.endErr();
          });
        }

        /*设置列表数据*/
        function setListData(curPageData, num, size,type){
          var listDom=document.getElementById("dataList");
          for (var i = 0; i < curPageData.length; i++) {
            var pd=curPageData[i];
            var carrier = _this.$route.query.carrier;
            var driver = _this.$route.query.driver;
            var display = "none";
            if(type == 0){
              if(driver == ""){
                 if(carrier == pd.pkCarrier){
                   display = "block";
                 }
              }
              var str='<div class="firstBox">';
              str+='<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPMAAADICAMAAAAKlSdjAAAAilBMVEUAAAAymf8ymf8wl/8zmP8zmf8ymP8zmP8ymf8ymP8wmv8tnv8ymP8ymf8mmf8ymf8ymf8zmf8ymv8AkP8ymf8ymf8ymP8ymP8ymP8ymf8xmf8umP8ymf8xmf8wmP8xmf8ymf8ymf8ymf8ymP8zmf8ymf8vmf8ymP8ymf8smf8wmv8xmv8xmf8zmf9gs/33AAAALXRSTlMAwIBAajL93XOkNQqL4QbGmKBMAvXvvJC1Y1EW+VooHehH16nQlCyuew8jQzlJ+gi6AAAEPUlEQVR42u3diW7iMBSF4ROgIW1IYMhCNgj71t73f71RVTGinXiUDrZjp/d7g5/FsrL4gjHGGOsrv5jMTqnTjezgbXxotjnF1LH4tAyhz5NDRgiWEfSIBmSMfQ0d/IwMkrxCvSglo7gFlFuQYeIjFCvIOMEFSkUBmWcBpXIykHvFvZ/wNRPtoNAbGSkOoc6EzLSBOlsy0wLqVGSmFMpcyFBbKLMiQyVQ5oUM5eJGZ3OcLZ/KCKqE9ZvnuEY1u4cL1FtlBjWPj9BjnpjSnPnQpd6a0bwPoU+dmNCc1NBpY0KzB7123TcHIfS6up03D6Bb1nnzC3TLu25OoF3ddfMe2kVdN2fQb91x8zP0G3MzN3MzN3MzNwPRtTgP/vBsaX5z7mS5j2942tK9wJbmOX2SzNFaXlEvmqkaoqWhSz1ppqREO1PqTTMt0MqVetQ8RivLPjVXaMXrUzOF3MzN3MzN3MzNLXAzN5vavB5+GJnaTM6H/QPNIsY233DzuwhtjPrUnKCVTZ+aU7QSxj1qXqKdUX+a9xFa2vWleVyjrfC5H80HH9+wmjhfBWY3u5PBZ97wggdd1mY3k+NDtsz43/YMko0s+D8XkKqMLWgOQsi0sGLd9iBRWVnRvA4hz4HskEOaqPODOVqaQppXssUVN707w0BoJHHRsMUzJPHJGltIciVrVPjQ1zf6G5X40MMzSYRWkGNE9njiZm7mZm7mZm42XLfNgfMYG5sneIjPzdzMzdzMzdzMzbwP42ZuNhs3czM3czM3/2/zdPAYG5t/4t6Tm7mZm7mZm+1q3g0fsjG1OXD+2FakVrx3bqZJV83bvMSdcL4jZeLJC+6tBkkHzdUowlcvAamRlvjKf9be7L6iQTkmFXYRGkx0N3totHJJvm0omJimtzkINT7dXqDZSm/zWePYkDVEHK3NR43PPc8g4mlt9iGSkmweRAqtzRFETtL3YSOIbLQ21xCZSt9vDyCSa20uIODH0psziBy0Nu8gsCTpzW6JZuFaa7O7QqNoK7+ZFsJlW2sz7X00GZCCZneIJqtYczOlF/ztTLKbxcN/jwHpbqbxMsJnx5TUNJO7KPGZf447uWYQHPLX4c1yMFV5H6PKvPnwZuPtYiOvDX1Db+5XtcLN3MzN3MzN3MzN3MzN3MzNZA9ZzUuyRw05hmSPEHKUZI0AskzJFgvI4pEt3iCLvyY7ZADws1bu6gjgh50gVkCmyIboESTbBGS2ZA7p/InJJyGuzz5UCIvJc+q8G5NQ4si2/kep8y79NRhGUM0joSlk+0VCM0CMm7mZm7mZm7mZm7mZm7mZm7mZm7mZm7m5CTdz83/ISegE2RYkNIA+LyR0BvR9wAU0GpPIEbKVMQkkF2i0JIEJ5JuQQA6tZtRoH0K+MBUtHXpFi0owxFKB8ER/i70IutXn1LmXzkZHyCWe8Zku8hqMMcZYX/0GEkRPYmJUkM4AAAAASUVORK5CYII=">';
              str+='</div><div class="secondBox">';
              str+='<p data-code="'+pd.carrCode+'"><span>'+pd.carrierName+'</span></p>';
              str+='<div id="star_grade'+(i*1+(num-1)*size)+'" class="star_grade"></div>';
              var sprotYear = ((new Date()).getTime()-(new Date(pd.createDate.replace('-','/').replace('-','/'))).getTime())/1000/60/60/24/365;
              var sportyearName = sprotYear -0.5<0?"不到半年":androidIos.fixed(sprotYear,1)+"年";
              var tranType = pd.tranType == null ? '陆运' : pd.tranType;
              str+='<h2>'+tranType+'&nbsp;&nbsp;<span  style="font-size: 0.35rem;">'+sportyearName+'</span></h2>';
              str+='</div>';
              str+="<img style='display: "+display+"' class='checked' src='data:image/png;base64,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'>";
              str+='<div class="clearBoth"></div>';
            }else if(type == 1){
              if(driver != ""){
                if(driver == pd.pkDriver){
                  display = "block";
                }
              }
             var str='<div class="firstBox">';
              str+='<img src="data:image/png;base64,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" >';
              str+='</div><div class="secondBox">';
              str+='<p><span>' + pd.driverName + '</span></p>';
              str+='<div id="star_grade'+(i*1+(num-1)*size)+'" class="star_grade"></div>';
              var age = pd.driverAge == null ||pd.driverAge *1 < 1 ? "小于一年" : pd.driverAge*1+'年';
              var carrierName = pd.carrierName == null || pd.carrierName == "" ? "暂无承运商" : pd.carrierName;
              str+='<h2>'+carrierName+'<br><span style="font-size: 0.35rem;">驾龄&nbsp;'+age+'</span></h2>';
              str+='</div>';
              str+="<img style='display: "+display+"' class='checked' src='data:image/png;base64,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'>";
              str+='<div class="clearBoth"></div>';
            }
            var liDom=document.createElement("li");
            liDom.innerHTML=str;
            if(type == 0){
              liDom.setAttribute("data-carrier",pd.pkCarrier);
              liDom.setAttribute("data-driver","");
            }else if(type ==1){
              liDom.setAttribute("data-carrier",pd.pkCarrier);
              liDom.setAttribute("data-driver",pd.pkDriver);
            }
            listDom.appendChild(liDom);
            $("#star_grade"+(i*1+(num-1)*size)).html("");
            $("#star_grade"+(i*1+(num-1)*size)).markingSystem({
              num: 5,
              havePoint: true,
              haveGrade: true,
              backgroundImageInitial: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEUAAAD9dyr9VDr8SD/9ZjP9YDb9cS78TT39bDH9aTH9XDf9dSv9YzT9XDf9bi/9cC79aTL9cy78QkJ+hTheAAAAEnRSTlMAH/T+wNxw+5yv5zzP5odurld/oABPAAAA1klEQVQ4y62RS5LDIAxE0Q/J2Elm+v6HnUwIKRsKVtEGmu56KqH07Qr3WPkkgNAioDCDLgG/+wqh4JQKdAHIKeU5YoP/H4xtEnC8Rszwgf0IvTGawQDfNB6t0yGo1f4oO2rJUYkQNr3nMzPf1ViA/ArYbCpGri1t5nO72MSnz9Vo4Tcx+oNcP5SzLgNyu+5Qh30ciLMMHF2Acf1JcBcQXDWkmwpeTzN6r57SiCQVQJRay36ITZ6uCuRnHEMR4U+bKsYjoB1BANur2A2QjkCl2S1SKH2p/gDnoAlDysm60AAAAABJRU5ErkJggg==',
              backgroundImageOver: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAMAAAC+oj0CAAAAYFBMVEUAAAD8QkL9UVH9eHj9VFT/wsL/zc3/19f/2dn/4eH/7+///f39R0f9TU39Tk79ZWX9YmL9a2v+lJT+oaH+paX+sLD+urr/1NT/3d3/5+f//v7+goL+g4P8QkL+u7v9bGzZkjZpAAAAHXRSTlMA7d+q105ANDEoFQPs5ePGxbuIeXNlWjgsHgOioFw9/yIAAACSSURBVBjTbdDZDoQgDEDRsggC7rvOVP//LycQU3TgvjQ5adKkEJsmyLQytmZYIIpUNUNkOrecWS+ZZ1YSuF3Ng5AYkmKY1e4ArMQkacHWKdcWQDf/2uhwjb+V33c3/tIN7gx/qAGqjdxGdVXkyhEbfGSIiycXxKN/R69U7x8zEn8Qu7BUdIhf4uU6Dwgd57X4+QMzcxYilqvWAwAAAABJRU5ErkJggg==',
              unit: '星',
              grade:pd.score==null?0:pd.score*1,
              height: 0.4* $("html").css("font-size").replace("px", ""),
              width: 0.4* $("html").css("font-size").replace("px", ""),
            });
            $("#dataList li").unbind("click").click(function () {

              var item = {
                 name:"",
                 pk_carrier:"",
                 driver_name:""
              }
              if($(this).find(".checked").css("display") == "none"){
                item.name = $(this).find("p span").text();
                item.pk_carrier = $(this).attr("data-carrier");
                item.driver_name = $(this).attr("data-driver");
              }
              item = JSON.stringify(item);
              sessionStorage.setItem("appoint",item);
              androidIos.gobackFrom(_this);
            })
          }
        }

        function getListDataFromNet(pdType,pageNum,pageSize,successCallback,errorCallback) {
          //延时一秒,模拟联网
          setTimeout(function () {
                var listData="";
                var carrier = _this.$route.query.carrier;
                var driver = _this.$route.query.driver;
                if(pdType==0){
                  var json = {
                    page:pageNum,
                    size:pageSize,
                    userCode:sessionStorage.getItem("token"),
                    keyword:$("#appoint #carTitleBox input").val(),
                    pk:driver == "" ? carrier : "",
                    source:sessionStorage.getItem("source")
                  }
                  $.ajax({
                    type: "POST",
                    url: androidIos.ajaxHttp()+"/carrier/getCarrierPage",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data:JSON.stringify(json),
                    timeout: 10000,
                    async:false,
                    success: function (getCarrierPage) {
                      if(getCarrierPage.success=="1"){
                        listData=getCarrierPage.list;
                      }else{
                        androidIos.second(getCarrierPage.message);
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
                }else if(pdType==1){
                  var json = {
                    page:pageNum,
                    size:pageSize,
                    userCode:sessionStorage.getItem("token"),
                    keyword:$("#appoint #carTitleBox input").val(),
                    pk : driver,
                    source:sessionStorage.getItem("source")
                  }
                  $.ajax({
                    type: "POST",
                    url: androidIos.ajaxHttp()+"/driver/getDriverPage",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data:JSON.stringify(json),
                    timeout: 10000,
                    async:false,
                    success: function (getDriverPage) {
                      if(getDriverPage.success=="1"){
                        listData=getDriverPage.list;
                      }else{
                        androidIos.second(getDriverPage.message);
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
                }
                successCallback(listData);
          },500)
        }
      }
    }
  }
</script>

<style >
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #appoint .carTitleBox{
    width: 100%;
    position: absolute;
    top: 0;
    height: 1.25rem;
    background: white;
  }
  #appoint .carTitleback{
    position: absolute;
    left:0;
    top:0;
    bottom: 0;
    height: auto;
    width: 1.5rem;
    background-image: url("../../images/titlejian.png");
    background-position: 35% 50%;
    background-repeat: no-repeat;
    background-size: 0.2rem 0.3714rem;
  }
  #appoint #carTitleBox{
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background: rgba(0,0,0,0.2);
    width:auto;
    height: auto;
    z-index:0;
  }
  #appoint .carTitleBox p {
    position: absolute;
    right:0;
    top:0;
    line-height: 1.25rem;
    color:#333;
    margin-right: 2%;
    font-size: 0.35rem;
  }
  #appoint .carTitleBox input{
    display: block;
    width:50%;
    background-color: #f2f2f2;
    border:1px solid #eaeaea;
    color:#333;
    padding: 0.15rem 0;
    margin-top:0.225rem;
    margin-left:2rem;
    font-size: 0.36rem;
    border-radius: 0.45rem;
    text-align: left;
    padding-left: 10%;
    background-image: url("../../images/sousuo.png");
    background-position: 6% 50%;
    background-repeat: no-repeat;
    background-size: 0.4133rem 0.4rem;
  }
  #appoint .set_image_all {
    cursor: pointer;
    position: relative;
  }
  #appoint .set_image_top div{
    position: relative;
  }
  #appoint .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:0.4rem!important;
  }
  #appoint .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #appoint .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 13;
  }

  #appoint .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #appoint .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #appoint .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
  }
  #appoint .nav{
    width:100%;
    position: absolute;
    top:1.26rem;
  }
  #appoint .nav p{
    float: left;
    width: 50%;
    background: white;
    line-height: 1rem;
    text-align: center;
    font-size: 0.4rem;
    color:#333;
  }
  #appoint .nav .active{
    border-bottom: 1px solid #3399FF;
    color: #3399FF;
  }
  #appoint #mescroll{
    margin-top:3px;
  }
  #appoint ul{
    width:100%;
  }
  #appoint li{
    width: 100%;
    background: white;
    border-bottom: 1px solid #dadada;
    position: relative;
  }
  #appoint .checked{
    position: absolute;
    width:0.5rem;
    right:0.5rem;
    top:50%;
    margin-top: -0.25rem;
  }
  #appoint .firstBox{
    width:20%;
    float: left;
    margin:0.25rem 5%;
  }
  #appoint .firstBox img{
    width:100%;
  }
  #appoint .secondBox{
    width:70%;
    float: left;
    margin-top: 0.25rem;
  }
  #appoint .secondBox p{
    font-size: 0.375rem;
    color:#333;
    margin-bottom: 0.1rem;
  }
  #appoint .secondBox p span{
    font-size: 0.375rem;
    color:#333;
  }
  #appoint .secondBox h1{
    font-size: 0.35rem;
    color:#333;
  }
  #appoint  .secondBox h2, #appoint secondBox span{
    font-size: 0.35rem;
    color:#333;
    line-height: 0.7rem;
  }
  #appoint .mescroll{
    position: fixed;
    top:2.21875rem;
    bottom: 0;
    height: auto;
    background-color: rgb(245, 245, 249)!important;
  }
</style>

