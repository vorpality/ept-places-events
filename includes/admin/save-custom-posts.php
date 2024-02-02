<?
function ept_pe_publish_custom_post_meta($new_status, $old_status, $post){
  ept_pe_publish_custom_images($new_status, $old_status, $post);

  ept_pe_event_publish_date_meta($new_status, $old_status, $post);

  ept_pe_place_publish_place_location($new_status, $old_status, $post);
}