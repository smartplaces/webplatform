Meteor.publish('beacons',function(){
  return Beacons.find({userId:this.userId},{sort:{updated:-1}});
});

Meteor.publish('locations', function(){
  return Locations.find({userId:this.userId},{sort:{title:1}});
});

Meteor.publish('tags', function(){
  return Tags.find({userId:this.userId});
});

Meteor.publish('messages', function(){
  return Messages.find({userId:this.userId});
});

Meteor.publish('scenarios', function(){
  return Scenarios.find({userId:this.userId});
});

Meteor.publish('coupons', function(){
  return Coupons.find({userId:this.userId});
});
