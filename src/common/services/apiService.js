import apiFetch from '@wordpress/api-fetch';

export const toggleFavoriteStatus = async (data) => {
  const response = await apiFetch({
    //example.com/wp-json/up/v1/favorite
    path: 'ept/v1/favorite',
    method: 'POST',
    data: {
      userID: data.userID,
      postID: data.postID,
      favorite : data.favorite
    }
  })
  return response;
}
export const getImages = async (post_id) =>{
  if (post_id==0) return [];

  const formData = {
    postID : post_id
  }

const response = await fetch(ept_posts.retrieve, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
});

const responseJSON = await response.json();
const images = {
  custom_images : responseJSON.images,
  primary_image : responseJSON.primary_image_id
}
return images;
}