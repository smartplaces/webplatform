gmaps = {
    // map object
    map: null,

    // google markers objects
    markers: [],

    // google lat lng objects
    latLngs: [],

    // our formatted marker data objects
    markerData: [],

    // add a marker given our formatted marker data object
    addMarker: function(marker) {
        var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        var gMarker = new google.maps.Marker({
            position: gLatLng,
            map: this.map,
            title: marker.title,
            // animation: google.maps.Animation.DROP,
            icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        this.latLngs.push(gLatLng);
        this.markers.push(gMarker);
        this.markerData.push(marker);

        var infowindow = new google.maps.InfoWindow();

        infowindow.setContent('<div><p>'+marker.title+'</p><p>'+marker.address+'</p><p>'+marker.contacts+'</p></div>');

        var m = this.map;

        google.maps.event.addListener(gMarker, 'click', function() {
            infowindow.open(m,gMarker);
        });

        return gMarker;
    },

    // calculate and move the bound box based on our markers
    calcBounds: function() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, latLngLength = this.latLngs.length; i < latLngLength; i++) {
            bounds.extend(this.latLngs[i]);
        }
        this.map.fitBounds(bounds);
    },

    // check if a marker already exists
    markerExists: function(key, val) {
        _.each(this.markers, function(storedMarker) {
            if (storedMarker[key] == val)
                return true;
        });
        return false;
    },


    // intialize the map
    initialize: function() {
        console.log("[+] Intializing Google Maps...");
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(45.0488000, 38.9725000),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(
            document.getElementById('map-canvas'),
            mapOptions
        );

        var m = this.map;
        var obj = this;
        google.maps.event.addListener(this.map, 'rightclick', function(event) {


          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({latLng: event.latLng}, function(results, status) {
              var location = {
                title : 'New Location #' + Math.round((Math.random()*1000)),
                address : 'Please enter correct address!',
                contacts : 'Please enter correct contacts!',
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
              }

              if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  location.address = results[0].formatted_address;
                }
              }

              Meteor.call('saveLocation',location,function (error){
                if (error){
                  alert(error.reason);
                }
              });
          });



          /*
          var marker = new google.maps.Marker({
              position: event.latLng, //map Coordinates where user right clicked
              map: m,
              draggable:true, //set marker draggable
              animation: google.maps.Animation.DROP, //bounce animation
              title:'New Location',
              icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' //custom pin icon
          });

          var mdata = {
            title : 'New Location #'+(Math.random()*1000),
            address : 'Please enter correct address!',
            contacts : 'Please enter correct contacts!',
            lat: marker.event.;
            lng: marker.lng
          }



          var infowindow = new google.maps.InfoWindow();


          infowindow.setContent('<div><p>'+mdata.title+'</p><p>'+mdata.address+'</p><p>'+mdata.contacts+'</p></div>');


          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(m,marker);
          });

          Meteor.call('saveLocation',mdata)
          */

        });


        // global flag saying we intialized already
        Session.set('map', true);
    }
}
