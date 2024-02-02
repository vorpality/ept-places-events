<?php 
function ept_pe_custom_images_content($post) {
  wp_nonce_field('custom_images_action', 'custom_images_nonce');

  $images_ids = get_post_meta($post->ID, 'custom_images');
  $primary_image_id = (int)get_post_meta($post->ID, 'primary_image', true);
  if ($primary_image_id == 0 && count($images_ids) > 0){
      $primary_image_id = $images_ids[0];
  }

  $images_data = array_map(function($image_id) use ($primary_image_id) {
      return array(
          'id' => $image_id,
          'url' => wp_get_attachment_url($image_id),
          'isPrimary' => ($image_id == $primary_image_id)
      );
  }, $images_ids);

  ?>
  <button type="button" id = "custom_images_upload_btn"><?php _e('Upload Images', 'e-potis');?></button>
  <div id="image-upload-root" data-images='<?php echo json_encode($images_data); ?>'></div>
  <?php
}