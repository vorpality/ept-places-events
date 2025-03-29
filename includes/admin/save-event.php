<?php

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
    update_event_location($post->ID,$_POST['ept_pe_place_id']);
    update_post_meta(
      $post->ID, 
      'event_location', 
      $_POST['ept_pe_place_id']
    );
  }
}
