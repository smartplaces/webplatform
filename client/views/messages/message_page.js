Template.messagePage.created = function (){
  if (this.data) {
    Session.set('message.header',this.data.header);
    Session.set('message.text',this.data.text);
    Session.set('message.url',this.data.url);
    Session.set('message.description',this.data.description);
    if (this.data.image){
      Session.set('message.image',this.data.image._id);    
    }

  }else{
    Session.set('message.header',undefined);
    Session.set('message.text',undefined);
    Session.set('message.url',undefined);
    Session.set('message.description',undefined);
    Session.set('message.image',undefined);
  }
}

Template.messagePage.rendered = function (){
  
  if (this.data && this.data.messagetype) {
    $('#messagetype').val(this.data.messagetype).trigger('change');
  }
  
  var format = function(state) {
    if (state.id){
      var i = Images.findOne(state.id);
      if (i){
        return '<img src="'+i.url({store:'thumbnail'})+'"/>';  
      }else{
        return state.text;  
      }
    }else{
      return state.text;  
    }
    
  }
  
  $('#image').select2({
    formatResult: format,
    escapeMarkup: function(m) { return m; }
  });
  
  if (this.data && this.data.image){
    $('#image').val(this.data.image._id).trigger('change');  
  }

}

Template.messagePage.helpers({
  
  images: function(){
    return Images.find();
  },
  
  image: function(){
    var i = Images.findOne(Session.get('message.image'));
    if (i){
      return i.url({store:'thumbnail'});
    }else{
      return "";
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

Template.messagePage.events({
  'click #delete':function(e){
    e.preventDefault();
    if (confirm("Are you realy want to delete this message?")){
      Messages.remove({_id:this._id}, function(error){
        if (error){
          createAlert('Danger',error.reason);
        }else{
          Router.go('messages');
        }
      });
    }
  },

  'change #image': function(e,t){
    Session.set('message.image',e.target.value);
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
      image: $(e.target).find('[id=image]').val()
    }

    if (this._id){
      _.extend(message,{_id:this._id});
    }
    
    Meteor.call('saveMessage',message,function (error){
      if (error){
        createAlert('Danger',error.reason);
      }else{
        Router.go('messages');
      }
    });
  }

});
