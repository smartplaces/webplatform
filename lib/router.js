Router.configure({
  layoutTemplate: 'layout'
});

Router.onBeforeAction('loading');

Router.onBeforeAction(function(pause){
  AccountsEntry.signInRequired(this,pause);
},{except:['entrySignIn','entrySignUp']});

Router.onBeforeAction(function(pause){
  if (Meteor.isClient){
    clearAlert();
  }
  this.next();
});

Router.map(function (){
  this.route('profile',{path:'/profile', data:function () {return Meteor.user();}});

  this.route('index',{
    path:'/',
    onBeforeAction: function () { Router.go('locations'); }
  });

  this.route('beacons',{
    path:'/beacons',
    template:'beaconsList',
    waitOn: function () {return [Meteor.subscribe('locations'), Meteor.subscribe('tags')];}
  });

  this.route('newbeacon',{
    path:'/beacons/new',
    template:'beaconPage',
    waitOn: function () {return[Meteor.subscribe('locations'), Meteor.subscribe('tags')];}
  });

  this.route('beacon', {
    path: '/beacons/:uuid/:major/:minor',
    template: 'beaconPage',
    data: function (){
      var location = Locations.findOne({uuid:this.params.uuid,major:parseInt(this.params.major)});
      var beacon = null;
      var minor = parseInt(this.params.minor);
      if (location){
        _.each(location.beacons, function(b){
          if (beacon===null && b.minor == minor){
            beacon = b;
          }
        });
      }
      return beacon;
    },
    waitOn: function () {return[Meteor.subscribe('locations'), Meteor.subscribe('tags')];}
  });

  this.route('locations',{
    path:'/locations',
    template:'locationsList',
    waitOn: function () {return Meteor.subscribe('locations');}
  });


  this.route('newlocation',{
    path:'/locations/new',
    template:'locationPage',
    waitOn: function () {return Meteor.subscribe('locations');}
  });

  this.route('location',{
    path:'/locations/:_id',
    template:'locationPage',
    data: function() {return Locations.findOne(this.params._id)},
    waitOn: function () {return Meteor.subscribe('locations');}
  });

  this.route('images',{
    path:'/images',
    template: 'imagesList',
    waitOn: function () {return Meteor.subscribe('images');}
  });
  
  this.route('messages',{
    path:'/messages',
    template:'messagesList',
    waitOn: function () {return [Meteor.subscribe('messages'), Meteor.subscribe('images')];}
  });

  this.route('newmessage',{
    path:'/messages/new',
    template:'messagePage',
    waitOn: function () {return [Meteor.subscribe('messages'), Meteor.subscribe('images')];}
  });

  
  this.route('message',{
    path:'/messages/:_id',
    template:'messagePage',
    data: function() {return Messages.findOne(this.params._id)},
    waitOn: function () {return [Meteor.subscribe('messages'), Meteor.subscribe('images')];}
  });


  this.route('scenarios',{
    path:'/scenarios',
    template:'scenariosList',
    waitOn: function () {return [Meteor.subscribe('scenarios'),Meteor.subscribe('messages')];}
  });

  this.route('newscenario',{
    path:'/scenarios/new',
    template:'scenarioPage',
    waitOn: function () {return [Meteor.subscribe('scenarios'),Meteor.subscribe('tags'),Meteor.subscribe('messages')];}
  });

  this.route('scenario',{
    path:'/scenarios/:_id',
    template:'scenarioPage',
    data: function() {return Scenarios.findOne(this.params._id);},
    waitOn: function () {return [Meteor.subscribe('scenarios'),Meteor.subscribe('tags'),Meteor.subscribe('messages')];}
  });

  this.route('coupons',{
    path:'/coupons',
    template:'couponsList',
    waitOn: function () {return Meteor.subscribe('coupons');}
  });

  this.route('newcoupon',{
    path:'/coupons/new',
    template:'couponPage',
    waitOn: function () {return [Meteor.subscribe('coupons'), Meteor.subscribe('locations'), Meteor.subscribe('images')]}
  });
  
  this.route('coupon',{
    path:'/coupons/:_id',
    template:'couponPage',
    data: function() {return Coupons.findOne(this.params._id)},
    waitOn: function () {return [Meteor.subscribe('coupons'), Meteor.subscribe('locations'), Meteor.subscribe('images')]}
  });

  this.route('getting_started', {
    path: '/getting_started', 
    template: 'getting_started',
    onBeforeAction: function() {
      AccountsEntry.signInRequired(this);
    }
  });
  
});

var requireLogin = function (){
  if (!Meteor.user()){
    this.render('accessDenied');
    this.stop();
  }
}
