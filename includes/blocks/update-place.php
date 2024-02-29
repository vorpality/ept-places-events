<?php

function ept_pe_update_place_form_render_cb($atts) {
  
  global $wpdb;
  $user = wp_get_current_user();
  if (!get_user_meta($user->ID, 'business_owner', true) && !is_admin()){
    wp_redirect(home_url());
  }
  $header = __("Add new place", 'e-potis');
  $current_post = 0;
  $current_title = '';
  $current_description = '';

  if(isset($_GET['pid'])) {
    $header = __("Edit place", 'e-potis');
    $current_post = $_GET['pid'];
    $current_title = get_the_title($current_post);
    $current_description = get_the_excerpt($current_post);
    $current_location = get_post_meta($current_post, 'place_location', true);
    $current_lat = get_post_meta($current_post, 'lat', true);
    $current_lng = get_post_meta($current_post, 'lng', true);

  }


  ob_start();
  ?>
  <div class="wp-block-ept-pe-update-place" 
    data-post-id = "<?php echo $current_post; ?>"
  >
    <form method = "post"
      id="add-place-form"
      action = ""
      autocomplete="off"
      enctype="multipart/form-data"
    >
      <div id ='form-status'>
      </div>

      <fieldset>
        <h2 id ="add-new-place-label">
          <?php echo $header;?>
        </h2>
        <h3>
          <?php echo (__('Place Title','e-potis'));?>
        </h3>
        <input 
          value="<?php echo $current_title;?>"
          type="text" 
          name="place_title" 
          id="place-title">
        </input >
        <h3>
          <?php echo (__('Place description','e-potis'));?>
        </h3>
        <textarea 
          value="<?php echo $current_description;?>"
          rows="5"
          cols="40"
          name="place_description" 
          id="place-description" 
        ></textarea>      
        <h3>
          <?php echo (__('Place location','e-potis'));?>
        </h3>
        <input name="place_location" id = "place-location" 
          value = "<?php echo $current_location; ?>"
          >
        <input type="hidden" id = "place-lat"
          value = "<?php echo $current_lat; ?>"
          >
        <input type="hidden" id = "place-lng"
          value = "<?php echo $current_lng; ?>"
          >
        <button type="button" id = "map-select">
          <?php echo __('Select from map', 'e-potis'); ?>
        </button>
        <h3><?php echo __('Place Images', 'e-potis'); ?></h3>
        <div class="file-upload-wrapper">
        </div>
        <input type="hidden" name="form-id" value = "021"></input>
        <input type="hidden" id="user-id" value = "<?php echo $user->ID?>"></input>
        <div class='btn-wrapper'>
            <button type="submit" class='open-confirmation-modal'><?php _e('Submit', 'e-potis'); ?></button>
        </div>
      </fieldset>
    </form>
    <div id="map-popup" >
      <input type = "hidden" id = "temp-lng">
      <input type = "hidden" id = "temp-lat">

      <div id="map-overlay" class = "close-popup"></div>
      <div id = "popup-container">
        <button class = "close-popup"> X </button>
        <div id="map-canvas"></div>
        <button id="confirm-location"><?php _e('Confirm Location', 'e-potis');?></button>
      </div>
    </div>
  </div>


  <?php

  $output = ob_get_contents();
  ob_end_clean();
  return $output;
}