var sep = "#*#";
var messages = [];
var showNumber = 10;
var bottomPlace = showNumber;


function procMessage(data) {
  var str = "";
  str = str +  data;
  return str;
}

//如果是服务器的转发消息的处理
function addFordMess(datas, username) {
  var m = {};
  m.username = datas[1];
  m.date = datas[2];
  m.message = datas[3];
  messages.push(m);
  return (bottomPlace >= messages.length - 1);
}

//将收到的消息加入队列
function addMessage(data, username) {
  var datas = data.split(sep);
  //消息的类型
  var type = parseInt(datas[0]);

  //服务器的转发消息
  if (type == 2)
    return addFordMess(datas, username);
}

function getMessages() {
  return messages;
}

//获取指定范围的消息列表
function chooseMessages(start, end) {
  var temp = [];
  for (var i = start; i < end; i++) {
    temp.push(messages[i]);
  }
  return temp;
}

//获取当前最新的用于显示的消息列表
function getNewMessages() {
  var end = messages.length;
  var start = end - showNumber;
  if (start < 0)
    start = 0;

  end = start + showNumber;
  if (end > messages.length)
    end = messages.length;

  bottomPlace = end;
  return chooseMessages(start, end);
}

//获取前x个消息的列表
function lastMessages() {
  var end = bottomPlace - showNumber;
  var start = end - showNumber;
  if (start < 0)
    start = 0;

  end = start + showNumber;
  if (end > messages.length)
    end = messages.length;

  bottomPlace = end;
  return chooseMessages(start, end);
}

//获取后x个消息的列表
function nextMessages() {
  var end = bottomPlace + showNumber;
  var start = 0;
  if (end > messages.length)
    end = messages.length;

  start = end - showNumber;
  if (start < 0)
    start = 0;

  bottomPlace = end;
  return chooseMessages(start, end);
}

//清除消息
function clearMessages() {
  bottomPlace = showNumber;
  messages = [];
}



module.exports = {
  procMessage: procMessage,
  addMessage: addMessage,
  getMessages: getMessages,
  lastMessages: lastMessages,
  nextMessages: nextMessages,
  getNewMessages: getNewMessages,
  clearMessages: clearMessages
}