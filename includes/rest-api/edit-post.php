<?php
function ept_pe_rest_api_edit_post_handler($request){
  $response['status'] = 1;
  $params = $request->get_json_params();

  if(
    !isset($params['postID']) ||
    empty($params['postID'])
  )
  {
    return $response;
  }

  $postID = absint($params['postID']);
  $post = get_post($postID);
  
  $postData = [
  'ID' => $post->ID,
  'type' => get_post_type($post),
  'title' => get_the_title($post),
  'excerpt' => get_the_excerpt($post),
  'meta' => get_post_meta($postID),
  'categories' => wp_get_post_categories($postID, ['fields' => 'all']),
  'tags' => wp_get_post_tags($postID, ['fields' => 'all']),
  ];
      

  $response['post'] = $postData;
  $response['status'] = 2;
  return new WP_REST_Response($response, 200);
}