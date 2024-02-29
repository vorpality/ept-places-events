<?php

function ept_pe_single_post_details_render_cb($atts) {
  //require_once EPT_PE_PLUGIN_DIR . 'includes/bar-owners.php';
  $userID = get_current_user_id();
  $postID = get_the_ID();
  $isFavorite = false;
  $postType = get_post_type($postID);
  $canEdit = does_own($userID, $postID);
  //Prepare 
  if ($postType == 'place'){
    $location = get_post_meta($postID,'place_location',true);
    if($userID != 0){
      $userFavorites = get_user_meta($userID, 'favorites', false);
      if(count($userFavorites) > 0){
        $isFavorite = (in_array(strval($postID), $userFavorites));
      }
    $place_lat = get_post_meta($postID,'lat',true);
    $place_lng = get_post_meta($postID,'lng',true);
    }
  }
  else if ($postType == 'event'){
    $date = get_post_meta($postID,'event_date',true);

    $placeID = get_post_meta($postID, 'event_location', true);
    if (!$placeID == '') {
      $placeTitle = get_the_title($placeID);
      $placeUrl = get_permalink($placeID);
    }
    else {
      $placeTitle = '';
      $placeUrl = '';
    }
  }

  $thumbnail_id = get_post_meta($postID, 'primary_image', true);
  $thumbnail_id = ($thumbnail_id == '')? '' : (int) $thumbnail_id;

  $image_ids = get_post_meta($postID, 'custom_images');
  $image_urls = [];

  if ($thumbnail_id > 0) {
    $thumbnail_url = wp_get_attachment_url($thumbnail_id);
    if (!empty($thumbnail_url)) {
        $image_urls[] = $thumbnail_url;
    }
  }
  foreach ($image_ids as $id) {
    if ($id != $thumbnail_id) {
      $url = wp_get_attachment_url($id);
      if (!empty($url)) {
          $image_urls[] = $url;
      }
    }
  }


  
  ob_start();

  ?>
  <div class ="wp-block-ept-single-post-details">
    <?php if ($canEdit){ ?>
      <div id = "edit-line"> 
        <button id = "edit-button" postType = "<?php echo($postType); ?>">
          <i class="bi bi-pencil-square"></i>
        </button>
      </div>
    <?php } ?>
    <div class ="single-post" 
      data-image-urls='<?php echo json_encode($image_urls); ?>' 
      data-post-url= '<?php the_permalink();?>'
      data-logged-in="<?php echo is_user_logged_in(); ?>"
      data-primary-url="<?php echo ($thumbnail_url); ?>"
      data-post-id="<?php echo $postID; ?>"
      data-user-id="<?php echo $userID; ?>"
      data-is-favorite="<?php echo $isFavorite; ?>"
      >
      <?php if($image_ids){ ?>
      <div class ="post-images">
        <div class ="post-buttons">
          <button class="heart-button"> 
            <i class="bi bi-heart favorite"></i>
          </button>
        </div>
        <div class ="single-post-image image-root">
          <img src="<?php  echo (wp_get_attachment_url($thumbnail_url)); ?>" alt="">
        </div>
      </div> <?php 
      }
      if ($postType == 'place') { ?>
        <div class ="single-post-detail">
          <div class = "post-info">
            <span id="place-location">
            <?php echo(__('Location', 'e-potis')); ?> : 
              <?php echo($location); ?>
            </span>
          </div>
        </div>
        <div id="place-map" 
          lat = "<?php echo $place_lat;?>"
          lng = "<?php echo $place_lng;?>"
          style="width: 320px; height: 480px;">
        </div><?php
      }
      else if ($postType == 'event'){ ?>
        <div class ="single-post-detail">
          <div class = "post-info">
            <span class="event-date">
              <?php  _e("Date : ",'e-potis'); echo($date); ?>
            </span>
            <span class="event-location">
              <?php  _e("Location : ",'e-potis'); ?>
              <a href = "<?php echo($placeUrl); ?>">
                <?php echo($placeTitle); ?>
              </a>
            </span>
          </div>
        </div> <?php 
      } ?>
    </div>
  </div>
  <?php

  $output = ob_get_contents();
  ob_end_clean();
  return $output;
}