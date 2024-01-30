<?php 

function ept_pe_place_images_content($post){
  wp_nonce_field('place_images_action', 'place_images_nonce' );

  $images_ids = get_post_meta($post->ID, 'place_images');
  $images_ids_string = implode(',', $images_ids);
  $primary_image_id = get_post_meta($post->ID, 'primary_image', true);
  $primary_image = ($primary_image_id) ? wp_get_attachment_url($primary_image_id) : wp_get_attachment_url($images_ids[0]);
  
  ?><div 
      id ="image-upload-root"
      data-post-id= "<?php echo($post->ID);?>"
    >
     <input type="hidden" name="place_images" value=" <?php echo esc_attr($images_ids_string); ?>" size="25" /><?php
    ?> <button type="button" id="place_images_upload_btn"> <?php _e('Upload Images', 'e-potis'); ?></button> 
    <div id= "image-preview-wrapper"><?php

      if (is_array($images_ids)) {
        foreach ($images_ids as $image_id) {
          $image_url = wp_get_attachment_url($image_id);
          if ($image_url) { ?>

            <div 
              class = "image-preview" 
              data-image_id="<?php echo(esc_attr($image_id));?>"
              data-image_url="<?php echo(esc_url($image_url));?>"
            >
            </div>
            <input type="hidden" id="primary_image_input" name="primary_image" value="<?php echo esc_attr($primary_image_id); ?>" />
            <input type="hidden" name="place_images[]" value="<?php echo(esc_attr($image_id)) ?>"> <?php
          } 
        }
      }?>
    </div>
  </div><?php
}