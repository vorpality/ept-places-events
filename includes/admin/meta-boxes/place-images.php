<?php 

function ept_pe_place_images_content($post){
  wp_nonce_field('place_images_action', 'place_images_nonce' );

  $images_ids = get_post_meta($post->ID, 'place_images');
  $images_ids_string = implode(',', $images_ids);
  
  ?> <input type="hidden" name="place_images" value=" <?php echo esc_attr($images_ids_string); ?>" size="25" /><?php
  ?> <button type="button" id="place_images_upload_btn"> <?php _e('Upload Images', 'e-potis'); ?></button> 
  <div id= "image-preview-wrapper"><?php

    if (is_array($images_ids)) {
      foreach ($images_ids as $image_id) {
        $image_url = wp_get_attachment_url($image_id);
        if ($image_url) { ?>
          <div class = "image-preview" id="image-<?php echo(esc_attr($image_id));?>">
            <img src="<?php echo esc_url($image_url); ?>" width="150" height="150" style="max-width: 150px; max-height: 150px;">
            <input type="hidden" name="place_images[]" value="<?php echo(esc_attr($image_id)) ?>'">
            <a href="#" class="remove_image_button reddddd"><?php _e('Remove', 'e-potis'); ?></a>
          </div><?php
        } 
      }
    }?>
  </div><?php
}