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
  }
});



Template.beaconsList.events({
  'change #locationFilter': function (e){
    Session.set('locationFilter',$(e.target).val());
  },

  'click .beacon-item': function(e){
    e.preventDefault();
    if ($(e.target).hasClass('beacon-item-remove')){
      if (confirm("Вы действительно хотите удалить этот маячек?")){
        alert('Удаление еще не реализовано :(');
      }
    }else{
      alert('Редактирование еще не реализовано :(');
    }

  },

});
