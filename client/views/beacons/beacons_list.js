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
});



Template.beaconsList.events({
  'change #locationFilter': function (e){
    Session.set('locationFilter',$(e.target).val());
  },


  'click .beacon-item-remove': function(e){
    e.preventDefault();
    if (confirm("Вы уверены, что хотите удалить этот маячек?")){
      var id = e.target.id;
      if (id){
        var params = id.split(':');
        var beacon = {
          uuid: params[0],
          major: params[1],
          minor: params[2]
        }
        Meteor.call('deleteBeacon',beacon,function (error){
          if (error){
              alert(error.reason);
          }
        });
      }

    }
  },

});
