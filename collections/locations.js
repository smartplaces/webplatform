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

    var data = _.extend(_.pick(location,'title','address','contacts','lat', 'lng'), {
      userId: user._id,
      updated: new Date().getTime()
    });

    if (location._id){
      Locations.update(location._id,{$set:data},function (error){
        if (error){
          throw new Meteor.Error(500, 'Can\'t save location data!');
        }
      });
    }else{
      Locations.insert(data);
    }
  }
});
