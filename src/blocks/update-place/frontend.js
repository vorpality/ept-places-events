import {__} from '@wordpress/i18n'
import { createRoot } from "react-dom/client";
import { FileUploadComponent} from '../../common/components/FileUploadComponent.js';
import { updatePlace } from './services/apiServices.js';
import { getImages } from '../../common/services/apiService.js';
import { mapAutoComplete } from '../../common/services/mapAutoComplete.js';
import { mapSelect } from '../../common/services/selectFromMap.js';

document.addEventListener('DOMContentLoaded',async () => {
  const post_id = document.querySelector('.wp-block-ept-pe-update-place').getAttribute('data-post-id');

  const startingImages =(post_id && post_id !== "0")? await getImages(post_id):[];
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
    const lat = add_place_form.querySelector('#place-lat').value;
    const lng = add_place_form.querySelector('#place-lng').value;
    event.preventDefault();
    add_place_form_fieldset.removeAttribute('disabled');
     
    const formData = new FormData();
    formData.append('user_id', userID);
    formData.append('post_id', post_id);
    formData.append('place_title', title);
    formData.append('place_description', description);
    formData.append('place_location', location);
    formData.append('lat', lat);
    formData.append('lng', lng);
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

  const modal = {
    content : document.getElementById('map-popup'),
    confirmButton : document.getElementById('confirm-location'),
    openButton : document.getElementById('map-select'),
    closeButton : Array.from(document.querySelectorAll('.close-popup'))
  }

  const tempFields = {
      lat : document.getElementById('temp-lat'),
      lng : document.getElementById('temp-lng')
  }

  const mainFields = {
    lat : document.getElementById('place-lat'),
    lng : document.getElementById('place-lng'),
    input: document.getElementById('place-location')
  }
  const startingPosition = (mainFields.lat.value != null) ? {
    lat : parseFloat(mainFields.lat.value),
    lng : parseFloat(mainFields.lng.value)
  } : null;
  mapSelect({modal,tempFields,mainFields,startingPosition});
});


