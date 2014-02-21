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
      throw new Meteor.Error(401,'You need to login to edit messages!');
    }

    if (!message.text || !message.url){
      throw new Meteor.Error(422,'Please fill in required fields!');
    }

    var data = _.extend(_.pick(message,'text','url','description'), {
      userId: user._id,
      updated: new Date().getTime()
    });

    if (message._id){
      Messages.update(message._id,{$set:data},function (error){
        if (error){
          throw new Meteor.Error(500, 'Can\'t save message data!');
        }
      });
    }else{
      Messages.insert(data);
    }
  }
});
