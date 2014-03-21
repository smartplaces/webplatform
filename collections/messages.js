Messages = new Meteor.Collection('messages');

Messages.allow({
  insert: loggedIn,
  update: owner,
  remove: owner

});

Meteor.methods({
  saveMessage: function (message){
    var user = Meteor.user();
    if (!user){
      throw new Meteor.Error(401,'Вам нужно залогиниться чтобы редактировать сообщения!');
    }

    if (!message.text){
      throw new Meteor.Error(422,'Пожалуйста, заполните все необходимые поля!');
    }

    var data = _.extend(_.pick(message,'text','url','description'), {
      userId: user._id,
      updated: new Date().getTime()
    });

    if (message._id){
      Messages.update(message._id,{$set:data},function (error){
        if (error){
          throw new Meteor.Error(500, 'Ошибка: невозможно сохранить сообщение :(!');
        }
      });
    }else{
      Messages.insert(data);
    }
  }
});
