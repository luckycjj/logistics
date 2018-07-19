<template>
    <div id="appointMore">
      <div v-if="type==0">
           <div id="messageBox">
               <div class="messageFirst">
                 <img :src="companyMessage.logo">
               </div>
               <div class="messageSecond">
                 <p>{{companyMessage.name}}</p>
                 <div id="star_grade" class="star_grade"></div>
                 <h2>{{companyMessage.tranType}}&nbsp;&nbsp;<span>入驻 {{companyMessage.tranYear}}年</span></h2>
               </div>
             <div class="clearBoth"></div>
             <h6 class="number">社会信用代码&nbsp;&nbsp;{{companyMessage.number}}</h6>
             <h3>法人&nbsp;&nbsp;{{companyMessage.peopleName}}</h3>
             <h3>电话&nbsp;&nbsp;{{companyMessage.tel}}</h3>
             <h3>地址&nbsp;&nbsp;{{companyMessage.address}}</h3>
             <h3>入驻时间&nbsp;&nbsp;{{companyMessage.time}}</h3>
           </div>
      </div>
      <div v-if="type==1">
         <div id="messageBox">
          <div class="messageFirst">
            <img :src="peopleMessage.logo">
          </div>
          <div class="messageSecond">
            <p>{{peopleMessage.name}}</p>
            <div id="star_grade" class="star_grade"></div>
            <h2>驾龄 {{companyMessage.tranYear}}年</h2>
          </div>
          <div class="clearBoth"></div>
        </div>
        <h6 id="titleS">车辆信息</h6>
        <div id="messgaeCar">
          <h3>{{peopleMessage.carMessgae.carNumber}}</h3>
          <h3>{{peopleMessage.carMessgae.type}}</h3>
          <div class="shuxian"></div>
          <h3>{{peopleMessage.compnay}}</h3>
          <h3>社会信用代码&nbsp;&nbsp;{{peopleMessage.number}}</h3>
        </div>
      </div>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import  "../../js/markingSystem";
    export default {
        name: "appointMore",
      data(){
          return{
             type:"",
             companyMessage:{
                logo:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmYzllYjE2Yi1lY2MwLTJlNDMtOWU1Ny01Yzk0NTI5Y2RhMTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Qjc5ODI1RTQwNTdFMTFFODgwMDE4Njg1MTNBQ0VFNzEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Qjc5ODI1RTMwNTdFMTFFODgwMDE4Njg1MTNBQ0VFNzEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJjNWUyNjQ2LTk4MGYtMjI0Ny1iMThjLTA5MjU0ODFjYzM0NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpmYzllYjE2Yi1lY2MwLTJlNDMtOWU1Ny01Yzk0NTI5Y2RhMTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz43DdvjAAAFVUlEQVR42tRZfUhVZxx+PN5NUcu2MrOsmGn/RJrNMiNybVDaGESNuBQIUcmYtbkVw20MIpgMwmxZ5JIwCUYw+ifZilH2R+RHbaZCBdawtFq2xOY08/Pu+d33uPt57j33ejX3wIPXc97f+z7nvO/v431PmC0/H0HidTKLXEemkovJBDJGv99L/km2ki3kFbKOHAxmsLAghKaTH5Efkm8GaNtN/kSWkzcDMdQCaJtG/kz+TuYHIVLwhm4rffyi9xkyoZHkYfI3cqPMAsYP6SNX77NUH2NcQpP1dfUZaUHoIX0W6mMkByt0BVlLLsPEQ8aoJzMDFSoGNWQcJg8zyUtGYjWD6a52CjOTiRh97GR/QiP18BGHV4c4XUOk+2J2RvGErUkLh1q7lgGJEWn6dKYL5oueHuD6deDqVWB42H3Nfkvu8xbw0/RwEXrvnjED2LMHmD9fCTt1Cli5Eti5U93v6ACOHQOeP3e2EuVv61nNZeqLJ0SkvMkxkUaQe3v3qraus13sPvXpegAODIeZB6Kjje+fPw+8fOlb5BgSE4HsbODyZeerG3VtN8feaEFQGceXSEFzM5CRYb4/z7Zhujb7G42AplkxOhp6B3ryBFiwwPu9gQHg2TPXa/Hx3lpK8VNgsQfY0dFov28u0i0duy5884iIUJS3LXRGXp43i1jRaKFRjv3pjLCYZWYh03F4uOv106f9i5ozB2hvB5KSnGowBpc1azxFCvr6jHp614KoqGxDofLku3axIGNFVlPjuL5tG1ePiSUtoiQcOQsVbN2q6I6zZw170hhojauW1auV14rQFy8cdA3OxljH4v/GDeDhQ/9tpY0EfoN51TA4GGtovHQp0NCAoB1t2jRg+3YVzCWoG0HulZX5egHxFgwNvWacdZl2Y1gnLFzoel08ubXVnNjly9XfI0dUNlrB6nHePHXt0SOjFOrxyL4zkTiQiHQXGihErDjlJVZxZ84AnZ0qC82erWbNxFKysDgY4TrUMNGQmdm0SdEd4gO+8Y/GGDmAqY9ODbGxXf8Doa0WCr3HHwsNvVYgXn/tGtDWxjwRq+pKcajjx/0PMTQEPHjg+H/JEmDWLMe92lozQpst9GxZIO95PwthcTs4CFRUqJi6ZQvQ3a0C8/r1Kk76E1lerlKjOJPYVlcrB1q0COjvVw7mH1c0hooq5nGbYRPJSBs2sNhKVwPPnQvs3g1cuOC/e7HNyfG0vXgxkGnvkR2qhsrKLj5tu9cmIyPA/fvcajF53boFFBWpHC+hRepH9+rHHbJUUlKA27eVbWWlw/bpUzVb/iH7pwEVR1NSStDSctSjiXQeFeWYRpvNEfMkxh465FmsuMdh+6Zi2NVWYzQsKTGbik84Kvxz58oo9jvcvRvl+tJ7FKUCWsb91oEDKluJczU2miv1xJFSU4GDB7lzn6kENzWZLRN/1c+pnPZMGRnf2J/UG8QhJGUmJAC9vcq5Hj82t8LGbKUoHrM1U6Sozd0X3o8ds7I6UFeXOEVipxyefe79AGLVqne40G1TQKRU1V8bn5SUlv6B3NyC/wL9q8Ff+j6p3/fZU0XFCWzefNRe3U8+ZC/yAXnP3GleVdWnsFrL/G6HQ4suPUM2BHY+WlX1CavzQq7Z0UkQ2SQbHyORvoUKTp78Hjt2pCEzs80wdI0HYWEjUvtDfV3xuWUw/1UkL+8r1NcXMSaGytOkWPhS93D/zxTw5xurdR/u3PmYWewt7kgDOwYKD+9l/fAjf/1ANgb08oP+ILZ/fwJToRVdXe8zHSYx1cahry+ShYYkeBuLjyFGjr8prpXXavlQUk4G/UHsXwEGALqEn42r7IGUAAAAAElFTkSuQmCC",
                name:"承运商1名称",
                price:3.1,
                tranType:"零担运输",
                tranYear:2,
                number:"91430111MA4L16JQ9B",
                peopleName:"张三",
                tel:"13162095658",
                address:"上海市浦东新区碧波路690号",
                time:"2018年6月3日"
             },
            peopleMessage:{
              logo:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmYzllYjE2Yi1lY2MwLTJlNDMtOWU1Ny01Yzk0NTI5Y2RhMTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Qjc5ODI1RTQwNTdFMTFFODgwMDE4Njg1MTNBQ0VFNzEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Qjc5ODI1RTMwNTdFMTFFODgwMDE4Njg1MTNBQ0VFNzEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjJjNWUyNjQ2LTk4MGYtMjI0Ny1iMThjLTA5MjU0ODFjYzM0NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpmYzllYjE2Yi1lY2MwLTJlNDMtOWU1Ny01Yzk0NTI5Y2RhMTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz43DdvjAAAFVUlEQVR42tRZfUhVZxx+PN5NUcu2MrOsmGn/RJrNMiNybVDaGESNuBQIUcmYtbkVw20MIpgMwmxZ5JIwCUYw+ifZilH2R+RHbaZCBdawtFq2xOY08/Pu+d33uPt57j33ejX3wIPXc97f+z7nvO/v431PmC0/H0HidTKLXEemkovJBDJGv99L/km2ki3kFbKOHAxmsLAghKaTH5Efkm8GaNtN/kSWkzcDMdQCaJtG/kz+TuYHIVLwhm4rffyi9xkyoZHkYfI3cqPMAsYP6SNX77NUH2NcQpP1dfUZaUHoIX0W6mMkByt0BVlLLsPEQ8aoJzMDFSoGNWQcJg8zyUtGYjWD6a52CjOTiRh97GR/QiP18BGHV4c4XUOk+2J2RvGErUkLh1q7lgGJEWn6dKYL5oueHuD6deDqVWB42H3Nfkvu8xbw0/RwEXrvnjED2LMHmD9fCTt1Cli5Eti5U93v6ACOHQOeP3e2EuVv61nNZeqLJ0SkvMkxkUaQe3v3qraus13sPvXpegAODIeZB6Kjje+fPw+8fOlb5BgSE4HsbODyZeerG3VtN8feaEFQGceXSEFzM5CRYb4/z7Zhujb7G42AplkxOhp6B3ryBFiwwPu9gQHg2TPXa/Hx3lpK8VNgsQfY0dFov28u0i0duy5884iIUJS3LXRGXp43i1jRaKFRjv3pjLCYZWYh03F4uOv106f9i5ozB2hvB5KSnGowBpc1azxFCvr6jHp614KoqGxDofLku3axIGNFVlPjuL5tG1ePiSUtoiQcOQsVbN2q6I6zZw170hhojauW1auV14rQFy8cdA3OxljH4v/GDeDhQ/9tpY0EfoN51TA4GGtovHQp0NCAoB1t2jRg+3YVzCWoG0HulZX5egHxFgwNvWacdZl2Y1gnLFzoel08ubXVnNjly9XfI0dUNlrB6nHePHXt0SOjFOrxyL4zkTiQiHQXGihErDjlJVZxZ84AnZ0qC82erWbNxFKysDgY4TrUMNGQmdm0SdEd4gO+8Y/GGDmAqY9ODbGxXf8Doa0WCr3HHwsNvVYgXn/tGtDWxjwRq+pKcajjx/0PMTQEPHjg+H/JEmDWLMe92lozQpst9GxZIO95PwthcTs4CFRUqJi6ZQvQ3a0C8/r1Kk76E1lerlKjOJPYVlcrB1q0COjvVw7mH1c0hooq5nGbYRPJSBs2sNhKVwPPnQvs3g1cuOC/e7HNyfG0vXgxkGnvkR2qhsrKLj5tu9cmIyPA/fvcajF53boFFBWpHC+hRepH9+rHHbJUUlKA27eVbWWlw/bpUzVb/iH7pwEVR1NSStDSctSjiXQeFeWYRpvNEfMkxh465FmsuMdh+6Zi2NVWYzQsKTGbik84Kvxz58oo9jvcvRvl+tJ7FKUCWsb91oEDKluJczU2miv1xJFSU4GDB7lzn6kENzWZLRN/1c+pnPZMGRnf2J/UG8QhJGUmJAC9vcq5Hj82t8LGbKUoHrM1U6Sozd0X3o8ds7I6UFeXOEVipxyefe79AGLVqne40G1TQKRU1V8bn5SUlv6B3NyC/wL9q8Ff+j6p3/fZU0XFCWzefNRe3U8+ZC/yAXnP3GleVdWnsFrL/G6HQ4suPUM2BHY+WlX1CavzQq7Z0UkQ2SQbHyORvoUKTp78Hjt2pCEzs80wdI0HYWEjUvtDfV3xuWUw/1UkL+8r1NcXMSaGytOkWPhS93D/zxTw5xurdR/u3PmYWewt7kgDOwYKD+9l/fAjf/1ANgb08oP+ILZ/fwJToRVdXe8zHSYx1cahry+ShYYkeBuLjyFGjr8prpXXavlQUk4G/UHsXwEGALqEn42r7IGUAAAAAElFTkSuQmCC",
              name:"张三白",
              price:3.1,
              tranYear:12,
              carMessgae:{
                 carNumber:"沪D123123",
                 type:"危险品运输/长板"
              },
              compnay:"欣阳集团",
              number:"91430111MA4L16JQ9B"
            }
          }
      },
      mounted:function () {
        var _this = this;
        document.title = _this.$route.query.title;
        _this.type = _this.$route.query.type;
        _this.$nextTick(function () {
          $("#star_grade").markingSystem({
            num: 5,
            havePoint: true,
            haveGrade: true,
            backgroundImageInitial: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABUUExURQAAAP+vFP+uFf+vFf+vFP+uFf+vFf+vEP+vFv+vFf+vFf+uFv+uFf+vFf+vEP+vFv+uFv+vFv+vFf+uFf+vFv+vE/+uFP+vFf+vFf+vFf+vFf+vFnNNxUUAAAAbdFJOUwBwwM9A0GAQgO+g4PCfIN+wf5Bfr1A/MG+PvyqffssAAAD2SURBVDjLrZPZmoMgDIVRKWGroLad5bz/ew5b5ytYuCo3iuf3JCGBsQ8v4ZwY6aQARQNAQmvIocHXOrKQmBnzfYtgwBnjfYsJJj5mTB3AIJXI4U7ej2O7LcgG0QLLbTsez0h7KD4tU86Im/JB/WRH2FnLO3/15HepZ4uYdACuvap+E8AuHYIWXPLLeyLqJc1I0EBPxEID/Q3R6Inwr3vf6LEPsu5r248d1agJ7A0woz7JOBnVsqj3UE1VpZN0LSdiUCeZLWmLU73ROWQuYlKwUlqo73MZEkK4IIefKSDuEM3oTgjmes2bVYdAjQP5f7kgnj51nf8ALCgPDh76n+EAAAAASUVORK5CYII=',
            backgroundImageOver: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABFUExURQAAAP+uFf+vEP+vFf+vFf+vFP+vFP+vEP+uFf+vFv+vFv+vFf+vFv+uFf+vFf+uFf+uFP+vFv+vFf+uFv+uFv+vFf+vFo0I45cAAAAWdFJOUwDwIKDvcEAQ0IDfkH9fYMA/r8+w4I+miN2BAAAArElEQVQ4y62T2xKDIAxEQRECeLfN/39qbUFHCcn0wX1z9syaZAelHtYYwij5ziAaJwAed3k5QIz4BQgRKUCI6DCrY4DXAQSSPQ/9suJF69IP8/GnaJCReX99i4LsP4AC3oc0IktAHpMj4DxYnYDLQWsE3A5OCXBMD1wfsQRiAUwlMBWAJj0UfdIt7kNapgayhPZeV9fw2d5zXUY8TWib9NG0NMFtp52RzT31nD9tUiTQDCmKqQAAAABJRU5ErkJggg==',
            unit: '星',
            grade:_this.companyMessage.price,
            height: 0.4* $("html").css("font-size").replace("px", ""),
            width: 0.4* $("html").css("font-size").replace("px", ""),
          });
        })
      },

    }
