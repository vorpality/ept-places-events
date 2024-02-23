
import {render, useState, useEffect} from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import { createRoot } from "react-dom/client";
import { __ } from '@wordpress/i18n';

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
  const marker = new AdvancedMarkerElement({
    map: map,
    position: latlng,
  });
}

//Editing React

function EditDashboard({ postID }) {
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    images: ''
  });

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await apiFetch({
          path: `ept/v1/edit_post`, 
          method: 'POST',
          data: { postID: postID }
        });

        console.log(response); // Log the fetched response

        const postType = response.post.type;
        setPostDetails({
          title: response.post.title || '',
          description: response.post.description || '',
          primary_image: response.post.meta.primary_image || '',
          images: response.post.meta.custom_images || [],
          type: response.post.type,
        })
          if (postType == "place"){
            setPostDetails(prevDetails => ({
              ...prevDetails,
              location: response.post.meta.place_location || ''
            }));
          }
          if (postType == "event"){
            setPostDetails(prevDetails => ({
              ...prevDetails,
              location: response.post.event_location || '',
              date: response.post.date || '',
            }));
          }
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [postID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const saveChanges = () => {
    console.log(postDetails);
    // Implement functionality to update post details on the server...
    location.reload();
  };

  return (
    
    <div className = "post-info edit-phase">
      {console.log(postDetails)}
      <label className = "edit-label">
        {__('Title', 'e-potis')}
      </label>
      <input 
        className='detail-box'
        type="text" 
        name="title" 
        value={postDetails.title || ''} 
        onChange={handleChange} 
      />
      <label className = "edit-label">
        {__('Description', 'e-potis')}
      </label>
      <textarea 
        className = 'detail-box' 
        name="description" 
        rows="10"
        colums="44"
        value={postDetails.description || ''} 
        onChange={handleChange}>
      </textarea>

      {postDetails.type=="place" &&
        <input 
          className='detail-box'
          type="text" 
          name="location" 
          value={postDetails.location || ''} 
          onChange={handleChange} 
        />
      }
      <button onClick={saveChanges}>Save</button>
    </div>
  );
}



addEventListener("DOMContentLoaded", () => {
  initMap();

  const postElement = document.querySelector('.wp-block-ept-single-post-details .single-post');
  const imageUrls = JSON.parse(postElement.dataset.imageUrls || '[]');
  const primary_image = postElement.dataset.primaryUrl;
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
      startingImage = {primary_image}
      imageUrls={imageUrls} 
      postUrl={post_url}
      postID = {postID}
      userID = {userID}
      loggedIn = {loggedIn}
      isFavorite = {isFavorite}
    />);
  }

  const edit_button = document.querySelector('.wp-block-ept-single-post-details #edit-button');
  edit_button.addEventListener('click', (event) => {
    event.preventDefault();
    const editable_interface = document.querySelector('.wp-block-ept-single-post-details');
    const editable_interface_root = createRoot(editable_interface);
    editable_interface_root.render(
      <EditDashboard
        postID = {postID}
      />
    )
  })
});

