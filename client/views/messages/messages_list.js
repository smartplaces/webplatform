Template.messagesList.helpers({
    messages: function(){
        return Messages.find();
    },

    confirmData: function(){
        return {
            title: "Удаление сообщения",
            body: "Вы уверены, что хотите удалить это сообщение?",
            actionClass: 'remove-confirm-ok'
        };
    }
});

Template.messagesList.events({
    'click .message-item-remove': function (e){
        e.preventDefault();
        Session.set('unconfirmDeleteMessage',e.target.id);
        $('#confirmModal').modal('show');
    },
    'click .remove-confirm-ok': function(e,t){
        e.preventDefault();
        var id = Session.get('unconfirmDeleteMessage');
        Session.set('unconfirmDeleteMessage',undefined);
        $('#confirmModal').modal('hide');
        Messages.remove(id, function(error){
            if (error){
                createAlert(error.reason);
            }
        });
    }
});
