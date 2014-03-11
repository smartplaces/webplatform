Template.beaconPage.rendered = function (){

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

Template.beaconPage.helpers({

    locationInfo: function(){
        var loc = Locations.findOne({uuid:this.uuid,major:parseInt(this.major)});

        if (loc){
            return loc.title;
        }else{
            return '';
        }
    }
});

Template.beaconPage.events({
    'click #delete':function(e){
      e.preventDefault();
      var beacon = {
        uuid:this.uuid,
        major:this.major,
        minor:this.minor
      };

      Meteor.call('deleteBeacon',beacon, function (error){
              if (error){
                  alert(error.reason);
              }else{
                  Router.go('beacons');
              }
      });
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


        Meteor.call('updateBeacon',beacon,function (error){
            if (error){
              alert(error.reason);
            }else{
              Router.go('beacons');
            }
        });
    }

});
