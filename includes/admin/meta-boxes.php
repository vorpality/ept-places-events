<?php

function ept_pe_event_add_meta_boxes_cb($post){
  add_meta_box('date', __('Event Date','e-potis'), 'ept_pe_event_add_date');
  add_meta_box('location', __('Happening at', 'e-potis'), 'ept_pe_event_add_location');
  add_meta_box('custom_images', __('Event Images', 'e-potis'), 'ept_pe_custom_images_content');

}
   
function ept_pe_place_add_meta_boxes_cb($post){
  add_meta_box('location', __('Place Location','e-potis'), 'ept_pe_place_add_location');
    add_meta_box(
    'custom_images',          
    __('Place Images', 'e-potis'),                
    'ept_pe_custom_images_content'                      
  );
}

function ept_register_meta_fields() {
  register_rest_field(
      'place', // Change to your custom post type
      'meta',
      array(
          'get_callback'    => 'ept_get_meta_fields',
          'update_callback' => null,
          'schema'          => null,
      )
  );
}

function ept_get_meta_fields($object, $field_name, $request) {
  $post_id = $object['id'];

  return array(
      'place_location' => get_post_meta($post_id, 'place_location', true),
      'custom_images'  => get_post_meta($post_id, 'custom_images', true),
      'primary_image'  => get_post_meta($post_id, 'primary_image', true),
      'event_date'     => get_post_meta($post_id, 'event_date', true),
      'place_lat'      => get_post_meta($post_id, 'location_lat', true),
      'place_lng'      => get_post_meta($post_id, 'location_lng', true),
      'is_favorite'    => false,
      'distance'       => get_post_meta($post_id, 'distance', true),
      'place_url'      => get_post_meta($post_id, 'place_url', true),
  );
}
