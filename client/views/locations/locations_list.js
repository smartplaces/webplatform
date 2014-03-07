Template.locationsList.helpers({
    locations: function(){
        return Locations.find();
    }
});
Template.locationsList.events({

  'click #newadd': function(e){
    e.preventDefault();
    var location = Session.get('newLocation');
    gmaps.infowindow.close();
    gmaps.marker.setVisible(false);

    Meteor.call('saveLocation',location,function (error){
      if (error){
        alert(error.reason);
      }
    });
  },

  'click .location-item': function(e){
    e.preventDefault();
    if ($(e.target).hasClass('location-item-remove')){
      if (confirm("Вы действительно хотите удалить это место?")){
        Locations.remove({_id:e.currentTarget.id}, function(error){
          if (error){
              alert(error.reason);
            }
        });
        //gmaps.removeMarker(e.currentTarget.id);
        //gmaps.calcBounds();
      }
    }else{
      gmaps.centerMarker(e.currentTarget.id);
    }

  },

  'submit form':function(e){
        e.preventDefault();
        var location = {
            _id: $(e.target).find('[id=id]').val(),
            title: $(e.target).find('[id=title]').val(),
            address: $(e.target).find('[id=address]').val(),
            contacts: $(e.target).find('[id=contacts]').val(),
        }
        gmaps.infowindows[location._id].close();
        Meteor.call('saveLocation',location,function (error){
            if (error){
              alert(error.reason);
            }
        });
    }

});
