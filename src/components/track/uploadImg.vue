<template>
    <div id="uploadImg">
      <div id="title" v-if="type == 1" v-title data-title="异常签收"></div>
      <div id="title" v-if="type == 0" v-title data-title="正常签收"></div>
      <div v-if="type == 1">
        <textarea v-if="modify" placeholder="其他异常情况，请如实填写，稍后将有客服人员与 您电话联系" @keyup="remarkKeyup(2)"  maxlength="100" v-model="errorSignRemark"></textarea>
        <div id="textarea" v-else>{{errorSignRemark}}</div>
        <div class="addImg">
          <h1>货物异常图片</h1>
          <div class="imgBox"  v-for="(item,index) in imgList">
            <img :src="item.file"  @click="lookImg($event,item.file)"  :onerror="errorlogo" >
            <div class='closed' @click="removeImg(index)" v-if="modify"></div>
          </div>
          <div class="addImgFirst" v-if="imgList.length < imgListLength && modify">
            <img src="../../images/addImgP.png">
            <input type="file" accept=".jpg,.png" multiple id="imgFile" @change="inputChange($event,1)">
            <p v-html="imgList.length == 0 ? '添加图片':imgList.length + '/' + imgListLength"></p>
          </div>
          <div class="clearBoth"></div>
        </div>
      </div>
      <div v-else>
        <div id="star_grade" class="star_grade scorelistscore"></div>
        <ul>
          <li v-for="(item,index) in normalSignList" @click="normalSignListClick(1,index)" :class="item.choose ? 'chooseTrue' : ''">
            {{item.displayName}}
          </li>
          <div class="clearBoth"></div>
        </ul>
        <textarea placeholder="其他想说的，可以填在这里" maxlength="100" @keyup="remarkKeyup(1)" v-model="normalSignRemark"></textarea>
        <div class="addImg">
          <h1>货物</h1>
          <div class="imgBox"  v-for="(item,index) in imgList">
            <img :src="item.file" :onerror="errorlogo"  @click="lookImg($event,item.file)">
            <div class='closed' @click="removeImg(index)"></div>
          </div>
          <div class="addImgFirst" v-if="imgList.length < imgListLength">
            <img src="../../images/addImgP.png">
            <input type="file" multiple accept=".jpg,.png" id="imgFileS" @change="inputChange($event,2)">
            <p v-html="imgList.length == 0 ? '添加图片':imgList.length + '/' + imgListLength"></p>
          </div>
          <div class="clearBoth"></div>
        </div>
      </div>
      <button id="letGo" @click="fileup()" v-if="modify">提交</button>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import bridge from '../../js/bridge';
  import {bomb} from "../../js/zujian";
  import  "../../js/markingSystem";
  import PinchZoom from "../../js/pinchzoom";
  export default {
        name: "upload-img",
      data(){
          return{
            type:1,
            errorSignRemark:"",
            normalSignRemark:"",
            normalSignList:[],
            imgList:[],
            imgListLength:4,
            errorlogo: 'this.src="' + require('../../images/timg.jpg') + '"',
            httpurl:"",
            modify:false,
          }
      },
      beforeMount:function () {
        var _this = this;
        _this.type = _this.$route.query.expSign;
      },
      mounted: function () {
        var _this = this;
        androidIos.bridge(_this);
      },
      methods:{
        go:function () {
            var _this = this;
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
            if(_this.type == 0){
              _this.startXing();
              $.ajax({
                type: "GET",
                url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
                data:{str:"normal_Receipt",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
                dataType: "json",
                timeout: 10000,
                success: function (getSysConfigList) {
                  for(var i = 0 ; i < getSysConfigList.length ; i++){
                    getSysConfigList[i].choose = false;
                  }
                  _this.normalSignList = getSysConfigList;
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                  if(status=='timeout'){//超时,status还有success,error等值的情况
                    androidIos.second("网络请求超时");
                  }else if(status=='error'){
                    androidIos.errorwife();
                  }
                }
              });
            }else{
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/order/findDriverConfirmedReceiptInfo",
                data:JSON.stringify({
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source"),
                  pk:_this.$route.query.pk,
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 10000,
                success: function (findDriverConfirmedReceiptInfo) {
                  if(findDriverConfirmedReceiptInfo.success == "1"){
                      _this.errorSignRemark = findDriverConfirmedReceiptInfo.driverRemark;
                      var imgL = findDriverConfirmedReceiptInfo.abnormalPicture.split(",");
                      if( imgL.length > 0 && findDriverConfirmedReceiptInfo.driverRemark != ""){
                        _this.modify = false;
                      }else{
                        _this.modify = true;
                      }
                      for(var i = 0;i < imgL.length;i++){
                        _this.imgList.push({
                          file:_this.httpurl + imgL[i],
                          httpfile:imgL[i],
                        });
                      }
                  }else{
                    androidIos.second(findDriverConfirmedReceiptInfo.message);
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
            $(document).unbind("click").on("click","#star_grade .set_image_item",function () {
              var x = $(this).index("#star_grade .set_image_item");
              $("#star_grade").html("");
              $("#star_grade").markingSystem({
                num: 5,
                havePoint: true,
                haveGrade: true,
                backgroundImageInitial:require('../../images/star_hollow.png'),
                backgroundImageOver:require('../../images/star_solid.png'),
                unit: '星',
                grade:x*1+1,
                height:0.8* $("html").css("font-size").replace("px", ""),
                width:0.8* $("html").css("font-size").replace("px", ""),
              });
              $("#star_grade .set_image_top").css("z-index",10);
              var width =  $("#star_grade .set_image_all").width();
              $("#star_grade .set_image_all").css("marginLeft",-width/2 + "px");
            })
          },
        normalSignListClick:function (type,index) {
          if(type == 1){
            var _this = this;
            _this.normalSignList[index].choose  = !_this.normalSignList[index].choose;
          }else if(type == 2){
            var _this = this;
            _this.errorSignList[index].choose  = !_this.errorSignList[index].choose;
          }

        },
        startXing:function () {
            var _this = this;
            $("#star_grade").html("");
            $("#star_grade").markingSystem({
              num: 5,
              havePoint: true,
              haveGrade: true,
              backgroundImageInitial:require('../../images/star_hollow.png'),
              backgroundImageOver:require('../../images/star_solid.png'),
              unit: '星',
              grade:0,
              height: 0.8* $("html").css("font-size").replace("px", ""),
              width: 0.8* $("html").css("font-size").replace("px", ""),
            });
            $("#star_grade .set_image_top").css("z-index",10);
            var width =  $("#star_grade .set_image_all").width();
            $("#star_grade .set_image_all").css("marginLeft",-width/2 + "px");
          },
        inputChange:function (e,type) {
            var _this = this;
            for (var i = 0; i < e.target.files.length; i++) {
              if( i < _this.imgListLength - _this.imgList.length){
                _this.compress(_this.getObjectURL(e.target.files[i]),"1000","1000",type);
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
        lookImg:function (even,imgurl) {
          var _this = this;
          if (even.target.className != "closed") {
            var img = imgurl;
            $("#imgBigbox").remove();
            $("body").append(
              "<div id='imgBigbox'><div class='pinch-zoom'><img onerror='"+ _this.errorlogo+"' id='zoomimg'  src='"+img+"' '></div><div id='zhezhaoImg'></div></div>"
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
        removeImg:function (index) {
          var _this = this;
          androidIos.first("确认删除吗?");
          $(".tanBox-yes").unbind('click').click(function(){
            $(".tanBox-bigBox").remove();
            _this.imgList.splice(index,1);
          });
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
                type: type == 1 ? "errorImgCar" : "normalImgCar",
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
                  _this.imgList.push({
                    file:base64,
                    httpfile:json.path,
                  });
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
        remarkKeyup:function (type) {
          var _this = this;
          if(type == 1){
            _this.normalSignRemark = _this.normalSignRemark.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】]/g,'');
          }else if(type == 2){
            _this.errorSignRemark = _this.errorSignRemark.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】]/g,'');
          }
        },
        fileup:function () {
          var _this = this;
          var json;
          if(_this.type == 0){
            var list = [];
            for(var i = 0; i < _this.normalSignList.length;i++){
              if(_this.normalSignList[i].choose){
                list.push(_this.normalSignList[i].displayName)
              }
            }
            var number = $("#star_grade .grade").text();
            if(list.length == 0 && _this.normalSignRemark == ""){
              bomb.first("请选择或填写内容");
              return false;
            }
            var listImg = [];
            for(i = 0 ; i< _this.imgList.length ;i++){
              listImg.push(_this.imgList[i].httpfile)
            }
            json = {
              pk: _this.$route.query.pk,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
              remark: _this.errorSignRemark,
              abnormalPicture: listImg.join(","),
              productNumber:number
            }
          }else{
            if( _this.errorSignRemark == ""){
              bomb.first("请填写内容");
              return false;
            }
            var listImg = [];
            for(i = 0 ; i< _this.imgList.length ;i++){
              listImg.push(_this.imgList[i].httpfile)
            }
            if(listImg.length == 0){
              bomb.first("请上传货物缺损图片");
              return false;
            }
            json = {
              pk: _this.$route.query.pk,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
              remark: _this.errorSignRemark,
              abnormalPicture: listImg.join(","),
            }
          }
          androidIos.loading("提交中");
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/order/driverConfirmedReceipt",
            data:JSON.stringify(json),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 10000,
            success: function (driverConfirmedReceipt) {
              if(driverConfirmedReceipt.success == "1"){
                 _this.$cjj("提交成功");
                 setTimeout(function () {
                    androidIos.gobackFrom(_this);
                 },500)
              }else{
                androidIos.second(driverConfirmedReceipt.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              $("#common-blackBox").remove();
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("网络请求超时");
              }else if(status=='error'){
                androidIos.errorwife();
              }
            }
          })
        }
      }
    }
</script>
<style>
  #uploadImg .set_image_all {
    cursor: pointer;
    position: relative;
    left:50%;
  }
  #uploadImg .set_image_top div{
    position: relative;
  }
  #uploadImg .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
    display: none!important;
  }
  #uploadImg .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:auto!important;
  }
  #uploadImg .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #uploadImg .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 13;
  }
</style>
<style scoped>
  ul{
    width:90%;
    display: block;
    margin:0.2rem auto ;
  }
  .chooseTrue{
    color:white!important;
    background: #2C9CFF!important;
    border: 1px solid #2c9cff!important;
  }
  #star_grade{
    margin-top: 0.5rem;
  }
  ul li{
    font-size:0.35rem;
    color:#333;
    background:rgb(248,248,248);
    border:1px solid rgb(222,222,222);
    float: left;
    padding:0 0.2rem;
    line-height:0.75rem ;
    margin-top: 0.57rem;
    margin-right: 0.1rem;
    min-width: 1.6rem;
    text-align: center;
    border-radius: 0.15rem;
  }
 textarea{
    width:84%;
    padding: 3%;
    margin: 0.5rem auto 0.3rem auto;
    display: block;
    height: 3rem;
    border: 1px solid #dadada;
    font-size: 0.375rem;
    color:#666;
    resize:none;
  }
 #textarea{
   width:84%;
   padding: 3%;
   margin: 0.5rem auto 0.3rem auto;
   display: block;
   min-height: 3rem;
   border: 1px solid #dadada;
   font-size: 0.375rem;
   color:#666;
   background: white;
 }
  .addImgFirst{
    width:2.04rem;
    height:2.04rem;
    overflow: hidden;
    position: relative;
    float: left;
    border: 1px dashed #dedede;
  }
  .addImgFirst img{
    width:0.7rem ;
    height: 0.7rem;
    margin:0.54rem auto 0.25rem auto;
  }
  .addImgFirst input{
    position: absolute;
    width:100%;
    top:0;
    bottom: 0;
    height: auto;
    opacity: 0;
  }
  .addImgFirst p {
    text-align: center;
    font-size: 0.3125rem;
    color:#dedede;
  }
  .addImg h1{
    font-size: 0.35rem;
    margin-bottom: 0.2rem;
    color:#333;
  }
  .addImg{
    width:90%;
    margin: 0 auto 0.2rem auto;
  }
  .imgBox{
    width:2.04rem ;
    height: 2.04rem;
    float: left;
    border:1px solid white;
    margin-right: 0.15rem;
    margin-top: 1px;
    position: relative;
  }
  .imgBox img{
    width: 2.04rem;
    height: 2.04rem;
    overflow: hidden;
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
  #letGo{
    display: block;
    margin: 0.2rem auto;
    width:90%;
    color:white;
    background: #2c9cff;
    font-size: 0.4rem;
    letter-spacing: 2px;
    border-radius: 0.1rem;
    line-height: 1.2rem;
  }
</style>
