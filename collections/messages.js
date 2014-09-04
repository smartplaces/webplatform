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

    if (message.messagetype == 10 && (!message.header || !message.text) || message.messagetype == 20 && !message.url){
      throw new Meteor.Error(422,'Пожалуйста, заполните все необходимые поля!');
    }

    var data = _.extend(_.pick(message,'text','url','description','header','messagetype'), {
      userId: user._id,
      updated: new Date().getTime(),
      image: {}
    });

    var image = MessageImages.findOne(message.image);

    if (image){
      data.image = {
        _id: image._id,
        key: image.getFileRecord().copies.message_images.key
      };
    }

    var msgId = undefined;

    if (message._id){
      msgId = message._id;
      Messages.update(message._id,{$set:data},function (error){
        if (error){
          throw new Meteor.Error(500, 'Ошибка: невозможно сохранить сообщение :(!');
        }
      });
    }else{
      msgId = Messages.insert(data);
    }

    if (image){
      MessageImages.update(image._id,{$set:{msgId:msgId}}, function (error){
          if (error){
            throw new Meteor.Error(500, 'Ошибка: невозможно обновить метаданные для message_image :(!');
          }
        });
    }
  }
});
