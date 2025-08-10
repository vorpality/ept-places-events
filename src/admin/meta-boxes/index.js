import './main.css';
import {render, useState, useEffect} from '@wordpress/element'
import { createRoot } from "react-dom/client";
import apiFetch from '@wordpress/api-fetch'
import { __ } from '@wordpress/i18n'
import {
  MediaUpload,MediaUploadCheck
} from "@wordpress/block-editor";

function ImagesManager() {
  const rootElement = document.getElementById('image-upload-root');
  const initialImages = JSON.parse(rootElement.dataset.images || '[]');
  const [images, setImages] = useState(initialImages);
  const [primaryImageId, setPrimaryImageId] = useState(
    initialImages.find(image => image.isPrimary)?.id || null
  );
  const addNewImages = (newImages) => {
    const uniqueNewImages = newImages.filter(newImage => 
      !images.some(existingImage => parseInt(existingImage.id, 10) === newImage.id)
    );
    setImages([...images, ...uniqueNewImages]);
    
    if (!primaryImageId && uniqueNewImages.length > 0) {
      setPrimaryImageId(uniqueNewImages[0].id);
    }
  };

  window.addNewImagesToUploader = addNewImages;

  // Handle removing an image
  const removeImage = (id) => {
    const new_images = images.filter(image => image.id !== id);
    setImages(new_images);

    if (primaryImageId === id) {
      if (new_images.length > 0) {
        setPrimaryImageId(new_images[0].id);
      } else {
        setPrimaryImageId(null);
      }
    }
  };

  // Handle setting an image as primary
  const setPrimaryImage = (id) => {
    setPrimaryImageId(id);
  };

  return (
    <div>
      <div id="image-preview-wrapper">
        {images.map(image => (
          <ImagePreview
            key={image.id}
            id={image.id}
            url={image.url}
            isPrimary={image.id === primaryImageId}
            onRemove={() => removeImage(image.id)}
            onSetPrimary={() => setPrimaryImage(image.id)}
          />
        ))}
      </div>
      {images.map(image => (
        <input key={image.id} type="hidden" name="custom_images[]" value={image.id} />
      ))}
      {primaryImageId && <input type="hidden" name="primary_image" value={primaryImageId} />}
    </div>
  );
}
export default ImagesManager;

function ImagePreview({ id, url, isPrimary, onRemove, onSetPrimary }) {
  const [isChecked, setIsChecked] = useState(isPrimary);

  useEffect(() => {
    setIsChecked(isPrimary);
  }, [isPrimary]);

  const handlePrimaryChange = () => {
    if (!isChecked) {
      onSetPrimary(id);
    }
  };

  return (
    <div className="image-preview">
      <img src={url} />
      <button className="remove_image_button" onClick={() => onRemove(id)}>
        <i className="bi bi-x"></i>
      </button>
      <div className="image-details">
        <label>{__('Primary Image' , 'e-potis')}</label>
        <input
          type="checkbox"
          className="primary-checkbox"
          checked={isChecked}
          onChange={handlePrimaryChange}
        />
      </div>
    </div>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('image-upload-root');
  const root = createRoot(rootElement);
  root.render(<ImagesManager />);


  const uploadButton = document.getElementById('custom_images_upload_btn');
  if (uploadButton != null) {
    uploadButton.addEventListener('click', function() {
      const mediaUploader = wp.media({
        title: 'Select Images',
        button: {
          text: 'Use these images'
        },
        multiple: true
      }).on('select', function() {
        const selectedAttachments = mediaUploader.state().get('selection').map(attachment => attachment.toJSON());

        if (window.addNewImagesToUploader) {
          window.addNewImagesToUploader(selectedAttachments);
        }
      }).open();
    });
  }



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


