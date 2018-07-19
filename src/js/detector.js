/**
 * @desc 检测在userAgent中是否包含某个字符串
 * @param {string} needle - 关键字
 * @return {boolean} 如果匹配到关键字返回true，否则返回false
 */
const find = needle =>
  new RegExp(needle.toLocaleLowerCase()).test(window.navigator.userAgent.toLocaleLowerCase());

/**
 * @description 判断是不是是在微信环境下
 * @return {boolean} 如果是在微信中返回true
 */
export const isWeChat = () => find('MicroMessenger');

/**
 * @description 判断是不是在途牛金服App中，和native约定他们复写webview的
 * userAgent，在userAgent最后添加'; TuniuFinacial;'
 * @return {boolean} 如果是在途牛金服App中返回true
 */
export const isApp = () => find('TuniuFinacial');

/**
 * @description 判断是不是在iOS环境下
 * @return {boolean} 如果是在iOS环境下返回true
 */
export const isiOS = () => find('iPhone|iPad|iPod');

/**
 * @description 判断是不是在Android环境下
 * @return {boolean} 如果是在Android环境下返回true
 */
export const isAndroid = () => find('Android');
