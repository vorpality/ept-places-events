<?php
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

