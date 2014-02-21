PROXIMITIES = [{code: 'IMMEDIATE',label: 'Immediate'},{code:'NEAR',label:'Near'},{code:'FAR',label:'Far'}];
EVENTS = [{code:'ENTER',label:'Enter'},{code:'EXIT',label:'Exit'}];
FREQUENCIES = [{code:'1H', label:'One message per hour'},{code:'1D',label:'One message per day'}];

owner = function (userId, doc){
  return doc && userId && doc.userId === userId;
}

loggedIn = function (userId, doc){
  return !! userId;
}
