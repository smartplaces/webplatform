Template.messagesList.helpers({
    messages: function(){
        return Messages.find();
    }
});

Template.messagesList.events({
  'click .message-item-remove': function (e){
    e.preventDefault();
    if (confirm("Вы уверены, что хотите удалить это сообщение?")){
      Messages.remove(e.target.id);
    };
  }
});
