<template>
    <div id="score">
      <div id="title" v-title data-title="评分详情"></div>
      <div id="bigBox">
          <div id="box">
            <p>{{score.bothscore}}分</p>
            <div id="star_grade" class="star_grade"></div>
            <div class="clearBoth"></div>
          </div>
          <ul>
            <li v-for="(item,index) in score.list">
              <p>{{item.name}}</p>
              <div :id="'star_grade'+index" class="star_grade"></div>
              <div class="clearBoth"></div>
            </li>
          </ul>
      </div>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  export default {
      name: "score",
      data(){
          return{
              score:{
                 bothscore:4,
                 list:[{
                   name:"货物",
                   score:"0"
                 },{
                   name:"司机",
                   score:"0"
                 },{
                   name:"承运商",
                   score:"0"
                 }]
              }
          }
      },
      mounted:function(){
        var _this = this;
        androidIos.bridge(_this);
      },
      methods:{
        go:function () {
          var _this = this;
          $("#star_grade").html("");
          $("#star_grade").markingSystem({
            num: 5,
            havePoint: true,
            haveGrade: true,
            backgroundImageInitial: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEUAAAD9dyr9VDr8SD/9ZjP9YDb9cS78TT39bDH9aTH9XDf9dSv9YzT9XDf9bi/9cC79aTL9cy78QkJ+hTheAAAAEnRSTlMAH/T+wNxw+5yv5zzP5odurld/oABPAAAA1klEQVQ4y62RS5LDIAxE0Q/J2Elm+v6HnUwIKRsKVtEGmu56KqH07Qr3WPkkgNAioDCDLgG/+wqh4JQKdAHIKeU5YoP/H4xtEnC8Rszwgf0IvTGawQDfNB6t0yGo1f4oO2rJUYkQNr3nMzPf1ViA/ArYbCpGri1t5nO72MSnz9Vo4Tcx+oNcP5SzLgNyu+5Qh30ciLMMHF2Acf1JcBcQXDWkmwpeTzN6r57SiCQVQJRay36ITZ6uCuRnHEMR4U+bKsYjoB1BANur2A2QjkCl2S1SKH2p/gDnoAlDysm60AAAAABJRU5ErkJggg==',
            backgroundImageOver: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAMAAAC+oj0CAAAAYFBMVEUAAAD8QkL9UVH9eHj9VFT/wsL/zc3/19f/2dn/4eH/7+///f39R0f9TU39Tk79ZWX9YmL9a2v+lJT+oaH+paX+sLD+urr/1NT/3d3/5+f//v7+goL+g4P8QkL+u7v9bGzZkjZpAAAAHXRSTlMA7d+q105ANDEoFQPs5ePGxbuIeXNlWjgsHgOioFw9/yIAAACSSURBVBjTbdDZDoQgDEDRsggC7rvOVP//LycQU3TgvjQ5adKkEJsmyLQytmZYIIpUNUNkOrecWS+ZZ1YSuF3Ng5AYkmKY1e4ArMQkacHWKdcWQDf/2uhwjb+V33c3/tIN7gx/qAGqjdxGdVXkyhEbfGSIiycXxKN/R69U7x8zEn8Qu7BUdIhf4uU6Dwgd57X4+QMzcxYilqvWAwAAAABJRU5ErkJggg==',
            unit: '星',
            grade:_this.score.bothscore,
            height: 0.4* $("html").css("font-size").replace("px", ""),
            width: 0.4* $("html").css("font-size").replace("px", ""),
          });
          $("#star_grade .grade").css("display","none")
          for(var i = 0; i < _this.score.list.length; i++){
            $("#star_grade"+i).html("");
            $("#star_grade"+i).markingSystem({
              num: 5,
              havePoint: true,
              haveGrade: true,
              backgroundImageInitial: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEUAAAD9dyr9VDr8SD/9ZjP9YDb9cS78TT39bDH9aTH9XDf9dSv9YzT9XDf9bi/9cC79aTL9cy78QkJ+hTheAAAAEnRSTlMAH/T+wNxw+5yv5zzP5odurld/oABPAAAA1klEQVQ4y62RS5LDIAxE0Q/J2Elm+v6HnUwIKRsKVtEGmu56KqH07Qr3WPkkgNAioDCDLgG/+wqh4JQKdAHIKeU5YoP/H4xtEnC8Rszwgf0IvTGawQDfNB6t0yGo1f4oO2rJUYkQNr3nMzPf1ViA/ArYbCpGri1t5nO72MSnz9Vo4Tcx+oNcP5SzLgNyu+5Qh30ciLMMHF2Acf1JcBcQXDWkmwpeTzN6r57SiCQVQJRay36ITZ6uCuRnHEMR4U+bKsYjoB1BANur2A2QjkCl2S1SKH2p/gDnoAlDysm60AAAAABJRU5ErkJggg==',
              backgroundImageOver: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAMAAAC+oj0CAAAAYFBMVEUAAAD8QkL9UVH9eHj9VFT/wsL/zc3/19f/2dn/4eH/7+///f39R0f9TU39Tk79ZWX9YmL9a2v+lJT+oaH+paX+sLD+urr/1NT/3d3/5+f//v7+goL+g4P8QkL+u7v9bGzZkjZpAAAAHXRSTlMA7d+q105ANDEoFQPs5ePGxbuIeXNlWjgsHgOioFw9/yIAAACSSURBVBjTbdDZDoQgDEDRsggC7rvOVP//LycQU3TgvjQ5adKkEJsmyLQytmZYIIpUNUNkOrecWS+ZZ1YSuF3Ng5AYkmKY1e4ArMQkacHWKdcWQDf/2uhwjb+V33c3/tIN7gx/qAGqjdxGdVXkyhEbfGSIiycXxKN/R69U7x8zEn8Qu7BUdIhf4uU6Dwgd57X4+QMzcxYilqvWAwAAAABJRU5ErkJggg==',
              unit: '星',
              grade:_this.score.list[i].score,
              height: 0.4* $("html").css("font-size").replace("px", ""),
              width: 0.4* $("html").css("font-size").replace("px", ""),
            });
          }
        }
      }
    }
</script>

<style scoped>
#bigBox{
  width:100%;
  background: white;
}
  #box{
    width:90%;
    margin-left: 10%;
    border-bottom: 1px solid #dcdcdc;
  }
  #box p{
    float: left;
    line-height: 1.5rem;
    font-size: 0.5rem;
    color:#ffaf28;
    width:1.3rem;
  }
  #star_grade{
    float: left;
    margin-top: 0.55rem;
    margin-left: 0.2rem;
  }
  ul{
    width:90%;
    margin-left: 10%;
    padding: 0.2rem 0;
  }
  li{
    width:100%;
  }
  ul p{
    width:1.3rem;
    float: left;
    line-height: 0.8rem;
    color:#333;
    font-size: 0.35rem;
  }
  li .star_grade{
    margin-left: 0.2rem;
   margin-top: 0.2rem;
    float: left;
  }
</style>
