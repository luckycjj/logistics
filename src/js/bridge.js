import { isAndroid } from './detector';

const noop = () => {};

/**
 * @desc 使用iframe的方式与native通信，创建bridge对象
 * @param {function} callback - callback接受bridge对象，
 * bridge对象有registerHandler和callHandler两个方法，首先
 * 调用registerHandler，然后调用callHandler方法。
 */
const setupWebViewJavascriptBridge = (callback) => {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  const WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  return setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
};

/**
 * @desc 调用native的方法
 * @param {string} method - 要调用的native方法名
 * @param {string} params - 调用native方法所需要传递的参数，
 * 如果需要传递对象JSON.stringify成string, 默认为空字符串。
 * @param {function} callback - 调用native方法之后的callback。
 */
const invoke = (method, params = '', callback = noop) => {
  console.log('========== INVOKE BEGIN ==========');
  console.log('==> bridge: ', window.WebViewJavascriptBridge);
  console.log('==> params: ', params);
  console.log('==> method: ', method);
  console.log('==> callback: ', callback);
  console.log('========== INVOKE END ==========');
  if (isAndroid() && window.WebViewJavascriptBridge) {
    window.WebViewJavascriptBridge.callHandler(method, params, callback);
    return;
  }
  setupWebViewJavascriptBridge(bridge => bridge.callHandler(method, params, callback));
};

/**
 * @desc 把js的方法暴露给native调用
 * @param {string} method - 暴露给native方法名
 * @param {function} callback - 暴露给native的callback。
 */
const register = (method, callback = noop) => {
  if (isAndroid() && window.WebViewJavascriptBridge) {
    window.WebViewJavascriptBridge.registerHandler(method, callback);
    return;
  }
  setupWebViewJavascriptBridge(bridge => { // eslint-disable-line
    bridge.registerHandler(method, callback);
  });
};

const callbackUUID = () => {
  const s4 = () => (Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
  return `callback$${s4()}$${s4()}$${s4()}$${s4()}$${s4()}$${s4()}$${s4()}`;
};

export default {
  invoke,
  register,
  callbackUUID,
};
