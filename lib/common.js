UUID = "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0";
PROXIMITIES = [{code: 'IMMEDIATE',label: 'Immediate'},{code:'NEAR',label:'Near'},{code:'FAR',label:'Far'}];
EVENTS = [{code:'ENTER',label:'Enter'},{code:'EXIT',label:'Exit'}];
FREQUENCIES = [{code:'1H', label:'One message per hour'},{code:'1D',label:'One message per day'}];

owner = function (userId, doc){
  return doc && userId && doc.userId === userId;
}

loggedIn = function (userId, doc){
  return !! userId;
}
