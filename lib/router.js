Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () { return Meteor.subscribe('beacons');}

});

Router.map(function (){
  this.route('index',{path:'/', template:'index'});

  this.route('beacons',{path:'/beacons', template:'beaconsList'});
  this.route('newbeacon',{path:'/beacons/new', template:'beaconNewPage'});
  this.route('beacon',{path:'/beacons/:_id', template:'beaconPage', data: function () {return Beacons.findOne(this.params._id)}});

  this.route('locations',{path:'/locations', template:'locationsList'});
  this.route('newlocation',{path:'/locations/new', template:'locationPage'});
  this.route('location',{path:'/locations/:_id', template:'locationPage', data: function() {return Locations.findOne(this.params._id)}});

  this.route('messages',{path:'/messages', template:'messagesList'});
  this.route('newmessage',{path:'/messages/new', template:'messageNewPage'});
  this.route('message',{path:'/messages/:_id', template:'messagePage', data: function() {return Messages.findOne(this.params._id)}});

  this.route('scenarios',{path:'/scenarios', template:'scenariosList'});
  this.route('newscenario',{path:'/scenarios/new', template:'scenarioNewPage'});
  this.route('scenario',{path:'/scenarios/:_id', template:'scenarioPage', data: function() {return Scenarios.findOne(this.params._id)}});


});

var requireLogin = function (){
  if (!Meteor.user()){
    this.render('accessDenied');
    this.stop();
  }
}

Router.before(requireLogin,{except:[]});
