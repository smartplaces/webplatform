Template.locationsList.helpers({
    locations: function(){
        return Locations.find();
    }
});
Template.locationsList.events({
  'click #add': function(e){
    e.preventDefault();
    alert('To Add new Location: Right-Click on appropriate location on map - new row in table and new marker on map will appear.');
  }
});
