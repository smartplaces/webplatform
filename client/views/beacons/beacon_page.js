Template.beaconPage.rendered = function (){
    var tags = [];
    Tags.find().forEach(function (tag){tags.push(tag.name);});
    $('#tags').select2({
        tags:tags
    });
    
    $('#location').select2({
        placeholder: "Место, где расположен маячок"
    });
    
    if (this.data){
        var loc = Locations.findOne({uuid:this.data.uuid,major:parseInt(this.data.major)});
        if (loc){
            $('#location').val(loc._id).trigger('change');
            $('#location').select2("enable",false);
        }else{
            createAlert('Danger','Упс! :( Не можем место, в котором установлен маячек.')
        }
        Session.set('isNewBeacon', false);
        Session.set('beacon.name',this.data.name);
        Session.set('beacon.tags',this.data.tags.length);
    }else{
        if (Session.get('locationFilter')){
            $('#location').val(Session.get('locationFilter')).trigger('change');
        }
        Session.set('isNewBeacon', true);
        Session.set('beacon.name',undefined);
        Session.set('beacon.tags',undefined);
    }
}

Template.beaconPage.helpers({
    locations: function (){
        return Locations.find();
    },
    isNewBeacon: function(){
        return Session.get('isNewBeacon');
    }
});

Template.beaconPage.events({
    'change #name': function(e,t) {
        Session.set('beacon.name',e.target.value);
    },
    
    'change #tags': function(e,t){
        Session.set('beacon.tags',e.target.value);
    },
    
    'click #delete':function(e){
        e.preventDefault();
        var beacon = {
            uuid:this.uuid,
            major:this.major,
            minor:this.minor
        };

        Meteor.call('deleteBeacon',beacon, function (error){
            if (error){
                createAlert(error.reason);
            }else{
                Router.go('beacons');
            }
        });
    },

    'submit form':function(e){
        e.preventDefault();
        var location = Locations.findOne($(e.target).find('[id=location]').val());
        
        var beacon = {
            name: $(e.target).find('[id=name]').val(),
            uuid: location.uuid,
            major: location.major,
            minor: $(e.target).find('[id=minor]').val(),
            tags:[]
        };
        
        var tags = $(e.target).find('[id=tags]').val();

        _.each(tags.split(','),function(tag){
            if (tag!=="") {
                beacon.tags.push(tag);
            }
        });
        
        if (!beacon.name || beacon.tags.length===0){
            createAlert('Danger','Пожалуйста, заполните все необходимые поля!');
            return;
        }
        
        if (Session.get('isNewBeacon')){
            if (!location.beacons){
                location.beacons=[];
            }    
            location.beacons.push(beacon);
            Meteor.call('saveLocation',location,function (error){
                if (error){
                    createAlert('Danger',error.reason);
                }else{
                    Router.go('beacons');
                }
            });
        }else{
            Meteor.call('updateBeacon',beacon,function (error){
                if (error){
                    createAlert(error.reason);
                }else{
                    Router.go('beacons');
                }
            });    
        }
        
        Meteor.call('saveTags',beacon.tags,function (error){
            if (error){
                createAlert('Danger',error.reason);
            }
        });
    }

});
