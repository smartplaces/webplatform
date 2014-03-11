Locations = new Meteor.Collection('locations');

Locations.allow({
  insert: loggedIn,
  update: owner,
  remove: owner

});

Meteor.methods({
    saveLocation: function (location){
      var user = Meteor.user();
      if (!user){
        throw new Meteor.Error(401,'You need to login to edit locations!');
      }

      if (!location.title || !location.address){
        throw new Meteor.Error(422,'Please fill in required fields!');
      }

      var data = _.extend(_.pick(location,'title','address','contacts','lat', 'lng','major', 'uuid','beacons'), {
        userId: user._id,
        updated: new Date().getTime()
      });

      if (location._id){
        _.each(data.beacons,function(b){
          if (Meteor.isServer){
            if (!b.minor) b.minor=incrementCounter(data.major, 1);
          }
          if (!b.major) b.major=location.major;
          if (!b.uuid) b.uuid=location.uuid;
        });
        Locations.update(location._id,{$set:data},function (error){
          if (error){
            throw new Meteor.Error(500, 'Can\'t save location data!');
          }
        });
      }else{
        var major = null;
        if (Meteor.isServer){
          major = incrementCounter(UUID, 1);
        }
        data.major = major;
        data.uuid = UUID;
        if (!location.beacons){
          location.beacons = [];
        }
        Locations.insert(data);
      }
    },

  deleteBeacon: function (beacon){
    Locations.update(
      {
        uuid:beacon.uuid,
        major:parseInt(beacon.major)
      },
      {
        $pull:{
          beacons:{
            uuid:beacon.uuid,
            major:parseInt(beacon.major),
            minor:parseInt(beacon.minor)
          }
        }
      },function (error){
        if (error){
          throw new Meteor.Error(500, 'Can\'t delete beacon!');
        }
      });
  },

  updateBeacon: function(beacon){
    var user = Meteor.user();

    if (!user){
      throw new Meteor.Error(401,'You need to login to edit beacons!');
    }

    var data = _.pick(beacon,'name','uuid','major','minor','tags');


    Locations.update(
      {
        'beacons.uuid':data.uuid,
        'beacons.major':parseInt(data.major),
        'beacons.minor':parseInt(data.minor)
      },
      {
        $set: {
          'beacons.$.name':data.name,
          'beacons.$.tags':data.tags
        }
      },function (error){
        if (error){
          throw new Meteor.Error(500, 'Can\'t save beacon data!');
        }
      });
  }
});
