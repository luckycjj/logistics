<template>
    <div id="calculator">
      <div id="title" v-title data-title="欣阳计算器"></div>
      <div class="calc-wrap">
        <div class="calc-in-out">
          <!-- 上一条运算记录 -->
          <p class="calc-history" title=""></p>
          <!-- 输入的数据 -->
          <p class="calc-in"></p>
          <!-- 输出的运算结果 -->
          <p class="calc-out active"></p>
        </div>
        <table class="calc-operation">
          <thead></thead>
          <tbody>
          <tr>
            <td data-ac="cls" class="cls">C</td>
            <td data-ac="del">&larr;</td>
            <td data-ac="sq">x<sup>2</sup></td>
            <td data-ac="mul">&times;</td>
          </tr>
          <tr>
            <td data-val="7">7</td>
            <td data-val="8">8</td>
            <td data-val="9">9</td>
            <td data-ac="div">&divide;</td>
          </tr>
          <tr>
            <td data-val="4">4</td>
            <td data-val="5">5</td>
            <td data-val="6">6</td>
            <td data-ac="plus">+</td>
          </tr>
          <tr>
            <td data-val="1">1</td>
            <td data-val="2">2</td>
            <td data-val="3">3</td>
            <td data-ac="minus">-</td>
          </tr>
          <td data-ac="per">%</td>
          <td data-val="0">0</td>
          <td data-ac="dot">.</td>
          <td data-ac="eq" class="eq">=</td>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script>
    export default {
        name: "calculator",
        data(){
          return{

          }
        },
        mounted:function () {
          function Calculator($dom) {
            this.$dom = $($dom);
            // 历史运算
            this.$history = this.$dom.find('.calc-history');
            // 输入区
            this.$in = this.$dom.find('.calc-in');
            // 输出区
            this.$out = this.$dom.find('.calc-out');
            this.$operation = this.$dom.find('.calc-operation');

            // 运算符映射
            this.op = {
              'plus': '+',
              'minus': '-',
              'mul': '*',
              'div': '/'
            };
            this.opArr = ['+', '-', '*', '/'];

            // 中缀表达式
            this.infix = [];
            // 后缀表达式
            this.suffix = [];
            // 后缀表达式运算结果集
            this.result = [];
            // 存储最近的值
            this.lastVal = 0;
            // 当前已经计算等于完成
            this.calcDone = false;
            // 当前正在进行小数点点（.）相关值的修正
            this.curDot = false;

            this.init();
          }

          Calculator.prototype = {
            constructor: Calculator,
            // 初始化
            init: function() {
              this.bindEvent();
            },
            // 绑定事件
            bindEvent: function() {
              var that = this;

              that.$operation.on('click', function(e) {
                e = e || window.event;
                var elem = e.target || e.srcElement,
                  val,
                  action;

                if (elem.tagName === 'TD') {
                  val = elem.getAttribute('data-val') || elem.getAttribute('data-ac');
                  // 数字：0-9
                  if (!isNaN(parseInt(val, 10))) {
                    // 构建中缀表达式并显示
                    var infixRe = that.buildInfix(parseInt(val, 10), 'add');
                    that.$in.text(infixRe.join('')).addClass('active');

                    that.calculate();

                    return;
                  }

                  action = val;

                  // 操作：清除、删除、计算等于
                  if (['cls', 'del', 'eq'].indexOf(action) !== -1) {
                    if (!that.infix.length) {
                      return;
                    }

                    // 清空数据
                    if (action === 'cls' || (action === 'del' && that.calcDone)) {
                      that.$in.text('');
                      that.$out.text('');

                      that.resetData();
                    }
                    // 清除
                    else if (action === 'del') {
                      // 重新构建中缀表达式
                      var infixRe = that.buildInfix(that.op[action], 'del');
                      that.$in.text(infixRe.join('')).addClass('active');

                      that.calculate();

                    }
                    // 等于
                    else if (action === 'eq') {
                      that.calculate('eq');

                    }
                  }
                  // 预运算：百分比、小数点、平方
                  else if (['per', 'dot', 'sq'].indexOf(action) !== -1) {
                    if (!that.infix.length || that.isOp(that.lastVal)) {
                      return;
                    }

                    if (action === 'per') {
                      that.lastVal /= 100;
                    } else if (action === 'sq') {
                      that.lastVal *= that.lastVal;
                    } else if (action === 'dot') {
                       var cc = that.lastVal.toString();
                       if(cc.indexOf(".") == -1){
                          that.lastVal = that.lastVal+'.';
                       }
                    }

                    // 重新构建中缀表达式
                    var infixRe = that.buildInfix(that.lastVal, 'change');
                    that.$in.text(infixRe.join('')).addClass('active');

                    that.calculate();
                  }
                  // 运算符：+ - * /
                  else if (that.isOp(that.op[action])) {
                    if (!that.infix.length && (that.op[action] === '*' || that.op[action] === '/')) {
                      return;
                    }

                    var infixRe = that.buildInfix(that.op[action], 'add');
                    that.$in.text(infixRe.join('')).addClass('active');
                  }
                }
              });
            },

            resetData: function() {
              this.infix = [];
              this.suffix = [];
              this.result = [];
              this.lastVal = 0;
              this.curDot = false;
            },

            // 构建中缀表达式
            buildInfix: function(val, type) {
              // 直接的点击等于运算之后，
              if (this.calcDone) {
                this.calcDone = false;
                // 再点击数字，则进行新的运算
                if (!this.isOp(val)) {
                  this.resetData();
                }
                // 再点击运算符，则使用当前的结果值继续进行运算
                else {
                  var re = this.result[0];
                  this.resetData();
                  this.infix.push(re);
                }

              }

              var newVal;

              // 删除操作
              if (type === 'del') {
                newVal = this.infix.pop();
                // 删除末尾一位数
                newVal = Math.floor(newVal / 10);
                if (newVal) {
                  this.infix.push(newVal);
                }

                this.lastVal = this.infix[this.infix.length - 1];
                return this.infix;
              }
              // 添加操作，首先得判断运算符是否重复
              else if (type === 'add') {
                // 两个连续的运算符
                if (this.isOp(val) && this.isOp(this.lastVal)) {
                  return this.infix;
                }
                // 两个连续的数字
                else if (!this.isOp(val) && !this.isOp(this.lastVal)) {
                  var cc = this.lastVal.toString();
                  if(cc.indexOf(".")==-1){
                    newVal = this.lastVal * 10 + val;
                  }else{
                    newVal = this.lastVal.toString() + val;
                  }

                  this.infix.pop();
                  this.infix.push(this.lastVal = newVal);

                  return this.infix;
                }
                // 首个数字正负数
                if (!this.isOp(val) && this.infix.length === 1 && (this.lastVal === '+' || this.lastVal === '-')) {
                  newVal = this.lastVal === '+' ? val : 0 - val;
                  this.infix.pop();
                  this.infix.push(this.lastVal = newVal);

                  return this.infix;
                }


                this.infix.push(this.lastVal = val);
                return this.infix;
              }

              // 更改操作，比如%的预运算
              else if (type === 'change') {
                this.infix.pop();
                this.infix.push(this.lastVal = val);

                return this.infix;
              }

            },
            // 判断是否为运算符
            isOp: function(op) {
              return op && this.opArr.indexOf(op) !== -1;
            },
            // 判断运算符优先级
            priorHigher: function(a, b) {
              return (a === '+' || a === '-') && (b === '*' || b === '/');
            },
            // 进行运算符的运算
            opCalc: function(b, op, a) {
              return op === '+'
                ? a + b
                : op === '-'
                  ? a - b
                  : op === '*'
                    ? a * b
                    : op === '/'
                      ? a / b
                      : 0;
            },
            // 即时得进行运算
            calculate: function(type) {
              this.infix2Suffix();
              var suffixRe = this.calcSuffix();

              if (suffixRe) {
                this.$out.text('=' + suffixRe)
                  .attr('title', suffixRe)
                  .removeClass('active');

                // 如果是直接显示地进行等于运算
                if (type === 'eq') {
                  this.$in.removeClass('active');
                  this.$out.addClass('active');
                  // 设置标记：当前已经显示地进行计算
                  this.calcDone = true;
                  this.lastVal = suffixRe;
                  // 设置历史记录
                  var history = this.infix.join('') + ' = ' + suffixRe;
                  this.$history.text(history).attr('title', history);
                }

              }
            },

            // 中缀表达式转后缀
            infix2Suffix: function() {
              var temp = [];
              this.suffix = [];

              for (var i = 0; i < this.infix.length; i++) {
                // 数值，直接压入
                if (!this.isOp(this.infix[i])) {
                  this.suffix.push(this.infix[i]);
                }
                else {
                  if (!temp.length) {
                    temp.push(this.infix[i]);
                  }
                  else {
                    var opTop = temp[temp.length - 1];
                    // 循环判断运算符优先级，将运算符较高的压入后缀表达式
                    if (!this.priorHigher(opTop, this.infix[i])) {
                      while (temp.length && !this.priorHigher(opTop, this.infix[i])) {
                        this.suffix.push(temp.pop());
                        opTop = temp[temp.length - 1];
                      }
                    }
                    // 将当前运算符也压入后缀表达式
                    temp.push(this.infix[i]);
                  }
                }
              }
              // 将剩余运算符号压入
              while (temp.length) {
                this.suffix.push(temp.pop());
              }
            },

            // 后缀表达式计算
            calcSuffix: function() {
              this.result = [];
              for (var i = 0; i < this.suffix.length; i++) {
                // 数值，直接压入结果集
                if (!this.isOp(this.suffix[i])) {
                  this.result.push(Number(this.suffix[i]));
                }
                // 运算符，从结果集中取出两项进行运算，并将运算结果置入结果集合
                else {
                  this.result.push(this.opCalc(this.result.pop(), this.suffix[i], this.result.pop()));
                }
              }
              // 此时结果集中只有一个值，即为结果
              return this.result[0];
            }
          };

          new Calculator('.calc-wrap');
        }
    }
