import {__} from '@wordpress/i18n'
import { useState, useEffect} from '@wordpress/element'

export const FileUploadComponent = ({startingImages}) => {
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
      setPrimaryImage(initialPrimaryImage[0] ? initialPrimaryImage[0] : '');
      setSelectedFiles(customImagesArray);

    }, [startingImages]);


  
  
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map((file, index) => ({
      id: `new-${index}-${Date.now()}`,
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
      <label htmlFor="post-images" className="file-upload-button">{__('Choose Files', 'e-potis')}</label>
      <input type="hidden" id="post-primary-image-id" value = {primaryImage} />
      <input 
        type="file" 
        id="post-images" 
        name="post_images[]" 
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