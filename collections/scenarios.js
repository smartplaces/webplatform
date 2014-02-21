Scenarios = new Meteor.Collection('scenarios');

Scenarios.allow({
  insert: loggedIn,
  update: owner,
  remove: owner
});

Meteor.methods({
  saveScenario: function(scenario){
    var user = Meteor.user();

    if (!user){
      throw new Meteor.Error(401,'You need to login to edit scenarios!');
    }

    if (!scenario.name ||
        !scenario.message ||
        (scenario.beacons.length===0) ||
        (scenario.proximity.length===0) ||
        (scenario.event.length===0) ||
        !scenario.frequency ||
        !scenario.start ||
        !scenario.end
       ){
        throw new Meteor.Error(422,'Please fill in required fields!');
    }

    var data = _.extend(_.pick(scenario,'name','message','beacons','proximity','event','frequency','start','end','active'), {
      userId: user._id,
      updated: new Date().getTime()
    });

    if (scenario._id){
      Scenarios.update(scenario._id,{$set:data},function (error){
        if (error){
          throw new Meteor.Error(500, 'Can\'t save scenario data!');
        }
      });
    }else{
      Scenarios.insert(data);
    }
  }
});

