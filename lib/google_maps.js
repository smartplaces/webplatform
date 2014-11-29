gmaps = {
    centerLat: 45.0488000,
    centerLng: 38.9725000,

    // map object
    map: null,

    // google markers objects
    markers: {},
    // google inforwindows objects
    infowindows: {},
    // google lat lng objects
    latLngs: [],


    infowindow: null,
    marker: null,

    removeAllMarkers: function(){
      _.each(this.markers,function(m){
        if (m){
          m.setMap(null);
        }
      });
      this.markers = {};
    },

    addMarker: function(marker) {
        var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        var gMarker = new google.maps.Marker({
            position: gLatLng,
            map: this.map,
            title: marker.title,
            //animation: google.maps.Animation.DROP,
            icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        this.latLngs.push(gLatLng);

        this.markers[marker._id]=gMarker;

        //this.markerData.push(marker);

        var infowindow = new google.maps.InfoWindow();

        this.infowindows[marker._id]=infowindow;


        google.maps.event.addListener(gMarker, 'click', function() {
          var id;
          _.each(gmaps.markers,function(val,key){
            if (val == gMarker){
              id = key;
              return;
            }
          });
          if (!id){
            alert('Error - marker not found!');
            return;
          }
          var location = Locations.findOne({_id:id});
          infowindow.setContent(
            '<form role="form">'+
              '<input type="hidden" id="id" value="'+location._id+'">'+
              '<div class="form-group">'+
                  '<label for="title">Название</label>'+
                  '<input class="form-control" id="title" placeholder="Название" value="'+location.title+'">'+
              '</div>'+
              '<div class="form-group">'+
                  '<label for="address">Адрес</label>'+
                  '<input class="form-control" id="address" placeholder="Адрес" value="'+location.address+'">'+
              '</div>'+
              '<div class="form-group">'+
                  '<label for="contacts">Контакты</label>'+
                  '<input class="form-control" id="contacts" placeholder="Контакты" value="'+location.contacts+'">'+
              '</div>'+
              '<div class="btn-toolbar" role="toolbar">'+
                  '<div class="btn-group">'+
                    '<button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Сохранить</button>'+
                  '</div>'+
              '</div>'+
            '</form>'
          );
          infowindow.open(gmaps.map,gMarker);
        });

        return gMarker;
    },

    // calculate and move the bound box based on our markers
    calcBounds: function() {
      if (Locations.find().count()===0){
        this.map.setCenter(new google.maps.LatLng(this.centerLat, this.centerLng));
      }else{
        var bounds = new google.maps.LatLngBounds();
          _.each(gmaps.markers,function(m){
            if (m) bounds.extend(m.getPosition());
          });
        this.map.fitBounds(bounds);
      }
    },

    // check if a marker already exists
    markerExists: function(id) {
      if (gmaps.markers[id]) {
        return true;
      }else {
        return false;
      }
    },

    centerMarker: function(id){
      _.each(this.infowindows,function(iw){if (iw) iw.close();});
      var gm = gmaps.markers[id];
      gmaps.map.setCenter(gm.getPosition());
      gmaps.map.setZoom(17);
      new google.maps.event.trigger(gm, 'click' );
    },

    removeMarker: function(id){
      var gm = gmaps.markers[id];
      gm.setMap(null);
      gmaps.markers[id] = undefined;
    },

    initialize: function() {
        console.log("[+] Intializing Google Maps...");
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(this.centerLat, this.centerLng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(
            document.getElementById('map-canvas'),
            mapOptions
        );

        var input = document.getElementById('pac-input');
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', this.map);

        var infowindow = new google.maps.InfoWindow();
        this.infowindow = infowindow;

        var marker = new google.maps.Marker({map: this.map});
        this.marker = marker;

        var m = this.map;

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          infowindow.close();
          marker.setVisible(false);

          var place = autocomplete.getPlace();
          if (!place.geometry) {
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            m.fitBounds(place.geometry.viewport);
          } else {
            m.setCenter(place.geometry.location);
            m.setZoom(17);  // Why 17? Because it looks good.
          }
          /*
          marker.setIcon({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
          });
          */
          marker.setIcon({url:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'});
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }
          var location = {
            title: place.name,
            address: address,
            contacts: '',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          Session.set('newLocation',location);
          infowindow.setContent(
          '<div>'+
            '<div><strong>'+place.name+'</strong></br>'+address+'</div>'+
              '</br>'+
              '<p><a class="btn btn-primary" id="newadd"><span class="glyphicon glyphicon-plus"></span> Добавить место</a></p>'+
          '</div>'+
        '</div>'
          );
          infowindow.open(m, marker);
        });

        /*
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
          */


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


        });
        */


        // global flag saying we intialized already
        Session.set('map', true);
    }
}
