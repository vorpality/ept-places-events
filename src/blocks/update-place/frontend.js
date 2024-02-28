import {__} from '@wordpress/i18n'
import { createRoot } from "react-dom/client";
import { FileUploadComponent} from '../../common/components/FileUploadComponent.js';
import { updatePlace } from './services/apiServices.js';
import { getImages } from '../../common/services/apiService.js';
import { mapAutoComplete } from '../../common/services/mapAutoComplete.js';
document.addEventListener('DOMContentLoaded',async () => {
  const post_id = document.querySelector('.wp-block-ept-pe-update-place').getAttribute('data-post-id');

  const  startingImages =(post_id && post_id !== "0")? await getImages(post_id):[];
  const rootElement = document.querySelector('.file-upload-wrapper');
  if (rootElement) {
      const root = createRoot(rootElement);
      root.render(<FileUploadComponent startingImages={startingImages} />);
  }

  const add_place_form = document.querySelector('#add-place-form');

  add_place_form?.addEventListener('submit', async event => {
    event.preventDefault();

    const add_place_form_fieldset = add_place_form.querySelector('fieldset')
    add_place_form_fieldset.setAttribute('disabled', true)


    const add_place_status = add_place_form.querySelector('#form-status')
    add_place_status.innerHTML = `
      <div class ="modal-status modal-status-info">
      ${__('Please wait! We are processing your request.', 'e-potis')}
      </div>
    `;
    const userID = add_place_form.querySelector('#user-id').value;
    const title = add_place_form.querySelector('#place-title').value;
    const description = add_place_form.querySelector('#place-description').value;
    const location = add_place_form.querySelector('#place-location').value;
    const primaryImage = add_place_form.querySelector('#post-primary-image-id').value;
    event.preventDefault();
    add_place_form_fieldset.removeAttribute('disabled');
     
    const formData = new FormData();
    formData.append('user_id', userID);
    formData.append('post_id', post_id);
    formData.append('place_title', title);
    formData.append('place_description', description);
    formData.append('place_location', location);
    window.currentSelectedFiles.forEach((file, index) => {
      if (file.isStartingImage){
        formData.append(`existing_images[]`, file.id);
      }
      else {
        formData.append(`place_images[${index}]`, file.file);
        formData.append(`tempID[${index}]`, file.id);
      }
    });
    formData.append('primary_image_id', primaryImage);
    const response = await updatePlace(formData);
    const responseJSON = await response.json();
    console.log(responseJSON)
    if(response.status == 200) {
      add_place_status.innerHTML = `
        <div class = "form-status form-status-success">
          ${__('Success! The place has been succesfully created, you can view it at ', 'e-potis')} <a href = "${responseJSON.url}">${responseJSON.url}</a>
        </div>
      `
    } else {
      add_place_form_fieldset.removeAttribute('disabled')
      add_place_status.innerHTML = `
        <div class ="form-status form-status-danger">
          ${__('Something went wrong', 'e-potis')}
        </div>
      `
    }
  })

  
  const mapAutoCompleteField = mapAutoComplete({
    main : document.getElementById('place-location'),
    lat : document.getElementById('place-lat'),
    lng :document.getElementById('place-lng')
  })
  document.head.append(mapAutoCompleteField.script);

  document.getElementById('map-select').addEventListener('click', () => {

    const fields = {
      latField : document.getElementById('temp-lat'),
      lngField : document.getElementById('temp-lng')
    }
    document.getElementById('map-popup').style.display = 'block';
    initMapPopup(fields); 
  });
  
  document.getElementById('confirm-location').addEventListener('click', async () => {
    const result_lat = document.getElementById('place-lat');
    const result_lng = document.getElementById('place-lng');
    result_lat.value = parseFloat(document.getElementById('temp-lat').value);
    result_lng.value = parseFloat(document.getElementById('temp-lng').value);
    const latLng = {
      lat : parseFloat(document.getElementById('temp-lat').value),
      lng : parseFloat(document.getElementById('temp-lng').value)
    }
    const geocoder = new google.maps.Geocoder();
    console.log(latLng);
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        document.getElementById('place-location').value = results[0].formatted_address;
      }
    });
  
    document.getElementById('map-popup').style.display = 'none';
  });
})



async function initMapPopup(fields) {
  const {AdvancedMarkerElement} = await google.maps.importLibrary("marker")
  const map = new google.maps.Map(document.getElementById('map-canvas'), {
    mapId : 'potato',
    center: { lat: 37.98, lng: 23.725 }, // Default location
    zoom: 12,
  });


  let markers = [];
  map.addListener("click", (mapsMouseEvent) => {
    const latlng = mapsMouseEvent.latLng.toJSON();
    if (markers[0]){
      markers[0].position = null;
    }
    markers = [];
    markers.push(new AdvancedMarkerElement ({
      position: { lat: latlng.lat, lng: latlng.lng },
      map: map,
      draggable: true,
    }));
    fields.latField.value = latlng.lat;
    fields.lngField.value = latlng.lng;
  })

}