Template.beaconNewPage.rendered = function (){

    var tags = [];

    Tags.find().forEach(function (tag){tags.push(tag.name);});

    $('#tags').select2({
        tags:tags
    });


    $('#location').select2({
        placeholder: "Место, где расположен маячок",
        allowClear: true
    });

}

Template.beaconNewPage.helpers({
    locations: function (){
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

Template.beaconNewPage.events({
    'submit form':function(e){
      e.preventDefault();

      var location = Locations.findOne($(e.target).find('[id=location]').val());

      if (!location){
        alert('Выбраное местоположение маячка отсутствует в базе :(');
        return;
      }

      var beacon = {
        name: $(e.target).find('[id=name]').val(),
        tags:[]
      }

      var tags = $(e.target).find('[id=tags]').val();

      _.each(tags.split(','),function(tag){
        beacon.tags.push(tag);
      });

      if (!location.beacons){
        location.beacons=[];
      }
      location.beacons.push(beacon);

      Meteor.call('saveLocation',location,function (error){
        if (error){
          alert(error.reason);
        }else{
          Router.go('beacons');
        }
      });

      Meteor.call('saveTags',beacon.tags,function (error){
        if (error){
          alert(error.reason);
        }
      });
    }

});
