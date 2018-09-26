<template>
  <div class="orderMoreFi" @click="hideDanjv($event)">
    <div id="title" v-title data-title="上传单据"></div>
    <p id="wenzi">请确认您已完成运输，并核实以下信息</p>
    <div class="orderMoreFiaddress">
      <div class="orderMoreFiaddressFirst">
        <p>邮寄地址</p>
        <h1>{{address}}</h1>
        <div class="clearBoth"></div>
      </div>
      <div class="orderMoreFiaddressSecond">
        <p>联系方式</p>
        <h1 @click="phonecall(phone)">{{phone}}</h1>
        <div class="clearBoth"></div>
      </div>
    </div>
    <div class="orderMoreFiaddress">
      <div class="piaojv">
        <p>上传单据</p>
        <div class="addDanjv" @click="addDanjv()" id="addDanjv">添加单据</div>
        <div id='paojvList' style="display: none;">
          <ul id="typeclick"><li v-if="imgList1.length < imgListLength"><input class="fileInput" type="file" multiple accept=".jpg,.png" @change="inputChange($event,0)">签收单({{imgList1.length}}/{{imgListLength}})</li><li  v-if="imgList2.length < imgListLength"><input class="fileInput" type="file" multiple accept=".jpg,.png" @change="inputChange($event,1)">仓库票据({{imgList2.length}}/{{imgListLength}})</li><li  class='otherpiao' v-if="imgList3.length < imgListLength"> <input class="fileInput" type="file" multiple accept=".jpg,.png" @change="inputChange($event,2)">其他票据({{imgList3.length}}/{{imgListLength}})</li></ul>
        </div>
        <div class="clearBoth"></div>
      </div>
    </div>
    <ul id="imgListBox">
        <li v-for="(item,index) in imgList1" class="imgBox">
          <div class='closed' @click="removeImg(index,0)"></div>
          <img  :onerror="errorlogo" :src="item.httpfile" @click="lookImg($event,item.httpfile)">
          <div class="imgtype">{{item.type=="1"?"仓库票据":item.type=="0"?"签收单":"其他票据"}}</div>
        </li>
        <li v-for="(item,index) in imgList2">
          <div class='closed' @click="removeImg(index,1)"></div>
          <img  :onerror="errorlogo" :src="item.httpfile" @click="lookImg($event,item.httpfile)">
          <div class="imgtype">{{item.type=="1"?"仓库票据":item.type=="0"?"签收单":"其他票据"}}</div>
        </li>
        <li v-for="(item,index) in imgList3">
          <div class='closed' @click="removeImg(index,2)"></div>
          <img  :onerror="errorlogo"  :src="item.httpfile" @click="lookImg($event,item.httpfile)">
          <div class="imgtype">{{item.type=="1"?"仓库票据":item.type=="0"?"签收单":"其他票据"}}</div>
        </li>
        <div class="clearBoth"></div>
      </ul>
    <div id="orderMoreFiBottom">
      <button @click="okGo()"  id="orderMoreFibutton">完成</button>
    </div>
  </div>
</template>
<script>
  import bridge from '../../js/bridge';
  import  {androidIos} from '../../js/app';
  import PinchZoom  from '../../js/pinchzoom'
  import {bomb} from '../../js/zujian.js'
