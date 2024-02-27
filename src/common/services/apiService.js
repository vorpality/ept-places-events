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