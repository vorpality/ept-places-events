
import {render, useState, useEffect} from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import { createRoot } from "react-dom/client";

let map;


function ImageScroller({ imageUrls,postUrl }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [url] = useState(postUrl);
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const dotElements = imageUrls.map((_, index) => (
      <button 
        key={index} 
        onClick = {() => setCurrentImageIndex(index) }
      >
        <img 
          className = {` image-preview ${currentImageIndex === index ? 'active' :''} `}
          src={imageUrls[index]} 
          alt=""
        />
      </button>
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
      <div className = "image-preview-container">
        {dots}
      </div>
    </>
  );
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

  const postElement = document.querySelector('.single-post');
  console.log(postElement)
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

