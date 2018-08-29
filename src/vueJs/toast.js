var Toast = {};
Toast.install = function (Vue,options) {
    Vue.prototype.$cjj = (tips) => {
      let opt = {
        duration:'200'         // 持续时间
      }
      for(let property in options){
        opt[property] = options[property];  // 使用 options 的配置
      }
      let toastTpl = Vue.extend({     // 1、创建构造器，定义好提示信息的模板
        template:"<div id='loadingyesbox'><div id='loadingyes'><img id='loadingImg' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAApVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+4/eNVAAAANnRSTlMA4QXdF9gQqBuh9xQD+9MJ9PCvQb1zlul5SSDlT4qA7cmdZ2ELtJqHJYM7LFZujpEwzbjDMydHfkgtAAAJNklEQVR42tTa2VbiQBAG4D8rJCQkYd+UfUdF0Xr/R5tzxvFgZQ8kdM936YXwH7qqK51GNdSvyWDbs1qdWVOZuu5Uac46Lav31J18qfg/6O3F64fmUiJXW78u2jpkNlrW+pRTv7YcQUb6aa5RQcr81IBMnPZrk27UfG07kII63EzpLv35UHwHOL4FVILp2xECrRYzKs1ssYIY9W1ApQqedDze0XKpdK51xGPtLKpIbYTHqfdcqoy70fEY3rNNufjGx3z//M9+/tH0KRf7WcUDTBTKoqy3i+HRRIR5HC626+x/oE1QtdGaUk1b3cMKGVaHbmtKqdYjVEkd2JTM7XSPyO340nEpmT1QUZmDRokC62SiIPNkBZTIOKAaXo+SjN/aKm6itt/GlKTnoQJngxK8L1XcwRnWbIpnHFG6gUvxWm3czRwEFMsdoFzmB8WyNzuUwnz2KdaHiRJ9aRRnum+gNOY+oDjaF0pz8imG0vVQqtVLbN37J5Skm97nq9+nuihFL3bpjlCJUWwx9nA/tUZR/RMqc+pTVE3FnbwORW1MVMjsUVTHw11WM4rQDohR9Sg0M3EHvUkRtRUqt6pRRLOBmzUMCvOXeIilT2GGjhuZ0RzGDg+yi35408RNvHcKm3t4GG8erRMPN/AuFOIu8VBLt5Te1aKQ4IAHOwQUUkNhAwpRdni4nUIhAxQ0jFSaDgF0g0ImKORsRzuGEI0mcfYnCjAV4t5NCGKGkygmcnMukvwesUkuDvLaEmcIyJGyLz8hp0k4RwNCNYzbCr4eEDOuQ7D6mJigjhzUGTHTHYTbTYmZqcj2RIx/hgTOfuEy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'>"+tips+"</div></div>",
      });
      let tpl = new toastTpl().$mount().$el;  // 2、创建实例，挂载到文档以后的地方
      document.body.appendChild(tpl);     // 3、把创建的实例添加到body中
      var loadingyesbox = document.getElementById("loadingyesbox");
      var loadingyes = document.getElementById("loadingyes");
      var loadingImg = document.getElementById("loadingImg");
      loadingyesbox.style.position = "fixed";
      loadingyesbox.style.left = "0";
      loadingyesbox.style.right = "0";
      loadingyesbox.style.top = "0";
      loadingyesbox.style.bottom = "0";
      loadingyesbox.style.width = "auto";
      loadingyesbox.style.height = "auto";
      loadingyesbox.style.background = "rgba(255,255,255,0)";
      loadingyesbox.style.zIndex = "300";
      loadingyes.style.position = "fixed";
      loadingyes.style.left = "50%";
      loadingyes.style.top = "45%";
      loadingyes.style.width = "2rem";
      loadingyes.style.height = "2rem";
      loadingyes.style.marginLeft = "-1rem";
      loadingyes.style.marginTop = "-1rem";
      loadingyes.style.background = "rgba(0,0,0,0.7)";
      loadingyes.style.textAlign = "center";
      loadingyes.style.color = "#f1f1f1";
      loadingyes.style.lineHeight = "0.8rem";
      loadingyes.style.fontSize = "0.35rem";
      loadingyes.style.borderRadius = "0.1rem";
      loadingyes.style.letterSpacing = "0.03125rem";
      loadingImg.style.width = "1rem";
      loadingImg.style.display = "block";
      loadingImg.style.margin = "10% auto 0 auto";
      setTimeout(function () {
        let opacity = 1;
        let time = setInterval(function () {
          opacity = opacity-0.1;
          loadingyes.style.opacity =opacity ;
          if(opacity<0.1){
            clearInterval(time);
            document.body.removeChild(tpl);
          }
        },10)
      },opt.duration);
    }
}
module.exports = Toast;
