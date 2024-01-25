import {render, useState} from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import { createRoot } from "react-dom/client";

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
  const blocks = document.querySelectorAll('.post-buttons')

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
  
})

function changeBubbleValue(newVal){
  const bubble = document.querySelector('.mini-cart-bubble')
  const currentQ = parseInt(bubble.dataset.quantity)
  const newQ = currentQ + newVal
  bubble.dataset.quantity = newQ;
}

function changePostValue(postID, newVal){
  const blocks = document.querySelectorAll('.single-post')
  blocks.forEach(block =>{
    /*
    console.log(block)
    if (parseInt(block.dataset.postId)==postID){
      console.log(block)
      block.dataset.isInCart=newVal
    }*/
    //reDraw(block)
  })
}