export default {
  name: 'orderMoreFo',
  data () {
    return {
      address:"上海市浦东新区兰花路333世纪大厦1801-1802室",
      phone:"50929122",
      imgList1:[],
      imgList2:[],
      imgList3:[],
      httpurl:"",
      imgListLength:4,
      errorlogo: 'this.src="' + require('../../images/timg.jpg') + '"'
    }
  },
  mounted: function() {
    var _this = this;
    androidIos.bridge(_this);
  },
    methods:{
      lookImg:function (even,imgurl) {
        var _this = this;
        if (even.target.className != "closed") {
            var img = imgurl;
            $("#imgBigbox").remove();
            $("body").append(
              "<div id='imgBigbox'><div class='pinch-zoom'><img id='zoomimg'  onerror='"+ _this.errorlogo+"'  src='" + img + "'  '></div><div id='zhezhaoImg'></div></div>"
            );
            $("#imgBigbox").css({
              width: "100%",
              height: "100%",
              position: "fixed",
              top: "0",
              left: "0",
              background: "rgb(0,0,0)",
              "z-index": "999",
              display: "block"
            });
            $("#zhezhaoImg").css({
              width: "100%",
              height: "100%",
              position: "absolute",
              background: "rgba(0,0,0,0)",
              "z-index": "999",
              top: "0",
              left: "0"
            });
            $("#imgBigbox img").css({ width: "100%", position: "absolute" });
            var image = document.getElementById("zoomimg");
            image.onload = function() {
              var height = $("#imgBigbox img").height();
              $("div.pinch-zoom").each(function() {
                new PinchZoom($(this), {});
              });
              $(".pinch-zoom-container").css({
                width: "100%",
                height: "100%"
              });
              $("#imgBigbox img").css("top", "50%");
              $(".pinch-zoom").css({ width: "100%", height: "100%" });
              $("#imgBigbox img").css("margin-top", -height / 2 + "px");
              var setImgBox;
              var setImgBoxNumber = 10;
              setImgBox = setInterval(function() {
                setImgBoxNumber--;
                if (setImgBoxNumber < 9) {
                  clearInterval(setImgBox);
                  setImgBoxNumber = 10;
                  $("#zhezhaoImg").remove();
                }
              }, 100);
            };
          }
      },
      hideDanjv:function (e) {
        var id = e.target.id;
        var className = e.target.className;
        if( id != "typeclick" && id != "addDanjv" && className != "fileInput"){
          $("#paojvList").hide();
        }
      },
      go:function () {
         var _this = this;
         _this.heightout();
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/settings/findParamValueByName ",
          data: JSON.stringify({
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
            paramName:"resourcePath"
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          async:false,
          timeout:30000,
          success: function(findParamValueByName){
            if(findParamValueByName.success == "1"){
              _this.httpurl = findParamValueByName.paramValue;
            }else{
              androidIos.second(findParamValueByName.message);
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
      },
      heightout:function () {
        var height =  document.getElementById("wenzi").offsetHeight;
        for(var i = 0; i < document.getElementsByClassName("orderMoreFiaddress").length ; i++){
           height += document.getElementsByClassName("orderMoreFiaddress")[i].offsetHeight;
        }
        var fontSize = document.getElementsByTagName("html")[0].style;
        var fontpx = fontSize.fontSize.replace("px","");
        document.getElementById("imgListBox").style.top = (height) / fontpx + 0.31 + "rem";
      },
      inputChange:function (e,type) {
        var _this = this;
        var length = type == 0 ? _this.imgList1.length : type == 1 ? _this.imgList2.length : _this.imgList3.length;
        for (var i = 0; i < e.target.files.length; i++) {
          if( i < _this.imgListLength - length){
            _this.compress(_this.getObjectURL(e.target.files[i]),"1000","1000",type);
          }else{
             bomb.first("最多上传" + _this.imgListLength + "张");
          }
        }
        e.target.value = "";
      },
      getObjectURL:function(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      compress:function(img, MaximgW, MaximgH,type) {
        var _this = this;
        var image = new Image();
        image.src = img ;
        var imageWidth =  "";
        var imageHeight = "";
        image.onload = function () {
          var canvas = document.createElement('canvas');
          if (image.width < MaximgW && image.height < MaximgH) {
            imageWidth = image.width;
            imageHeight = image.height;
          } else {
            if (image.width > image.height) {
              imageWidth = MaximgW;
              imageHeight = MaximgW * (image.height / image.width);
            } else if (image.width < image.height) {
              imageHeight = MaximgH;
              imageWidth = MaximgH * (image.width / image.height);
            } else {
              imageWidth = MaximgW;
              imageHeight = MaximgH;
            }
          }
          canvas.width = imageWidth;
          canvas.height = imageHeight;
          var con = canvas.getContext('2d');
          con.clearRect(0, 0, canvas.width, canvas.height);
          con.drawImage(image, 0, 0, imageWidth, imageHeight);
          var base64 = canvas.toDataURL('image/jpeg', 0.5).substr(0);
          androidIos.loading("正在上传");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/uploadFile",
            data:JSON.stringify({
              type: type == 0 ? "QSD" : type == 1 ?  "CKPJ" : type == 2 ? "OTHETPJ" : "PROJECT",
              name:"",
              file: base64.substr(23),
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (json) {
              if (json.success == "1") {
               var jsonData = {
                  file:base64,
                  httpfile:_this.httpurl + json.path,
                  type:type
                }
                if(type == 0){
                 _this.imgList1.push(jsonData);
                }else if(type == 1){
                  _this.imgList2.push(jsonData);
                }else if(type == 2){
                  _this.imgList3.push(jsonData);
                }
              } else{
                androidIos.second(json.message);
              }
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
              $("#common-blackBox").remove();
              if (status == 'timeout') { //超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！")
              } else if (status == "error") {
                androidIos.errorwife();
              }
            }
          });
        }
      },
      removeImg:function (number,type) {
        var _this = this;
        androidIos.first("确认删除吗?");
        $(".tanBox-yes").unbind('click').click(function(){
          $(".tanBox-bigBox").remove();
          if(type == 0){
            _this.imgList1.splice(number,1);
          }else if(type == 1){
            _this.imgList2.splice(number,1);
          }else if(type == 2){
            _this.imgList3.splice(number,1);
          }
        });
      },
      addDanjv:function () {
        if($("#paojvList").css("display")=="none"){
          $("#paojvList").show();
          $("#paojvList").animate({size: "1"}, {
            step: function (now, fx) {
              $("#paojvList").css({"transform": "scale(" + now + ")"});
              $("#paojvList").css({"-webkit-transform": "scale(" + now + ")"});
              $("#paojvList").css({"-moz-transform": "scale(" + now + ")"});
              $("#paojvList").css({"-o-transform": "scale(" + now + ")"});
              $("#paojvList").css({"-ms-transform": "scale(" + now + ")"});
              $("#paojvList").css({"opacity": "1"});
            },
            duration: 100
          });
        }else{
          $("#paojvList").hide();
        }
      },
      phonecall:function (phone) {
        bridge.invoke('callTelephone',phone);
      },
      okGo:function () {
        var _this = this;
        if(_this.imgList1.length == 0 && _this.imgList2.length == 0 && _this.imgList3.length == 0){
          bomb.first("请添加单据");
          return false;
        }
        androidIos.second("功能正在开发,请耐心等待");
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #wenzi{
    margin-left: 0.4rem;
    color:#999;
    font-size: 0.37rem;
    line-height:1.1rem ;
  }
  .orderMoreFiaddress{
    width:100%;
    background: white;
    border-top: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
    margin-bottom: 0.2rem;
  }
  .orderMoreFiaddressFirst p{
    padding: 0.3rem 0 0.3rem 0;
    float: left;
    margin-left: 0.4rem;
    color:#999;
    font-size: 0.375rem;
  }
  .orderMoreFiaddressSecond{
    border-top: 1px solid #dcdcdc;
  }
  #paojvList{
  position:absolute;
  width:3rem;
  background:#666;
  right:0.2rem;
  top:1.1rem;
  opactiy:0;
  transform: scale(0.8);
  -webkit-transform: scale(0.8);
  -moz-transform: scale(0.8);
  -o-transform: scale(0.8);
  -ms-transform: scale(0.8);
  z-index:999
  }
  #paojvList ul{
  width:90%;
  margin:0 auto
  }
  #paojvList li{
  width:90%;
  font-size:0.3125rem;
  color:white;
  padding:0.2rem 5%;
  border-bottom:1px solid white;
  position:relative
  }
  .otherpiao{
    border:none!important;
  }
  .orderMoreFiaddressSecond p{
    padding: 0.3rem 0 0.3rem 0;
    float: left;
    margin-left: 0.4rem;
    color:#999;
    font-size: 0.375rem;

  }
  .orderMoreFiaddressFirst h1{
    padding: 0.3rem 0 0.3rem 0;
    float: right;
    margin-right: 0.3rem;
    color:#333;
    font-size: 0.375rem;
    width: 7.2rem;
    text-align: right;
  }
  .orderMoreFiaddressSecond h1{
    padding: 0.3rem 0 0.3rem 0;
    float: right;
    margin-right: 0.3rem;
    color:#333;
    font-size: 0.375rem;
    width: 7.2rem;
    text-align: right;
  }
  .piaojv{
    position: relative;
  }
  .piaojv p{
    padding: 0.3rem 0 0.3rem 0;
    float: left;
    margin-left: 0.4rem;
    color:#999;
    font-size: 0.375rem;
  }
  #imgListBox{
    position: absolute;
    top:5rem;
    bottom: 1.5rem;
    overflow: scroll;
    height: auto;
    width: 100%;
  }
  .closed{
    z-index:4;
    position:absolute;
    right:-0.2rem;
    top:-0.2rem;
    color:white;
    width:0.6rem;
    height: 0.6rem;
    background-image: url("../../images/ImglistHide.png");
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size:cover;
  }
  .addDanjv{
    float: right;
    width:1.61rem;
    padding: 0.1rem 0.5rem 0.1rem 0.3rem ;
    margin-right: 0.3rem;
    color:#333;
    border:1px solid #fff;
    font-size: 0.375rem;
    margin-top: 0.17rem;
    background-image: url("../../images/downJian.png");
    background-repeat: no-repeat;
    background-position: 91% 50%;
    background-size:0.28rem  0.1333rem;
  }
  #orderMoreFiBottom{
    position: fixed;
    bottom:0;
    height:1.4rem;
    background: transparent;
    width: 100%;
  }
.orderMoreFi button{
  width:92%;
  margin:0.25rem auto 0 auto;
  display: block;
  background: #2d9cff;
  color:white;
  line-height: 1rem;
  font-size: 0.4rem;
  letter-spacing: 0.0625rem;
  border-radius: 0.2rem;
}
  .orderMoreFibutton{
    background: -webkit-linear-gradient(90deg, #ff8340, #ff6d27)!important; /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(90deg,  #ff8340, #ff6d27)!important; /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(90deg,  #ff8340, #ff6d27)!important; /* Firefox 3.6 - 15 */
    background: linear-gradient(90deg,  #ff8340, #ff6d27)!important; /* 标准的语法（必须放在最后） */
  }
  #typeclick li{
    position: relative;
  }
  #typeclick li input{
     position: absolute;
    width:100%;
    height: 100%;
    opacity: 0;
    top:0;
    left:0;
  }
  #imgListBox li{
    width:2.8rem;height:2.6rem ;float: left; margin-left: 0.4rem;position: relative;margin-top: 0.3rem;
  }
  #imgListBox li img{
    position: absolute;width:100%;height:100%;
  }
  #imgListBox li .imgtype{
    position: absolute;width:100%;height: 0.75rem;bottom:0;font-size: 0.3125rem;color:white;background: rgba(0,0,0,0.5);text-align: center;line-height: 0.75rem;
  }
</style>
