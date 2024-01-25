var autocomplete;
const field = document.getElementById('location-input');
if (field != null) {
  var geocoder;
  // Create the script tag, set the appropriate attributes
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDY56cwNRUcmVLV3LpSUUwjPWx4TQJHr3I&libraries=places&callback=initMap';
  script.async = true;
  window.initMap = function() {
    

    autocomplete = new google.maps.places.Autocomplete(field);
    geocoder = new google.maps.Geocoder();
  };


  field.addEventListener( 'change', async event => {
    var lat = document.getElementById('location-lat');
    var lng = document.getElementById('location-lng');
    await geocoder.geocode({ address: field.value }, function (results, status){
      if (status ==='OK' && results.length > 0){
        lat.value = results[0].geometry.location.lat(),
        lng.value = results[0].geometry.location.lng()
      };
    })

  })
  document.head.appendChild(script);
}

