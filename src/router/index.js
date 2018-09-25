// 引入子路由

import newOrder from '../pages/newOrder'
import calculator from '../pages/calculator'
import robbing from '../pages/robbing'
import orderLogistics from '../pages/orderLogistics'
import track from '../pages/track'
import site from '../pages/site'
import car from '../pages/car'
import uploadData from '../pages/uploadData'
import agreeToRefuse from '../pages/agreeToRefuse'
import signIn from  '../pages/signIn'
import Vue from 'vue'
import Router from 'vue-router'
import  newOrderF from '@/components/newOrder/newOrder'
import  newOrderS from '@/components/newOrder/chooseStart'
import  newOrderT from '@/components/newOrder/remark'
import  newOrderFo from '@/components/newOrder/histroyAddress'
import  newOrderSi from '@/components/newOrder/goodsType'
import  newOrderSe from '@/components/newOrder/goods'
import  newOrderEg from '@/components/newOrder/appoint'
import  newOrderNi from '@/components/newOrder/insurance'
import  newOrder11 from '@/components/newOrder/addressMessage'
import  newOrder12 from '@/components/newOrder/needKnow'
import  robbingF from '@/components/robbing/robbingMore'
import  robbingS from '@/components/robbing/dismantling'
import  robbingT from '@/components/robbing/dismantlingTrue'
import  siteF from '@/components/site/chooseSite'
import  siteFo from '@/components/site/editSite'
import  siteFi from '@/components/site/siteSure'
import  siteSi from '@/components/site/timeSite'
import  siteSe from '@/components/site/lastSure'
import  siteEg from '@/components/site/car'
import  siteNi from '@/components/site/carHanger'
import  orderLogisticsF from '@/components/orderLogistics/orderLogisticsMore'
import  orderLogisticsS from '@/components/orderLogistics/map'
import  trackF from '@/components/track/trackMore'
import  trackS from '@/components/track/map'
import  trackT from '@/components/track/qrcode'
import  trackFo from  '@/components/track/uploadBill'
import  trackSi from '@/components/track/uploadImg'
import  carF from '@/components/car/carMessage'
import  carS from '@/components/car/map'
import  carT from '@/components/car/changeCarpeople'
import  carFo from '@/components/car/newdriver'
import  carFi from '@/components/car/newCar'
import uploadDataF from '@/components/uploadData/pdf'
import uploadDataS from '@/components/uploadData/uploadDataS'
import uploadDataT from '@/components/uploadData/uploadDataT'
import uploadDataFo from '@/components/uploadData/uploadDataFo'
import  agreeList from  '@/components/agreeToRefuse/agreeList'
import  agreeMore from  '@/components/agreeToRefuse/agreeMore'
Vue.use(Router);

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
    document.getElementById('title').innerText = document.title
  }
});
Vue.filter('companyTypeName', function(value) {
  value = value*1;
  var valueTypeName  ="";
  switch (value)
  {
    case 0:
      valueTypeName="";
      break;
    case 1:
      valueTypeName="待审核";
      break;
    case 2:
      valueTypeName="已审核";
      break;
    case 3:
      valueTypeName="已驳回";
      break;
    case 4:
      valueTypeName="已禁用";
      break;
  }
  return valueTypeName
});

Vue.filter('orderTypeName', function(value) {
  value = value*1;
  var valueTypeName  ="";
  switch (value)
  {
    case 0:
      valueTypeName = "待确认";
      break;
    case 10:
      valueTypeName = "已确认";
      break;
    case 20:
      valueTypeName = "司机出发";
      break;
    case 31:
      valueTypeName = "提货到达";
      break;
    case 32:
      valueTypeName = "开始装货";
      break;
    case 33:
      valueTypeName = "装货完毕";
      break;
    case 41:
      valueTypeName = "运输到达";
      break;
    case 42:
      valueTypeName = "开始卸货";
      break;
    case 43:
      valueTypeName = "卸货完毕";
      break;
    case 50:
      valueTypeName = "已签收";
      break;
    case 60:
      valueTypeName = "退单";
      break;
  }
  return valueTypeName
});

export default new Router({
  routes: [
    {
      path: '/uploadData',
      name: 'uploadData',
      component: uploadData,
      children: [
        {path: 'pdf',component:uploadDataF},
        {path: 'uploadDataS', component: uploadDataS},
        {path: 'uploadDataT', component: uploadDataT},
        {path: 'uploadDataFo', component: uploadDataFo}
      ]
    },
    {
      path:'/signIn',
      name:'signIn',
      component:signIn,
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: calculator
    },
    {
      path:'/newOrder',
      name:'newOrder',
      component:newOrder,
      children: [
        {path: '/', component: newOrderF},
        {path: 'chooseStart', component: newOrderS},
        {path:'remark',component:newOrderT},
        {path: 'histroyAddress', component: newOrderFo},
        {path: 'goodsType', component: newOrderSi},
        {path: 'goods', component: newOrderSe},
        {path: 'appoint', component: newOrderEg},
        {path: 'insurance', component: newOrderNi},
        {path:"addressMessage",component:newOrder11},
        {path:"needKnow",component:newOrder12}
      ]
    },
    {
      path: '/robbing',
      name: 'robbing',
      component: robbing,
      children: [
        {path: 'robbingMore', component: robbingF},
        {path: 'dismantling', component: robbingS},
        {path: 'dismantlingTrue', component: robbingT}
        ]
    },
    {
      path: '/site',
      name: 'site',
      component: site,
      children: [
        {path: 'chooseSite', component: siteF},
        {path: 'editSite', component: siteFo},
        {path: 'siteSure', component: siteFi},
        {path: 'timeSite', component: siteSi},
        {path: 'lastSure', component: siteSe},
        {path: 'car', component: siteEg},
        {path: 'carHanger', component: siteNi}
      ]
    },
    {
      path: '/track',
      name: 'track',
      component: track,
      children: [
        {path: 'trackMore', component: trackF},
        {path: 'map', component: trackS},
        {path: 'qrcode', component: trackT},
        {path:'uploadBill',component:trackFo},
        {path:'uploadImg',component:trackSi}
      ]
    },
    {
      path: '/car',
      name: 'car',
      component: car,
      children: [
        {path: '/',
          component: carF,
          children:[{
            path:"/",
            component:carS
          }]
        },
        {path: 'map', component: carS},
        {path: 'changeCarpeople', component: carT},
        {path: 'newdriver', component: carFo},
        {path: 'newCar', component: carFi}
      ]
    },
    {
      path: '/orderLogistics',
      name: 'orderLogistics',
      component: orderLogistics,
      children: [
        {path: 'orderLogisticsMore',
          component: orderLogisticsF,
          children:[{
            path:"/",
            component:orderLogisticsS
          }]
        },
        {path: 'map', component:orderLogisticsS},
      ]
    },
    {
      path: '/agreeToRefuse',
      name: 'agreeToRefuse',
      component: agreeToRefuse,
      children: [
        {path: '/', component: agreeList},
        {path: 'agreeMore', component: agreeMore},
      ]
    },
  ]
})
