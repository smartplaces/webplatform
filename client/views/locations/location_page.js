Template.locationPage.events({
    'click #delete':function(e){
      e.preventDefault();
      if (confirm("Are you realy want to delete this location?")){
        Locations.remove({_id:this._id}, function(error){
          if (error){
              alert(error.reason);
            }else{
              Router.go('locations');
            }
        });
      }
    },

    'submit form':function(e){
        e.preventDefault();

        var location = {
            title: $(e.target).find('[id=title]').val(),
            address: $(e.target).find('[id=address]').val(),
            contacts: $(e.target).find('[id=contacts]').val()
        }

        if (this._id){
          _.extend(location,{_id:this._id});
        }

        Meteor.call('saveLocation',location,function (error){
            if (error){
              alert(error.reason);
            }else{
              Router.go('locations');
            }
        });
    }

});
