Template.beaconsList.helpers({
    locations: function (){
        var _id = Session.get('locationFilter');
        if (_id){
            return Locations.find({_id:_id});
        }else{
            return Locations.find();
        }
    },

    allLocations: function(){
        return Locations.find();
    },

    isCurrentLocation: function(value){
        if (Session.get('locationFilter')==value){
            return 'selected';
        }else{
            return '';
        }
    },

    confirmData: function(){
        return {
            title: "Удаление маячка",
            body: "Вы уверены, что хотите удалить этот маячек?",
            actionClass: 'remove-confirm-ok'
        };
    },
});



Template.beaconsList.events({
    'change #locationFilter': function (e){
        Session.set('locationFilter',$(e.target).val());
    },


    'click .beacon-item-remove': function(e){
        e.preventDefault();
        var id = e.target.id;
        if (id){
            var params = id.split(':');
            var beacon = {
                uuid: params[0],
                major: params[1],
                minor: params[2]
            }
            Session.set('unconfirmDeleteBeacon',beacon);
            $('#confirmModal').modal('show');
        }else{
            createAlert('Danger','Упс! :( При удалении маячка что-то пошло не так.');
        }
    },
    
    'click .remove-confirm-ok': function(e,t){
        e.preventDefault();
        var beacon = Session.get('unconfirmDeleteBeacon');
        Session.set('unconfirmDeleteBeacon',undefined);
        $('#confirmModal').modal('hide');
        Meteor.call('deleteBeacon',beacon,function (error){
            if (error){
                createAlert(error.reason);
            }
        });
    },

});
