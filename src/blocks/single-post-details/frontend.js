
import { createRoot } from "react-dom/client";
import { __ } from '@wordpress/i18n';
import { ImageScroller } from './components/ImageScroller.js';
import { initMap } from './services/Map.js'


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
  if (edit_button) {
    const postType = edit_button.getAttribute("postType");
    edit_button.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = `${window.location.origin}/edit-${postType}?pid=${postID}`;
    })
  }
});

