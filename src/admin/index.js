import './main.css';
import {render, useState, useEffect} from '@wordpress/element'
import { createRoot } from "react-dom/client";
import apiFetch from '@wordpress/api-fetch'
import { __ } from '@wordpress/i18n'
import {
  MediaUpload,MediaUploadCheck
} from "@wordpress/block-editor";

function ImagePreview({id, url}){
  const [image_id, set_image_id] = useState(id);
  const [image_url, set_image_url] = useState(url);
  //const [primary_image, set_primary_image] = useState(primary_image_id);
  const [removed, set_removed] = useState(false);

  const handle_image_remove = (id) =>{
    console.log('id = ' + id)
    console.log('image id = ' + image_id) 
    console.log(removed);
    set_removed(true);
    console.log(removed)

  }

  console.log(image_url)

  if (removed) 
    return <></>

  return (
    <>
    <img 
      src={image_url} 
    />
    <button
      type = "button"
      className="remove_image_button"
      onClick={() => handle_image_remove(image_id)}
    >
      <i className="bi bi-x"></i>
    </button>
    <div className = "image-details">
      <label> {__('Primary image', 'e-potis')}</label>
      <input 
        type = "checkbox" 
        className = "primary-checkbox"
        name ="primary_image" 
        //checked = {is_primary == image_id}
        //onChange={() => handle_primary_change()}
      ></input>
    </div>
    </>
  )
}


document.addEventListener('DOMContentLoaded', () =>{
  const images = document.querySelectorAll('.image-preview');

  images.forEach(image => {
    
    const image_id = parseInt(image.dataset.image_id)
    const image_url = image.dataset.image_url;
    console.log(image_url)
    const root = createRoot(image);
    root.render(
      <ImagePreview
        id={image_id}
        url={image_url}
      />
    )
  })

  
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
          attachment.toJSON();
          return attachment;
        });

        const imageContainer = document.getElementById('image-preview-wrapper');
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

        imageContainer.addEventListener('change', function(event) {
          console.log('change ' + event.target);
          if (event.target.classList.contains('primary-checkbox')) {
            const checkboxes = document.querySelectorAll('.primary-checkbox');
            checkboxes.forEach(cb => {
              if(cb !== event.target) {
                cb.checked = false;
              }
            });
            const primaryInput = document.getElementById('primary_image_input');
            primaryInput.value = event.target.checked ? event.target.value : '';
          }
        });

      }).open()
    });
  }
  /*
  const remove_images = document.querySelectorAll(".remove_image_button");
  if (remove_images != null){
    remove_images.forEach(element => {
      element.addEventListener('click', (event) => {
        event.preventDefault();
        const root = element.parentElement;
        root.remove();
      })
      
    });
  }*/
  


var autocomplete;
const field = document.getElementById('location-input');
if (field != null) {
  var geocoder;
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


