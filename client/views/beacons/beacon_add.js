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

  if (Session.get('locationFilter')){
    $('#location').val(Session.get('locationFilter')).trigger('change');
  }

}

Template.beaconNewPage.helpers({
  locations: function (){
    return Locations.find();
  }
});

Template.beaconNewPage.events({
  'change name': function(e,t) {
    Session.set('beacon.name',e.target.value);
  },
  
  'submit form':function(e){
    e.preventDefault();

    var location = Locations.findOne($(e.target).find('[id=location]').val());

    if (!location){
      createAlert('Danger','Выбраное местоположение маячка отсутствует в базе :(');
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
        createAlert('Danger',error.reason);
      }else{
        Router.go('beacons');
      }
    });

    Meteor.call('saveTags',beacon.tags,function (error){
      if (error){
        createAlert('Danger',error.reason);
      }
    });
  }

});