</script>

<style scoped>
  .calc-wrap {
    width: 8rem;
    margin:0.3rem auto;
    border: 1px solid #ddd;
    border-radius: 0.08rem;
  }


  .calc-operation {
    width: 100%;
    border-collapse: collapse;
  }

  .calc-in-out {
    width: 100%;
    padding: 0.267rem 0.534rem;
    text-align: right;
    box-sizing: border-box;
    background-color: rgba(250, 250, 250, .9);
  }
  .calc-in-out p {
    overflow: hidden;
    margin: 0.1333rem;
    width: 100%;
  }
  .calc-history {
    margin-left: -0.533333rem;
    font-size:0.48rem;
    color: #bbb;
    border-bottom: 1px dotted #ddf;
    min-height: 0.613333rem;
  }

  .calc-in,
  .calc-out {
    font-size: 0.5rem;
    color: #888;
    line-height:1.04rem;
    min-height: 1.04rem;
  }

  .calc-in {
    color: #888;
  }
  .calc-out {
    color: #ccc;
  }

  .calc-in.active,
  .calc-out.active {
    font-size: 0.88rem;
    color: #666;
    word-wrap:break-word
  }

  .calc-operation td {
    padding: 0.26667rem;
    width: 25%;
    text-align: center;
    border: 1px solid #ddd;
    font-size: 0.693333rem;
    color: #888;
    cursor: pointer;
  }

  .calc-operation td:active {
    background-color: #ddd;
  }

  .calc-operation .cls {
    color: #ee8956;
  }
</style>
