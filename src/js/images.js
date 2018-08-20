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
        '<img  id="h5u_preview_' + rand_id + '" style="display: none;" onerror=src="data:image/jpeg;base64,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" />' +
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
        $(".tanBox-yes").unbind('click').click(function () {
          $(".tanBox-bigBox").remove();
          var parentsId = thisclose.parents(".imgUpload").attr("id");
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
          }
          if(sessionStorage.getItem("source") == "2"){
            localStorage.setItem("UPMESSA",JSON.stringify(message));
          }else if(sessionStorage.getItem("source") == "3"){
            localStorage.setItem("DRIVERMESSA",JSON.stringify(message));
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
      type: parentsId == "box" ? "YY" : parentsId == "box1" ? "DL" : parentsId == "box2" ? "SFZ" : parentsId == "box3" ? "JS" : "YS" ,
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
        $("#common-blackBox").remove();
        if (json.success == "1") {
          $("#h5u_options_" + rand_id).css("display", "none");
          $("#h5u_preview_" + rand_id).show();
          $("#closed_" + rand_id).show();
          $("#h5u_options_" + rand_id).append("<p class='h5u_options_hiddenP'>" + json.path + "</p>");
          var message = "";
          if(sessionStorage.getItem("source") == "2"){
            message = localStorage.getItem("UPMESSA") != null ? JSON.parse(localStorage.getItem("UPMESSA")) : {
              Drivepic : "",
              IDpic: "",
              Licensepic: "",
              Roadpic: "",
              Travelpic: "",
              bank: "",
              bankNumber: "",
              company: "",
              name: "",
              nvitationodeIC: "",
              peopleNumber: ""};
          }else if(sessionStorage.getItem("source") == "3"){
            message = localStorage.getItem("DRIVERMESSA") != null ? JSON.parse(localStorage.getItem("DRIVERMESSA")) : {
              Drivepic : "",
              IDpic: "",
              Licensepic: "",
              Roadpic: "",
              Travelpic: "",
              bank: "",
              bankNumber: "",
              company: "",
              name: "",
              nvitationodeIC: "",
              peopleNumber: ""};
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
          }
          var http = location.href;
          if(sessionStorage.getItem("source") == "2" && http.indexOf("/uploadData/uploadDataT") != -1 ){
            localStorage.setItem("UPMESSA",JSON.stringify(message));
          }else if(sessionStorage.getItem("source") == "3" && http.indexOf("/uploadData/uploadDataT") != -1){
            localStorage.setItem("DRIVERMESSA",JSON.stringify(message));
          }
        } else if (json.success == "-1") {
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

  function add_doc(base, idnum) {
    $('#aii_upload_form').append('<input type="hidden" name="img[]" id="f_' + idnum + '" value="' + base + '"/>');
  }
})($);

function img_remove(element) {
  var num = $(element).prev().attr('idnum');
  $(element).parent().remove();
  $('#f_' + num).remove();
}
