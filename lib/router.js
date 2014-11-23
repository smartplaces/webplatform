Router.configure({
  layoutTemplate: 'layout'
});

Router.onBeforeAction('loading');

Router.onBeforeAction(function(pause){
  AccountsEntry.signInRequired(this,pause);
},{except:['entrySignIn','entrySignUp']});

Router.map(function (){
  this.route('profile',{path:'/profile', data:function () {return Meteor.user();}});

  this.route('index',{
    path:'/',
    onBeforeAction: function () { Router.go('locations'); }
  });

  this.route('beacons',{
    path:'/beacons',
    template:'beaconsList',
    waitOn: function () {return [Meteor.subscribe('locations'), Meteor.subscribe('beacons'), Meteor.subscribe('tags')];}
  });

  this.route('newbeacon',{
    path:'/beacons/new',
    template:'beaconNewPage',
    waitOn: function () {return[Meteor.subscribe('locations'), Meteor.subscribe('beacons'), Meteor.subscribe('tags')];}
  });

  this.route('editbeacon', {
    path: '/beacons/edit/:uuid/:major/:minor',
    template: 'beaconPage',
    data: function (){
      var location = Locations.findOne({uuid:this.params.uuid,major:parseInt(this.params.major)});
      var beacon = null;
      var minor = this.params.minor;
      if (location){
        _.each(location.beacons, function(b){
          if (beacon==null && b.minor == minor){
            beacon = b;
          }
        });
      }
      return beacon;
    }
  });

  this.route('beacon',{
    path:'/beacons/:_id',
    template:'beaconPage',
    data: function () {return Beacons.findOne(this.params._id)},
    waitOn: function () {return [Meteor.subscribe('locations'), Meteor.subscribe('beacons'), Meteor.subscribe('tags')];}
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
    waitOn: function () {return Meteor.subscribe('scenarios');}
  });

  this.route('newscenario',{
    path:'/scenarios/new',
    template:'scenarioNewPage',
    waitOn: function () {return [Meteor.subscribe('scenarios'),Meteor.subscribe('tags'),Meteor.subscribe('messages')];}
  });

  this.route('scenario',{
    path:'/scenarios/:_id',
    template:'scenarioPage',
    data: function() {return Scenarios.findOne(this.params._id)},
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
    waitOn: function (){
      var self = this;
      Session.set('newCouponCreated',false);
      Meteor.call('saveEmpty',function(err,id){
        Deps.autorun(function(comp){
          var coupon = Coupons.findOne(id);
          if (!coupon) {
            comp.stop();
          }else{
            var result = coupon.pass != undefined;
            if (result){
              Session.set('newCouponCreated', result);
              self.data = function() {return coupon};
              comp.stop();
            }
          }
        });
      });
      return [
        Meteor.subscribe('coupons'), Meteor.subscribe('logos'), Meteor.subscribe('strips'), Meteor.subscribe('locations'),
        {ready: function(){ return Session.get('newCouponCreated');}}
      ];
    }
  });

  this.route('logoupload',{
    path:'/coupons/:_id/icon/:_iid/logo/:_lid/strip/:_sid',
    template:'couponPage',
    waitOn: function(){
      self = this;
      var iid = self.params._iid;
      var lid = self.params._lid;
      var sid = self.params._sid;

      Session.set('isImageStored',false);

      Deps.autorun(function(comp){
        var icon = Logos.findOne(iid);
        var logo = Logos.findOne(lid);
        var strip = Strips.findOne(sid);

        if ((!icon || icon.hasStored('icons')) && (!logo || logo.hasStored('logos')) && (!strip || strip.hasStored('strips'))){
          Session.set('isImageStored',true);
          comp.stop;
        }
      });

      return [
        Meteor.subscribe('coupons'), Meteor.subscribe('logos'), Meteor.subscribe('strips'), Meteor.subscribe('locations'),
        {ready: function (){return Session.get('isImageStored');}}
      ];
    },
    data: function() {
      var c = Coupons.findOne(this.params._id);

      if (!c.images) c.images = {};

      if (!c.images.logo) c.images.logo = {};
      if (!c.images.strip) c.images.strip = {};

      c.images.logo._id = this.params._lid;
      c.images.strip._id = this.params._sid;

      return c;
    }
  });

  this.route('coupon',{
    path:'/coupons/:_id',
    template:'couponPage',
    data: function() {return Coupons.findOne(this.params._id)},
    waitOn: function () {return [Meteor.subscribe('coupons'), Meteor.subscribe('logos'), Meteor.subscribe('strips'), Meteor.subscribe('locations')]}
  });



  this.route('getting_started', {path: '/getting_started', template: 'getting_started', onBeforeAction: function() {AccountsEntry.signInRequired(this);}});
});

var requireLogin = function (){
  if (!Meteor.user()){
    this.render('accessDenied');
    this.stop();
  }
}
