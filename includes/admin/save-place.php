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
    update_place_location($post->ID,$_POST['ept_pe_lat'],$_POST['ept_pe_lng']);
  }
}

function ept_pe_place_update_owner_db($new_status, $old_status, $post){

  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }

  if (!current_user_can('edit_post', $post->ID)) {
    return;
  }

  if ($new_status == 'publish' && $post->post_type == 'place') {  
    global $wpdb;
    $table_name = $wpdb->prefix . 'bar_owners'; 
    
    $exists = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_name WHERE post_id = %d", $post->ID));
    
    if ($exists) {
      $wpdb->update(
        $table_name,
        ['user_id' => NULL],
        ['post_id' => $post->ID], 
        ['%d'], 
        ['%d'] 
      );
    } else {
      $wpdb->insert(
        $table_name,
        ['user_id' => NULL, 'post_id' => $post->ID],
        ['%d', '%d']
      );
    }
  }
}