UUID = "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0";
PROXIMITIES = [{code: 'IMMEDIATE',label: 'менее метра'},{code:'NEAR',label:'нескольких метров'},{code:'FAR',label:'дальше, чем 3-4 метра'}];
EVENTS = [{code:'ENTER',label:'подходит'},{code:'EXIT',label:'отходит'}];
FREQUENCIES = [{code:60, label: 'Раз в минуту'},{code:300, label: 'Раз в 5 минут'},{code:3600, label:'Раз в час'},{code:86400,label:'Раз в день'}];

AWSAccessKeyId="AKIAIC2FDX45YKFRD7IQ";

owner = function (userId, doc){
  return doc && userId && doc.userId === userId;
}

loggedIn = function (userId, doc){
  return !! userId;
}

commonFormatDate = function (date){
  return moment(date).format('DD.MM.YYYY');
}


DEFAULT_COUPON ={
  title:'Заголовок',
  coupon:'Купон',
  description:'Описание',
  addInfoLabel:'Дополнительная',
  addInfoValue:'Информация',
  code:'Код - 123456',
  logo:'',
  banner:'',
  bgColor:'',
  textColor:'',
  addInfoTextColor:''
}


