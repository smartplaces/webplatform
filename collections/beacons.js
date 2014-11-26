Beacons = new Meteor.Collection('beacons');

Beacons.allow({
  insert: loggedIn,
  update: owner,
  remove: owner
});

Meteor.methods({
  saveBeacon: function(beacon){
    var user = Meteor.user();
    var beaconWithSameUUID = Beacons.findOne({uuid:beacon.uuid,major:beacon.major,minor:beacon.minor});
    if (!user){
      throw new Meteor.Error(401,'You need to login to edit beacons!');
    }

    if (!beacon.uuid || !beacon.major || !beacon.minor){
      throw new Meteor.Error(422,'Please fill in required fields!');
    }

    if (beaconWithSameUUID && (!beacon._id || beacon._id!==beaconWithSameUUID._id)){
      throw new Meteor.Error(302, 'Beacon with same UUID:Major:Minor already exists!');
    }

    var data = _.extend(_.pick(beacon,'name','uuid','major','minor','location','tags'), {
      userId: user._id,
      updated: new Date().getTime()
    });

    if (beacon._id){
      Beacons.update(beacon._id,{$set:data},function (error){
        if (error){
          throw new Meteor.Error(500, 'Can\'t save beacon data!');
        }
      });
    }else{
      Beacons.insert(data);
    }

    _.each(data.tags,function (tag){
        if (tag!==undefined && tag.trim()!==""){
          if (!Tags.findOne({name:tag.trim(), userId:user._id})){
            Tags.insert({name:tag.trim(),userId:user._id});
          }
        }
    });

  }
});
