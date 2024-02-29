import {__} from '@wordpress/i18n'
import { getImages } from '../../common/services/apiService.js';
import { FileUploadComponent } from '../../common/components/FileUploadComponent.js';
import { createRoot } from "react-dom/client";
import { updateEvent } from './services/apiServices.js';




document.addEventListener('DOMContentLoaded',async () => {
  const post_id = document.querySelector('.wp-block-ept-pe-update-event').getAttribute('data-post-id');

  const startingImages =(post_id && post_id !== "0")? await getImages(post_id):[];
  const rootElement = document.querySelector('.file-upload-wrapper');
  if (rootElement) {
      const root = createRoot(rootElement);
      root.render(<FileUploadComponent startingImages={startingImages} />);
  }

  const add_event_form = document.querySelector('#add-event-form');

  add_event_form?.addEventListener('submit', async event => {
    event.preventDefault();

    const add_event_form_fieldset = add_event_form.querySelector('fieldset')
    add_event_form_fieldset.setAttribute('disabled', true)

    const add_event_status = add_event_form.querySelector('#form-status')
    add_event_status.innerHTML = `
      <div class ="modal-status modal-status-info">
      ${__('Please wait! We are processing your request.', 'e-potis')}
      </div>
    `   

    const userID=add_event_form.querySelector('#user-id').value;
    const title=add_event_form.querySelector('#event-title').value;
    const description=add_event_form.querySelector('#event-description').value;
    const location=add_event_form.querySelector('#event-location').value;
    const primaryImage =add_event_form.querySelector('#post-primary-image-id').value;
    const date = add_event_form.querySelector('#event-date').value;

    event.preventDefault();
    add_event_form_fieldset.removeAttribute('disabled');
     
    const formData = new FormData();
    formData.append('user_id', userID);
    formData.append('post_id', post_id);
    formData.append('event_title', title);
    formData.append('event_description', description);
    formData.append('event_location', location);
    formData.append('event_date', date);
    window.currentSelectedFiles.forEach((file, index) => {
      if (file.isStartingImage){
        formData.append(`existing_images[]`, file.id);
      }
      else {
        formData.append(`event_images[${index}]`, file.file);
        formData.append(`tempID[${index}]`, file.id);
      }
    });
    formData.append('primary_image_id', primaryImage);

    const response = await updateEvent(formData);
    const responseJSON = await response.json();
    if(responseJSON.status === 2) {
      add_event_status.innerHTML = `
        <div class = "form-status form-status-success">
          ${__('Success! The event has been succesfully created, you can view it at ', 'e-potis')} <a href = "${responseJSON.url}">${responseJSON.url}</a>
        </div>
      ` 
    } else {
      add_event_form_fieldset.removeAttribute('disabled')
      add_event_status.innerHTML = `
        <div class ="form-status form-status-danger">
          ${__('Something went wrong', 'e-potis')}
        </div>
      `
    }
  })
})
