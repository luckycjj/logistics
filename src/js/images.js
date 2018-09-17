import  {androidIos} from './app';
(function ($) {
  var imageWidth, imageHeight;
  var base64;
  $.fn.extend({
    aiiUpload: function (obj) {
      if (typeof obj != "object") {
        alert('参数错误');
        return;
      }
      var file_num = 0;
      var fileInput = $(this);
      var fileInputId = fileInput.attr('id');
      var randID = fileInputId + Math.floor(Math.random() * 1000000000); //随机ID
      createDoc('#' + fileInputId, obj.method, obj.action, obj.subText, randID, obj.formIdName);
      $('#h5u_file_' + randID).change(function () {
        if (test(this.value) == false) {
          return false;
        }
        for (var i = 0; i < this.files.length; i++) {
          if (this.files[i].size / 1048576 > 5) {
            androidIos.first("上传图片尺寸大于5M");
            continue;
          }
          var objUrl = getObjectURL(this.files[i]);
          if (objUrl) {
            //imgBefore(objUrl,file_num);
            render(objUrl, obj.max_w, obj.max_h, file_num, randID, obj.action);
            file_num++;
          }
        }

      });
    }
  });
  //创建form表单
  var imgBase;

  function createDoc(objID, form_method, form_action, sub_txt, rand_id, form_id_name) {
    var element = $(objID);
    var str = "";
    if (objID.indexOf("b") != -1) {
      str += '<div class="upbox">' +
        "<div class='closed'   id='closed_" + rand_id + "' style='z-index:4;display:none;position: absolute;top:0.1rem; right:0.1rem;width:1rem;height:1rem;'><div style='position:absolute;right:0rem;top:0rem;font-size: 0.3125rem;border-radius: 50%;color:white;width:0.5rem;height: 0.5rem;text-align: center;line-height: 0.45rem;z-index: 3;background: rgba(0,0,0,0.5);'>x</div></div>" +
        '<canvas id="canvas_' + rand_id + '" style="display:none;"></canvas>' +
        '<div class="options hide cjjimgbox" id="h5u_options_' + rand_id + '"></div>' +
        '<img  id="h5u_preview_' + rand_id + '" style="display: none;" onerror=src="' + require("../images/timg.jpg") + '" />' +
        '<div class="js-upbtn" id="h5u_upbtn_' + rand_id + '">' +
        '<a href="javascript:;" class="h5u_file">' +
        '<input type="file" class="up_file3 cjjfile" id="h5u_file_' + rand_id + '" accept="image/*">' +
        '</a>' +
        '</div>' +
        '<input type="hidden" name="' + form_id_name + '" id="h5u_form_hidden_' + rand_id + '" >' +
        '</div>';
      element.append(str);
      $(".upbox").css({
        "width": "auto",
        "height": "auto",
        "position": "absolute",
        "left": "0",
        "right": "0",
        "top": "0",
        "bottom": "0"
      });
      $(".upbox input").css({
        "width": "auto",
        "height": "auto",
        "opacity": "0",
        "position": "absolute",
        "left": "0",
        "right": "0",
        "top": "0",
        "bottom": "0"
      });
      $(".upbox img").css({
        "width": "100%",
        "height": "100%",
        "position": "absolute",
        "z-index": "2"
      });
      $(".upbox .closed").unbind("click").click(function () {
        androidIos.first("确定删除吗？");
        var thisclose = $(this);
        var parentsId = thisclose.parents(".imgUpload").attr("id");
        $(".tanBox-yes").unbind('click').click(function () {
          $(".tanBox-bigBox").remove();
          if(localStorage.getItem("UPMESSA")!= null){
            var message = sessionStorage.getItem("source") == "2" ?JSON.parse(localStorage.getItem("UPMESSA")):JSON.parse(localStorage.getItem("DRIVERMESSA")) ;
            if(parentsId == "box"){
              message.Licensepic = "";
            }else if(parentsId == "box1"){
              message.Roadpic = "";
            }else if(parentsId == "box2"){
              message.IDpic = "";
            }else if(parentsId == "box3"){
              message.Drivepic = "";
            }else if(parentsId == "box4"){
              message.Travelpic = "";
            }else if(parentsId == "box5"){
              message.IDpicfan = "";
            }else if(parentsId == "box6"){
              message.authorization = "";
            }
            if(sessionStorage.getItem("source") == "2"){
              localStorage.setItem("UPMESSA",JSON.stringify(message));
            }else if(sessionStorage.getItem("source") == "3"){
              localStorage.setItem("DRIVERMESSA",JSON.stringify(message));
            }
          }
          thisclose.parents(".upbox").find(".cjjimgbox").html("");
          thisclose.parents(".upbox").find("img").hide();
          thisclose.parents(".upbox").find("input").val("");
          thisclose.hide();
        });
      })
    }
  }
  //检查文件类是否是图片格式
  function test(value) {
    var regexp = new RegExp("(.JPEG|.jpeg|.JPG|.jpg|.BMP|.bmp|.PNG|.png)$", 'g');
    return regexp.test(value);
  }

  function render(src, MaximgW, MaximgH, idnum, rand_id, action) {
    var image = new Image();
    image.onload = function () {
      //如果图片的尺寸小于定义的最大宽和高，则以图片原始尺寸为准
      var canvas = document.getElementById('canvas_' + rand_id);
      var previewIMG = document.getElementById('h5u_preview_' + rand_id);
      //预览图片


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
      imgBase = canvas.toDataURL('image/jpeg', 0.5);
      base64 = canvas.toDataURL('image/jpeg', 0.5).substr(0);
      previewIMG.src = base64;
      //add_doc(base64,idnum);
      //上传图片
      upload_base(base64, action, rand_id);
    }
    image.src = src;
  };
  //建立一個可存取到該file的url
  function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
      url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  }
  //预览
  function imgBefore(objUrl, idnum) {
    var li = '<li class="view"><img src="' + objUrl + '" id="aiiImg_' + idnum + '" idnum="' + idnum + '" /><div class="close" onclick="img_remove(this);"></div></li>'
    $('.viewList').append(li);
    var img = $('#aiiImg_' + idnum);
    //预览图片居中 填满 代码

    img.load(function () {
      var imgw = img.width(),
        imgh = img.height();
      if (imgw > imgh) {
        img.css('height', '100%');
        img.css('width', 'auto');
        img.css('marginLeft', -(img.width() - img.height()) / 2 + 'px');
      } else if (imgw < imgh) {
        img.css('width', '100%');
        img.css('height', 'auto');
        img.css('marginTop', -(img.height() - img.width()) / 2 + 'px');
      }
    });
  }
  //上传图片
  function upload_base(base, action, rand_id) {
    //隐藏上传控件按钮
    var parentsId = $("#h5u_file_"+rand_id).parents(".imgUpload").attr("id");
    var imagesJson = {
      type: parentsId == "box" ? "YY" : parentsId == "box1" ? "DL" : parentsId == "box2" ? "SFZ" : parentsId == "box3" ? "JS" : parentsId == "box4" ? "YS" : parentsId == "box5" ? "SEZF" : "SQH" ,
      name:"",
      file: base.substr(23),
      userCode:sessionStorage.getItem("token"),
      source:sessionStorage.getItem("source")
    }
    androidIos.loading("正在上传");
    $.ajax({
      type: "POST",
      url: action,
      data:JSON.stringify(imagesJson),
      contentType: "application/json;charset=utf-8",
      dataType: "json",
      timeout: 30000,
      success: function (json) {
        if (json.success == "1") {
          $("#h5u_options_" + rand_id).css("display", "none");
          $("#h5u_preview_" + rand_id).show();
          $("#closed_" + rand_id).show();
          $("#h5u_options_" + rand_id).append("<p class='h5u_options_hiddenP'>" + json.path + "</p>");
          var message = "";
          if(sessionStorage.getItem("source") == "2"){
            message = localStorage.getItem("UPMESSA") != null ? JSON.parse(localStorage.getItem("UPMESSA")) : {
              userCode : sessionStorage.getItem("token"),
              nvitationodeIC:"",
              company: "",
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
              peopleNumber:""};
          }else if(sessionStorage.getItem("source") == "3"){
            message = localStorage.getItem("DRIVERMESSA") != null ? JSON.parse(localStorage.getItem("DRIVERMESSA")) : {
              userCode : sessionStorage.getItem("token"),
              nvitationodeIC:"",
              company: "",
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
              peopleNumber:""};
          }
          if(parentsId == "box"){
            var idF = $("#box .cjjimgbox .h5u_options_hiddenP");
            message.Licensepic = idF.text();
          }else if(parentsId == "box1"){
            var idS = $("#box1 .cjjimgbox .h5u_options_hiddenP");
            message.Roadpic = idS.text();
          }else if(parentsId == "box2"){
            var idT = $("#box2 .cjjimgbox .h5u_options_hiddenP");
            message.IDpic = idT.text();
          }else if(parentsId == "box3"){
            var idFo = $("#box3 .cjjimgbox .h5u_options_hiddenP");
            message.Drivepic = idFo.text();
          }else if(parentsId == "box4"){
            var idFi = $("#box4 .cjjimgbox .h5u_options_hiddenP");
            message.Travelpic = idFi.text();
          }else if(parentsId == "box5"){
            var idFi = $("#box5 .cjjimgbox .h5u_options_hiddenP");
            message.IDpicfan = idFi.text();
          }else if(parentsId == "box6"){
            var idFi = $("#box6 .cjjimgbox .h5u_options_hiddenP");
            message.authorization = idFi.text();
          }
          var http = location.href;
          if(sessionStorage.getItem("source") == "2" && http.indexOf("/uploadData/uploadDataT") != -1 ){
            localStorage.setItem("UPMESSA",JSON.stringify(message));
          }else if(sessionStorage.getItem("source") == "3" && http.indexOf("/uploadData/uploadDataT") != -1){
            localStorage.setItem("DRIVERMESSA",JSON.stringify(message));
          }
        } else{
          androidIos.second(json.message);
        }
      },
      complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
        $("#" + parentsId + " input").val("");
        $("#common-blackBox").remove();
        if (status == 'timeout') { //超时,status还有success,error等值的情况
          androidIos.second("当前状况下网络状态差，请检查网络！")
        } else if (status == "error") {
          androidIos.errorwife();
        }
      }
    });
  }

  function add_doc(base, idnum) {
    $('#aii_upload_form').append('<input type="hidden" name="img[]" id="f_' + idnum + '" value="' + base + '"/>');
  }
})($);

function img_remove(element) {
  var num = $(element).prev().attr('idnum');
  $(element).parent().remove();
  $('#f_' + num).remove();
}
