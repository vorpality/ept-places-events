import { createRoot } from "react-dom/client";
import { FavoritePost } from '../../common/components/FavoritePost.js';
import { QueryImageBox } from './components/QueryImageBox.js';

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
      <QueryImageBox 
        imageUrls={imageUrls} 
        postUrl={post_url}
      />);
    }
  });

});



