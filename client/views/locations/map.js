Template.map.rendered = function (){
    if (!Session.get('map')){
        gmaps.initialize();
    }

    Deps.autorun(function() {
      gmaps.removeAllMarkers();
      Locations.find().forEach(function(loc){gmaps.addMarker(loc);});
      gmaps.calcBounds();
    });
    /*Deps.autorun(function() {
        var locations = Locations.find().fetch();

        _.each(locations, function(location) {
            if (typeof location.lat !== 'undefined' &&
                typeof location.lng !== 'undefined') {

                var objMarker = {
                    id: location._id,
                    lat: location.lat,
                    lng: location.lng,
                    title: location.title,
                    address: location.address,
                    contacts: location.contacts
                };

                // check if marker already exists
                if (!gmaps.markerExists(objMarker.id))
                    gmaps.addMarker(objMarker);

            }
        });
    });*/

};

Template.map.destroyed = function (){
    Session.set('map',false);
}
