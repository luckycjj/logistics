<template>
  <div id="carHanger">
    <div id="title" v-title :data-title="title"></div>
    <div id="mescroll" class="mescroll mesrollTop">
      <ul id="dataList0" class="data-list">
      </ul>
    </div>
    <div id="filterBox" v-if="show" @click="filterBoxBlackFalse($event)">
      <div id="filter">
        <div style="position: absolute;top:0;bottom:1.2rem;width:100%;height: auto;overflow: scroll;">
          <div class="table">
            <p>车辆类型</p>
            <ul>
              <li v-for="(item,index) in carType" :class="[item.choose?'filterColor':'',index%3==1?'margin':'']" @click="choosefilter(3,index)">{{item.displayName}}</li>
              <div class="clearBoth"></div>
            </ul>
          </div>
        </div>
        <div id="filterSureBox">
          <div class="filterSure" @click="resetFilter()">重置</div>
          <div class="filterSure filterYes" @click="okFilter()">完成</div>
          <div class="clearBoth"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import bridge from '../../js/bridge';
  import {bomb} from "../../js/zujian";
  export default {
    name: "car-hanger",
    data(){
      return{
        carType:[],
        search:{
          tranState:"",
          tranType:"",
          carType:""
        },
        carSure:[],
        mescroll:"",
        listType:"",
        pageSize:"",
        pageNum:"",
        orderPk:"",
        totle:0,
        show:false,
        pdType:0,
        title:"",
      }
    },
    watch:{
      carSure:{
        handler:function(val,oldval){
          var _this = this;
          _this.$nextTick(function () {
            document.title = (document.getElementById("title")).dataset.title;
            document.getElementById("title").innerText = document.title;
            document.getElementById("carTitleBox").children[0].children[1].innerText = document.getElementById("title").innerText;
          })
        },
        deep:true
      }
    },
    beforeMount:function () {
      var _this = this;
      if(_this.$route.query.memo != null){
        _this.title = "车头(" + JSON.parse(_this.$route.query.memo).carNumber + ")";
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function(){
        var _this = this;
        sessionStorage.removeItem("changeCarpeople");
        sessionStorage.removeItem("changeCarFupeople");
      /*  var carsure = sessionStorage.getItem("carsure");
        if(carsure != null){
          _this.carSure = JSON.parse(carsure);
        }else{*/
          if(_this.$route.query.memo != null){
            _this.carSure.push(JSON.parse(_this.$route.query.memo))
          }
       /* }*/
        _this.orderPk = sessionStorage.getItem("dispatchPK") == undefined ? "" :sessionStorage.getItem("dispatchPK");
        var mescroll = new MeScroll("mescroll", { //id固定"body"
          //上拉加载的配置项
          up: {
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            clearEmptyId: "dataList0", //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
            page:{
              size:15
            },
            empty:{
              tip:"暂无车辆~",
              warpId:'mescroll',
              icon:require('../../images/nojilu.png'),
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", "")
          }
        });
        _this.mescroll = mescroll;

        /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
        function getListData(page){
          //联网加载数据
          getListDataFromNet(_this.pdType, page.num, page.size, function(curPageData){
            mescroll.endSuccess(curPageData.length);
            setListData(curPageData, page.num, page.size,_this.pdType);
          }, function(){
            mescroll.endErr();
          });
        }

        /*设置列表数据*/
        function setListData(curPageData, num, size,type){
          var listDom=document.getElementById("dataList0");
          var nnnn = 0;
          for (var i = 0; i < curPageData.length; i++) {
            var pd=curPageData[i];
            var type = pd.type == 2 ? '运输中' : '空闲中';
            type = '<span class="nowtype">'+type+'</span>';
            var display = $("#search").find("h5").text() == "取消" ? "block":"none";
            var length = pd.length == "" ? "" : pd.length+ "米" ;
            var minheight = pd.zongweight == "0" ? "0.5rem" : "auto";
            var display2 = pd.zongweight == "0" ? "none" : "inline";
            var img = _this.orderPk ==""  && (pd.now == '0' || pd.now == '1' || pd.now == '2')?"<div class='clearImg' style='display: "+display+"'></div><div class='reaseImg' style='display: "+display+"'></div>":_this.orderPk =="" && pd.carType == '0' && pd.now == '3'  ? "<div class='clearImg' style='right:0.6rem;display: " + display + "'></div>" : "";
            var str = '<div class="top" data-driverLicense="'+pd.driverLicense+'" data-pkCar="'+pd.pkCar+'" data-carType="'+pd.carType+'">'+
              '<span class="carnumber">'+pd.carNumber+'</span><span class="cartype">'+pd.sportType+'</span><span  class="transtype">'+pd.transType+'</span><span class="carlength">' + length + '</span><span class="carModel">'+pd.carModel+'</span>'+type+'<div class="clearBoth"></div>'+
              '<p style="min-height: ' + minheight + ';" class="weight"><span style="font-size: 0.3125rem;display: ' + display2+ '">满载：<span style="font-size: 0.3125rem;">'+pd.zongweight+'</span>吨&nbsp;&nbsp;已承载：'+pd.nowweight+'吨</span></p>'+
              img +
              '<div class="clearBoth"></div></div>';
            var liDom=document.createElement("li");
            liDom.classList.add("liDom");
            liDom.dataset.nowtype = pd.now;
            liDom.innerHTML=str;
            listDom.appendChild(liDom);
            $("#carHanger #dataList0 li .top").unbind('click').click(function () {
              var that = $(this);
              if($("#search").find("h5").text() != "取消"){
                var carNumber = that.find(".carnumber").text();
                var pkcar = that.attr("data-pkCar");
                var cartype = that.attr("data-carType");
                var carModel = that.find(".cartype").text();
                if(_this.orderPk != ""){
                  if(carModel == "整车"){
                    androidIos.addPageList();
                    _this.$router.push({ path: '/car',query:{title: carModel,pkCar:pkcar,carType:cartype}});
                  }else{
                      _this.carSure.push({
                        pkcar:pkcar,
                        carModel:carModel ,
                        cartype:cartype,
                      });
                      _this.carSureGo();
                  }
                }
              }
            })
            $("#carHanger #dataList0 li .thirdBox").unbind('click').click(function () {
              var tel = $(this).attr("data-tel");
              bridge.invoke('callTelephone',tel);
            })
            $("#search").unbind("click").click(function () {
              if($(this).find("h5").text() == "筛选"){
                _this.show = true;
                if(_this.carType.length == 0){
                  $.ajax({
                    type: "POST",
                    url: androidIos.ajaxHttp()+"/settings/getCarType",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    timeout: 30000,
                    success: function (getCarType) {
                      for(var i = 0;i<getCarType.length;i++){
                        getCarType[i].choose = false;
                      }
                      _this.carType = getCarType;
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
              }else{
                var display = $("#car .clearImg").css("display");
                if(display == "block"){
                  if($("#dataList0 li").length > 0){
                    $("#car .clearImg").css("display","none");
                    $("#car .reaseImg").css("display","none");
                    $(this).find("h5").text("编辑");
                  }
                }else{
                  if($("#dataList0 li").length > 0){
                    $("#car .clearImg").css("display","block");
                    $("#car .reaseImg").css("display","block");
                    $(this).find("h5").text("取消");
                  }
                }
              }
            });
            $(".reaseImg").unbind("click").click(function (event) {
              event.stopPropagation();
              var that = $(this).parents("li");
              var json = {
                cartrantype:that.find(".transtype").text(),
                carmodelNumber:that.find(".transtype").text(),
                carmodel:that.find(".cartype").text(),
                type:that.find(".carModel").text(),
                carCode:that.find(".carModel").text(),
                carlength:that.find(".carlength").text(),
                carmodelNumber:that.find(".cartype").text(),
                carlengthCode:that.find(".carlength").text().replace(/米/g,''),
                carNumber:that.find(".carnumber").text().substring(1),
                plateName:that.find(".carnumber").text().substring(0,1),
                weight:that.find(".weight span").text(),
                carpk:that.find(".top").attr("data-pkCar"),
                Travelpic:that.find(".top").attr("data-driverLicense")
              }
              sessionStorage.setItem("carchange",JSON.stringify(json));
              androidIos.addPageList();
              _this.$router.push({ path: '/car/newCar'});
            })
            $(".clearImg").unbind("click").click(function () {
              var carPk = $(this).parents("li").find(".top").attr("data-pkCar");
              androidIos.first("确定删除吗？");
              var that = $(this);
              $("#tanBox-yes").unbind("click").click(function () {
                $(".tanBox-bigBox").remove();
                androidIos.loading("正在删除");
                $.ajax({
                  type: "POST",
                  url: androidIos.ajaxHttp()+"/driver/deleteCar",
                  data:JSON.stringify({
                    pk:carPk,
                    userCode:sessionStorage.getItem("token"),
                    source:sessionStorage.getItem("source")
                  }),
                  contentType: "application/json;charset=utf-8",
                  dataType: "json",
                  timeout: 30000,
                  async:false,
                  success: function (deleteCar) {
                    if(deleteCar.success=="1"){
                      that.parents("li").remove();
                      _this.$cjj("删除成功");
                    }else{
                      androidIos.second(deleteCar.message)
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
                });
                $.ajax({
                  type: "POST",
                  url: androidIos.ajaxHttp() + "/carrier/getCarList",
                  data:JSON.stringify({
                    type:_this.listType,
                    page:_this.pageNum*_this.pageSize,
                    size:1,
                    status:_this.search.tranState,
                    transType:_this.search.tranType,
                    carType:_this.search.carType,
                    userCode:sessionStorage.getItem("token"),
                    source:sessionStorage.getItem("source"),
                    checkStatus:_this.orderPk == "" ? "" : 2,
                  }),
                  contentType: "application/json;charset=utf-8",
                  dataType: "json",
                  timeout: 30000,
                  async:false,
                  success: function (getCarList) {
                    if(getCarList.success=="1"){
                      var listData = [];
                      var pdType = _this.pdType;
                      for(var i =0; i< getCarList.list.length;i++){
                        var tt = getCarList.list[i];
                        // 0 正在审核 1 已审核 2 已驳回 3已禁用
                        var json = {
                          logo:tt.driverDto.driverImg == null || tt.driverDto.driverImg ==""?"data:image/png;base64,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":tt.driverDto.driverImg,
                          name:tt.driverDto.driverName,
                          tel:tt.driverDto.mobile,
                          carModel:tt.carModel,
                          pkDriver:tt.driverDto.pkDriver,
                          pkCar:tt.pkCar,
                          sprotYear:tt.driverDto.driverAge,
                          carNumber:tt.carNo,
                          sportType:tt.carType,
                          length:tt.length,
                          driverLicense:tt.driverLicense,
                          zongweight:tt.loadWeight*1,
                          nowweight:tt.weight*1,
                          type:tt.weight*1 > 0 ? 2 :1,
                          carType:pdType,
                          transType:tt.transType,
                          now:pdType == 0  && tt.checkStatus == '1' ? 0 : pdType == 0  && tt.checkStatus == '3' ? 2 : pdType == 0 && tt.checkStatus == '4' ? 3 : 1 ,
                        }
                        listData.push(json);
                      }
                      if(listData.length > 0){
                        setListData(listData,_this.pageNum*_this.pageSize,1,'');
                      }

                    }else{
                      androidIos.second(getCarList.message);
                      setListData([],_this.pageNum*_this.pageSize,1,'');
                    }
                  },
                  complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                    if(status=='timeout'){//超时,status还有success,error等值的情况
                      androidIos.second("网络请求超时");
                      setListData([],_this.pageNum*_this.pageSize,1,'');
                    }else if(status=='error'){
                      androidIos.errorwife();
                      setListData([],_this.pageNum*_this.pageSize,1,'');
                    }
                  }
                })
              })

            })
          }
          for(var x = $(".firstBox").length - nnnn ; x < $(".firstBox").length;x++){
            var className = document.getElementsByClassName("firstBoxImg")[x];
            className.onload = function () {
              for (var i = $(".firstBox").length - nnnn ;i < $(".firstBox").length; i++) {
                var heightImg = $(".firstBoxImg").eq(i).height();
                var heightBox = $(".firstBox").eq(i).height();
                var widthBox = $(".firstBox").eq(i).width();
                var htmlSize = $("html").css("fontSize").replace("px", "");
                if (heightImg > heightBox) {
                  $(".firstBoxImg").eq(i).css("marginTop", (heightBox - heightImg) / 2 / htmlSize + "rem");
                } else {
                  $(".firstBoxImg").eq(i).height(heightBox / htmlSize + "rem");
                  $(".firstBoxImg").eq(i).width("auto");
                  var widthImg = $(".firstBoxImg").eq(i).width();
                  $(".firstBoxImg").eq(i).css("marginLeft", (widthBox - widthImg) / (2) / htmlSize + "rem");
                }
              }
            }
          }
        }
        function getListDataFromNet(pdType,pageNum,pageSize,successCallback,errorCallback) {
          //延时一秒,模拟联网
          setTimeout(function () {
            var listData=[];
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp()+"/carrier/getCarList",
              data:JSON.stringify({
                type:0,
                page:pageNum,
                size:pageSize,
                status:_this.search.tranState,
                transType:_this.search.tranType,
                carType: "41efd612fc2e4067a1debc30a1c36383",
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source"),
                checkStatus:2,
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (getCarList) {
                if(getCarList.success == "1"){
                  if(_this.orderPk == ""){
                    $("#search").find("h5").text("编辑");
                  }else if(_this.orderPk != ""){
                    $("#search").find("h5").text("筛选");
                  }
                  _this.listType = pdType;
                  _this.pageNum = pageNum;
                  _this.pageSize = pageSize;
                  _this.totle = getCarList.total;
                  for(var i =0; i< getCarList.list.length;i++){
                    var tt = getCarList.list[i];
                    var json = {
                      logo:tt.driverDto.driverImg == null || tt.driverDto.driverImg ==""?"data:image/png;base64,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":tt.driverDto.driverImg,
                      name:tt.driverDto.driverName,
                      tel:tt.driverDto.mobile,
                      carModel:tt.carModel,
                      pkDriver:tt.driverDto.pkDriver,
                      pkCar:tt.pkCar,
                      sprotYear:tt.driverDto.driverAge,
                      carNumber:tt.carNo,
                      sportType:tt.carType,
                      length:tt.length,
                      driverLicense:tt.driverLicense,
                      zongweight:tt.loadWeight*1,
                      nowweight:tt.weight*1,
                      type:tt.weight*1 > 0 ? 2 :1,
                      carType:pdType,
                      transType:tt.transType,
                      now:tt.checkStatus == '1' ? 0 : tt.checkStatus == '3' ? 2 :  tt.checkStatus == '4' ? 3 : 1 ,
                    }
                    listData.push(json);
                  }
                  successCallback(listData);
                }else{
                  androidIos.second(getCarList.message);
                  successCallback([]);
                }
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                  successCallback([]);
                }else if(status=='error'){
                  androidIos.errorwife();
                  successCallback([]);
                }
              }
            })
          },500)
        }
      },
      carSureGo:function () {
        var _this = this;
        var carModel = [];
        var pkcar = [];
        var cartype = "";
        for(var i = 0 ; i < _this.carSure.length ; i++){
          carModel.push(_this.carSure[i].carModel);
          pkcar.push(_this.carSure[i].pkcar);
          cartype = _this.carSure[i].cartype;
        }
        carModel = carModel.join(",");
        pkcar = pkcar.join(",");
        androidIos.addPageList();
        _this.$router.push({ path: '/car',query:{title: carModel,pkCar:pkcar,carType:cartype}});
      },
      navClick:function (number) {
        var _this = this;
        var i = number;
        if(_this.pdType != i) {
          _this.pdType = i;
          $(".nav .active").removeClass("active");
          $(".nav p").eq(i).addClass("active");
          _this.mescroll.resetUpScroll();
        }
      },
      newCar:function(){
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/car/newCar'});
      },
      filterBoxBlackFalse:function(e){
        var _this = this;
        if(e.target.id == "filterBox"){
          _this.show = false;
        }
      },
      choosefilter:function (number,index) {
        var _this = this;
        if(number == 1){
          _this.tranState[index].choose = !_this.tranState[index].choose;
        }else if(number == 2){
          _this.tranType[index].choose = !_this.tranType[index].choose;
        }else if(number == 3){
          for(var i = 0 ; i <  _this.carType.length ; i++){
            if(i == index){
              _this.carType[index].choose = !_this.carType[index].choose;
            }else{
              _this.carType[i].choose = false;
            }
          }
        }
      },
      resetFilter:function () {
        var _this = this;
        /*  for(var i = 0 ;i < _this.tranState.length;i ++){
            _this.tranState[i].choose = false;
          }*/
        /* for(var i = 0 ;i < _this.tranType.length;i ++){
           _this.tranType[i].choose = false;
         }*/
        for(var i = 0 ;i < _this.carType.length;i ++){
          _this.carType[i].choose = false;
        }
      },
      okFilter:function () {
        var _this = this;
        var tranState="",tranType="",carType="";
        for(var i = 0 ;i < _this.carType.length;i ++){
          if(_this.carType[i].choose){
            if(carType == ""){
              carType = _this.carType[i].value
            }else{
              carType= carType + "," + _this.carType[i].value;
            }
          }
        }
        _this.search.tranState = tranState;
        _this.search.tranType = tranType;
        _this.search.carType = carType;
        _this.show = false;
        _this.mescroll.resetUpScroll();
      }
    }
  }
</script>

<style>
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #carHanger .nav{
    width:100%;
  }
  #carHanger .nav p{
    float: left;
    width: 33.333333%;
    background: white;
    line-height: 1rem;
    text-align: center;
    font-size: 0.4rem;
    color:#333;
  }
  #carHanger .nav .active{
    border-bottom: 1px solid #3399FF;
    color: #3399FF;
  }
  #carHanger .clearImg{
    width:0.6rem;
    height: 0.6rem;
    background-image: url("../../images/clean.png");
    position: absolute;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size:cover;
    right:1.5rem;
    top:50%;
    /* margin-top: -0.3rem;*/
    display: none;
  }
  #carHanger .reaseImg{
    width:0.6rem;
    height: 0.6rem;
    background-image: url("../../images/edit.png");
    position: absolute;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size:cover;
    right:0.6rem;
    top:50%;
    /*margin-top: -0.3rem;*/
    display: none;
  }
  #carHanger .checkImg{
    width:0.6rem;
    height: 0.6rem;
    background-image: url("../../images/checked.png");
    position: absolute;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size:cover;
    right:0.6rem;
    top:50%;
    /*margin-top: -0.3rem;*/
    display: none;
  }
  #carHanger #mescroll{
    margin-top: 0.5rem;
  }
  #carHanger #mescroll ul{
    width:100%;
  }
  #carHanger #mescroll ul li{
    width: 94%;
    background: white;
    /* margin-bottom: 0.2rem; */
    margin: 0 auto 0.3rem auto;
    border-radius: 0.2rem;
    box-shadow: 0 5px 10px #cecbcb;
  }
  #carHanger li .top{
    width:95%;
    margin-left: 5%;
    padding-bottom: 0.15rem;
    position: relative;
  }
  #carHanger li .top .carnumber{
    font-size: 0.4rem;
    line-height: 1rem;
    margin-right:0.2rem;
    color:#333;
  }
  #carHanger li .top .cartype{
    font-size: 0.3125rem;
    line-height: 1rem;
    margin-right:0.2rem;
    color:#999999;
  }
  #carHanger li .top .carlength,#carHanger li .top .carModel,#carHanger li .top .transtype{
    font-size: 0.3125rem;
    line-height: 1rem;
    margin-right:0.2rem;
    color:#999999;
  }
  #carHanger li .top .weight{
    font-size: 0.3125rem;
    margin-right:0.2rem;
    color:#999999;
  }
  #carHanger li .top .nowtype{
    position: absolute;
    right: 0;
    font-size: 0.4rem;
    line-height: 1rem;
    margin-right: 5%;
    color:#333;
  }
  #carHanger li .bottom{
    position: relative;
    width:90%;
    margin-left: 5%;
    padding-bottom: 0.15rem;
    border-top: 1px solid #dbdbdb;
  }
  #carHanger .firstBox{
    float: left;
    margin:0.25rem 5% 0.25rem 0;
    width:1rem;height:1rem;overflow: hidden;border-radius: 50%;line-height: 1rem
  }
  #carHanger .firstBox img{
    width:100%;
    display: inline-block;
    vertical-align: middle;
  }
  #carHanger .secondBox{
    width:40%;
    float: left;
    margin-top: 0.25rem;
  }
  #carHanger .thirdBox{
    width:30%;
    background-image: url("../../images/tel.png");
    background-position: 100% 50%;
    background-repeat: no-repeat;
    background-size: 0.8rem 0.8rem;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    height: auto;
  }
  #carHanger .secondBox p{
    font-size: 0.35rem;
    color:#333;
  }
  #carHanger .secondBox p span{
    font-size: 0.3125rem;
    color:#333;
  }
  #carHanger .secondBox h1{
    font-size: 0.3125rem;
    color:#999;
  }
  #carHanger  .secondBox h2, #carHanger secondBox span{
    font-size: 0.3125rem;
    color:#999;
    line-height: 0.5rem;
  }
  #carHanger .secondBox h2 span{
    margin-left: 0.2rem;
  }
  #carHanger .mescroll{
    position: fixed;
    top:2.21875rem;
    bottom: 0;
    height: auto;
  }
