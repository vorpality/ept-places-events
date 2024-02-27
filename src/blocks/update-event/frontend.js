import {__} from '@wordpress/i18n'
import {render, useState, useEffect} from '@wordpress/element'
import { createRoot } from "react-dom/client";

const FileUploadComponent = ({startingImages}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [primaryImage, setPrimaryImage] = useState('');
  
    useEffect(() => {
      const customImagesArray = startingImages.custom_images && Object.keys(startingImages.custom_images).length > 0
      ? Object.entries(startingImages.custom_images).map(([id, { url, name }]) => ({
          id,
          name,
          url,
          isStartingImage: true
        }))
      : [];
    
      const initialPrimaryImage = startingImages.primary_image || (customImagesArray.length > 0 ? customImagesArray[0].id : '');
      setPrimaryImage(initialPrimaryImage[0]);

      setSelectedFiles(customImagesArray);

    }, [startingImages]);


  
  
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map((file, index) => ({
      id: `new-${index}-${Date.now()}`, // Generate a unique ID for new files
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      isStartingImage: false,
    }));
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
    if (primaryImage == '' && newFiles.length > 0) {
      setPrimaryImage(newFiles[0].id);
    }
  };
 

  useEffect(() => {
    window.currentSelectedFiles = selectedFiles; 
  }, [selectedFiles]); 

  const removeFile = (indexToRemove) => {
    const fileToRemove = selectedFiles[indexToRemove];
    if (fileToRemove.id == primaryImage) {
      let newPrimary = selectedFiles.find((_, index) => index != indexToRemove);
      setPrimaryImage(newPrimary ? newPrimary.id : '');
    }
    if (!fileToRemove.isStartingImage) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
  };

  const handlePrimaryChange = (file_id) => {
      setPrimaryImage(file_id);
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setPrimaryImage('');
  }

  return(
    <>
      <label htmlFor="event-images" className="file-upload-button">{__('Choose Files', 'e-potis')}</label>
      <input type="hidden" id="event-primary-image-id" value = {primaryImage} />
      <input 
        type="file" 
        id="event-images" 
        name="event_images[]" 
        multiple 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />
      <div className="file-list">
        {selectedFiles.map((file, index) => (
          
          <div key={index} className="file-entry">
            <div className='file-image-container'>
              <img 
                className='file-image'
                src={file.url} 
                alt={file.name} 
              /> 
              <span className="remove-file" onClick={() => removeFile(index)}>&#10005;</span>
            </div>
            
            <div className='side-by-side'>
              <input
                className="primary-image-check"
                type="checkbox"
                checked={file.id === primaryImage}
                onChange={() => handlePrimaryChange(file.id)}
              />
              <label className = "primary-label" htmlFor="primary-image-check">{__('Primary', 'e-potis')}</label>
            </div>
            
          </div>
        ))}
        </div>
      {selectedFiles.length > 0 && 
        <button 
          className='clear-list'
          onClick={clearFiles}
        >
          {__('Clear Files', 'e-potis')}
        </button>
      }
    </>
  );
}
/*
jQuery(document).ready(function($) {
  var showButton = $('.wp-block-ept-user-flow-my-business .add-event-button');
  var addEventContainer = document.querySelector('.wp-block-ept-user-flow-add-event');

  if(showButton.length > 0) {
    addEventContainer.style.display=('none');
    showButton.click(function(event) {
      event.preventDefault();
      $(this).css('display', 'none');
      addEventContainer.style.display=('flex');
    });
  }

});*/

document.addEventListener('DOMContentLoaded',async () => {
  const post_id = document.querySelector('.wp-block-ept-pe-update-event').getAttribute('data-post-id');

  const  startingImages =(post_id && post_id !== "0")? await getImages(post_id):[];
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
    const primaryImage =add_event_form.querySelector('#event-primary-image-id').value;
    event.preventDefault();
    add_event_form_fieldset.removeAttribute('disabled');
     
    const formData = new FormData();
    formData.append('user_id', userID);
    formData.append('post_id', post_id);
    formData.append('event_title', title);
    formData.append('event_description', description);
    formData.append('event_location', location);
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

    const response = await fetch(ept_events.update, {
      method: 'POST',
      body: formData, 
    });

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

async function getImages(post_id){
  if (post_id==0) return [];

  const formData = {
    postID : post_id
  }

const response = await fetch(ept_posts.retrieve, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
});

const responseJSON = await response.json();
const images = {
  custom_images : responseJSON.images,
  primary_image : responseJSON.primary_image_id
}
return images;
}