</script>

<style>
  #appointMore .set_image_all {
    cursor: pointer;
    position: relative;
  }
  #appointMore  .set_image_top div{
    position: relative;
  }
  #appointMore .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:0.4rem!important;
  }
  #appointMore .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #appointMore .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
  }

  #appointMore .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #appointMore .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #appointMore .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
  }
  #appointMore #messageBox{
    widtH:100%;
    background: white;
    margin-top: 0.2rem;
    padding-bottom: 0.4rem;
  }
  #appointMore .messageFirst{
    width:20%;
    float: left;
    margin:0.25rem 5%;
  }
  #appointMore #messageBox h6{
    widtH:95%;
    margin-left: 5%;
    border-bottom: 1px solid #dbdbdb;
    font-size: 0.375rem;
    line-height: 0.9rem;
    color:#333;
  }
  #appointMore #messageBox h3{
    widtH:95%;
    margin-left: 5%;
    font-size: 0.375rem;
    margin-top: 0.2rem;
    color:#333;
  }
  #appointMore .messageFirst img{
    width:100%;
  }
  #appointMore .messageSecond{
    width:70%;
    float: left;
    margin-top: 0.25rem;
  }
  #appointMore .messageSecond p{
    font-size: 0.375rem;
    color:#333;
  }
  #appointMore #titleS{
     margin-left: 5%;
    font-size: 0.375rem;
    line-height: 0.8rem;
    color:#666;
  }
  #appointMore .messageSecond p span{
    font-size: 0.375rem;
    color:#333;
  }
  #appointMore .messageSecond h1{
    font-size: 0.35rem;
    color:#333;
  }
  #appointMore  .messageSecond h2, #appointMore .messageSecond span{
    font-size: 0.35rem;
    color:#333;
    line-height: 0.7rem;
  }
  #appointMore .messageSecond h2 span{
    margin-left: 0.2rem;
  }
  #appointMore #messgaeCar{
    width:100%;
    background: white;
    padding: 0.2rem 0;
  }
  .shuxian{
    width:95%;
    height: 1px;
    margin:0 0 0.2rem 5%;
    background: #dbdbdb;
  }
  #appointMore #messgaeCar h3{
    margin-left: 5%;
    font-size: 0.375rem;
    margin-bottom: 0.2rem;
  }
</style>
