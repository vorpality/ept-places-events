<?php

function ept_products_single_place_details_render_cb($atts) {
  $userID = get_current_user_id();
  $postID = get_the_ID();
  $isFavorite = false;
  $postType = get_post_type($postID);

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

  $image_ids = get_post_meta($postID, 'custom_images');
  $image_urls = [];
  if (!empty($image_ids)) {
      if (!is_array($image_ids)) {
          $image_ids = explode(',', $image_ids);
      }
      $image_ids = array_filter(array_map('intval', $image_ids));
      $image_urls = array_map(function($id) {
          return wp_get_attachment_url($id);
      }, $image_ids);
  }

  $thumbnail = get_post_meta($postID, 'primary_image', true);
  $thumbnail = ($thumbnail == '')? '' : (int) $thumbnail;
  
  ob_start();

  ?>
  <div class ="wp-block-ept-single-post-details">
    <div class ="single-post" data-image-urls='<?php echo json_encode($image_urls); ?>' data-post-url= '<?php the_permalink();?>'>
      <div class ="image-container">
        <div class ="button-data post-buttons"
          data-logged-in="<?php echo is_user_logged_in(); ?>"
          data-post-id="<?php echo $postID; ?>"
          data-user-id="<?php echo $userID; ?>"
          data-is-favorite="<?php echo $isFavorite; ?>"
        >
          <button class="heart-button"> 
            <i class="bi bi-heart favorite"></i>
          </button>
        </div>
        <div class ="single-post-image image-root">
          <img src="<?php  echo (wp_get_attachment_url($thumbnail)); ?>" alt="">
        </div>
      </div> <?php 
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
          <script>(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
            ({key: "AIzaSyDY56cwNRUcmVLV3LpSUUwjPWx4TQJHr3I", v: "weekly"});</script>
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