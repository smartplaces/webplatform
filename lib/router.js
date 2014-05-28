Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.onBeforeAction('loading');

Router.map(function (){
  this.route('index',{path:'/', template:'index', onBeforeAction: function() {AccountsEntry.signInRequired(this);}});

  this.route('beacons',{path:'/beacons', template:'beaconsList', onBeforeAction: function() {AccountsEntry.signInRequired(this);}});
  this.route('newbeacon',{path:'/beacons/new', template:'beaconNewPage', onBeforeAction: function() {AccountsEntry.signInRequired(this);}});
  this.route('editbeacon', {
    path: '/beacons/edit/:uuid/:major/:minor',
    template: 'beaconPage',
    data: function (){
      var location = Locations.findOne({uuid:this.params.uuid,major:parseInt(this.params.major)});
      var beacon = null;
      var minor = this.params.minor;
      _.each(location.beacons, function(b){
        if (beacon==null && b.minor == minor){
          beacon = b;
        }
      });
      return beacon;
    },
    onBeforeAction: function() {AccountsEntry.signInRequired(this);}
  });

  this.route('profile',{path:'/profile', data:function () {return Meteor.user();}, onBeforeAction: function() {AccountsEntry.signInRequired(this);}});

  this.route('beacon',{path:'/beacons/:_id', template:'beaconPage', data: function () {return Beacons.findOne(this.params._id)}, onBeforeAction: function() {AccountsEntry.signInRequired(this);}});

  this.route('locations',{path:'/locations', template:'locationsList', onBeforeAction: function() {AccountsEntry.signInRequired(this);}});
  this.route('newlocation',{path:'/locations/new', template:'locationPage', onBeforeAction: function() {AccountsEntry.signInRequired(this);}});
  this.route('location',{path:'/locations/:_id', template:'locationPage', data: function() {return Locations.findOne(this.params._id)}, onBeforeAction: function() {AccountsEntry.signInRequired(this);}});

  this.route('messages',{path:'/messages', template:'messagesList', onBeforeAction: function() {AccountsEntry.signInRequired(this);}});
  this.route('newmessage',{path:'/messages/new', template:'messageNewPage', onBeforeAction: function() {AccountsEntry.signInRequired(this);}});
  this.route('message',{path:'/messages/:_id', template:'messagePage', data: function() {return Messages.findOne(this.params._id)}, onBeforeAction: function() {AccountsEntry.signInRequired(this);}});

  this.route('scenarios',{path:'/scenarios', template:'scenariosList', onBeforeAction: function() {AccountsEntry.signInRequired(this);}});
  this.route('newscenario',{path:'/scenarios/new', template:'scenarioNewPage', onBeforeAction: function() {AccountsEntry.signInRequired(this);}});
  this.route('scenario',{path:'/scenarios/:_id', template:'scenarioPage', data: function() {return Scenarios.findOne(this.params._id)}, onBeforeAction: function() {AccountsEntry.signInRequired(this);}});

  this.route('coupons',{path:'/coupons', template:'couponsList', onBeforeAction: function() {AccountsEntry.signInRequired(this);}});
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
      return { ready: function(){ return Session.get('newCouponCreated');}};
    },
    onBeforeAction: function() {
      AccountsEntry.signInRequired(this);
    },
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

      return {
        ready: function (){
          return Session.get('isImageStored');
        }
      };
    },
    data: function() {
      var c = Coupons.findOne(this.params._id);

      if (!c.images) c.images = {};

      if (!c.images.logo) c.images.logo = {};
      if (!c.images.strip) c.images.strip = {};

      c.images.logo._id = this.params._lid;
      c.images.strip._id = this.params._sid;

      return c;
    },
    onBeforeAction: function() {AccountsEntry.signInRequired(this);}
  });

  this.route('coupon',{
    path:'/coupons/:_id',
    template:'couponPage',
    data: function() {return Coupons.findOne(this.params._id)},
    onBeforeAction: function() {AccountsEntry.signInRequired(this);}
  });


});

var requireLogin = function (){
  if (!Meteor.user()){
    this.render('accessDenied');
    this.stop();
  }
}

//Router.onBeforeAction(requireLogin,{except:[]});
