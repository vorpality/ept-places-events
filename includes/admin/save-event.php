<?php

function ept_pe_publish_event_meta($new_status, $old_status, $post){
  ept_pe_event_publish_date_meta($new_status, $old_status, $post);
  ept_pe_place_publish_place_location($new_status, $old_status, $post);
  ept_pe_place_publish_place_images($new_status, $old_status, $post);
}

function ept_pe_event_publish_date_meta($new_status, $old_status, $post){
  if(!isset($_POST['ept_pe_event_date'])) {
    return;
}

  if ( $new_status == 'publish') {
    update_post_meta(
      $post->ID, 
      'event_date', 
      $_POST['ept_pe_event_date']
    );
    update_post_meta(
      $post->ID, 
      'event_location', 
      $_POST['ept_pe_place_id']
    );
  }
}

function ept_pe_place_publish_place_location($new_status, $old_status, $post){
  if(!isset($_POST['ept_pe_place_location'])){
    return;
}
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }

  if (!current_user_can('edit_post', $post->ID)) {
    return;
  }

  if ( $new_status == 'publish') {  
    update_post_meta(
      $post->ID, 
      'place_location', 
      $_POST['ept_pe_place_location']
    );
    update_post_meta(
      $post->ID, 
      'lat', 
      $_POST['ept_pe_lat']
    );
    update_post_meta(
      $post->ID, 
      'lng', 
      $_POST['ept_pe_lng']
    );
  }
}

function ept_pe_place_publish_place_images($new_status, $old_status, $post) {

  if (!isset($_POST['place_images_nonce']) || !wp_verify_nonce($_POST['place_images_nonce'], 'place_images_action')) {
    return;
  }

  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }
  
  if (!current_user_can('edit_post', $post->ID)) {
    return;
  }
//print_r($_POST);
//exit();
  if ( $new_status == 'publish') {
    $primary_image = isset($_POST['primary_image']) ? $_POST['primary_image'] : '';
    add_post_meta($post->ID, 'primary_image', sanitize_text_field($primary_image));
    $new_images = isset($_POST['place_images']) ? $_POST['place_images'] : '';
    delete_post_meta($post->ID, 'place_images');
    if (!empty($new_images)) {
      foreach ($new_images as $new_image){
        add_post_meta($post->ID, 'place_images', sanitize_text_field($new_image));
      }
    }
  }
}