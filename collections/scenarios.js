Scenarios = new Meteor.Collection('scenarios');

Scenarios.allow({
  insert: loggedIn,
  update: owner,
  remove: owner
});

Meteor.methods({
  saveScenario: function(scenario){
    if (Meteor.isServer){
        var user = Meteor.user();

        if (!user){
            throw new Meteor.Error(401,'Вам нужно залогиниться чтобы редактировать сценарии!');
        }

        if (!scenario.name ||
            !scenario.message ||
            (scenario.beacons.length===0) ||
            (scenario.proximity.length===0) ||
            (scenario.event.length===0)
           ){
            throw new Meteor.Error(422,'Пожалуйста, заполните все необходимые поля!');
        }

        var data = _.extend(_.pick(scenario,'name','message','coupon','beacons','proximity','event','frequency','start','end','active'), {
            userId: user._id,
            updated: new Date().getTime()
        });

        if (scenario._id){
            Scenarios.update(scenario._id,{$set:data},function (error){
                if (error){
                    throw new Meteor.Error(500, 'Ошибка: невозможно сохранить сценарий :(!');
                }
            });
        }else{
            Scenarios.insert(data);
        }
    }
  }
});

