// author: underscore
// 函数去抖（连续事件触发结束后只触发一次）
// sample 1: Underscore.Debounce(function(){}, 1000)
// 连续事件结束后的 1000ms 后触发
// sample 1: Underscore.Debounce(function(){}, 1000, true)
// 连续事件立即触发一次（此时会忽略第二个参数），连续事件结束后的 1000ms 不触发
// ----------------------------------------- //

const Debounce = function(func, wait, immediate) {
    let timeout, args, context, timestamp, result;
    const later = function() {
        const last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            clearTimeout(timeout);
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function() {
        context = this;
        args = arguments;
        timestamp = Date.now();
        const callNow = immediate && !timeout;
        if (!timeout)
            timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
}

export default Debounce;
