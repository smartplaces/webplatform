UUID = "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0";
PROXIMITIES = [{code: 'IMMEDIATE',label: 'менее метра'},{code:'NEAR',label:'нескольких метров'},{code:'FAR',label:'дальше, чем 3-4 метра'}];
EVENTS = [{code:'ENTER',label:'подходит'},{code:'EXIT',label:'отходит'}];
FREQUENCIES = [{code:'1H', label:'Раз в час'},{code:'1D',label:'Раз в день'}];

owner = function (userId, doc){
  return doc && userId && doc.userId === userId;
}

loggedIn = function (userId, doc){
  return !! userId;
}

commonFormatDate = function (date){
  return moment(date).format('DD.MM.YYYY');
}
