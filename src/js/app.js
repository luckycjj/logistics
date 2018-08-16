import bridge from './bridge';
import {bomb} from "./zujian";
var androidIos = {
  gobackFrom: function (that) {
    if(bomb.hasClass("app","appBox")){
      var addPageList = window.sessionStorage.getItem("addPageList");
      $("#errorwifeBox").remove();
      $("#common-blackBox").remove();
      $(".tanBox-bigBox").remove();
      var http =  location.href;
      if(http.indexOf("/uploadData/uploadDataT") != -1){
        var message = JSON.parse(localStorage.getItem("UPMESSA"));
         if(message != null && (message.Drivepic != "" || message.IDpic != "" || message.Licensepic != "" || message.Roadpic != "" || message.Travelpic != "" || message.bank != "" || message.bankNumber != "" || message.company != "" || message.name != "" || message.nvitationodeIC != "" || message.peopleNumber != "" )){
           androidIos.first("信息尚未上传，需要保存吗？");
           $(".tanBox-close").unbind('click').click(function(){
             $(".tanBox-bigBox").remove();
             localStorage.removeItem("UPMESSA");
             androidIos.gogogogo(that);
           });
           $(".tanBox-yes").unbind('click').click(function(){
             $(".tanBox-bigBox").remove();
             androidIos.gogogogo(that);
           });
         }else{
           androidIos.gogogogo(that);
         }
      }else{
        androidIos.gogogogo(that);
      }
    }

  },
  gogogogo:function (that) {
    var addPageList = sessionStorage.getItem("addPageList");
    if (addPageList * 1 > 0) {
      var number = addPageList * 1 - 1;
      sessionStorage.setItem("addPageList", number);
      that.$router.go(-1);
      setTimeout(function () {
        bomb.addClass("app","appBox");
      },500)
    } else {
      bomb.addClass("app","appBox");
      bridge.invoke('gobackfrom');
    }
  },
  fixed:function (number,length) {
      var len = 1;
     for(var i=0 ; i<length ; i++){
         len = len +"0";
      }
      var bignumber = number*len;
      if((bignumber.toString()).indexOf(".")!=-1){
        var list = (bignumber.toString()).split(".");
        var leng = 1;
        for(var x=0 ; x<list[1].length-1 ; x++){
          leng = leng +"0";
        }
         if(list[1]-5*leng>=0){
            bignumber = list[0]*1+1
         }else{
           bignumber = list[0]
         }
      }
      return  bignumber/len;
  },
  ajaxHttp: function () {
    var http = 'http://10.10.10.231:8085';
    //var http = 'http://222.73.159.76:8085';
    return http;
  },
  addPageList: function () {
    var addPageList = window.sessionStorage.getItem("addPageList");
    var number = addPageList * 1 + 1;
    sessionStorage.setItem("addPageList", number);
  },
  firstblack: function (message) {
    $("#messageBombFirstBox").remove();
    $("body").append("<div id='messageBombFirstBox'><p id='messageBombFirst'>" + message + "</p></div>");
    $("#messageBombFirstBox").css({
      "width": "100%",
      "height": "100%",
      "position": "fixed",
      "top": "0",
      "left": "0",
      "background": "rgba(255,255,255,0)",
      "z-index": "99999"
    });
    $("#messageBombFirst").css({
      "position": "absolute",
      "z-index": "9999999",
      "background": "rgba(86,86,86,0.7)",
      "color": "white",
      "padding": "0.13rem 0.2rem",
      "border-radius": "0.1rem",
      "font-size": "0.375rem"
    });
    var leftF = document.getElementById('messageBombFirst').offsetWidth;
    var Left = (document.documentElement.clientWidth - leftF) / 2;
    $("#messageBombFirst").css({
      "margin-left": Left + "px",
      "bottom": " 1.2rem"
    });
    var time = 1;
    var setTime = setInterval(function () {
        if (time < 0) {
          clearInterval(setTime);
          $("#messageBombFirst").animate({
            "opacity": "0"
          }, 500, function () {
            $("#messageBombFirstBox").remove();
          });
        }
        time--
      },
      300)
  },
  first:function(message){
      $(".tanBox-bigBox").remove();
      $("body").append("<div class='tanBox-bigBox'>" +
        "<div class='tanBox-box'>" +
        "<p>温馨提示</p>"+
        "<div class='tanBox-class'>" +
        "<h3 style='width: 80%;margin-left: 10%;line-height: 0.6rem;padding: 0.3rem 0;'>" + message + "</h3>"+
        "<div class='clearBoth'></div>"+
        "</div>"+
        "<div class='tanBox-button'><button class='tanBox-close'>取消</button><div class='tanBox-shuxian'></div><button id='tanBox-yes' class='tanBox-yes tanBox-yesGo'>确定</button></div>"+
        "</div>"+
        "</div>");
      $(".tanBox-close").unbind('click').click(function(){
        $(".tanBox-bigBox").remove();
      });
  },
  second:function(message){
    $(".tanBox-bigBox").remove();
    $("body").append("<div class='tanBox-bigBox'>" +
      "<div class='tanBox-box'>" +
      "<p>温馨提示</p>"+
      "<div class='tanBox-class'>" +
      "<h3 style='width: 80%;margin-left: 10%;line-height: 0.6rem;padding: 0.3rem 0;'>" + message + "</h3>"+
      "<div class='clearBoth'></div>"+
      "</div>"+
      "<div class='tanBox-button'><button style='width:100%;color:#333;' class='tanBox-close'>确定</button></div>"+
      "</div>"+
      "</div>");
    $(".tanBox-close").unbind('click').click(function(){
      $(".tanBox-bigBox").remove();
    });
  },
  third:function (message) {
    $(".tanBox-bigBox").remove();
    $("body").append("<div class='tanBox-bigBox'>" +
      "<div class='tanBox-box'>" +
      "<p>温馨提示</p>"+
      "<div class='tanBox-class'>" +
      "<div style='width:30%;height:1rem;font-size: 0.4rem;color:#333;line-height: 1rem;text-align: right;float: left;margin-left: 10%;'>"+message+"：</div>"+
      "<div id='Z01' style='width:55%;height:1rem;font-size: 0.4rem;color:#999;line-height: 1rem;padding-left: 5%;float: left;'>请选择"+message+"</div>"+
      "<div class='clearBoth'></div>"+
      "</div>"+
      "<div class='tanBox-button'><button class='tanBox-close'>取消</button><div class='tanBox-shuxian'></div><button id='tanBox-yes' class='tanBox-yes tanBox-yesGo'>确定</button></div>"+
      "</div>"+
      "</div>");
    $(".tanBox-close").unbind('click').click(function(){
      $(".tanBox-bigBox").remove();
    });
  },
  loading: function (message) {
    $("#common-blackBox").remove();
    $("body").append("<div id='common-blackBox'>" +
      "<div id='common-black' style='line-height: 0.8rem;'>" +
      "<div class='common-imgbox'></div>" + message + "</div>" +
      "</div>");
  },
  bridge:function (that) {
    new Promise(function (resolve,reject) {
      if(bridge.invoke('token') != undefined){
        bridge.invoke('token','',function(response) {
          resolve(response);
        })
      }else{
        reject(2)
      }
    }).then(function (data) {
      data = JSON.parse(data);
      sessionStorage.setItem("token", data.userCode);
      sessionStorage.setItem("source", data.source);
      that.$nextTick(function() {
        that.go();
      });
    }).catch(function (error) {
      that.$nextTick(function() {
        that.go();
      });
    })
  },
  jsonsort: function (obj) {
    var keys = [];
    for (var key in obj) {
      keys.push(key);
    }
    keys.sort();
    var message = "";
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      message += key + obj[key];
    }
    return message;
  },
  encryption: function (message) {
    var iv = ""; //随机生成长度为32的16进制字符串。IV称为初始向量，不同的IV加密后的字符串是不同的，加密和解密需要相同的IV。
    var key = sessionStorage.getItem("key");
    var cryptkey = CryptoJS.enc.Latin1.parse(key);
    var ciphertext = aesEncrypt(message, cryptkey); //加密
    var decryptedMessage = aesDecrypt(ciphertext, cryptkey); //解密
    function aesEncrypt(message, key) {
      var ciphertext = CryptoJS.AES.encrypt(message, key, {
        iv: CryptoJS.enc.Latin1.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return ciphertext; //密码对象(Obejct类型，非WordArray类型)，Base64编码。
      //return ciphertext.toString();//密码对象的Base64字符串
    }

    function aesDecrypt(ciphertext, key) {
      var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
        iv: CryptoJS.enc.Latin1.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8); //WordArray对象转utf8字符串
    }
    return ciphertext.toString()
  },
  errorwife: function () {
    $("#errorwifeBox").remove();
    $("body").append("<div id='errorwifeBox'>" +
      "<div id='errorImgbox'></div>" +
      "<p>网络错误，请检查网络</p>" +
      "<button>重试</button>" +
      "</div>");
    $("#errorwifeBox button").unbind("click").click(function () {
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/settings/getTransType",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        success: function () {
          window.location.reload();
        },
        error: function () {
          androidIos.firstblack("当前状况下无网络，请检查网络!");
        }
      });
    })
  },
  GetQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var s = window.location.href.indexOf("?");
    var r = window.location.href.substr(s + 1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  idCardCheck:function (id) {
    // 1 "验证通过!", 0 //校验不通过
    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //号码规则校验
    if(!format.test(id)){
      return false
    }
    //区位码校验
    //出生年月日校验   前正则限制起始年份为1900;
    var year = id.substr(6,4),//身份证年
      month = id.substr(10,2),//身份证月
      date = id.substr(12,2),//身份证日
      time = Date.parse(month+'-'+date+'-'+year),//身份证日期时间戳date
      now_time = Date.parse(new Date()),//当前时间戳
      dates = (new Date(year,month,0)).getDate();//身份证当月天数
    if(time>now_time||date>dates){
      return false
    }
    //校验码判断
    var c = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);   //系数
    var b = new Array('1','0','X','9','8','7','6','5','4','3','2');  //校验码对照表
    var id_array = id.split("");
    var sum = 0;
    for(var k=0;k<17;k++){
      sum+=parseInt(id_array[k])*parseInt(c[k]);
    }
    if(id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
      return false
    }
    return true
  }

};
export {
  androidIos
}
