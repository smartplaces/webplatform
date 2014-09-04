Template.messageNewPage.rendered = function (){

    Session.set('message.header',undefined);
    Session.set('message.text',undefined);
    Session.set('message.url',undefined);
    Session.set('message.description',undefined);

    $('#messagetype').val(10).trigger('change');

}

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
  },
  header: function(){
    return Session.get('message.header');
  },
  text: function(){
    return Session.get('message.text');
  },
  url: function(){
    return Session.get('message.url');
  },
  description: function(){
    return Session.get('message.description');
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

  'change #messagetype': function(e,t){
    switch (e.target.value) {
      case '10':
        $('.type-page-group').removeClass('hidden');
        $('.type-url-group').addClass('hidden');
        break;
      case '20':
        $('.type-page-group').addClass('hidden');
        $('.type-url-group').removeClass('hidden');
        break;
    };
  },

  'change #header': function(e,t){
    Session.set('message.header',e.target.value);
  },

  'change #text': function(e,t){
    Session.set('message.text',e.target.value);
  },

  'change #url': function(e,t){
    Session.set('message.url',e.target.value);
  },

  'change #description': function(e,t){
    Session.set('message.description',e.target.value);
  },

  'submit form':function(e,t){
    e.preventDefault();

    var message = {
      messagetype: $(e.target).find('[id=messagetype]').val(),
      header: $(e.target).find('[id=header]').val(),
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
