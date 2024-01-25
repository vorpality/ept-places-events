import './main.css';

document.addEventListener('DOMContentLoaded', () =>{
  console.log('script loaded')
  const uploadButton = document.getElementById('place_images_upload_btn');
  if (uploadButton != null){
    uploadButton.addEventListener('click', function() {
      const mediaUploader = wp.media({
        title: 'Select Images',
        button: {
          text: 'Use these images'
        },
        multiple: true
      }).on('select', function() {
        const attachments = mediaUploader.state().get('selection').map(function(attachment) {
          console.log(attachment);
          attachment.toJSON();
          console.log(attachment)
          return attachment;
        });

        const imageContainer = document.getElementById('image-preview-wrapper');
        console.log(imageContainer)
        attachments.forEach(function(attachment) {
          const div = document.createElement('div');
          div.id = 'image-'+attachment.id;
          div.className = "image-preview";

          const img = document.createElement('img');
          img.src = attachment.attributes.url;
          img.style.width = '150px';
          img.style.height = '150px';

          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'place_images[]';
          input.value = attachment.id;

          const removeBtn = document.createElement('a');
          removeBtn.href = "#";
          removeBtn.className="remove_image_Button";
          removeBtn.innerHTML="Remove";

          imageContainer.appendChild(div);
          div.appendChild(img);
          div.appendChild(input);
          div.appendChild(removeBtn);
        });

      }).open()
    });
  }
  const remove_images = document.querySelectorAll(".remove_image_button");
  if (remove_images != null){
    remove_images.forEach(element => {
      element.addEventListener('click', (event) => {
        event.preventDefault();
        const root = element.parentElement;
        root.remove();
      })
      
    });
  }

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

});