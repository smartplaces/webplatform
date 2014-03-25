Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () { return Meteor.subscribe('locations');}

});

Router.map(function (){
  this.route('index',{path:'/', template:'index', before: function() {AccountsEntry.signInRequired(this);}});

  this.route('beacons',{path:'/beacons', template:'beaconsList', before: function() {AccountsEntry.signInRequired(this);}});
  this.route('newbeacon',{path:'/beacons/new', template:'beaconNewPage', before: function() {AccountsEntry.signInRequired(this);}});
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
    before: function() {AccountsEntry.signInRequired(this);}
  });

  this.route('profile',{path:'/profile', data:function () {return Meteor.user();}, before: function() {AccountsEntry.signInRequired(this);}});

  this.route('beacon',{path:'/beacons/:_id', template:'beaconPage', data: function () {return Beacons.findOne(this.params._id)}, before: function() {AccountsEntry.signInRequired(this);}});

  this.route('locations',{path:'/locations', template:'locationsList', before: function() {AccountsEntry.signInRequired(this);}});
  this.route('newlocation',{path:'/locations/new', template:'locationPage', before: function() {AccountsEntry.signInRequired(this);}});
  this.route('location',{path:'/locations/:_id', template:'locationPage', data: function() {return Locations.findOne(this.params._id)}, before: function() {AccountsEntry.signInRequired(this);}});

  this.route('messages',{path:'/messages', template:'messagesList', before: function() {AccountsEntry.signInRequired(this);}});
  this.route('newmessage',{path:'/messages/new', template:'messageNewPage', before: function() {AccountsEntry.signInRequired(this);}});
  this.route('message',{path:'/messages/:_id', template:'messagePage', data: function() {return Messages.findOne(this.params._id)}, before: function() {AccountsEntry.signInRequired(this);}});

  this.route('scenarios',{path:'/scenarios', template:'scenariosList', before: function() {AccountsEntry.signInRequired(this);}});
  this.route('newscenario',{path:'/scenarios/new', template:'scenarioNewPage', before: function() {AccountsEntry.signInRequired(this);}});
  this.route('scenario',{path:'/scenarios/:_id', template:'scenarioPage', data: function() {return Scenarios.findOne(this.params._id)}, before: function() {AccountsEntry.signInRequired(this);}});

  this.route('coupons',{path:'/coupons', template:'couponsList', before: function() {AccountsEntry.signInRequired(this);}});
  this.route('newcoupon',{path:'/coupons/new', template:'couponPage', before: function() {AccountsEntry.signInRequired(this);}});
  this.route('coupon',{path:'/coupons/:_id', template:'couponPage', before: function() {AccountsEntry.signInRequired(this);}});
});

var requireLogin = function (){
  if (!Meteor.user()){
    this.render('accessDenied');
    this.stop();
  }
}

//Router.before(requireLogin,{except:[]});
