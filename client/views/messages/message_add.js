Template.messageNewPage.helpers({
  image: function(){
    var _iid = (Session.get('message.image'))?Session.get('message.image'):((this.image)?this.image._id:undefined);
    var image = MessageImages.findOne(_iid);
    if (image){
      return image;
    }else{
      return {
        url: function(){return '/sample-background.png';}
      };
    }
  }

});

Template.messageNewPage.events({
  'click #delete':function(e){
    e.preventDefault();
    if (confirm("Вы действительно хотите удалить это сообщение?")){
      Messages.remove({_id:this._id}, function(error){
        if (error){
          alert(error.reason);
        }else{
          Router.go('messages');
        }
      });
    }
  },

  'change #image': function(e,t){
    var fsFile = new FS.File(e.target.files[0]);

    fsFile.userId = Meteor.userId();

    var image = MessageImages.insert(fsFile,function(err,fileObj){
      if (err){
        console.log(err);
      }else{
        Session.set('message.image',fileObj._id);
      }
    });

    Router.go('/messages/'+'new'+'/image/'+image._id);
  },

  'submit form':function(e,t){
    e.preventDefault();

    var message = {
      text: $(e.target).find('[id=text]').val(),
      url: $(e.target).find('[id=url]').val(),
      description: $(e.target).find('[id=description]').val(),
    }

    message.image = (Session.get('message.image'))?Session.get('message.image'):((t.data && t.data.image) ? t.data.image._id : undefined);

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
