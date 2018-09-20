<template>
  <div id="carHanger">
    <div id="title" v-title :data-title="title"></div>
    <div id="Allcar">
      <ul>
        <li class="boxshowNo">
          <div class="allcarBoth"><div class="cartype1 zongCartype">普货车挂<span>({{jiaobiao.hangGeneralGoodsCount}})</span></div><div class="downJian" id="downJian2" @click="lookMoreCarAll(2)"></div><div class="clearBoth"></div></div>
          <div id="mescroll2" class="mescrollFirst">
            <ul id="dataList2" class="data-list">
            </ul>
          </div>
        </li>
        <li class="boxshowNo">
          <div class="allcarBoth"><div class="cartype3 zongCartype">冷链车挂<span>({{jiaobiao.hangColdChainCount}})</span></div><div class="downJian" id="downJian1" @click="lookMoreCarAll(1)"></div><div class="clearBoth"></div></div>
          <div id="mescroll1" class="mescrollFirst">
            <ul id="dataList1" class="data-list">
            </ul>
          </div>
        </li>
        <li class="boxshowNo">
          <div class="allcarBoth"><div class="cartype2 zongCartype">危险品车挂<span>({{jiaobiao.hangDangerCount}})</span></div><div class="downJian" id="downJian3" @click="lookMoreCarAll(3)"></div><div class="clearBoth"></div></div>
          <div id="mescroll3" class="mescrollFirst">
            <ul id="dataList3" class="data-list">
            </ul>
          </div>
        </li>
        <li class="boxshowNo">
          <div class="allcarBoth"><div class="cartype4 zongCartype">集装箱车挂<span>({{jiaobiao.hangContainerCount}})</span></div><div class="downJian" id="downJian4" @click="lookMoreCarAll(4)"></div><div class="clearBoth"></div></div>
          <div id="mescroll4" class="mescrollFirst">
            <ul id="dataList4" class="data-list">
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div id="filterBox" v-if="show" @click="filterBoxBlackFalse($event)">
      <div id="filter">
        <div style="position: absolute;top:0;bottom:1.2rem;width:100%;height: auto;overflow: scroll;">
          <div class="table">
            <p>运输状态</p>
            <ul>
              <li v-for="(item,index) in tranState" :class="[item.choose?'filterColor':'',index%3==1?'margin':'']" @click="choosefilter(1,index)">{{item.displayName}}</li>
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
        tranState:[],
        tranType:[],
        search:{
          tranState:"",
          tranType:"",
          carType:""
        },
        carSure:[],
        carSureTuo:[],
        carNumber:[],
        mescroll:"",
        mescroll1:"",
        listType:"",
        pageSize:"",
        pageNum:"",
        orderPk:"",
        totle:0,
        show:false,
        pdType:0,
        title:"",
        maxHeight:"",
        jiaobiao:"",
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
        var carsure = sessionStorage.getItem("carsure");
        if(carsure != null){
          _this.carSureTuo = JSON.parse(carsure);
          sessionStorage.removeItem("carsure");
        }
        if(_this.$route.query.memo != null){
          _this.carSure.push(JSON.parse(_this.$route.query.memo));
          sessionStorage.setItem("carsureListS",_this.$route.query.memo);
        }
        _this.orderPk = sessionStorage.getItem("dispatchPK") == undefined ? "" :sessionStorage.getItem("dispatchPK");
        var GUALABELTOP = sessionStorage.getItem("GUALABELTOP");
        if(GUALABELTOP != undefined){
          GUALABELTOP = JSON.parse(GUALABELTOP);
          _this.search.tranState = GUALABELTOP.sarech;
          if(GUALABELTOP.type == 0){
            if(GUALABELTOP.number != ""){
              _this.lookMoreCarAll(GUALABELTOP.number);
            }
          }
          sessionStorage.removeItem("GUALABELTOP");
        }
        _this.jiaobiaoAjax();
        $("#search").find("h5").text("筛选");//筛选
        $("#search").unbind("click").click(function () {
            _this.show = true;
            if(_this.tranState.length == 0){
              $.ajax({
                type: "GET",
                url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
                data:{str:"car_status",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
                dataType: "json",
                timeout: 10000,
                success: function (getSysConfigList) {
                  for(var i = 0;i<getSysConfigList.length;i++){
                    if(getSysConfigList[i].value.indexOf(_this.search.tranState) != -1 && _this.search.tranState!=""){
                      getSysConfigList[i].choose = true;
                    }else{
                      getSysConfigList[i].choose = false;
                    }
                  }
                  _this.tranState = getSysConfigList;
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
        });
      },
      lookMoreCarAll:function (Zongtype) {
        var _this = this;
        Zongtype = Zongtype == undefined ? 0 : Zongtype;
        for(var i = 1 ; i < 5 ; i++){
          $("#mescroll" + i).css("height","auto");
          $("#mescroll" + i).html("<ul id='dataList" + i + "' class='data-list'></ul>");
          if( i != Zongtype){
            bomb.removeClass("downJian"+i,"logisticsImg");
            $("#mescroll" + i).html("");
          }
        }
        var numberZ = Zongtype == 2 ? 0 : Zongtype == 1 ? 1 : Zongtype == 3 ? 2 :3;
        var offsetTop = document.getElementsByClassName("boxshowNo")[numberZ].offsetTop;
        _this.maxHeight = ($(window).height())/($("html").css("fontSize").replace("px","")) - 4.2+ "rem";
        if(!bomb.hasClass("downJian"+Zongtype,"logisticsImg")){
          bomb.addClass("downJian"+Zongtype,"logisticsImg")
          $("#mescroll" + Zongtype).animate({height:_this.maxHeight},100);
          $("#Allcar").animate({scrollTop: offsetTop + "px"}, 500);
          $("#Allcar").css("overflow","hidden");
          _this.mescroll = "";
          var mescroll = new MeScroll("mescroll" + Zongtype, { //id固定"body"
            //上拉加载的配置项
            up: {
              callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
              noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
              clearEmptyId: "dataList"+ Zongtype, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
              page:{
                size:15
              },
              empty:{
                tip:"暂无车辆~",
              }
            },
            down: {
              offset: 2.1 * $("html").css("font-size").replace("px", "")
            }
          });
          _this.mescroll = mescroll ;
          function getListData(page){
            //联网加载数据
            getListDataFromNet(_this.pdType, page.num, page.size, function(curPageData){
              mescroll.endSuccess(curPageData.length);
              setListData(curPageData, page.num, page.size,_this.pdType);
            }, function(){
              mescroll.endErr();
            });
          }
          function setListData(curPageData, num, size,typeNumber){
            var listDom=document.getElementById("dataList" + Zongtype);
            var nnnn = 0;
            for (var i = 0; i < curPageData.length; i++) {
              var pd=curPageData[i];
              var type = pd.now == 0 ? '审核中' :pd.now == 2 ? '已驳回' : pd.now == 3 ? '已禁用' : (pd.type == 1 ? '使用中': pd.type == 2 ?  '在途中' : pd.type == 3 ? '维修中' : pd.type == 4 ? '保养中' : '空闲中');
              var types = '<span class="nowtype">'+type+'</span>';
              var display = $("#search").find("h5").text() == "取消" ? "block":"none";
              var length = pd.length == "" ? "" : pd.length+ "米" ;
              var minheight = pd.zongweight == "0" ? "0.5rem" : "auto";
              var display2 = pd.zongweight == "0" ? "none" : "inline";
              var paddingBottom =  pd.zongweight == "0" ? "0rem" : "0.12rem";
              var img = _this.orderPk ==""  && (pd.now == '0' || pd.now == '1' || pd.now == '2')?"<div class='clearImg' style='display: "+display+"'></div><div class='reaseImg' style='display: "+display+"'></div>":_this.orderPk =="" && pd.carType == '0' && pd.now == '3'  ? "<div class='clearImg' style='right:0.6rem;display: " + display + "'></div>" : "";
              var display3 = "none";
              for(var a = 0 ; a < _this.carSureTuo.length ; a ++){
                if(_this.carSureTuo[a].pkcar == pd.pkCar){
                  display3 = "block";
                }
              }
              var img2 = _this.orderPk != "" ?"<div class='checkImg' style='display: "+display3+"'></div>":"";
              var str = "";
              str += '<div class="top" data-sWeight="'+ androidIos.numSub(pd.zongweight ,pd.nowweight)+'" data-userNow="'+pd.userNow+'" data-driverLicense="'+pd.driverLicense+'" data-pkCar="'+pd.pkCar+'" data-carType="'+pd.carType+'">'+
                '<h1 style="width:80%;margin-top: 0.2rem;margin-bottom: 0.1rem;"><span class="carnumber">'+pd.carNumber+'</span><span class="cartype" style="margin-right: 0;">'+pd.sportType+'</span><span class="carModel">/'+pd.carModel+'</span><span  class="transtype">'+pd.transType+'</span><span class="carlength">' + length + '</span></h1>'+types+'<div class="clearBoth"></div>'+
                '<p style="min-height: ' + minheight + ';" class="weight"><span style="font-size: 0.34rem;display: ' + display2+ '">满载：<span style="font-size: 0.34rem;">'+pd.zongweight+'</span>吨&nbsp;&nbsp;已承载：'+pd.nowweight+'吨</span></p>'+
                img + img2 +
                '<div class="clearBoth"></div></div>';
              var liDom=document.createElement("li");
              liDom.classList.add("liDom");
              liDom.dataset.nowtype = pd.now;
              liDom.innerHTML=str;
              listDom.appendChild(liDom);
              $("#carHanger #dataList" + Zongtype + " li .top").unbind('click').click(function (e) {
                var that = $(this);
                if($("#search").find("h5").text() != "取消"){
                  var nowType = that.find(".nowtype").text();
                  var pkcar = that.attr("data-pkCar");
                  var cartype = that.attr("data-carType");
                  var carModel = that.find(".cartype").text();
                  var sWeight = that.attr("data-sweight");
                  var carPKlistGo = sessionStorage.getItem("carPKlistGo") == undefined ? "" : sessionStorage.getItem("carPKlistGo");
                  if(_this.orderPk != ""){
                    if(carPKlistGo.indexOf(pkcar) == -1){
                      if(nowType.indexOf("使用") != -1 || nowType.indexOf("维") != -1 || nowType.indexOf("保") != -1){
                        bomb.first( "该车挂正在" + nowType + ",请选择其它车挂");
                        return false;
                      }
                      if(sWeight - sessionStorage.getItem("weh") < 0 ){
                        bomb.first( "该车辆剩余载重量不足，请选择其它车辆");
                        return false;
                      }
                    }
                    _this.carSure.push({
                      pkcar:pkcar,
                      carModel:carModel ,
                      cartype:cartype,
                    });
                    sessionStorage.setItem("GUALABELTOP",JSON.stringify({number:Zongtype,type:0,sarech:_this.search.tranState}))
                    _this.carSureGo();
                  }
                }
              })
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
                  pk:_this.carSureTuo.length == 0 ? "" :_this.carSureTuo[1].pkcar,
                  type:0,
                  page:pageNum,
                  size:pageSize,
                  status:_this.search.tranState,
                  transType:Zongtype,
                  carType: "41efd612fc2e4067a1debc30a1c36383",
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source"),
                  checkStatus:_this.orderPk == "" ? "" : 2,
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 30000,
                success: function (getCarList) {
                  if(getCarList.success == "1"){
                    if(_this.orderPk == ""){
                      $("#search").find("h5").text("编辑");
                    }else if(_this.orderPk != ""){
                      $("#search").find("h5").text("筛选");//筛选
                    }
                    _this.listType = pdType;
                    _this.pageNum = pageNum;
                    _this.pageSize = pageSize;
                    _this.totle = getCarList.total;
                    for(var i =0; i< getCarList.list.length;i++){
                      var tt = getCarList.list[i];
                      var json = {
                        logo:tt.driverDto.driverImg,
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
                        zongweight:tt.loadWeight*1 / 1000,
                        nowweight:tt.weight*1 / 1000,
                        type:tt.carStatus,
                        carType:pdType,
                        transType:tt.transType,
                        now:tt.checkStatus == '1' ? 0 : tt.checkStatus == '3' ? 2 :  tt.checkStatus == '4' ? 3 : 1 ,
                        userNow:tt.pkTransType == null ? "整车运输" : tt.pkTransType
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
        }else{
          bomb.removeClass("downJian"+Zongtype,"logisticsImg");
          _this.mescroll = "";
          $("#mescroll" + Zongtype).html("");
          $("#Allcar").css("overflow","scroll");
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
        _this.$router.push({ path: '/car',query:{title: carModel,pkCar:pkcar,carType:cartype,nowCartype:0}});
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
          for(var i = 0 ;i < _this.tranState.length;i ++){
            _this.tranState[i].choose = false;
          }
         for(var i = 0 ;i < _this.tranType.length;i ++){
           _this.tranType[i].choose = false;
         }
        for(var i = 0 ;i < _this.carType.length;i ++){
          _this.carType[i].choose = false;
        }
      },
      okFilter:function () {
        var _this = this;
        var tranState=[],tranType=[],carType=[];
        for(var i = 0 ;i < _this.tranState.length;i ++){
          if(_this.tranState[i].choose){
            tranState.push( _this.tranState[i].value)
          }
        }
        for(var i = 0 ;i < _this.carType.length;i ++){
          if(_this.carType[i].choose){
            carType.push( _this.carType[i].value)
          }
        }
        for(var i = 0 ;i < _this.tranType.length;i ++){
          if(_this.tranType[i].choose){
            tranType.push( _this.tranType[i].value)
          }
        }
        _this.search.tranState = tranState.join(",");
        _this.search.tranType = tranType.join(",");
        _this.search.carType = carType.join(",");
        _this.show = false;
        if(_this.mescroll != ""){
          _this.mescroll.resetUpScroll();
        }
        _this.jiaobiaoAjax();
      },
      jiaobiaoAjax:function () {
        var _this = this;
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/carrier/carTypeStatistics",
          data:JSON.stringify({
            status:_this.search.tranState,
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source"),
            type:_this.orderPk == "" ? 0 : 1,//0 所有 1 已审核
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (carTypeStatistics) {
            if(carTypeStatistics.success == "1"){
              _this.jiaobiao = {
                carHeadCount: carTypeStatistics.carHeadCount,
                carHangCount:carTypeStatistics.carHangCount,
                coldChainCount: carTypeStatistics.coldChainCount,
                containerCount: carTypeStatistics.containerCount,
                dangerCount: carTypeStatistics.dangerCount,
                generalGoodsCount: carTypeStatistics.generalGoodsCount,
                zhengCount : carTypeStatistics.coldChainCount*1 + carTypeStatistics.containerCount*1 + carTypeStatistics.dangerCount*1 + carTypeStatistics.generalGoodsCount*1,
                hangColdChainCount:  carTypeStatistics.hangColdChainCount,
                hangContainerCount: carTypeStatistics.hangContainerCount,
                hangDangerCount: carTypeStatistics.hangDangerCount,
                hangGeneralGoodsCount: carTypeStatistics.hangGeneralGoodsCount,
              };
            }else{
              androidIos.second(carTypeStatistics.message);
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
      },
    }
  }
</script>

<style>
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #carHanger #Allcar {
    position: fixed;
    top: 1.3rem;
    bottom: 0;
    height: auto;
    width: 100%;
    margin-top: 0.5rem;
    overflow: scroll;
  }
  #carHanger ul li .zongCartype span {
    font-size: 0.375rem;
    line-height: 0.7rem;
  }
  #carHanger #Allcar .allcarBoth{
    width: 95%;
    margin-left: 5%;
    padding-bottom: 0.15rem;
    position: relative;
  }
  #carHanger .mescrollFirst{
    overflow-x: hidden;
    overflow-y: scroll;
  }
  #carHanger .boxshowNo{
    box-shadow: none;
  }
  #carHanger ul li .zongCartype{
    padding-left: 1.2rem;
    height: 1.7rem;
    margin-top: 0.2rem;
    background-position: 0 50%;
    background-repeat: no-repeat;
    background-size: 0.8rem 0.8rem;
    font-size: 0.4rem;
    line-height: 1.7rem;
    float: left;
  }
  #carHanger li .logisticsImg{
    -webkit-transform:scaleY(-1);
    transform:scaleY(-1);
  }
  #carHanger ul li .cartype1{
    background-image: url("../../images/cartype1.png");
  }
  #carHanger ul li .cartype2{
    background-image: url("../../images/cartype2.png");
  }
  #carHanger ul li .cartype3{
    background-image: url("../../images/cartype3.png");
  }
  #carHanger ul li .cartype4{
    background-image: url("../../images/cartype4.png");
  }
  #carHanger ul li .downJian{
    width: 0.5rem;
    margin-top: 0.22rem;
    float: right;
    padding: 1.35rem 0.1rem 0.35rem 1.3rem;
    background-position: 60% 50%;
    background-repeat: no-repeat;
    background-size: 0.5rem;
    background-image: url("../../images/downJian.png");
  }
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
  #carHanger ul{
    width:100%;
  }
  #carHanger  ul li{
    width: 94%;
    background: white;
    /* margin-bottom: 0.2rem; */
    margin: 0 auto 0.3rem auto;
    border-radius: 0.2rem;
    box-shadow: 0 5px 10px rgba(0,0,0,0.06);
  }
  #carHanger li .top{
    width:95%;
    margin-left: 5%;
    padding-bottom: 0.15rem;
    position: relative;
  }
  #carHanger li .top .carnumber{
    font-size: 0.4rem;
    margin-right:0.2rem;
    color:#333;
  }
  #carHanger li .top .cartype{
    font-size: 0.34rem;
    margin-right:0.2rem;
    color:#999999;
  }
  #carHanger li .top .carlength,#carHanger li .top .carModel,#carHanger li .top .transtype{
    font-size: 0.34rem;
    margin-right:0.2rem;
    color:#999999;
  }
  #carHanger li .top .weight{
    font-size: 0.34rem;
    margin-right:0.2rem;
    color:#999999;
  }
  #carHanger li .top .nowtype{
    position: absolute;
    right: 0;
    top:0;
    font-size: 0.4rem;
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


