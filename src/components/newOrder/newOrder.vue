<template>
    <div id="newOrder">
      <div id="title" v-if="newordertrantype == '0'" v-title data-title="发布全部货源"></div>
      <div id="title" v-if="newordertrantype == '1'" v-title data-title="发布冷链池货源"></div>
      <div id="title" v-if="newordertrantype == '2'" v-title data-title="发布普货池货源"></div>
      <div id="title" v-if="newordertrantype == '3'" v-title data-title="发布危险品池货源"></div>
      <div id="title" v-if="newordertrantype == '4'" v-title data-title="发布集装箱池货源"></div>
      <div id="peopleAddress">
          <div id="histroyAddress" @click="histroyAddress()"  v-if="pk==''&& both.histroyAddressLength">
            常用路线
          </div>
          <div class="right">
            <div class="message  pickmessage">
              <p>发货方信息</p>
              <h1 v-html="both.startAddress.people==''?'提货人姓名、联系电话、提货城市、详细地址':both.startAddress.people + ' ' + both.startAddress.tel + ' ' + both.startAddress.city + ' ' + both.startAddress.address" :class="both.startAddress.people==''?'':'blackColor'" @click="goStartAddress()"></h1>
            </div>
            <div class="borderBottom"></div>
            <div class="message arrmessage">
              <p>收货方信息</p>
              <h1 v-html="both.endAddress.people==''?'收货人姓名、联系电话、提货城市、详细地址':both.endAddress.people + ' ' + both.endAddress.tel + ' ' + both.endAddress.city + ' ' + both.endAddress.address" :class="both.endAddress.people==''?'':'blackColor'" @click="goEndAddress()"></h1>
            </div>
          </div>
        <div class="clearBoth"></div>
      </div>
      <div id="time" class="label">
        <div class="lablebox">
          <span>提货时间</span>
          <input type="text" style="width:21%;" name="USER_AGE" id="USER_AGE" readonly class="input" placeholder="请选择时分" v-model="both.timeBeforeF"/>
          <input type="text" style="width:28%;" name="USER_AGE" id="USER_AGES" readonly class="input" placeholder="请选择年月日" v-model="both.timeBeforeS"/>
          <div class="clearBoth"></div>
        </div>
        <div class="lablebox borderno">
          <span>收货时间</span>
          <input type="text" style="width:21%;" name="USER_AGES" id="USER_AGET" readonly class="input" placeholder="请选择时分" v-model="both.timeAfterF"/>
          <input type="text" style="width:28%;" name="USER_AGES" id="USER_AGEFo" readonly class="input" placeholder="请选择年月日" v-model="both.timeAfterS"/>
          <div class="clearBoth"></div>
        </div>
      </div>
      <div  v-for="(item,index) in both.productList" :id="'goods'+index" class="goodsLabel">
        <div class="labelTitle" v-if="both.productList.length>1">
          <p v-html="item.goodsType==''?'货物：暂无':'货物：'+item.goodsType">货物{{index+1}}</p>
          <h6 @click="removeList(index)" v-if="pk==''">删除</h6>
          <div class="clearBoth"></div>
        </div>
        <div class="label" :class="both.productList.length>1?'labelTop':''">
          <div class="lablebox goodsTypeLabel borderno">
            <span class="required">货物类别</span>
            <p v-html="item.goodsType==''?'请选择货物类型':item.goodsType" :class="item.goodsType==''?'':'blackColor'" @click="goodsType(index)" :datatype="item.goodstypenumber"></p>
            <div class="clearBoth"></div>
          </div>
          <div class="lablebox borderno" style="border-top: 1px solid #dadada!important;">
            <span class="required">货物重量</span>
            <div class="unit" :id="'Z00'+index">{{item.unitWight}}</div>
            <input type="text" placeholder="请输入货物重量" maxlength="10" v-model="item.wight" @keyup="weightKeyup()"/>
            <div class="clearBoth"></div>
          </div>
          <div class="lablebox borderno" style="border-top: 1px solid #dadada!important;" v-if="item.protype == 1 || item.protype == 2">
            <span class="required">货物体积</span>
            <div class="unit" :id="'Z01'+index">{{item.unitWeight}}</div>
            <input type="text" placeholder="请输入货物体积" maxlength="10" v-model="item.weight" @keyup="volumeKeyup()"/>
            <div class="clearBoth"></div>
          </div>
        </div>
      </div>
      <div id="add"  v-if="pk==''">
         <p @click="addList()">增加</p>
         <img src="../../images/add.png" @click="addList()">
        <div class="clearBoth"></div>
      </div>
      <div  v-if="pk==''" id="insurance" class="label" style="margin-top: 0;">
        <div class="lablebox" v-if="both.carTypeLook">
          <span class="required">车辆车型</span>
          <p v-html="both.tranType==''?'请选择车辆车型':both.tranType" :class="both.tranType==''?'':'blackColor'" @click="tranType()"></p>
          <div class="clearBoth"></div>
        </div>
        <div class="lablebox borderno">
          <span>承运商／司机</span>
          <p v-html="both.appoint==''?'请选择指定承运商或司机':both.appoint" :class="both.appoint==''?'':'blackColor'" @click="appoint()"></p>
          <div class="clearBoth"></div>
        </div>
        <!--<div class="lablebox borderno">
          <span>保险</span>
          <p v-html="both.insurance==''?'请选择保险':both.insurance" :class="both.insurance==''?'':'blackColor'" @click="insurance()"></p>
          <div class="clearBoth"></div>
        </div>-->
      </div>
      <div  v-if="pk==''" id="payment" class="label">
        <div class="lablebox imgno">
          <span>付款方</span>
          <div id="pay">
             <label>发货方<div class="clearBoth"></div></label>
            <div class="clearBoth"></div>
          </div>
          <div class="clearBoth"></div>
        </div>
        <div class="lablebox borderno">
          <span>备注</span>
          <p v-html="both.remark==''?'请填写备注,例如:自卸,走高速':both.remark" :class="both.remark==''?'':'blackColor'" @click="remark()"></p>
          <div class="clearBoth"></div>
        </div>
      </div>
      <div v-if="pk==''" id="price" class="label">
        <div class="lablebox borderno imgno">
          <span class="required">价格</span>
          <input type="text" placeholder="请输入价格" maxlength="20" v-model="price" @keyup="asdfgh()"/>
          <div class="clearBoth"></div>
        </div>
      </div>
      <div v-if="pk==''" id="read"  style="margin: 0 auto; width: 94%;background: transparent;height: 1.4rem;line-height: 1.4rem;">
        <div class=" borderno">
          <label><div class="circleBox" @click="readChoose()"><div class="circletrue" v-if="both.read"></div></div><span style="font-size: 0.35rem;color:#999999;">已阅读</span><span @click="needKnow()"  style="font-size: 0.35rem;color:#999999;">《发货须知》</span><span @click="calculatorGo()" style="font-size: 0.35rem; color:#999;float: right;"> 计算器</span><div class="clearBoth"></div></label>
        </div>
      </div>
      <button id="submit" class="gogogo" @click="submitGo()">提交</button>
      <div id="vehicleBox" v-if="vehicleBox">
           <div id="vehicle">
             <img src="../../images/closed.png" @click="vehicleBoxClosed()">
             <p>选择车辆车型</p>
             <div class="vehicleBox">
               <div class="vehicle" v-if="both.carList.length > 0">
                 <h6>用车类型</h6>
                 <ul>
                   <li v-for="(item,index) in both.carList" :class="item.choose ? 'chooseTrue' : ''" @click="carListS(index,1)">{{item.displayName}}</li>
                   <li @click="lookMore(1)" class="cartypelookMore" v-if="both.carListMore">全部</li>
                   <div class="clearBoth"></div>
                 </ul>
               </div>
               <div class="vehicle" v-if="both.carWidthList.length > 0">
                 <h6>车长<span>（米，可多选）</span></h6>
                 <ul>
                   <li v-for="(item,index) in both.carWidthList" v-if="item.look" :class="item.choose ? 'chooseTrue' : ''" @click="carListS(index,2)">{{item.displayName}}</li>
                   <li @click="lookMore(2)" class="cartypelookMore" v-if="both.carWidthListMore">全部</li>
                   <div class="clearBoth"></div>
                   <div class="cartypeOther" v-if="!both.carWidthListMore"><span>其它车长：</span><input v-model="both.cartypeOther" placeholder="点击输入"/>米</div>
                 </ul>
               </div>
               <div class="vehicle" v-if="both.carTypeList.length > 0">
                 <h6>车型<span>（可多选）</span></h6>
                 <ul>
                   <li v-for="(item,index) in both.carTypeList" v-if="item.look"  :class="item.choose ? 'chooseTrue' : ''" @click="carListS(index,3)">{{item.displayName}}</li>
                   <li @click="lookMore(3)" class="cartypelookMore" v-if="both.carTypeListMore">全部</li>
                   <div class="clearBoth"></div>
                 </ul>
               </div>
             </div>
             <button @click="carListSure()">确定</button>
           </div>
      </div>
      <div id="newOrderMessageBox" v-if="newOrderMessageBox">
          <div id="newOrderMessage">
            <p>请确认订单信息</p>
            <div class="message_address">
              <h6>起点</h6><h5>{{both.startAddress.city}}</h5>
              <div class="clearBoth"></div>
              <h6>卸点</h6><h5>{{both.endAddress.city}}</h5>
              <div class="clearBoth"></div>
            </div>
            <div class="message_product" v-for="(item,index) in both.productList">
              <h6>货物</h6><h5>{{item.goodsType}}</h5><div class="clearBoth"></div>
              <h6>规格</h6><h5>{{item.number * 1}}件<span v-if="item.wight * 1 >0">/{{item.wight * 1}}{{item.unitWight}}</span><span v-if="item.weight * 1 >0">/{{item.weight * 1}}{{item.unitWeight}}</span></h5>
              <div class="clearBoth"></div>
            </div>
            <div class="message_price">
              <h6>金额</h6><h5>¥{{price*1}}</h5>
              <div class="clearBoth"></div>
            </div>
            <div class="message_button">
              <button @click="messageButtonNo()">取消</button>
              <div class='message_shuxian'></div>
              <button class="message_buttonYes"  @click="messageButtonYes()">确定</button>
              <div class="clearBoth"></div>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
   import {androidIos} from "../../js/app";
   import {bomb} from "../../js/zujian";
   import "../../js/mobiscroll_date"
   import  "../../js/mobiscroll";
   import bridge from "../../js/bridge";
   import Debounce from '../../js/Debounce.js'
   export default {
        name: "newOrder",
       data(){
          return{
            both:{
              histroyAddressLength:false,
              startAddress:{
                people:"",
                tel:"",
                city:"",
                address:"",
                company:"",
                pk:"",
              },
              endAddress:{
                people:"",
                tel:"",
                city:"",
                address:"",
                company:"",
                pk:"",
              },
              timeBeforeF:"",
              timeBeforeS:"",
              timeAfterF:"",
              timeAfterS:"",
              productList:[{
                pkInvPackB:"",
                goodsType:"",
                protype:2,
                goodstypenumber:"",
                number:1,
                wight:"",
                unitWight:"吨",
                wightTen:"1",
                weight:"",
                unitWeight:"立方米",
                weightTen:"1",
                tranpk:"",
              }],
              tranType:"",
              tranTypeValue:"",
              appoint:"",
              pk_carrier:"",
              driver_name:"",
              insurance:"",
              remark:"",
              pay:0,
              read:true,
              scrollTop:0,
              initialWeight:0,
              price:"",
              carList:[],
              carListSure:"",
              carListSureValue:"",
              carWidthList:[],
              carWidthListSure:"",
              carWidthListSureValue:"",
              cartypeOther:"",
              cartypeOtherSure:"",
              carTypeList:[],
              carTypeListSure:"",
              carTypeListSureValue:"",
              carListMore:false,
              carWidthListMore:false,
              carTypeListMore:false,
              carTypeLook:true,
            },
            pk:"",
            price:"",
            price123:false,
            newOrderMessageBox:false,
            vehicleBox:false,
            newordertrantype:"",
            suremend: new Debounce(this.ajaxPost, 1000)
          }
       },
     watch:{
       both:{
         handler:function(val,oldval){
            var _this = this;
            _this.$nextTick(function () {
              var self = _this.both;
              var weightBoth = 0;
              for(var i = 0;i<self.productList.length;i++){
                if(self.productList[i].number!=""){
                  self.productList[i].number=(self.productList[i].number.toString().match(/\d+(\.\d{0,0})?/)||[''])[0]*1;
                }
                if(self.productList[i].wight!=""){
                  if(self.productList[i].wightTen<1){
                    self.productList[i].wight=(self.productList[i].wight.toString().match(/\d+(\.\d{0,3})?/)||[''])[0];
                  }else{
                    self.productList[i].wight=(self.productList[i].wight.toString().match(/\d+(\.\d{0,3})?/)||[''])[0];
                  }
                  weightBoth = weightBoth + self.productList[i].wight * self.productList[i].wightTen;
                }
                if(self.productList[i].weight!=""){
                  if(self.productList[i].weightTen<1){
                    self.productList[i].weight=(self.productList[i].weight.toString().match(/\d+(\.\d{0,3})?/)||[''])[0];
                  }else{
                    self.productList[i].weight=(self.productList[i].weight.toString().match(/\d+(\.\d{0,3})?/)||[''])[0];
                  }
                }
              }
              if( weightBoth > 30){
                self.carTypeLook = false;
              }else{
                self.carTypeLook = true;
              }
              _this.price=(_this.price.toString().match(/\d+(\.\d{0,2})?/)||[''])[0];
              _this.both.cartypeOther = (_this.both.cartypeOther.toString().match(/\d+(\.\d{0,1})?/)||[''])[0];
              if(_this.pk == ""){
                if(self.startAddress.people!=""&&self.timeBeforeF!=""&&self.timeBeforeS!=""&&self.timeAfterF!=""&&self.timeAfterS!=""&&self.endAddress.people!=""&&self.read&&((self.tranType != ""&& weightBoth <= 30) || weightBoth > 30)){
                  for(var i = 0;i<self.productList.length;i++) {
                    if(_this.price!=""){
                      if (self.productList[i].goodsType == "" || ((self.productList[i].protype == 2 || self.productList[i].protype == 1) && (self.productList[i].wight*1 == "0" || self.productList[i].weight*1 == "0" ) ) || (self.productList[i].protype == 0 && self.productList[i].wight*1 == "0" && self.productList[i].weight*1 == "0") ) {
                        bomb.removeClass("submit", "submit");
                        break;
                      } else {
                        bomb.addClass("submit", "submit");
                      }
                    }else{
                      bomb.removeClass("submit", "submit");
                      break;
                    }
                  }
                  _this.suremend();
                }else{
                  bomb.removeClass("submit","submit");
                }
              }else{
                if(self.startAddress.people!=""&&self.timeBeforeF!=""&&self.timeBeforeS!=""&&self.timeAfterF!=""&&self.timeAfterS!=""&&self.endAddress.people!="" ){
                  for(var i = 0;i<self.productList.length;i++) {
                    if (self.productList[i].goodsType == "" || ((self.productList[i].protype == 2 || self.productList[i].protype == 1) && (self.productList[i].wight*1 == "0" || self.productList[i].weight*1 == "0" ) ) || (self.productList[i].protype == 0 && self.productList[i].wight*1 == "0" && self.productList[i].weight*1 == "0")) {
                      bomb.removeClass("submit", "submit");
                      break;
                    } else {
                      bomb.addClass("submit", "submit");
                    }
                  }
                }else{
                  bomb.removeClass("submit","submit");
                }
              }
            })
         },
         deep:true
       }
     },
     beforeMount:function () {
       var _this = this;
       if(_this.$route.query.newordertrantype != undefined){
         _this.newordertrantype = _this.$route.query.newordertrantype;
         sessionStorage.setItem("NEWORDERTRANTYPE",_this.$route.query.newordertrantype)
       }else{
         _this.newordertrantype = 0;
         sessionStorage.setItem("NEWORDERTRANTYPE",0)
       }
     },
      mounted:function(){
          var _this = this;
          androidIos.bridge(_this);
      },
      methods:{
          asdfgh:function(){
            var _this = this;
            var self = _this.both;
            if(_this.price!= ""){
              self.price = _this.price;
            }
            if(_this.pk == ""){
              var weightBoth = 0;
              for(var i = 0;i<self.productList.length;i++) {
                weightBoth =  weightBoth + self.productList[i].wight * self.productList[i].wightTen;
              }
              if(self.startAddress.people!=""&&self.timeBeforeF!=""&&self.timeBeforeS!=""&&self.timeAfterF!=""&&self.timeAfterS!=""&&self.endAddress.people!=""&&self.read&&((self.tranType != ""&& weightBoth <= 30) || weightBoth > 30) ){
                for(var i = 0;i<self.productList.length;i++) {
                  if(_this.price!=""){
                    if (self.productList[i].goodsType == "" || ((self.productList[i].protype == 2 || self.productList[i].protype == 1) && (self.productList[i].wight*1 == "0" || self.productList[i].weight*1 == "0" ) ) || (self.productList[i].protype == 0 && self.productList[i].wight*1 == "0" && self.productList[i].weight*1 == "0") ) {
                      bomb.removeClass("submit", "submit");
                      break;
                    } else {
                      bomb.addClass("submit", "submit");
                    }
                  }else{
                    bomb.removeClass("submit", "submit");
                    break;
                  }
                }
              }else{
                bomb.removeClass("submit","submit");
              }
            }else {
              if (self.startAddress.people != "" && self.timeBeforeF != "" && self.timeBeforeS != "" && self.timeAfterF != "" && self.timeAfterS != "" && self.endAddress.people != "") {
                for (var i = 0; i < self.productList.length; i++) {
                  if (self.productList[i].goodsType == "" || ((self.productList[i].protype == 2 || self.productList[i].protype == 1) && (self.productList[i].wight*1 == "0" || self.productList[i].weight*1 == "0" ) ) || (self.productList[i].protype == 0 && self.productList[i].wight*1 == "0" && self.productList[i].weight*1 == "0")) {
                    bomb.removeClass("submit", "submit");
                    break;
                  } else {
                    bomb.addClass("submit", "submit");
                  }
                }
              } else {
                bomb.removeClass("submit", "submit");
              }
            }
          },
          go:function(){
            var _this = this;
            var ajax1 =   $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp()+"/settings/getTransType",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 30000,
                success: function (getSysConfigList) {
                  if(getSysConfigList.length > 2){
                    _this.both.carListMore = true
                  }
                  for(var i = 0; i < getSysConfigList.length;i++){
                    getSysConfigList[i].choose = false;
                    getSysConfigList[i].look = false;
                    if(i < 2){
                      getSysConfigList[i].look = true;
                    }
                  }
                  _this.both.carList = getSysConfigList;
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                  if(status=='timeout'){//超时,status还有success,error等值的情况
                    androidIos.second("网络请求超时");
                  }else if(status=='error'){
                    androidIos.errorwife();
                  }
                }
              })
            var ajax2 =   $.ajax({
                type: "GET",
                url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
                data:{str:"car_type",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
                dataType: "json",
                timeout: 10000,
                success: function (getSysConfigList) {
                  if(getSysConfigList.length > 3){
                    _this.both.carTypeListMore = true
                  }
                  for(var i = 0; i < getSysConfigList.length;i++){
                    getSysConfigList[i].choose = false;
                    getSysConfigList[i].look = false;
                    if(i < 3){
                      getSysConfigList[i].look = true;
                    }
                  }
                  _this.both.carTypeList = getSysConfigList;
                },
                complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                  if(status=='timeout'){//超时,status还有success,error等值的情况
                    androidIos.second("网络请求超时");
                  }else if(status=='error'){
                    androidIos.errorwife();
                  }
                }
              })
            var ajax3 =  $.ajax({
              type: "GET",
              url: androidIos.ajaxHttp()+"/settings/getSysConfigList",
              data:{str:"car_length",userCode:sessionStorage.getItem("token"),source:sessionStorage.getItem("source")},
              dataType: "json",
              timeout: 10000,
              success: function (getSysConfigList) {
                if(getSysConfigList.length > 5){
                  _this.both.carWidthListMore = true;
                }
                for(var i = 0; i < getSysConfigList.length;i++){
                  getSysConfigList[i].choose = false;
                  getSysConfigList[i].look = false;
                  if(i < 5){
                    getSysConfigList[i].look = true;
                  }
                }
                _this.both.carWidthList = getSysConfigList;
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                }else if(status=='error'){
                  androidIos.errorwife();
                }
              }
            })
            Promise.all([ajax1, ajax2, ajax3]).then(function(values) {
              var newTimeCjj = new Date();
              var yearCjj = newTimeCjj.getFullYear();
              var monthCjj = newTimeCjj.getMonth()+1;
              var dateCjj = newTimeCjj.getDate();
              var hourCjj = newTimeCjj.getHours();
              var minCjj = newTimeCjj.getMinutes();
              var secCjj = newTimeCjj.getSeconds();
              var dateCjjS = dateCjj+1;
              var hourCjjS = hourCjj+1;
              var newDateCjj = new Date(yearCjj+"/"+monthCjj+"/"+dateCjj+" "+hourCjjS+":"+minCjj+":"+secCjj);
              var newDataCjj = new Date((new Date()).getTime()+24*60*60*1000);
              _this.both.timeBeforeS = _this.ten(newDateCjj.getFullYear())+"-"+ _this.ten((newDateCjj.getMonth()+1))+"-"+_this.ten(newDateCjj.getDate());
              _this.both.timeBeforeF = _this.ten(newDateCjj.getHours())+":"+_this.ten(newDateCjj.getMinutes())+":"+_this.ten(newDateCjj.getSeconds());
              _this.both.timeAfterS = _this.ten(newDataCjj.getFullYear())+"-"+ _this.ten((newDataCjj.getMonth()+1))+"-"+_this.ten(newDataCjj.getDate());
              _this.both.timeAfterF = "08:00:00";
              var newOrder = sessionStorage.getItem("newOrder");
              var histroyAddress = sessionStorage.getItem("histroyAddress");
              var startAddress = sessionStorage.getItem("startAddress");
              var endAddress = sessionStorage.getItem("endAddress");
              var goodsType =  sessionStorage.getItem("goodsType");
              var appoint = sessionStorage.getItem("appoint");
              var insurance =   sessionStorage.getItem("insurance");
              var remark = sessionStorage.getItem("remark");
              var pk = _this.$route.query.pk;
              _this.pk = pk ==undefined || _this.$route.query.type == undefined || _this.$route.query.type == "2" || _this.$route.query.type == "3"?"":pk;
              if(pk != undefined && newOrder == undefined){
                $.ajax({
                  type: "POST",
                  url: androidIos.ajaxHttp()+"/order/invoiceDetail",
                  data:JSON.stringify({pk:pk,source:sessionStorage.getItem("source"),userCode:sessionStorage.getItem("token")}),
                  contentType: "application/json;charset=utf-8",
                  dataType: "json",
                  async:false,
                  timeout: 10000,
                  success: function (invoiceDetail) {
                    var list=[];
                    for(var i =0;i<invoiceDetail.invPackDao.length;i++){
                      _this.both.initialWeight = _this.both.initialWeight*1 + invoiceDetail.invPackDao[i].weight/1000*1;
                      var listJson = {
                        tranpk:invoiceDetail.category,
                        pkInvPackB:invoiceDetail.invPackDao[i].pkInvPackB,
                        goodsType:invoiceDetail.invPackDao[i].goodsName+"-"+invoiceDetail.invPackDao[i].goodsTypeName,
                        goodstypenumber:invoiceDetail.invPackDao[i].goodsCode+"-"+invoiceDetail.invPackDao[i].goodsType,
                        number:invoiceDetail.invPackDao[i].num,
                        unitWight:"吨",
                        wight:invoiceDetail.invPackDao[i].weight/1000,
                        wightTen:"1",
                        unitWeight:"立方米",
                        weight:invoiceDetail.invPackDao[i].volume*1,
                        weightTen:"1",
                        protype:invoiceDetail.invPackDao[i].weight*1 != 0 && invoiceDetail.invPackDao[i].volume*1 == 0 ? 0 :invoiceDetail.invPackDao[i].weight*1 == 0 && invoiceDetail.invPackDao[i].volume*1 != 0 ? 1 : 2,
                      }
                      list.push(listJson);
                    }
                    var transTypeName = invoiceDetail.transType != "" ? invoiceDetail.transType + "," : "";
                    var carLengthName = invoiceDetail.carLength != "" ? invoiceDetail.carLength + "," : "";
                    var carModelName = invoiceDetail.carModel != "" ? invoiceDetail.carModel + "," : "";
                    var lengthOther = "";
                    if(_this.konwList(invoiceDetail.carLength.split(",")) != undefined){
                      lengthOther= _this.konwList(invoiceDetail.carLength.split(",")).yes;
                    }
                    var lengthOtherYes = "";
                    if(lengthOther != ""){
                      invoiceDetail.carLength = _this.konwList(invoiceDetail.carLength.split(",")).list.join(",");
                      lengthOtherYes = lengthOther;
                    }else{
                        for(var i = 0 ; i <invoiceDetail.carLength.split(",").length; i++ ){
                           var num = 0;
                           for(var x = 0; x<_this.both.carWidthList.length ;x ++){
                              if(invoiceDetail.carLength.split(",")[i] == _this.both.carWidthList[x].value){
                                 break;
                              }
                              num ++ ;
                           }
                           if(num == _this.both.carWidthList.length){
                             lengthOtherYes = invoiceDetail.carLength.split(",")[i];
                             var listcarlength = invoiceDetail.carLength.split(",");
                             listcarlength.splice(i,1);
                              invoiceDetail.carLength = listcarlength.join(",");
                           }
                        }
                    }
                    if(lengthOtherYes != ""){
                      _this.both.carWidthListMore = false;
                      for(var i = 0; i < _this.both.carWidthList.length;i++){
                        _this.both.carWidthList[i].look = true;
                      }
                    }
                    var pdlist = {
                      startAddress:{
                        people:invoiceDetail.delivery.contact,
                        tel:invoiceDetail.delivery.mobile,
                        city:invoiceDetail.delivery.province+"-"+invoiceDetail.delivery.city+"-"+invoiceDetail.delivery.area,
                        address:invoiceDetail.delivery.detailAddr,
                        company:invoiceDetail.delivery.addrName,
                        pk:invoiceDetail.delivery.pkAddress,
                      },
                      endAddress:{
                        people:invoiceDetail.arrival.contact,
                        tel:invoiceDetail.arrival.mobile,
                        city:invoiceDetail.arrival.province+"-"+invoiceDetail.arrival.city+"-"+invoiceDetail.arrival.area,
                        address:invoiceDetail.arrival.detailAddr,
                        company:invoiceDetail.arrival.addrName,
                        pk:invoiceDetail.arrival.pkAddress,
                      },
                      timeBeforeF:invoiceDetail.deliDate.split(" ")[1],
                      timeBeforeS:invoiceDetail.deliDate.split(" ")[0],
                      timeAfterF:invoiceDetail.arriDate.split(" ")[1],
                      timeAfterS:invoiceDetail.arriDate.split(" ")[0],
                      productList:list,
                      tranType:transTypeName + carLengthName + carModelName ,
                      trantypenumber:"",
                      appoint:invoiceDetail.carrierDto.carrierName,
                      pk_carrier:invoiceDetail.carrierDto.pkCarrier,
                      driver_name:"",
                      insurance:"",
                      remark:invoiceDetail.remark,
                      pay:0,
                      read:true,
                      scrollTop:0,
                      initialWeight:_this.both.initialWeight,
                      price:invoiceDetail.price,
                      carList:_this.both.carList,
                      carListSure:invoiceDetail.transType,
                      carListSureValue:invoiceDetail.transType =="整车运输" ? "5fda0edc8df34b4d8c1ed44a6f1f866e" : "e5e602a22c5a4689b8d151c76a4d1179",
                      carWidthList:_this.both.carWidthList,
                      carWidthListSure:invoiceDetail.carLength,
                      carWidthListSureValue:invoiceDetail.carLength,
                      cartypeOther:lengthOtherYes,
                      cartypeOtherSure:lengthOtherYes,
                      carTypeList:_this.both.carTypeList,
                      carTypeListSure:invoiceDetail.carModel,
                      carTypeListSureValue:invoiceDetail.carModel,
                      carListMore:_this.both.carListMore,
                      carWidthListMore:_this.both.carWidthListMore,
                      carTypeListMore:_this.both.carTypeListMore,
                      carTypeLook:true,
                    }
                    _this.price = invoiceDetail.price*1;
                    _this.both = pdlist;
                    _this.$nextTick(function () {
                      if(_this.pk != ""){
                        $(".pickmessage h1,.arrmessage h1,#time .lablebox").addClass("imgno");
                        for(var i = 0 ; i<$(".goodsTypeLabel").length;i++){
                          $(".goodsTypeLabel").eq(i).addClass("imgno");
                        }
                      }
                    })
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
              if(histroyAddress!=undefined){
                histroyAddress = JSON.parse(histroyAddress);
                _this.both = histroyAddress;
                sessionStorage.removeItem("histroyAddress");
                sessionStorage.removeItem("newOrder");
              }
              if(newOrder!=undefined && histroyAddress == undefined){
                newOrder = JSON.parse(newOrder);
                _this.both = newOrder;
                _this.price = _this.both.price;
                _this.$nextTick(function () {
                  $("#newOrderBox").animate({scrollTop: _this.both.scrollTop}, 0);
                })
                sessionStorage.removeItem("newOrder");
              }
              if(newOrder==null && histroyAddress == null){
                $.ajax({
                  type: "POST",
                  url: androidIos.ajaxHttp()+"/address/getAddres",
                  data:JSON.stringify({
                    page:1,
                    size:1,
                    keyword:"",
                    pk:"",
                    userCode:sessionStorage.getItem("token"),
                    source:sessionStorage.getItem("source"),
                    type:1
                  }),
                  contentType: "application/json;charset=utf-8",
                  dataType: "json",
                  timeout: 10000,
                  success: function (getAddres) {
                    if(getAddres.success=="1"){
                      _this.both.startAddress = {
                        people:getAddres.list[0].contact,
                        tel:getAddres.list[0].mobile,
                        city:getAddres.list[0].province+"-"+getAddres.list[0].city+"-"+getAddres.list[0].area,
                        address:getAddres.list[0].detailAddr,
                        company:getAddres.list[0].addrName,
                        pk:getAddres.list[0].pkAddress,
                      }
                    }else{
                      androidIos.second(getAddres.message);
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
              if(_this.pk == ""){
                if(!_this.both.histroyAddressLength){
                  var json = {
                    page:1,
                    size:1,
                    keyword:"",
                    userCode:sessionStorage.getItem("token"),
                    source:sessionStorage.getItem("source"),
                    type:sessionStorage.getItem("NEWORDERTRANTYPE") == '0' ? '' :sessionStorage.getItem("NEWORDERTRANTYPE"),
                  }
                  $.ajax({
                    type: "POST",
                    url: androidIos.ajaxHttp()+"/order/getHistoryOrder",
                    data:JSON.stringify(json),
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    timeout: 10000,
                    success: function (getHistoryOrder) {
                      if(getHistoryOrder.success="1"){
                        if(getHistoryOrder.total-1>0){
                          _this.both.histroyAddressLength = true;
                        }
                      }else{
                        androidIos.second(getHistoryOrder.message)
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
              }
              if(startAddress!=undefined){
                startAddress = JSON.parse(startAddress);
                _this.both.startAddress.people = startAddress.name;
                _this.both.startAddress.tel = startAddress.phone;
                _this.both.startAddress.city = startAddress.province + '-' + startAddress.city + '-'  + startAddress.area;
                _this.both.startAddress.address = startAddress.address;
                _this.both.startAddress.company = startAddress.company;
                _this.both.startAddress.pk =  startAddress.pk;
                _this.price = "";
                _this.both.price = "";
                sessionStorage.removeItem("startAddress");
              }
              if(endAddress!=undefined){
                endAddress = JSON.parse(endAddress);
                _this.both.endAddress.people = endAddress.name;
                _this.both.endAddress.tel = endAddress.phone;
                _this.both.endAddress.city = endAddress.province + '-' + endAddress.city + '-'  + endAddress.area;
                _this.both.endAddress.address = endAddress.address;
                _this.both.endAddress.company = endAddress.company;
                _this.both.endAddress.pk =  endAddress.pk;
                _this.price = "";
                _this.both.price = "";
                sessionStorage.removeItem("endAddress");
              }
              if(goodsType!=undefined){
                goodsType = JSON.parse(goodsType);
                _this.both.productList[goodsType.index].goodsType =goodsType.parentName + '-' +goodsType.name;
                _this.both.productList[goodsType.index].goodstypenumber =goodsType.parentcode + '-' +goodsType.code;
                _this.both.productList[goodsType.index].protype = goodsType.protype;
                _this.both.productList[goodsType.index].number = 1;
                _this.both.productList[goodsType.index].tranpk = goodsType.tranpk;
                _this.both.productList[goodsType.index].wight = "";
                _this.both.productList[goodsType.index].weight = "";
                _this.price = "";
                _this.both.price = "";
                sessionStorage.removeItem("goodsType");
              }
              if(appoint!=undefined){
                appoint = JSON.parse(appoint);
                _this.both.appoint =appoint.name;
                _this.both.pk_carrier = appoint.pk_carrier;
                _this.both.driver_name = appoint.driver_name;
                sessionStorage.removeItem("appoint");
              }
              if(insurance!=undefined){
                insurance = JSON.parse(insurance);
                _this.both.insurance =insurance.name+" ¥"+insurance.price+"/次";
                sessionStorage.removeItem("insurance");
              }
              if(remark!=undefined){
                _this.both.remark =remark;
                sessionStorage.removeItem("remark");
              }
              $(document).on('click','.lablebox input',function () {
                var $Val = $.trim($(this).val())
                $(this).val('').focus().val($Val)
              })
              if(_this.pk == ""){
                var currYear = (new Date()).getFullYear();
                var opt={};
                opt.date = {preset : 'date'};
                opt.datetime = {preset : 'datetime'};
                opt.time = {preset : 'time'};
                opt.default = {
                  theme: 'android-ics light', //皮肤样式
                  display: 'bottom', //显示方式
                  mode: 'scroller', //日期选择模式
                  dateFormat: 'yy-mm-dd',
                  timeFormat: 'HH:ii',
                  lang: 'zh',
                  showNow: true,
                  nowText: "今天",
                  startYear: currYear, //开始年份
                  endYear: currYear + 20 ,//结束年份
                  onSelect: function (valueText, inst) {//选择时事件（点击确定后），valueText 为选择的时间，
                    var dateF = "";
                    if(inst.settings["0"]==1){
                      dateF = new Date(inst.val.replace(/\-/g, "\/"));
                    }else if(inst.settings["0"]==2){
                      dateF = new Date($("#USER_AGES").val().replace(/\-/g, "\/")+" "+inst.val);
                    }else if(inst.settings["0"]==3){
                      dateF = new Date(inst.val.replace(/\-/g, "\/"));
                    }else if(inst.settings["0"]==4){
                      dateF = new Date($("#USER_AGEFo").val().replace(/\-/g, "\/")+" "+inst.val);
                    }
                    var dateS=""
                    if(inst.settings["0"]==1){
                      dateS = new Date(new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate());
                    }else if(inst.settings["0"]==2){
                      dateS = new Date(new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes());
                    }else if(inst.settings["0"]==3){
                      dateS = new Date($("#USER_AGES").val().replace(/\-/g, "\/"));
                    }else if(inst.settings["0"]==4){
                      dateS = new Date($("#USER_AGES").val().replace(/\-/g, "\/")+" "+$("#USER_AGE").val());
                    }
                    var dateT = "";
                    if(inst.settings["0"]==1){
                      dateT = new Date($("#USER_AGEFo").val().replace(/\-/g, "\/"));
                    }else if(inst.settings["0"]==2){
                      dateT = new Date($("#USER_AGEFo").val().replace(/\-/g, "\/")+" "+$("#USER_AGET").val());
                    }
                    if(dateF-dateS>=0){
                      if(inst.settings["0"]==1){
                        if(dateF-dateT>0){
                          $("#USER_AGEFo").val("");
                          $("#USER_AGET").val("");
                          _this.both.timeAfterF = $("#USER_AGET").val();
                          _this.both.timeAfterS = $("#USER_AGEFo").val();
                        }
                      }else if(inst.settings["0"]==2){
                        if(dateF-dateT>0){
                          $("#USER_AGEFo").val("");
                          $("#USER_AGET").val("");
                          _this.both.timeAfterF = $("#USER_AGET").val();
                          _this.both.timeAfterS = $("#USER_AGEFo").val();
                        }
                      }
                    }else{
                      if(inst.settings["0"]==1){
                        if(dateF - (new Date(new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate()+" "+"00:00:00")).getTime()<=0){
                          bomb.first("提货时间不能早于当前时间");
                          $("#USER_AGES").val("");
                          $("#USER_AGE").val("");
                          _this.both.timeBeforeF = $("#USER_AGE").val();
                          _this.both.timeBeforeS = $("#USER_AGES").val();
                          return false;
                        }
                      }
                      if(inst.settings["0"]==2){
                        if(dateF - new Date(new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate()+" "+new Date().getHours()+":"+new Date().getMinutes()).getTime()<=0){
                          bomb.first("提货时间不能早于当前时间");
                          $("#USER_AGE").val("");
                          _this.both.timeBeforeF = $("#USER_AGE").val();
                          return false;
                        }
                      }
                      if(inst.settings["0"]==3||inst.settings["0"]==4){
                        bomb.first("到货时间不能早于提货时间");
                        $("#USER_AGEFo").val("");
                        $("#USER_AGET").val("");
                        _this.both.timeAfterF = $("#USER_AGET").val();
                        _this.both.timeAfterS = $("#USER_AGEFo").val();
                        return false;
                      }
                      $("#USER_AGEFo").val("");
                      $("#USER_AGET").val("");
                      _this.both.timeAfterF = $("#USER_AGET").val();
                      _this.both.timeAfterS = $("#USER_AGEFo").val();
                    }
                    if(inst.settings["0"]==1){
                      _this.both.timeBeforeS =valueText;
                      _this.both.timeBeforeF  ="";
                    }else if(inst.settings["0"]==2){
                      _this.both.timeBeforeF = valueText+":00";
                    }else if(inst.settings["0"]==3){
                      _this.both.timeAfterS = valueText;
                      _this.both.timeAfterF  ="";
                    }else if(inst.settings["0"]==4){
                      _this.both.timeAfterF = valueText+":00";
                    }
                  }
                };
                $("#USER_AGEFo").mobiscroll($.extend(opt['date'], opt['default'],"3"));
                $("#USER_AGET").mobiscroll($.extend(opt['time'], opt['default'],"4"));
                $("#USER_AGE").mobiscroll($.extend(opt['time'], opt['default'],"2"));
                $("#USER_AGES").mobiscroll($.extend(opt['date'], opt['default'],"1"));
              }
              $("#USER_AGES,#USER_AGE,#USER_AGET,#USER_AGEFo").focus(function(){
                document.activeElement.blur();
              });
              _this.$nextTick(function () {
                for(var i = 0;i<_this.both.productList.length;i++){
                  var x = 0 , y = 0;
                  x = Math.floor(1 / _this.both.productList[i].wightTen / 1000);
                  y = Math.floor(1 / _this.both.productList[i].weightTen / 1000);
                  if(_this.both.productList[i].protype == 0 || _this.both.productList[i].protype == 1  || _this.both.productList[i].protype == 2){
                    var unitWight = new LArea();
                    unitWight.init({
                      'trigger': '#Z00'+i,
                      'valueTo': '#Z00'+i,
                      'keys': {
                        id: 'id',
                        name: 'name'
                      },
                      'type': 1,
                      'data':[{
                        "code":"1",
                        "region":"吨"
                      },{
                        "code":"0.001",
                        "region":"千克"
                      }]
                    });
                    unitWight.value = [x];
                    unitWight.addPointer = function (name) {
                      name = JSON.parse(name);
                      if(_this.both.productList[name.id.substr(4)*1].wight !=""){
                        _this.both.productList[name.id.substr(4)*1].wight = _this.both.productList[name.id.substr(4)*1].wight/(name.firstCode/_this.both.productList[name.id.substr(4)*1].wightTen);
                      }
                      _this.both.productList[name.id.substr(4)*1].wightTen = name.firstCode;
                      _this.both.productList[name.id.substr(4)*1].unitWight = name.firstVal;
                    }
                  }
                  if(_this.both.productList[i].protype == 1 || _this.both.productList[i].protype == 2) {
                    var unitWeight = new LArea();
                    unitWeight.init({
                      'trigger': '#Z01' + i,
                      'valueTo': '#Z01' + i,
                      'keys': {
                        id: 'id',
                        name: 'name'
                      },
                      'type': 1,
                      'data': [{
                        "code": "1",
                        "region": "立方米"
                      }, {
                        "code": "0.001",
                        "region": "升"
                      }]
                    });
                    unitWeight.value = [y];
                    unitWeight.addPointer = function (name) {
                      name = JSON.parse(name);
                      if (_this.both.productList[name.id.substr(4) * 1].weight != "") {
                        _this.both.productList[name.id.substr(4) * 1].weight = _this.both.productList[name.id.substr(4) * 1].weight / (name.firstCode / _this.both.productList[name.id.substr(4) * 1].weightTen);
                      }
                      _this.both.productList[name.id.substr(4) * 1].weightTen = name.firstCode;
                      _this.both.productList[name.id.substr(4) * 1].unitWeight = name.firstVal;
                    }
                  }
                }
      /*          if(_this.pk == "" && _this.$route.query.type == undefined){
                  bridge.invoke("guide","1");
                }*/
              })
            });
          },
        lookMore:function (type) {
            var _this = this.both;
           if(type == 1){
             for(var i = 0 ;i < _this.carList.length;i++){
               _this.carList[i].look = true;
             }
             _this.carListMore = false;
           }else if(type == 2){
             for(var i = 0 ;i < _this.carWidthList.length;i++){
               _this.carWidthList[i].look = true;
             }
             _this.carWidthListMore = false;
           }else if(type == 3){
             for(var i = 0 ;i < _this.carTypeList.length;i++){
               _this.carTypeList[i].look = true;
             }
             _this.carTypeListMore = false;
           }
        },
        konwList:function (list) {
          var ary = list;
          var nary=ary.sort();
          for(var i=0;i<nary.length;i++){
            if (nary[i]==nary[i+1]){
              nary.splice(i,1);
              return {
                list : nary,
                yes : nary[i]
              };
            }
          }
        },
        ajaxPost: function() {
          var _this = this;
          var self = _this.both;
          var weight =0;
          var volumn = 0;
          var weightList = [];
          for(var x = 0;x<_this.both.productList.length;x++){
            if( _this.both.productList[x].wight != ""){
              weightList.push( _this.both.productList[x].wight);
            }
            if(_this.both.productList[x].protype == 0 && _this.both.productList[x].wight*1 == 0){
              return false;
            }
            if(_this.both.productList[x].protype == 1 && (_this.both.productList[x].wight*1 == 0 || _this.both.productList[x].weight*1 == 0)){
              return false;
            }
            if(_this.both.productList[x].protype == 2 && (_this.both.productList[x].wight*1 == 0 || _this.both.productList[x].weight*1 == 0)){
              return false;
            }
            weight = weight*1 + _this.both.productList[x].wight * _this.both.productList[x].wightTen;
            volumn = volumn*1 + _this.both.productList[x].weight * _this.both.productList[x].weightTen;
          }
          if(_this.pk == ""){
            if(self.startAddress.people!=""&&self.timeBeforeF!=""&&self.timeBeforeS!=""&&self.timeAfterF!=""&&self.timeAfterS!=""&&self.endAddress.people!=""&&self.read &&((self.tranType != self.tranTypeValue && weight <= 30) ||  weight > 30)){
              if(( weight*1 > 0 || volumn*1 > 0) && _this.both.price == ""){
                var carListSureValueList = self.carListSureValue.split(",");
                var carListSureValue = "";
                for(var i = 0 ; i < carListSureValueList.length ;i ++){
                  if(carListSureValueList[i] == ""){
                    carListSureValueList.splice(i,1)
                  }
                }
                carListSureValue = carListSureValueList.join(",");
                var carWidthListSureValueList = (self.carWidthListSure + ","+ self.cartypeOtherSure).split(",");
                var carWidthListSureValue = "";
                for(var i = 0 ; i < carWidthListSureValueList.length ;i ++){
                  if(carWidthListSureValueList[i] == ""){
                    carWidthListSureValueList.splice(i,1)
                  }
                }
                carWidthListSureValue = carWidthListSureValueList.join(",");
                var listJson = carWidthListSureValue.split(",");
                var listJSonNow = [];
                for(var i = 0; i<listJson.length;i++){
                    if(listJson[i].indexOf("-") != -1){
                       listJSonNow.push({
                          value : i ,
                          displayName : listJson[i].split("-")[1]/2 + listJson[i].split("-")[0]/2
                       })
                    }else{
                      listJSonNow.push({
                        value : i ,
                        displayName : listJson[i]
                      })
                    }
                }
                listJSonNow.sort(function (a,b) {
                   return a.displayName - b.displayName
                })
                var newList = [];
                for(var i = 0 ;i < listJSonNow.length ;i++){
                  newList.push(listJson[listJSonNow[i].value])
                }
                carWidthListSureValue = newList.join(",");
                var json = {
                  startCity:_this.both.startAddress.city.split("-")[1].replace("市",""),
                  endCity:_this.both.endAddress.city.split("-")[1].replace("市",""),
                  carLength:weight <= 30 && carListSureValue == "5fda0edc8df34b4d8c1ed44a6f1f866e" ? carWidthListSureValue : "",
                  weight:weight,
                  volume:volumn,
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source")
                }
                $.ajax({
                  type: "POST",
                  url: androidIos.ajaxHttp()+"/order/checkPrice",
                  data:JSON.stringify(json),
                  contentType: "application/json;charset=utf-8",
                  dataType: "json",
                  timeout: 10000,
                  async:false,
                  success: function (checkPrice) {
                    if(checkPrice.success=="1"){
                      _this.price = checkPrice.message;
                      _this.both.price = _this.price;
                      _this.price123 = true;
                    }else if(checkPrice.success=="-1"){
                      androidIos.second(checkPrice.message)
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
            }
          }
          var self = _this.both;
          if(_this.pk == ""){
            if(self.startAddress.people!=""&&self.timeBeforeF!=""&&self.timeBeforeS!=""&&self.timeAfterF!=""&&self.timeAfterS!=""&&self.endAddress.people!=""&&self.read&&((self.tranType != ""&& weight <= 30) ||  weight > 30)){
              for(var i = 0;i<self.productList.length;i++) {
                if(_this.price!=""){
                  if (self.productList[i].goodsType == "") {
                    bomb.removeClass("submit", "submit");
                    break;
                  }else if(self.productList[i].protype == 0 && self.productList[i].wight*1 == "0"){
                    bomb.removeClass("submit", "submit");
                    break;
                  }else if(self.productList[i].protype == 1 && (self.productList[i].wight*1 == "0" || self.productList[i].weight*1 == "0")){
                    bomb.removeClass("submit", "submit");
                    break;
                  }else if(self.productList[i].protype == 2 && (self.productList[i].wight*1 == "0" || self.productList[i].weight*1 == "0")){
                    bomb.removeClass("submit", "submit");
                    break;
                  } else {
                    bomb.addClass("submit", "submit");
                  }
                }
              }
            }else{
              bomb.removeClass("submit","submit");
            }
          }else{
            if(self.startAddress.people!=""&&self.timeBeforeF!=""&&self.timeBeforeS!=""&&self.timeAfterF!=""&&self.timeAfterS!=""&&self.endAddress.people!="" ){
              for(var i = 0;i<self.productList.length;i++) {
                if (self.productList[i].goodsType == "") {
                  bomb.removeClass("submit", "submit");
                }else if(self.productList[i].protype == 0 && self.productList[i].wight*1 == "0"){
                  bomb.removeClass("submit", "submit");
                }else if(self.productList[i].protype == 1 && self.productList[i].weight*1 == "0"){
                  bomb.removeClass("submit", "submit");
                }else if(self.productList[i].protype == 2 && self.productList[i].wight*1 == "0" && self.productList[i].weight*1 == "0"){
                  bomb.removeClass("submit", "submit");
                } else {
                  bomb.addClass("submit", "submit");
                }
              }
            }else{
              bomb.removeClass("submit","submit");
            }
          }
        },
        carListS:function (index,type) {
          var _this = this.both;
          if(type == 1){
            var trueMen = _this.carList[index].choose;
            for(var i = 0 ;i < _this.carList.length;i++){
              _this.carList[i].choose = false;
            }
            if(!trueMen){
              _this.carList[index].choose = !_this.carList[index].choose;
            }
          }else if(type == 2){
            var x = 0;
            if(!_this.carWidthList[index].choose){
              for(var i = 0 ; i < _this.carWidthList.length;i++){
                if(_this.carWidthList[i].choose){
                  x++;
                }
              }
              if(x >= 5){
                bomb.first("车长最多选择5种");
                return false;
              }
            }
            _this.carWidthList[index].choose = !_this.carWidthList[index].choose;
          }else if(type == 3){
            var x = 0;
            if(!_this.carTypeList[index].choose){
              for(var i = 0 ; i < _this.carTypeList.length;i++){
                if(_this.carTypeList[i].choose){
                  x++;
                }
              }
              if(x >= 3){
                bomb.first("车型最多选择3种");
                return false;
              }
            }
            _this.carTypeList[index].choose = !_this.carTypeList[index].choose;
          }

        },
        weightKeyup:function(){
          var _this = this;
          _this.price = "";
          _this.both.price = "";
          _this.suremend();
        },
        volumeKeyup:function(){
          var _this = this;
          _this.price = "";
          _this.both.price = "";
          _this.suremend();
        },
        readChoose:function(){
          var _this = this;
          _this.both.read =  !_this.both.read;
        },
        goStartAddress:function () {
          var _this = this;
          if(_this.pk == ""){
            _this.both.price = _this.price;
            _this.both.scrollTop =  _this.getPageScroll();
            sessionStorage.setItem("newOrder",JSON.stringify(_this.both));
            androidIos.addPageList();
            sessionStorage.setItem("startAddressmessage",JSON.stringify(_this.both.startAddress));
            _this.$router.push({ path: '/newOrder/addressMessage',query:{"type":1}});
          }
        },
        histroyAddress:function(){
          var _this = this;
          _this.both.price = _this.price;
          _this.both.scrollTop =  _this.getPageScroll();
          sessionStorage.setItem("newOrder",JSON.stringify(_this.both));
          androidIos.addPageList();
          _this.$router.push({ path: '/newOrder/histroyAddress'});
        },
        goEndAddress:function () {
          var _this = this;
          if(_this.pk == ""){
            _this.both.price = _this.price;
            _this.both.scrollTop =  _this.getPageScroll();
            sessionStorage.setItem("newOrder",JSON.stringify(_this.both));
            androidIos.addPageList();
            sessionStorage.setItem("endAddressmessage",JSON.stringify(_this.both.endAddress));
            _this.$router.push({ path: '/newOrder/addressMessage',query:{"type":3}});
          }
        },
        tranType:function () {
          var _this = this;
          _this.vehicleBox = true;
          _this.both.tranTypeValue = _this.both.tranType;
          if(_this.both.carList.length > 0 && _this.both.carWidthList.length > 0 && _this.both.carTypeList.length > 0){
            var list1 = _this.both.carListSure.split(",");
            var list2 = _this.both.carWidthListSure.split(",");
            var list3 = _this.both.carTypeListSure.split(",");
            var len1 = list1.length;
            var len2 = list2.length;
            var len3 = list3.length;
            _this.both.cartypeOther = _this.both.cartypeOtherSure;
            for(var z =0 ;z < 3;z++){
              var child = z == 0 ? list1 : z==1 ? list2 :list3 ;
              var forChild = z == 0 ? _this.both.carList : z == 1 ? _this.both.carWidthList : _this.both.carTypeList;
              for(var i = 0 ; i < child.length ; i++){
                for(var x = 0 ; x <forChild.length ; x++){
                  if(child[i] == forChild[x].displayName){
                    forChild[x].choose = true;
                  }
                }
              }
            }
          }

        },
        vehicleBoxClosed:function () {
          var _this = this;
          _this.vehicleBox = false;
          _this.both.tranTypeValue = _this.both.tranType;
          for(var i = 0;i < _this.both.carList.length;i++){
            _this.both.carList[i].choose = false;
          }
          for(var i = 0;i < _this.both.carWidthList.length;i++){
            _this.both.carWidthList[i].choose = false;
          }
          for(var i = 0;i < _this.both.carTypeList.length;i++){
            _this.both.carTypeList[i].choose = false;
          }
          _this.both.cartypeOther = "";
        },
        carListSure:function () {
            var self = this.both;
            var x = [],y =[],z = [];
            for(var i = 0; i < self.carList.length ; i++){
               if(self.carList[i].choose){
                  x.push({
                     name : self.carList[i].displayName,
                     value : self.carList[i].value
                  })
               }
            }
          for(var i = 0; i < self.carWidthList.length ; i++){
            if(self.carWidthList[i].choose){
              y.push({
                name : self.carWidthList[i].displayName,
                value : self.carWidthList[i].value
              })
            }
          }
          for(var i = 0; i < self.carTypeList.length ; i++){
            if(self.carTypeList[i].choose){
              z.push({
                name : self.carTypeList[i].displayName,
                value : self.carTypeList[i].value
              })
            }
          }
          if(x.length == 0){
               bomb.first("请选择用车类型");
               return false;
          }
          if(y.length == 0 && x[0].value == "5fda0edc8df34b4d8c1ed44a6f1f866e"){
            bomb.first("请选择车长");
            return false;
          }
          if(z.length == 0 && x[0].value == "5fda0edc8df34b4d8c1ed44a6f1f866e"){
            bomb.first("请选择车型");
            return false;
          }
          for(var i = 0; i < self.carList.length ; i++){
            if(self.carList[i].choose){
              self.carList[i].choose = !self.carList[i].choose;
            }
          }
          for(var i = 0; i < self.carWidthList.length ; i++){
            if(self.carWidthList[i].choose){
              self.carWidthList[i].choose = !self.carWidthList[i].choose;
            }
          }
          for(var i = 0; i < self.carTypeList.length ; i++){
            if(self.carTypeList[i].choose){
              self.carTypeList[i].choose = !self.carTypeList[i].choose;
            }
          }
          this.vehicleBox = false;
          self.tranTypeValue = self.tranType;
          self.tranType = "";
          self.carListSure = "";
          self.carListSureValue = "";
          self.carWidthListSure = "";
          self.carWidthListSureValue = "";
          self.carTypeListSure = "";
          self.carTypeListSureValue = "";
          self.cartypeOtherSure = "";
          for(var x1 = 0; x1 < x.length ; x1++){
            self.tranType = self.tranType + x[x1].name + ",";
            self.carListSure =self.carListSure + x[x1].name + ",";
            self.carListSureValue =self.carListSureValue + x[x1].value + ",";
          }
          for(var y1 = 0; y1 < y.length ; y1++){
            self.tranType = self.tranType + y[y1].name + "米,";
            self.carWidthListSure =self.carWidthListSure + y[y1].name + ",";
            self.carWidthListSureValue =self.carWidthListSureValue + y[y1].value + ",";
          }
          if( self.cartypeOther != ""){
            self.tranType = self.tranType + self.cartypeOther + "米,";
          }
          for(var z1 = 0; z1 < z.length ; z1++){
            self.tranType = self.tranType + z[z1].name + ",";
            self.carTypeListSure = self.carTypeListSure + z[z1].name + ",";
            self.carTypeListSureValue = self.carTypeListSureValue + z[z1].value + ",";
          }
          self.cartypeOtherSure = self.cartypeOther;
          this.price = "";
          self.price = "";
        },
        goodsType:function (index) {
          var _this = this;
          if(_this.pk == ""){
            _this.both.price = _this.price;
            _this.both.scrollTop =  _this.getPageScroll();
            sessionStorage.setItem("newOrder",JSON.stringify(_this.both));
            androidIos.addPageList();
            _this.$router.push({ path: '/newOrder/goodsType',query:{index: index}});
          }
        },
        appoint:function(){
          var _this = this;
          _this.both.price = _this.price;
          _this.both.scrollTop =  _this.getPageScroll();
          sessionStorage.setItem("newOrder",JSON.stringify(_this.both));
          androidIos.addPageList();
          _this.$router.push({ path: '/newOrder/appoint',query:{carrier:_this.both.pk_carrier,driver:_this.both.driver_name}});
        },
        remark:function () {
          var _this = this;
          _this.both.price = _this.price;
          _this.both.scrollTop =  _this.getPageScroll();
          sessionStorage.setItem("newOrder",JSON.stringify(_this.both));
          androidIos.addPageList();
          _this.$router.push({ path: '/newOrder/remark'});
        },
        insurance:function(){
          var _this = this;
          _this.both.price = _this.price;
          _this.both.scrollTop =  _this.getPageScroll();
          sessionStorage.setItem("newOrder",JSON.stringify(_this.both));
          androidIos.addPageList();
          _this.$router.push({ path: '/newOrder/insurance'});
        },
        calculatorGo:function(){
          var _this = this;
          _this.both.price = _this.price;
          _this.both.scrollTop =  _this.getPageScroll();
          sessionStorage.setItem("newOrder",JSON.stringify(_this.both));
          androidIos.addPageList();
          _this.$router.push({ path: '/calculator'});
        },
        needKnow:function(){
          var _this = this;
          _this.both.price = _this.price;
          _this.both.scrollTop =  _this.getPageScroll();
          sessionStorage.setItem("newOrder",JSON.stringify(_this.both));
          androidIos.addPageList();
          _this.$router.push({ path: '/newOrder/needKnow'});
        },
        getPageScroll:function() {
         var  yScroll;
         yScroll = document.getElementById("newOrderBox").scrollTop;
         return yScroll;
       },
        messageButtonNo:function(){
          var _this = this;
          _this.newOrderMessageBox = false;
        },
        addList:function(){
             var _this = this;
             var json = {
               pkInvPackB:"",
               goodsType:"",
               protype:2,
               goodstypenumber:"",
               number:1,
               wight:"",
               unitWight:"吨",
               wightTen:"1",
               weight:"",
               unitWeight:"立方米",
               weightTen:"1",
               tranpk:"",
             }
             _this.both.productList.push(json);
             _this.$nextTick(function () {
               var i = _this.both.productList.length - 1;
               var unitWight = new LArea();
               unitWight.init({
                 'trigger': '#Z00'+i,
                 'valueTo': '#Z00'+i,
                 'keys': {
                   id: 'id',
                   name: 'name'
                 },
                 'type': 1,
                 'data':[{
                   "code":"1",
                   "region":"吨"
                 },{
                   "code":"0.001",
                   "region":"千克"
                 }]
               });
               unitWight.value = [0];
               unitWight.addPointer = function (name) {
                 name = JSON.parse(name);
                 if(_this.both.productList[name.id.substr(4)*1].wight !=""){
                   _this.both.productList[name.id.substr(4)*1].wight = _this.both.productList[name.id.substr(4)*1].wight/(name.firstCode/_this.both.productList[name.id.substr(4)*1].wightTen);
                 }
                 _this.both.productList[name.id.substr(4)*1].wightTen = name.firstCode;
                 _this.both.productList[name.id.substr(4)*1].unitWight = name.firstVal;
               }
               var unitWeight = new LArea();
               unitWeight.init({
                 'trigger': '#Z01'+i,
                 'valueTo': '#Z01'+i,
                 'keys': {
                   id: 'id',
                   name: 'name'
                 },
                 'type': 1,
                 'data':[{
                   "code":"1",
                   "region":"立方米"
                 },{
                   "code":"0.001",
                   "region":"升"
                 }]
               });
               unitWeight.value = [0];
               unitWeight.addPointer = function (name) {
                 name = JSON.parse(name);
                 if(_this.both.productList[name.id.substr(4)*1].weight !=""){
                   _this.both.productList[name.id.substr(4)*1].weight = _this.both.productList[name.id.substr(4)*1].weight/(name.firstCode/_this.both.productList[name.id.substr(4)*1].weightTen);
                 }
                 _this.both.productList[name.id.substr(4)*1].weightTen = name.firstCode;
                 _this.both.productList[name.id.substr(4)*1].unitWeight = name.firstVal;
               }
             })
        },
        removeList:function(index){
             var _this = this;
             _this.both.productList.splice(index,1);
        },
        submitGo:function(){
            var _this = this;
            if(bomb.hasClass("submit","submit")){
              if(_this.price*1 <= 0 &&  _this.pk == ''){
                 bomb.first("请输入价格");
                 return false;
              }
              var self = _this.both;
              var w = 0;
              for(var i = 0;i<self.productList.length;i++) {
                self.productList[i].number = self.productList[i].number * 1 < 1 ? 1 : Math.ceil(self.productList[i].number);
                w = w*1 + self.productList[i].wight*self.productList[i].wightTen;
              }
              if(_this.pk!=""){
                if(w - self.initialWeight >= 10 ||self.initialWeight - w >= 10){
                  androidIos.second("吨位修改不得超过10吨");
                  return false;
                }
              }
              if(_this.pk == ""){
                if(_this.both.startAddress.pk == _this.both.endAddress.pk){
                   androidIos.first("收卸地点一致，确定要下单吗?");
                  $(".tanBox-yes").unbind('click').click(function(){
                    $(".tanBox-bigBox").remove();
                    _this.newOrderMessageBox = true;
                  });
                }else{
                  _this.newOrderMessageBox = true;
                }
              }else{
               _this.messageButtonYes();
              }
            }else{
              var self = _this.both;
              if(_this.pk == ""){
                if(self.startAddress.people == ""){
                  bomb.first("请选择发货方信息");
                  return false;
                }
                if(self.endAddress.people == "" ){
                  bomb.first("请选择到货方信息");
                  return false;
                }
                if(self.timeBeforeF == "" || self.timeBeforeS == "" || self.timeAfterF == "" || self.timeAfterS == ""){
                  bomb.first("请选择提货到货时间");
                  return false;
                }
                var weightBoth = 0;
                for(var i = 0;i<self.productList.length;i++) {
                  weightBoth = weightBoth + self.productList[i].wight * self.productList[i].wightTen;
                  if (self.productList[i].goodsType == ""){
                    bomb.first("请选择第" + (i+1) + "个货物");
                    return false;
                  }
                  if(self.productList[i].protype == 0){
                    if(self.productList[i].wight*1 == "0"){
                      bomb.first("请填写第" + (i+1) + "个货物的重量");
                      return false;
                    }
                  }else if(self.productList[i].protype == 1){
                    if(self.productList[i].weight*1 == "0"){
                      bomb.first("请填写第" + (i+1) + "个货物的体积");
                      return false;
                    }
                    if( self.productList[i].wight*1 == "0"){
                      bomb.first("请填写第" + (i+1) + "个货物的重量");
                      return false;
                    }
                  }else if(self.productList[i].protype == 2){
                    if(self.productList[i].weight*1 == "0"){
                      bomb.first("请填写第" + (i+1) + "个货物的体积");
                      return false;
                    }
                    if( self.productList[i].wight*1 == "0"){
                      bomb.first("请填写第" + (i+1) + "个货物的重量");
                      return false;
                    }
                  }

                }
                if(self.tranType == "" && weightBoth <= 30){
                  bomb.first("请选择运输类别");
                  return false;
                }
                if(!self.read){
                  bomb.first("请勾选发货须知");
                  return false;
                }
              }
            }
        },
        messageButtonYes:function(){
          var _this = this;
          if(bomb.hasClass("submit","gogogo")){
            var self = _this.both;
            var list = [];
            var weightBoth = 0;
            for( var i = 0 ; i < self.productList.length ; i++ ){
              var listjson = {
                pkInvPackB:self.productList[i].pkInvPackB == ""?undefined:self.productList[i].pkInvPackB,
                goodsClass:self.productList[i].goodstypenumber.split("-")[0],
                goodsCode: self.productList[i].goodstypenumber.split("-")[1],
                num: self.productList[i].number*1,
                weight:self.productList[i].wight*self.productList[i].wightTen*1000,
                volume:self.productList[i].weight*self.productList[i].weightTen
              }
              weightBoth = weightBoth + self.productList[i].wight*self.productList[i].wightTen;
              list.push(listjson);
            }
            var carListSureValueList = self.carListSureValue.split(",");
            var carListSureValue = "";
            for(var i = 0 ; i < carListSureValueList.length ;i ++){
               if(carListSureValueList[i] == ""){
                 carListSureValueList.splice(i,1)
               }
            }
            carListSureValue = carListSureValueList.join(",");
            var carWidthListSureValueList = (self.carWidthListSure + self.cartypeOtherSure).split(",");
            var carWidthListSureValue = "";
            for(var i = 0 ; i < carWidthListSureValueList.length ;i ++){
              if(carWidthListSureValueList[i] == ""){
                carWidthListSureValueList.splice(i,1)
              }
            }
            carWidthListSureValue = carWidthListSureValueList.join(",");
            var carTypeListSureValueList = self.carTypeListSureValue.split(",")
            var carTypeListSureValue = "";
            for(var i = 0 ; i < carTypeListSureValueList.length ;i ++){
              if(carTypeListSureValueList[i] == ""){
                carTypeListSureValueList.splice(i,1)
              }
            }
            carTypeListSureValue = carTypeListSureValueList.join(",");
            var json = {
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
              delAdderessinfo:{
                del_contact:self.startAddress.people,
                del_phone:self.startAddress.tel,
                del_add_detail:self.startAddress.address,
                del_com:self.startAddress.company,
                deladdrinfo:self.startAddress.city.replace(/\-/g, "\/"),
                pk_delivery:self.startAddress.pk
              },
              arrAdderessinfo:{
                arr_contact:self.endAddress.people,
                arr_phone:self.endAddress.tel,
                arr_add_detail:self.endAddress.address,
                arr_com:self.endAddress.company,
                arraddrinfo:self.endAddress.city.replace(/\-/g, "\/"),
                pk_arrival:self.endAddress.pk
              },
              act_leav_date:self.timeBeforeS + " " + self.timeBeforeF,
              act_arri_date:self.timeAfterS +" " + self.timeAfterF,
              goodspack:list,
              vehicleType:weightBoth <= 30 ? carListSureValue : "",
              carLength:weightBoth <= 30 && carListSureValue == "5fda0edc8df34b4d8c1ed44a6f1f866e" ? carWidthListSureValue : "",
              carModel:weightBoth <= 30 && carListSureValue == "5fda0edc8df34b4d8c1ed44a6f1f866e" ? carTypeListSureValue : "",
              pk_carrier:self.pk_carrier,
              driver_name:self.driver_name,
              if_insurance:self.insurance,
              pay:self.pay==1?"收货方":"发货方",
              est_amount:_this.price*1,
              remark:self.remark,
              pk:_this.$route.query.type == 3 ? _this.$route.query.pk : _this.pk,
              weightBoth:weightBoth,
            };
            androidIos.loading("正在提交");
            bomb.removeClass("submit","gogogo");
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp()+"/order/createOrder",
              data:JSON.stringify(json),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 50000,
              success: function (createOrder) {
                $("#common-blackBox").remove();
                bomb.addClass("submit","gogogo");
                if(createOrder.success=="1"){
                  _this.newOrderMessageBox = false;
                  _this.$cjj("提交成功");
                  setTimeout(function () {
                    androidIos.gobackFrom(_this);
                  },1000)
                }else if(createOrder.success=="-1"){
                  androidIos.second(createOrder.message)
                }
              },
              complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                $("#common-blackBox").remove();
                bomb.addClass("submit","gogogo");
                if(status=='timeout'){//超时,status还有success,error等值的情况
                  androidIos.second("网络请求超时");
                }else if(status=='error'){
                  androidIos.errorwife();
                }
              }
            })
          }

        },
        ten:function (min) {
          if(min<10){
            min = "0"+min;
          }else{
            min = min;
          }
          return min;
        }
      }
    }
</script>

<style scoped>
  .required{
    background-image: url("../../images/required.png");
    background-position: 0 50%;
    background-size: 0.2rem 0.2rem;
    background-repeat: no-repeat;
  }
  #newOrderMessageBox{
    position: fixed;
    top:0;
    bottom: 0;
    right:0;
    left:0;
    width:100%;
    height: 100%;
    background:rgba(0,0,0,0.5) ;
  }
  #newOrderMessage{
    width:7.1875rem;
    position: absolute;
    left:50%;
    margin-left: -3.59375rem;
    background: white;
    border: 0.03125rem solid #b1b1b1;
    border-radius: 0.25rem;
    top:30%;
    overflow: hidden;
  }
  #newOrderMessage p {
    width: 100%;
    line-height: 1rem;
    border-bottom: 0.03125rem solid #e0e0e0;
    font-size: 0.451rem;
    color:#333;
    text-align: center;
    letter-spacing: 0.03125rem;
    margin-bottom: 0.2rem;
  }
  .message_address,.message_insurance,.message_price{
    width:94%;
    padding: 0 3%;
    font-size: 0.35rem;
    color:#333;
  }
  .message_address h6,.message_insurance h6,.message_price h6,.message_product h6{
     float: left;
    font-size: 0.375rem;
    line-height: 0.7rem;
    color:#999;
  }
  .message_address h5,.message_insurance h5,.message_price h5,.message_product h5{
    float: right;
    font-size: 0.375rem;
    line-height: 0.7rem;
    color:#333;
    width:80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height:0.7rem;
  }
  .message_product h5 span{
    font-size: 0.375rem;
    color:#333;
  }
  .message_product,#newOrderMessage h3,#newOrderMessage h4{
    width:94%;
    padding: 0 3%;
    font-size: 0.3125rem;
    color:#333;
  }
  #newOrderMessage h3,#newOrderMessage h4{
    margin-top: 0.2rem;
  }
  .message_product h1,.message_product h2{
    font-size: 0.3125rem;
    color:#333;
  }
  .message_shuxian{
    width: 0.03125rem;
    height: 1.0625rem;
    float: left;
    background: #e0e0e0;
  }
  .message_button{
    border-top: 1px solid #e0e0e0 ;
    margin-top: 0.3rem;
  }
  .message_button button{
    height: 1.0625rem;
    width:3.578125rem;
    background: white;
    font-size: 0.44rem;
    float: left;
  }
  .message_buttonYes{
    color:#3399ff;
  }
  #histroyAddress{
    position: absolute;
    right:0;
    background: #3399FF;
    color:white;
    font-size: 0.3125rem;
    line-height: 0.8rem;
    width: 1.6rem;
    text-align: center;
    margin: 0.3rem 0.3rem 0 0.3rem;
    border-radius: 0.1rem;
  }
   #peopleAddress{
     width: 94%;
     background: white;
     margin: 0.3rem auto 0 auto;
     border-radius: 0.12rem;
     box-shadow: 0 0.1rem 10px #d8d8d8;
     position: relative;
   }
  #peopleAddress .right{
    float: left;
  }
   #peopleAddress .right{
     width:100%;
   }
   .labelTop{
     margin-top: 0.2rem!important;
   }
  .message{
    width:90%;
    padding-left: 10%;
    margin-top: 0.1rem;
    padding-bottom: 0.45rem;
  }
  .pickmessage{
     background-image: url("../../images/pickmessage.png");
    background-size: 0.267rem;
    background-repeat: no-repeat;
    background-position: 0.41rem 0.52rem;
  }
  .arrmessage{
    background-image: url("../../images/arrmessage.png");
    background-size: 0.267rem;
    background-repeat: no-repeat;
    background-position: 0.41rem 0.51rem;
  }
  .borderBottom{
    background:#e9eef3;
    width:90%;
    margin-left: 10%;
    height: 1px;
  }
   .message p{
     font-size: 0.4rem;
     color:#333;
     line-height: 1.3rem;
   }
  .message h1{
    width: 90%;
    padding-right: 10%;
    font-size: 0.375rem;
    color:#bcbcbc;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    background-image: url("../../images/lookMore.png");
    background-size: 0.187rem;
    background-repeat: no-repeat;
    background-position: 95% 50%;
  }
  .circle{
    width:0.3rem;
    height:0.3rem;
    border-radius: 0.15rem;
    background: #dadada;
    margin: 0 auto;
  }
  .left .top{
    margin-top: 0.85rem;
  }
  .line{
    width: 1px;
    height:1.5rem;
    background: #dadada;
    margin: 0 auto;
  }
  .blackColor{
    color:#333!important;
  }
.borderno{
  border:none!important;
}
  .label{
    margin:0.4rem auto 0 auto;
    background: white;
    width: 94%;
    border-radius: 0.12rem;
    box-shadow: 0 0.1rem 10px #d8d8d8;
  }
  .lablebox{
    width:90%;
    margin-left: 5%;
    padding: 0 5% 0 0;
    height: 1.4rem;
    line-height: 1.4rem;
    border-bottom: 1px solid #dadada;
    background-image: url("../../images/lookMore.png");
    background-size: 0.187rem;
    background-repeat: no-repeat;
    background-position: 95% 50%;
  }
  .lablebox span{
    line-height: 1.4rem;
    font-size: 0.4rem;
    color:#333;
    padding-left: 0.3rem;
    margin-left: -0.3rem;
  }
   .lablebox input{
     line-height: 0.6rem;
     height: 0.6rem;
     font-size: 0.375rem;
     color: #333;
     float: right;
     text-align: right;
     width: 55%;
     margin-right: 5%;
     margin-top:0.4rem;
   }
   .lablebox p{
      float: right;
     font-size: 0.375rem;
     color:#bcbcbc;
     margin-right: 5%;
     max-width: 70%;
     overflow: hidden;
     text-overflow:ellipsis;
     white-space: nowrap;
   }
  .unit{
    float: right;
    color:#333;
    width: 15%;
    padding:0 3% 0 1% ;
    margin-left: 0.1rem;
    text-align: center;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 0.375rem;
  }
  #Z02,#pay{
    float: right;
    font-size: 0.375rem;
    margin-right: 5%;
  }
  #pay label{
    float: left;
    font-size: 0.375rem;
  }
  #pay .circleBox,#read .circleBox{
    width:0.35rem;
    height: 0.35rem;
    border: 1px solid #2c9cff;
    float: left;
    border-radius: 50%;
    margin-top: 0.5rem;
    margin-right: 0.1rem;
  }
   #pay .circleBox .circletrue,#read .circleBox .circletrue{
     width:0.2rem;
     height: 0.2rem;
     background: #2c9cff;
     border-radius: 50%;
     margin:0.08rem 0.075rem 0 0.075rem;
   }
   #pay label{
     margin-left: 0.2rem;
   }
  #submit{
    width:90%;
    display: block;
    margin: 0.5rem auto;
    line-height: 1.2rem;
    font-size: 0.4rem;
    background: rgb(153, 153, 153);
    color:white;
    border-radius: 0.2rem;
    letter-spacing: 0.03125rem;
  }
  #gofrommessage{
    width:90%;
    display: block;
    margin: 0.5rem auto;
    line-height: 1.2rem;
    font-size: 0.4rem;
    background: rgb(153, 153, 153);
    color:white;
    border-radius: 0.2rem;
    letter-spacing: 0.03125rem;
  }
  .submit{
    background: #3492ff!important;
    /*background: -webkit-linear-gradient(left,#3da4ff, #3492ff)!important; !* Safari 5.1 - 6.0 *!
    background: -o-linear-gradient(left,#3da4ff, #3492ff)!important; !* Opera 11.1 - 12.0 *!
    background: -moz-linear-gradient(left,#3da4ff, #3492ff)!important; !* Firefox 3.6 - 15 *!
    background: linear-gradient(left,#3da4ff, #3492ff)!important; !* 标准的语法 *!*/
  }
  #add p{
    font-size: 0.375rem;
    line-height: 1rem;
    color:#666;
    float: right;
    margin-right: 5%;
  }
   .labelTitle h6{
     font-size: 0.35rem;
     color:#666;
     float: right;
     margin-right: 5%;
   }
  #add img{
    float: right;
    width:0.5rem;
    margin-top: 0.25rem;
    margin-right: 0.1rem;
  }
  .labelTitle{
    width:100%;
    background: #f5f5f9;
    margin-top: 0.3rem;
  }
  .labelTitle p{
    font-size: 0.35rem;
    color:#333;
    float: left;
    margin-left: 5%;
  }
  #successBox{
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom: 0;
    width:auto;
    height: auto;
    background: rgba(255,255,255,0);
  }
  #success{
    width:22%;
    position: absolute;
    top:40%;
    left:39%;
    background: rgba(0,0,0,0.5);
    border-radius: 0.3rem;
  }
  #success img{
    width:35%;
    display: block;
    margin:0.3rem auto;
  }
  #success p{
    text-align: center;
    margin-bottom: 0.3rem;
    color:white;
    font-size: 0.35rem;
  }
  .imgno{
    background-image: none!important;
  }
  #vehicleBox{
    position: fixed;
    width:100%;
    top:0;
    bottom:0;
    height: auto;
    z-index: 44;
    background: rgba(0,0,0,0.3);
  }
  #vehicle{
     width: 100%;
     background: white;
     position: absolute;
    bottom:0;
  }
  #vehicle button{
    width:90%;
    line-height: 1rem;
    background: #2c9cff;
    color:white;
    display: block;
    margin: 0.8rem auto 0.3rem auto;
    font-size: 0.375rem;
    border-radius: 0.2rem;
  }
  #vehicle p{
     text-align: center;
    font-size: 0.375rem;
    color:#333;
    line-height: 1rem;
    border-bottom: 1px solid #e6e6e6;
  }
  .vehicleBox{
    width:93%;
    margin: 0 auto;
    max-height: 10rem;
  }
  .vehicle{
    margin-top: 0.3rem;
  }
  .vehicleBox h6{
    font-size: 0.375rem;
    color:#333;
  }
  .vehicleBox h6 span{
    color:#999;
    font-size: 0.35rem;
  }
  .vehicle li{
    float: left;
    display: block;
    width: 18.5%;
    padding:0 1.375% ;
    text-align: center;
    line-height: 0.8rem;
    font-size: 0.35rem;
    background-color: #f3f3f3;
    color:#666;
    border-radius: 0.2rem;
    margin-top: 0.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 3%;
  }
  .chooseTrue{
     background-color: #2c9cff!important;
    color:white!important;
  }
  #vehicle img{
    position: absolute;
    width:1rem;
    z-index: 1;
  }
  .cartypelookMore{
     background-image: url("../../images/cartypeLook.png");
     background-size: 0.25rem;
     background-repeat: no-repeat;
    background-position: 93% 50%;
  }
  .cartypeOther{
     margin-left: 3%;
    font-size: 0.375rem;
    color:#333;
    line-height: 1rem;
    margin-top: 0.2rem;
  }
  .cartypeOther span{
    font-size: 0.375rem;
    color:#999;
  }
  .cartypeOther input{
     width:2rem;
     height: 0.375rem;
     font-size: 0.375rem;
     padding:0.15rem 0.2rem ;
    margin: 0 0.1rem 0 0.3rem;
    border: 1px solid #dcdcdc;
  }
</style>
