const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//将日期字符串转换为日期 字符串格式yyyy-MM-dd HH:mm:ss
const formatTimeStrToDate = timeStr => {
  let tempStrs = timeStr.split(" ");
  let dateStrs = tempStrs[0].split("-");
  var year = parseInt(dateStrs[0], 10);
  var month = parseInt(dateStrs[1], 10) - 1;
  var day = parseInt(dateStrs[2], 10);
  var timeStrs = tempStrs[1].split(":");
  var hour = parseInt(timeStrs [0], 10);
  var minute = parseInt(timeStrs[1], 10);
  var second = parseInt(timeStrs[2], 10);
  var date = new Date(year, month, day, hour, minute, second);
  return date;
}
//计算两个日期的时间差
const caclDateReduce = (dateStart,dateEnd) => {
  let retValue = {}
  let compareTime = dateEnd - dateStart;
  console.log(compareTime);
  // 计算出相差天数
  let days = Math.floor(compareTime / (24 * 3600 * 1000))
  retValue.Days = days
  // 计算出小时数
  let leaveHours = compareTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  let hours = Math.floor(leaveHours / (3600 * 1000))
  retValue.Hours = hours
  // 计算相差分钟数
  let leaveMinutes = leaveHours % (3600 * 1000) // 计算小时数后剩余的毫秒数
  let minutes = Math.floor(leaveMinutes / (60 * 1000))
  retValue.Minutes = minutes
  // 计算相差秒数
  let leaveSeconds = leaveMinutes % (60 * 1000) // 计算分钟数后剩余的毫秒数
  let seconds = Math.round(leaveSeconds / 1000)
  retValue.Seconds = seconds
  return retValue;
}

module.exports = {
  formatTime: formatTime,
  formatTimeStrToDate: formatTimeStrToDate,
  caclDateReduce: caclDateReduce
}
