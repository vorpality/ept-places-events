import { __ } from '@wordpress/i18n';
import { FavoritePost } from '../../../common/components/FavoritePost.js';
import {useState, useEffect} from '@wordpress/element';

export const ImageScroller = (props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [url] = useState(props.postUrl);
  const [dots, setDots] = useState([]);

 
  useEffect(() => {
    const dotElements = props.imageUrls.map((_, index) => (
      <button 
        key={index} 
        onClick = {() => setCurrentImageIndex(index) }
      >
        <img 
          className = {` image-preview ${currentImageIndex === index ? 'active' :''} `}
          src={props.imageUrls[index]} 
          alt=""
        />
      </button>
    ));
    
    setDots(dotElements);


  }, [currentImageIndex, props.imageUrls]);

  
  useEffect(() => {     
  const startingImageIndex = props.imageUrls.findIndex(url => url === props.startingImage);
  if (startingImageIndex !== -1) {
    setCurrentImageIndex(startingImageIndex);
  }
  }, [props.imageUrls, props.startingImage, ]);


  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : props.imageUrls.length - 1));
  };



  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % props.imageUrls.length);
  };

  return (
    <>
    <div className='image-container'>

      <FavoritePost 
        postID={props.postID} 
        userID={props.userID}
        isFavorite = {props.isFavorite}
        loggedIn={props.loggedIn}
      />
      {currentImageIndex > 0 && (
        <button onClick={handlePrevClick} className="arrow left-arrow">
          <i className="bi bi-arrow-left"></i>
        </button>
      )} 
      <a href = {url}>
        <img src={props.imageUrls[currentImageIndex]} alt="" />
      </a>
      {currentImageIndex < props.imageUrls.length - 1 && (
        <button onClick={handleNextClick} className="arrow right-arrow">
          <i className="bi bi-arrow-right"></i>
        </button>
      )}
    </div>
    {props.imageUrls.length > 1 && <div className = "image-preview-container">
      {dots}
    </div>}
    </>
  );
}