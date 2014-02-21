Template.beaconsList.helpers({
    beacons: function (){
        return Beacons.find();
    },

    locationInfo: function (){
      var location = Locations.findOne(this.location);
      if (location){
        return location.title;
      }else{
        return '';
      }
    }
});
