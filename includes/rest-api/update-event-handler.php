<?php
function ept_pe_rest_api_update_event_handler($request){
  require_once( ABSPATH . 'wp-admin/includes/image.php' );
  require_once( ABSPATH . 'wp-admin/includes/file.php' );
  require_once( ABSPATH . 'wp-admin/includes/media.php' );
  $file_handler = 'event_image';
  $attach_ids = [];
  $primary_id = 0;
  if (!empty($_FILES['event_images']['name'])) {
    $files = $_FILES['event_images'];
    for ($i = 1; $i <= count($files['name']); $i++) {
      if (!empty($files['name'][$i])) {
        $_FILES['event_image_single']['name'] = $files['name'][$i];
        $_FILES['event_image_single']['type'] = $files['type'][$i];
        $_FILES['event_image_single']['tmp_name'] = $files['tmp_name'][$i];
        $_FILES['event_image_single']['error'] = $files['error'][$i];
        $_FILES['event_image_single']['size'] = $files['size'][$i];

        $attach_id = media_handle_upload('event_image_single', 0);
        if (!is_wp_error($attach_id)) {
          $attach_ids[] = $attach_id;
          if ($request->get_param('tempID')[$i] == $request->get_param('primary_image_id')){
            $primary_id = $attach_id;
          }
        }
      }
    }
    unset($_FILES['event_image_single']);
}

  if (!empty($request->get_param('existing_images'))) {
    $existing_images = $request->get_param('existing_images');
    foreach ($existing_images as $image_id) {
      if (is_numeric($image_id)) {
          $attach_ids[] = $image_id;
          if ($image_id == $request->get_param('primary_image_id')){
            $primary_id = $image_id;
          }
      }
    }
  }
  if (is_wp_error($attach_ids)) {
    $response['message'] = 'No valid images provided.';
    return new WP_REST_Response($response, 500);
  }

  $response['status']=1;
  if(
    $request->get_param('user_id') == null ||
    $request->get_param('event_title') == null ||
    $request->get_param('event_location') == null
  )
  {
    $response['message'] = 'failed initial check';
    return $response;
  }
  $userID = $request->get_param('user_id');
  $user = get_user_by('id', $userID);

  $title = $request->get_param('event_title');
  $description = '';
  $place_id = $request->get_param('event_location');
  $event_date = $request->get_param('event_date');
  if ($request->get_param('event_description') != null){
    $description = $request->get_param('event_description');
  }
 
  $event_post = array(
    'post_author' => $userID,
    'post_title' => $title,
    'post_excerpt' => $description,
    'post_status' => 'publish',
    'post_type' => 'event',
    'meta_input' => array(
      'event_date' => $event_date
    ),
  );
  if ($request->get_param('post_id') == 0){
    $post_id = wp_insert_post($event_post);
  }
  else {
    $event_post['ID'] = $request->get_param('post_id');
    $post_id = wp_update_post($event_post);
  }
  update_event_location($post_id, $place_id);

  if ($post_id == 0) {
    $response['message'] = 'Failed to create event.';
    return new WP_REST_Response($response, 500);
  }
  if (!empty($attach_ids)) {
    set_post_thumbnail($post_id, $attach_ids[0]);
    delete_post_meta($post_id, 'custom_images');
    foreach($attach_ids as $attach_id){
      add_post_meta($post_id, 'custom_images', $attach_id);
    }
    update_post_meta($post_id, 'primary_image', $primary_id);
  }
  $response['prim'] = $primary_id;
  $response['url']= get_the_permalink($post_id);
  $response['status'] = 2;
  return $response;
}



