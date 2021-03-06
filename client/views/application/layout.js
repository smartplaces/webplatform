Template.layout.rendered=function (){
    $('li.active').removeClass('active');
    $('li > a[href="' + window.location.pathname + '"]').parent().addClass('active');
};

Template.layout.helpers({
  isLoggedIn: function() {
      return !!Meteor.user();
  },

  username: function() {
    var profile = Meteor.user().profile;
    if (profile && profile.firstName && profile.lastName){
      return profile.firstName+" "+profile.lastName;
    }else if (Meteor.user().emails && Meteor.user().emails.length > 0){
      return Meteor.user().emails[0].address;
    }else{
      return "Профиль";
    }
  }
});
