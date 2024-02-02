import {render, useState, useEffect} from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import { createRoot } from "react-dom/client";

function ImageScroller({ imageUrls,postUrl }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [url] = useState(postUrl);
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const dotElements = imageUrls.map((_, index) => (
      <button 
        key={index} 
        className={`bi ${currentImageIndex === index ? 'bi-circle-fill' : 'bi-circle'}`}
        onClick = {() => setCurrentImageIndex(index) }
      ></button>
    ));
    setDots(dotElements);
  }, [currentImageIndex, imageUrls]);


  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : imageUrls.length - 1));
  };



  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  return (
    <>
      {currentImageIndex > 0 && (
        <button onClick={handlePrevClick} className="arrow left-arrow">
          <i className="bi bi-arrow-left"></i>
        </button>
      )} 
      <a href = {url}>
        <img src={imageUrls[currentImageIndex]} alt="" />
      </a>
      {currentImageIndex < imageUrls.length - 1 && (
        <button onClick={handleNextClick} className="arrow right-arrow">
          <i className="bi bi-arrow-right"></i>
        </button>
      )}
      {imageUrls.length > 1 && <div className = "image-dots">
        {dots}
      </div>}
    </>
  );
}

function FavoritePost(props){
  const [permission] = useState(props.loggedIn)
  const [favorite, setFavorite] = useState(props.isFavorite)
  const className = favorite ? "is-favorite" : ""
  const fill = favorite ? "-fill" : ""
  return (    
    <>
    <button className={"heart-button " + className}
      onClick = {async event => {

        if(!permission) {
          return alert('You may need to log in.')
        }

        const favResponse = await apiFetch({ 
          //example.com/wp-json/ept/v1/favorite 
          path: 'ept/v1/favorite',
          method: 'POST',
          data: {
            userID: props.userID,
            postID: props.postID,
            favorite
          }
        })
        
        if(favResponse.status ==2) {
          setFavorite(!favorite)
        }
      }}>
    
    <i className={`bi bi-heart${fill} favorite`}></i>
 </button>
  </>
  )}



document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.wp-block-ept-pe-query .post-buttons')
  blocks.forEach( block => {
  const postID = parseInt(block.dataset.postId)
  const userID = parseInt(block.dataset.userId)
  const loggedIn = !!block.dataset.loggedIn
  const isFavorite = !!block.dataset.isFavorite
  const root = createRoot(block);
  root.render(
    <FavoritePost 
    postID={postID} 
    userID={userID}
    isFavorite = {isFavorite}
    loggedIn={loggedIn}
    />)
  })
  
  const postElements = document.querySelectorAll('.single-post');
  postElements.forEach(postElement => {
    const imageUrls = JSON.parse(postElement.dataset.imageUrls || '[]');
    const post_url = postElement.dataset.postUrl;
    if (imageUrls.length > 0) {
      const post_images = postElement.querySelector('.image-root');
      const root = createRoot(post_images);
      root.render(
      <ImageScroller 
        imageUrls={imageUrls} 
        postUrl={post_url}
      />);
    }
  });


});