</style>
<style scoped>
  #filterBox{
    position: fixed;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    height: auto;
    width:auto;
    background: rgba(0,0,0,0.5);
  }
  #filter{
    position: absolute;
    top:0;
    bottom: 0;
    left:20%;
    right:0;
    height: auto;
    width:auto;
    background: white;
  }
  #filterBox .table{
    width: 94%;
    margin: 0.2rem auto 0 auto;
  }
  #filterBox .table p{
    font-size: 0.35rem;
    color:#333;
  }
  #filterBox .table li{
    float: left;
    width: 28%;
    padding: 0 1%;
    text-align: center;
    line-height: 1rem;
    background: #cacaca;
    color:white;
    margin-top: 0.3rem;
    border-radius: 0.2rem;
    height: 1rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 0.3125rem;
  }
  #filterBox .table ul .margin{
    margin-left: 5%;
    margin-right: 5%;
  }
  .filterColor{
    background: #3399FF!important;
  }
  #filterSureBox{
    width: 100%;
    position: absolute;
    height: 1.2rem;
    bottom:0;
    left:0;
  }
  .filterSure{
    width:50%;
    float: left;
    background:#cacaca ;
    color:white;
    text-align: center;
    line-height: 1.2rem;
    font-size: 0.375rem;
  }
  .filterYes{
    background: #3399FF!important;
  }
  #newCar,#yesGo{
    width: 100%;
    position: fixed;
    height: 1.2rem;
    bottom:0;
    left:0;
    color:white;
    text-align: center;
    line-height: 1.2rem;
    font-size: 0.4rem;
    background: #3399FF;
  }
  .mesrollTop{
    top: 1.3rem!important;
  }
</style>


