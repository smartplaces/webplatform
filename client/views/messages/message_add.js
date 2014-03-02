Template.messageNewPage.events({
    'click #delete':function(e){
      e.preventDefault();
      if (confirm("Are you realy want to delete this message?")){
        Messages.remove({_id:this._id}, function(error){
          if (error){
              alert(error.reason);
            }else{
              Router.go('messages');
            }
        });
      }
    },

    'submit form':function(e){
        e.preventDefault();

        var message = {
            text: $(e.target).find('[id=text]').val(),
            url: $(e.target).find('[id=url]').val(),
            description: $(e.target).find('[id=description]').val(),
        }


        if (this._id){
          _.extend(message,{_id:this._id});
        }

        Meteor.call('saveMessage',message,function (error){
            if (error){
              alert(error.reason);
            }else{
              Router.go('messages');
            }
        });
    }

});
