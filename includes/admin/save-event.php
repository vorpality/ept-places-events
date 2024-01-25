<?php

function ept_pe_publish_event_meta($new_status, $old_status, $post){
  ept_pe_event_publish_date_meta($new_status, $old_status, $post);
  ept_products_publish_place_location($new_status, $old_status, $post);
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

function ept_products_publish_place_location($new_status, $old_status, $post){
  if(!isset($_POST['ept_pe_place_location'])) {
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