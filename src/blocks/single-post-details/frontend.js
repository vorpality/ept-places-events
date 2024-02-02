
import {render, useState, useEffect} from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import { createRoot } from "react-dom/client";

let map;

function ImageScroller(props) {
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
    <div className = "image-preview-container">
      {dots}
    </div>
    </>
  );
}

function FavoritePost(props){
  const [permission] = useState(props.loggedIn)
  const [favorite, setFavorite] = useState(props.isFavorite)
  const className = "heart-button "+favorite ? "heart-button is-favorite" : ""
  const fill = favorite ? "-fill" : ""
  return ( 
    <div className ="post-buttons">
      <button className={className}
        onClick = {async event => {

          if(!permission) {
            return alert('You may need to log in.')
          }

          const response = await apiFetch({
            //example.com/wp-json/up/v1/favorite
            path: 'ept/v1/favorite',
            method: 'POST',
            data: {
              userID: props.userID,
              postID: props.postID,
              favorite
            }
          })

          if(response.status ==2) {
            setFavorite(!favorite)
          }
        }}>
      <i className={`bi bi-heart${fill}`}></i>
    </button>
  </div>

  )
}

async function initMap() {
  const map_element = document.getElementById('place-map');
  if (!map_element) return;
  const lat = map_element.getAttribute("lat");
  const lng = map_element.getAttribute("lng");


  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const map_id = document.getElementById("place-location").value;
  const  latlng = new google.maps.LatLng(lat, lng);
  const map_options = {
    zoom: 15,
    center: latlng,
    mapId : "X"
  }
  map = new Map(map_element, map_options)

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: latlng,
  });
}

addEventListener("DOMContentLoaded", () => {
  initMap();

  const postElement = document.querySelector('.wp-block-ept-single-post-details .single-post');
  const imageUrls = JSON.parse(postElement.dataset.imageUrls || '[]');
  const post_url = postElement.dataset.postUrl;
  const postID = parseInt(postElement.dataset.postId);
  const userID = parseInt(postElement.dataset.userId);
  const loggedIn = !!postElement.dataset.loggedIn;
  const isFavorite = !!postElement.dataset.isFavorite;
  if (imageUrls.length > 0) {
    const post_images = postElement.querySelector('.post-images');
    const root = createRoot(post_images);
    root.render(
    <ImageScroller 
      imageUrls={imageUrls} 
      postUrl={post_url}
      postID = {postID}
      userID = {userID}
      loggedIn = {loggedIn}
      isFavorite = {isFavorite}
    />);
  }
});

