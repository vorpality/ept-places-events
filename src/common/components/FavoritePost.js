import { __ } from '@wordpress/i18n';
import {useState, useEffect} from '@wordpress/element';
import { toggleFavoriteStatus } from '../services/apiService.js';

export const FavoritePost = ({ userID, postID, isFavorite, loggedIn }) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const className = favorite ? "heart-button is-favorite" : "heart-button" ;
  const fill = favorite ? "-fill" : ""

  const handleFavoriteClick = async () =>{
    if(!loggedIn) {
      alert(__('You may need to log in.', 'e-potis'));
      return;
    }
    const response = await toggleFavoriteStatus({ userID, postID, favorite });
    console.log(response.status)
    if(response.status == 2) {
      setFavorite(!favorite);
    }
  }
  
  return ( 
    <div className ="post-buttons">
      <button className={className}
        onClick = {handleFavoriteClick}>
      <i className={`bi bi-heart${fill}`}></i>
    </button>
  </div>

  )
}