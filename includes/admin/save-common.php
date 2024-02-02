<?php
function ept_pe_publish_custom_images($new_status, $old_status, $post) {
  echo ($_POST['custom_images_nonce']);
  echo wp_verify_nonce($_POST['custom_images_nonce'], 'custom_images_action');
    if (!isset($_POST['custom_images_nonce']) || !wp_verify_nonce($_POST['custom_images_nonce'], 'custom_images_action')) {
      return;
    }
  
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
      return;
    }
    
    if (!current_user_can('edit_post', $post->ID)) {
      return;
    }
    if ( $new_status == 'publish') {
      $primary_image = isset($_POST['primary_image']) ? $_POST['primary_image'] : '';
      update_post_meta($post->ID, 'primary_image', sanitize_text_field($primary_image));
      set_post_thumbnail($post->ID, (int)$primary_image );
      $new_images = isset($_POST['custom_images']) ? $_POST['custom_images'] : '';
      delete_post_meta($post->ID, 'custom_images');
      if (!empty($new_images)) {
        foreach ($new_images as $new_image){
          add_post_meta($post->ID, 'custom_images', sanitize_text_field($new_image));
        }
      }
    }
  }