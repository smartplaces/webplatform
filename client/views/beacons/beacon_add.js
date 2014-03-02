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

    locationInfo: function(){
        var loc = Locations.findOne(this.location);

        if (loc){
            return loc.title;
        }else{
            return '';
        }
    }
});

Template.beaconNewPage.events({
    'click #delete':function(e){
      e.preventDefault();
      if (confirm("Вы действительно хотите удалить этот маячок?")){
        Beacons.remove({_id:this._id}, function(error){
          if (error){
              alert(error.reason);
            }else{
              Router.go('beacons');
            }
        });
      }
    },

    'submit form':function(e){
        e.preventDefault();

        var beacon = {
            name: $(e.target).find('[id=name]').val(),
            uuid: $(e.target).find('[id=uuid]').val(),
            major: $(e.target).find('[id=major]').val(),
            minor: $(e.target).find('[id=minor]').val(),
            tags:[]
        }

        var tags = $(e.target).find('[id=tags]').val();

        _.each(tags.split(','),function(tag){
            beacon.tags.push(tag);

        });

        var location = $(e.target).find('[id=location]').val();

        if (Locations.findOne(location)){
            beacon.location = location;
        }

        if (this._id){
          _.extend(beacon,{_id:this._id});
        }

        Meteor.call('saveBeacon',beacon,function (error){
            if (error){
              alert(error.reason);
            }else{
              Router.go('beacons');
            }
        });
    }

});
