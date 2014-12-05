Template.locationsList.helpers({
    locations: function(){
        return Locations.find();
    }, 

    confirmData: function(){
        return {
            title: "Удаление места",
            body: "Вы действительно хотите удалить это место? Все маячки, связанные с этим местом так же будут удалены!",
            actionClass: 'remove-confirm-ok'
        };
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
                createAlert(error.reason);
            }
        });
    },

    'click .location-item': function(e){
        e.preventDefault();
        if ($(e.target).hasClass('location-item-remove')){
            Session.set('unconfirmDeleteLocation',e.currentTarget.id);
            $('#confirmModal').modal('show');
        }else{
            gmaps.centerMarker(e.currentTarget.id);
        }

    },

    'click .remove-confirm-ok': function(e,t){
        e.preventDefault();
        var id = Session.get('unconfirmDeleteLocation');
        Session.set('unconfirmDeleteLocation',undefined);
        $('#confirmModal').modal('hide');
        Locations.remove({_id:id}, function(error){
            if (error){
                createAlert(error.reason);
            }
        });
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
                createAlert(error.reason);
            }
        });
    }

});
