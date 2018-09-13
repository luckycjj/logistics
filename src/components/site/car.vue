<template>
  <div id="car">
    <div id="title" v-title data-title="车辆信息"></div>
    <div class="nav" v-if="orderPk == ''">
      <p class="active" i="0" @click="navClick(0)">整车</p>
      <p i="1" @click="navClick(1)">车头</p>
      <p i="2" @click="navClick(2)">车挂</p>
      <div class="clearBoth"></div>
    </div>
    <div class="nav" v-if="orderPk != ''">
      <p class="active" style="width:50%;" i="0" @click="navClick(0)">整车</p>
      <p i="1" style="width:50%;" @click="navClick(1)">车头</p>
      <div class="clearBoth"></div>
    </div>
    <div id="mescroll" class="mescroll" style="display: none;" :style="{ bottom : orderPk == '' ? '1.2rem' : '0' }">
      <ul id="dataList0" class="data-list">
      </ul>
    </div>
    <div id="Allcar" style="display: none;">
        <ul>
          <li>
            <div class="allcarBoth"><div class="cartype1 zongCartype">普货车辆</div><div class="downJian" id="downJian2" @click="lookMoreCarAll(2)"></div><div class="clearBoth"></div></div>
            <div id="mescroll2" class="mescrollFirst">
              <ul id="dataList2" class="data-list data-listFirst">
              </ul>
            </div>
          </li>
          <li>
            <div class="allcarBoth"><div class="cartype3 zongCartype">冷链车辆</div><div class="downJian" id="downJian1" @click="lookMoreCarAll(1)"></div><div class="clearBoth"></div></div>
            <div id="mescroll1" class="mescrollFirst">
              <ul id="dataList1" class="data-list data-listFirst">
              </ul>
            </div>
          </li>
          <li>
            <div class="allcarBoth"><div class="cartype2 zongCartype">危险品车辆</div><div class="downJian" id="downJian3" @click="lookMoreCarAll(3)"></div><div class="clearBoth"></div></div>
            <div id="mescroll3" class="mescrollFirst">
              <ul id="dataList3" class="data-list data-listFirst">
              </ul>
            </div>
          </li>
          <li>
            <div class="allcarBoth"><div class="cartype4 zongCartype">集装箱车辆</div><div class="downJian" id="downJian4" @click="lookMoreCarAll(4)"></div><div class="clearBoth"></div></div>
            <div id="mescroll4" class="mescrollFirst">
              <ul id="dataList4" class="data-list data-listFirst">
              </ul>
            </div>
          </li>
        </ul>
    </div>
    <button id="newCar" @click="newCar()" v-show="orderPk == ''">新增车辆</button>
    <button id="yesGo" v-show="carSure.length > 1 && orderPk != ''" @click="carSureGo()">确定</button>
    <div id="filterBox" v-if="show" @click="filterBoxBlackFalse($event)">
      <div id="filter">
        <div style="position: absolute;top:0;bottom:1.2rem;width:100%;height: auto;overflow: scroll;">
          <!--<div class="table">
            <p>运输状态</p>
            <ul>
              <li v-for="(item,index) in carType" :class="[item.choose?'filterColor':'',index%3==1?'margin':'']" @click="choosefilter(3,index)">{{item.displayName}}</li>
              <div class="clearBoth"></div>
            </ul>
          </div>-->
          <div class="table">
            <p>运输状态</p>
            <ul>
              <li v-for="(item,index) in tranState" :class="[item.choose?'filterColor':'',index%3==1?'margin':'']" @click="choosefilter(1,index)">{{item.displayName}}</li>
              <div class="clearBoth"></div>
            </ul>
          </div>
          <!--<div class="table">
            <p>运输类型</p>
            <ul>
              <li v-for="(item,index) in tranType" :class="[item.choose?'filterColor':'',index%3==1?'margin':'']" @click="choosefilter(2,index)">{{item.displayName}}</li>
              <div class="clearBoth"></div>
            </ul>
          </div>-->
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
    name: "car",
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
        mescroll:"",
        mescroll1:"",
        listType:"",
        pageSize:"",
        pageNum:"",
        orderPk:"",
        totle:0,
        show:false,
        pdType:0,
        maxHeight:"",
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
    mounted:function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods:{
      go:function(){
        var _this = this;
        sessionStorage.removeItem("changeCarpeople");
        sessionStorage.removeItem("changeCarFupeople");
        var carsure = sessionStorage.getItem("carsureListS");
        if(carsure != null){
          _this.carSureTuo.push(JSON.parse(carsure));
          sessionStorage.removeItem("carsureListS");
        }
        var carsures = sessionStorage.getItem("carsure");
        if(carsures != null){
          _this.carSureTuo = JSON.parse(carsures);
          sessionStorage.removeItem("carsure");
        }
        _this.orderPk = sessionStorage.getItem("dispatchPK") == undefined ? "" :sessionStorage.getItem("dispatchPK");
        if(_this.orderPk == ""){
          $("#Allcar").hide();
          $("#mescroll").show();
          $("#search").find("h5").text("编辑");
        }else{
          $("#Allcar").show();
          $("#mescroll").hide();
          $("#search").find("h5").text("筛选");//筛选
        }
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
        function setListData(curPageData, num, size,typeNumber){
          var listDom=document.getElementById("dataList0");
          var nnnn = 0;
          for (var i = 0; i < curPageData.length; i++) {
            var pd=curPageData[i];
            var type =_this.orderPk =="" ? ( pd.now == 0 ? '审核中' :pd.now == 2 ? '已驳回' : pd.now == 3 ? '已禁用': '已审核'):( pd.now == 0 ? '审核中' :pd.now == 2 ? '已驳回' : pd.now == 3 ? '已禁用' : (pd.type == 1 ? '使用中': pd.type == 2 ?  '在途中' : pd.type == 3 ? '维修中' : pd.type == 4 ? '保养中' : '空闲中'));
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
            var str = '<div class="top" data-driverLicense="'+pd.driverLicense+'" data-pkCar="'+pd.pkCar+'" data-carType="'+pd.carType+'">'+
                '<h1 style="width:80%;margin-top: 0.2rem;margin-bottom: 0.1rem;"><span class="carnumber">'+pd.carNumber+'</span><span class="cartype">'+pd.sportType+'</span><span  class="transtype">'+pd.transType+'</span><span class="carlength">' + length + '</span><span class="carModel">'+pd.carModel+'</span></h1>'+types+'<div class="clearBoth"></div>'+
                '<p style="min-height: ' + minheight + ';" class="weight"><span style="font-size: 0.3125rem;display: ' + display2+ '">满载：<span style="font-size: 0.3125rem;">'+pd.zongweight+'</span>吨&nbsp;&nbsp;已承载：'+pd.nowweight+'吨</span></p>'+
                img + img2 +
                '<div class="clearBoth"></div></div>';
            var liDom=document.createElement("li");
            liDom.classList.add("liDom");
            liDom.dataset.nowtype = pd.now;
            liDom.innerHTML=str;
            listDom.appendChild(liDom);
            $("#car #dataList0 li .top").unbind('click').click(function (e) {
              var that = $(this);
              if($("#search").find("h5").text() != "取消"){
                var nowType = that.find(".nowtype").text();
                var carNumber = that.find(".carnumber").text();
                var pkcar = that.attr("data-pkCar");
                var cartype = that.attr("data-carType");
                var carModel = that.find(".cartype").text();
                if(_this.orderPk != ""){
                 /* if(nowType != "空闲中"){
                    bomb.first( that.find(".carnumber").text() + "正在" + nowType + "无法派车");
                    return false;
                  }*/
                  if(carModel == "整车"){
                    androidIos.addPageList();
                    _this.$router.push({ path: '/car',query:{title: carModel,pkCar:pkcar,carType:cartype}});
                  }else{
                     var json = {
                         pkcar:pkcar,
                         carModel:carModel ,
                         cartype:cartype,
                         carNumber:carNumber
                      };
                      androidIos.addPageList();
                      _this.$router.push({ path: '/site/carHanger',query:{memo:JSON.stringify(json)}});
                  }
                }else{
                  if(that.parents("li").attr("data-nowtype") == '0'){
                    bomb.first( that.find(".carnumber").text() + "正在审核");
                    return false;
                  }
                  if(that.parents("li").attr("data-nowtype") == '2'){
                    bomb.first( that.find(".carnumber").text() + "已被驳回，请修改信息");
                    return false;
                  }
                  if(that.parents("li").attr("data-nowtype") == '3'){
                    bomb.first( that.find(".carnumber").text() + "已被禁用，请修改信息");
                    return false;
                  }
                }
              }
            })
            $("#search").unbind("click").click(function () {
              if($(this).find("h5").text() == "筛选"){
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
                        getSysConfigList[i].choose = false;
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
                if(_this.tranType.length == 0){
                  $.ajax({
                    type: "GET",
                    url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
                    data:{str:"trans_type",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
                    dataType: "json",
                    timeout: 10000,
                    success: function (getSysConfigList) {
                      for(var i = 0;i<getSysConfigList.length;i++){
                        getSysConfigList[i].choose = false;
                        if(getSysConfigList[i].value == _this.search.tranType){
                          getSysConfigList[i].choose = true;
                        }
                      }
                      _this.tranType = getSysConfigList;
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
                    type:0,
                    page:_this.pageNum*_this.pageSize,
                    size:1,
                    status:_this.search.tranState,
                    transType:_this.search.tranType,
                    carType: _this.listType == "0" ? "5de1912471af4c2d839a27f268cd8ca7" :_this.orderPk == "" && _this.listType == "2" ? "41efd612fc2e4067a1debc30a1c36383": _this.listType == "1" ? "2ba6da2fd9cd4689965afe5abc8f9df4":"",
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
                          zongweight:tt.loadWeight*1,
                          nowweight:tt.weight*1,
                          type:tt.carStatus,
                          carType:pdType,
                          transType:tt.transType,
                          now:tt.checkStatus == '1' ? 0 :tt.checkStatus == '3' ? 2 : tt.checkStatus == '4' ? 3 : 1 ,
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
        }
        function getListDataFromNet(pdType,pageNum,pageSize,successCallback,errorCallback) {
          //延时一秒,模拟联网
          setTimeout(function () {
            var listData=[];
            if(!(_this.orderPk != '' && pdType == 0)){
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp()+"/carrier/getCarList",
                data:JSON.stringify({
                  type:0,
                  page:pageNum,
                  size:pageSize,
                  status:_this.search.tranState,
                  transType:_this.search.tranType,
                  carType: pdType == "0" ? "5de1912471af4c2d839a27f268cd8ca7" :_this.orderPk == "" && pdType == "2" ? "41efd612fc2e4067a1debc30a1c36383": pdType == "1" ? "2ba6da2fd9cd4689965afe5abc8f9df4":"",
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source"),
                  checkStatus:_this.orderPk == "" ? "" : 2,
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 30000,
                success: function (getCarList) {
                  if(getCarList.success == "1"){
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
                        zongweight:tt.loadWeight*1,
                        nowweight:tt.weight*1,
                        type:tt.carStatus,
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
            }

          },500)
        }
      },
      lookMoreCarAll:function (Zongtype) {
        var _this = this;
        _this.maxHeight = ($(window).height() - $("#dataList4").offset().top)/($("html").css("fontSize").replace("px","")) - 0.5 + "rem";
        for(var i = 1 ; i < 5 ; i++){
          $("#mescroll" + i).css("maxHeight","none");
          $("#mescroll" + i).html("<ul id='dataList" + i + "' class='data-list'></ul>");
          if( i != Zongtype){
            bomb.removeClass("downJian"+i,"logisticsImg");
          }
        }
        if(!bomb.hasClass("downJian"+Zongtype,"logisticsImg")){
          bomb.addClass("downJian"+Zongtype,"logisticsImg");
          $("#mescroll" + Zongtype).css("maxHeight",_this.maxHeight);
          _this.mescroll1 = "";
          var mescroll = new MeScroll("mescroll" + Zongtype, { //id固定"body"
            //上拉加载的配置项
            up: {
              callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
              noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
              clearEmptyId: "dataList"+ Zongtype, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
              page:{
                size:8
              },
              empty:{
                tip:"暂无车辆~",
              }
            },
            down: {
              offset: 2.1 * $("html").css("font-size").replace("px", "")
            }
          });

          _this.mescroll1 = mescroll;
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
              var type =_this.orderPk =="" ? ( pd.now == 0 ? '审核中' :pd.now == 2 ? '已驳回' : pd.now == 3 ? '已禁用': '已审核'):( pd.now == 0 ? '审核中' :pd.now == 2 ? '已驳回' : pd.now == 3 ? '已禁用' : (pd.type == 1 ? '使用中': pd.type == 2 ?  '在途中' : pd.type == 3 ? '维修中' : pd.type == 4 ? '保养中' : '空闲中'));
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
              str += '<div class="top" data-driverLicense="'+pd.driverLicense+'" data-pkCar="'+pd.pkCar+'" data-carType="'+pd.carType+'">'+
                '<h1 style="width:80%;margin-top: 0.2rem;margin-bottom: 0.1rem;"><span class="carnumber">'+pd.carNumber+'</span><span class="cartype">'+pd.sportType+'</span><span  class="transtype">'+pd.transType+'</span><span class="carlength">' + length + '</span><span class="carModel">'+pd.carModel+'</span></h1>'+types+'<div class="clearBoth"></div>'+
                '<p style="min-height: ' + minheight + ';" class="weight"><span style="font-size: 0.3125rem;display: ' + display2+ '">满载：<span style="font-size: 0.3125rem;">'+pd.zongweight+'</span>吨&nbsp;&nbsp;已承载：'+pd.nowweight+'吨</span></p>'+
                img + img2 +
                '<div class="clearBoth"></div></div>';
              var liDom=document.createElement("li");
              liDom.style.border = "1px solid #949494";
              liDom.style.boxShadow = "none";
              liDom.classList.add("liDom");
              liDom.dataset.nowtype = pd.now;
              liDom.innerHTML=str;
              listDom.appendChild(liDom);
              $("#car #dataList" + Zongtype + " li .top").unbind('click').click(function (e) {
                var that = $(this);
                if($("#search").find("h5").text() != "取消"){
                  var nowType = that.find(".nowtype").text();
                  var carNumber = that.find(".carnumber").text();
                  var pkcar = that.attr("data-pkCar");
                  var cartype = that.attr("data-carType");
                  var carModel = that.find(".cartype").text();
                  if(_this.orderPk != ""){
                    /* if(nowType != "空闲中"){
                       bomb.first( that.find(".carnumber").text() + "正在" + nowType + "无法派车");
                       return false;
                     }*/
                    if(carModel == "整车"){
                      androidIos.addPageList();
                      _this.$router.push({ path: '/car',query:{title: carModel,pkCar:pkcar,carType:cartype}});
                    }else{
                      var json = {
                        pkcar:pkcar,
                        carModel:carModel ,
                        cartype:cartype,
                        carNumber:carNumber
                      };
                      androidIos.addPageList();
                      _this.$router.push({ path: '/site/carHanger',query:{memo:JSON.stringify(json)}});
                    }
                  }else{
                    if(that.parents("li").attr("data-nowtype") == '0'){
                      bomb.first( that.find(".carnumber").text() + "正在审核");
                      return false;
                    }
                    if(that.parents("li").attr("data-nowtype") == '2'){
                      bomb.first( that.find(".carnumber").text() + "已被驳回，请修改信息");
                      return false;
                    }
                    if(that.parents("li").attr("data-nowtype") == '3'){
                      bomb.first( that.find(".carnumber").text() + "已被禁用，请修改信息");
                      return false;
                    }
                  }
                }
              })
              $("#search").unbind("click").click(function () {
                if($(this).find("h5").text() == "筛选"){
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
                          getSysConfigList[i].choose = false;
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
                  if(_this.tranType.length == 0){
                    $.ajax({
                      type: "GET",
                      url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
                      data:{str:"trans_type",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
                      dataType: "json",
                      timeout: 10000,
                      success: function (getSysConfigList) {
                        for(var i = 0;i<getSysConfigList.length;i++){
                          getSysConfigList[i].choose = false;
                          if(getSysConfigList[i].value == _this.search.tranType){
                            getSysConfigList[i].choose = true;
                          }
                        }
                        _this.tranType = getSysConfigList;
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
                  transType:Zongtype,
                  carType: pdType == "0" ? "5de1912471af4c2d839a27f268cd8ca7" :_this.orderPk == "" && pdType == "2" ? "41efd612fc2e4067a1debc30a1c36383": pdType == "1" ? "2ba6da2fd9cd4689965afe5abc8f9df4":"",
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source"),
                  checkStatus:_this.orderPk == "" ? "" : 2,
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 30000,
                success: function (getCarList) {
                  if(getCarList.success == "1"){
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
                        zongweight:tt.loadWeight*1,
                        nowweight:tt.weight*1,
                        type:tt.carStatus,
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
        }else{
          bomb.removeClass("downJian"+Zongtype,"logisticsImg");
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
            if(_this.orderPk != '' && number == 0){
              $("#Allcar").show();
              $("#mescroll").hide();
            }else{
              $("#Allcar").hide();
              $("#mescroll").show();
              for(var i = 1 ; i < 5 ; i++){
                $("#mescroll" + i).html("<ul id='dataList" + i + "' class='data-list'></ul>");
                bomb.removeClass("downJian"+i,"logisticsImg");
              }
              _this.mescroll.resetUpScroll();
            }
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
        if(_this.orderPk != "" && _this.pdType == "0"){
          _this.mescroll1.resetUpScroll();
        }else{
          _this.mescroll.resetUpScroll();
        }

      }
    }
  }
</script>

<style>
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #car #Allcar{
    position: fixed;
    top: 2.21875rem;
    bottom:0;
    height: auto;
    width:100%;
    margin-top: 0.5rem;
  }
  #car #Allcar .allcarBoth{
    width: 95%;
    margin-left: 5%;
    padding-bottom: 0.15rem;
    position: relative;
  }
  #car .nav{
    width:100%;
  }
  #car .nav p{
    float: left;
    width: 33.333333%;
    background: white;
    line-height: 1rem;
    text-align: center;
    font-size: 0.4rem;
    color:#333;
  }
  #car .nav .active{
    border-bottom: 1px solid #3399FF;
    color: #3399FF;
  }
  #car .clearImg{
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
  #car .reaseImg{
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
  #car .checkImg{
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
  #car ul li .zongCartype{
    padding-left: 1.2rem;
    height: 0.7rem;
    margin-top: 0.2rem;
    background-position: 0 50%;
    background-repeat: no-repeat;
    background-size: 0.861rem 0.7rem ;
    font-size: 0.375rem;
    line-height: 0.7rem;
    float: left;
  }
  /*#car ul li  .carMessageMore{
    display: none;
  }*/
  #car ul li .cartype1{
    background-image: url("../../images/cartype1.png");
  }
  #car ul li .cartype2{
    background-image: url("../../images/cartype2.png");
  }
  #car ul li .cartype3{
    background-image: url("../../images/cartype3.png");
  }
  #car ul li .cartype4{
    background-image: url("../../images/cartype4.png");
  }
  #car ul li .downJian{
     width:0.5rem;
    margin-top: 0.2rem;
     float: right;
     padding:0.35rem 0.3rem 0.35rem 0.3rem;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 0.5rem ;
    background-image: url("../../images/downJian.png");
  }
  #car #mescroll{
    margin-top: 0.5rem;
  }
  #car ul{
    width:100%;
  }
  #car ul li{
    width: 94%;
    background: white;
    /* margin-bottom: 0.2rem; */
    margin: 0 auto 0.3rem auto;
    border-radius: 0.2rem;
    box-shadow: 0 5px 10px #cecbcb;
    overflow: hidden;
    position: relative;
  }
  #car li .top{
    width:95%;
    margin-left: 5%;
    padding-bottom: 0.15rem;
    position: relative;
  }
  #car li .top .carnumber{
    font-size: 0.4rem;
    margin-right:0.2rem;
    color:#333;
  }
  #car li .top .cartype{
    font-size: 0.3125rem;
    margin-right:0.2rem;
    color:#999999;
  }
  #car li .logisticsImg{
    -webkit-transform:scaleY(-1);
    transform:scaleY(-1);
  }
  #car li .top .carlength,#car li .top .carModel,#car li .top .transtype{
    font-size: 0.3125rem;
    margin-right:0.2rem;
    color:#999999;
  }
  #car li .top .weight{
    font-size: 0.3125rem;
    margin-right:0.2rem;
    color:#999999;
  }
  #car li .top .nowtype{
    position: absolute;
    right: 0;
    font-size: 0.4rem;
    margin-right: 5%;
    color:#333;
    top:0;
  }
  #car li .bottom{
    position: relative;
    width:90%;
    margin-left: 5%;
    padding-bottom: 0.15rem;
    border-top: 1px solid #dbdbdb;
  }
  #car .firstBox{
    float: left;
    margin:0.25rem 5% 0.25rem 0;
    width:1rem;height:1rem;overflow: hidden;border-radius: 50%;line-height: 1rem
  }
  #car .firstBox img{
    width:100%;
    display: inline-block;
    vertical-align: middle;
  }
  #car .secondBox{
    width:40%;
    float: left;
    margin-top: 0.25rem;
  }
  #car .mescrollFirst{
    overflow-x: hidden;
    overflow-y: scroll;
  }
  #car .thirdBox{
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
  #car .secondBox p{
    font-size: 0.35rem;
    color:#333;
  }
  #car .secondBox p span{
    font-size: 0.3125rem;
    color:#333;
  }
  #car .secondBox h1{
    font-size: 0.3125rem;
    color:#999;
  }
  #car  .secondBox h2, #car secondBox span{
    font-size: 0.3125rem;
    color:#999;
    line-height: 0.5rem;
  }
  #car .secondBox h2 span{
    margin-left: 0.2rem;
  }
  #car .mescroll{
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


