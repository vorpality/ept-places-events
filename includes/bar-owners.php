<?php 
function get_owned_bars($user_id){
  global $wpdb;

  $table_name = $wpdb->prefix . 'bar_owners';
  $ownedArr = $wpdb->get_var($wpdb->prepare("SELECT post_id FROM $table_name WHERE user_id = %d", $user_id));
}

function does_own($user_id, $post_id){
  global $wpdb;

  $table_name = $wpdb->prefix . 'bar_owners';
  $isOwnerCheck = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name WHERE user_id = %d AND post_id = %d", $user_id, $post_id));
  if ($isOwnerCheck != null || $user_id == get_post_field('post_author', $post_id)){
    return true;
  }
  return false;
}