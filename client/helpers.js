UI.registerHelper('alertClass', function(){
  var clazz = Session.get('alertClass');
  if(clazz == "Success"){
    return "alert-success";
  }else if(clazz == "Info"){
    return "alert-info";
  }else if(clazz == "Warning"){
    return "alert-warning";
  }else if(clazz == "Danger"){
    return "alert-danger";
  }else{
    return "alert-hidden"
  }
});

UI.registerHelper('alertMessage', function(){
  return Session.get('alertMessage') || "";
});

createAlert = function(clazz, message){
  Session.set('alertClass', clazz);
  Session.set('alertMessage', message);
};

clearAlert = function(){
  Session.set('alertClass', undefined);
  Session.set('alertMessage', undefined);
};