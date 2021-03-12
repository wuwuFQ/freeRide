

module.exports = {
  formatDate: formatDate,
  formatTime: formatTime,
  formatDateTime: formatDateTime,
  isNull: isNull,
  numberToFix: numberToFix,
  formatTimeDate: formatTimeDate,
  dateTimeStringToTimeStamp: dateTimeStringToTimeStamp,
};

// 日期格式化 2021-02-26
function formatDate (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${[year, month, day].map(formatNumber).join('-')}`
}
// 时间格式化 11:01
function formatTime (date) {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return `${[hour, minute].map(formatNumber).join(':')}`
}
// 日期时间格式化  2021-02-26 11:01:32
function formatDateTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
// obj是空值?
function isNull(obj) {
  if (obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 毫秒
 * format：返回格式自定义，但参数必须与formateArr里保持一致 (Y年M月D日 h:m:s) (Y-M-D h:m:s)
*/
function formatTimeDate(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(parseInt(number));
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

/**时间字符串 转 时间戳 
 *  date 2021-03-01 11:13:26 
 * 返回时间戳timestamp = 1614569100000 毫秒
 */
function dateTimeStringToTimeStamp(dateStr) {
  //把日期'-'转为'/'  
  // date = date.replace(/-/g,'/'); 
  var timestamp = new Date(dateStr).getTime();
  return timestamp;
}

/**把数字转换成字符串，保留几位小数
 * value: 数字
 * num: 保留几位小数
 */
function numberToFix(value, num) {
  return value.toFixed(num)
}
