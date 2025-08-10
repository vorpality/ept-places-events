<?php

function ept_pe_query_render_cb($atts) {
  $title = esc_html($atts['title']);
  $userID = get_current_user_id();
  $userFavoritesString = get_user_meta($userID, 'favorites', false);
  $favoriteIDs = ($userFavoritesString)?  array_map('intval', $userFavoritesString) : [] ;
  $heading = esc_html($atts['content']);
  $showTitle = $atts['showCategory'];
  $category = '';
  $queryType = $atts['queryType'];
  $view = $atts['view'];
  $lat = 0;
  $lng = 0;

  if (isset($_COOKIE['location']) && $_COOKIE['location']=="set") {
    $lat = $_COOKIE['location_lat'];
    $lng = $_COOKIE['location_lng'];

    // Optionally sanitize them
    $lat = filter_var($lat, FILTER_VALIDATE_FLOAT);
    $lng = filter_var($lng, FILTER_VALIDATE_FLOAT);
  }
  $searchTerms = (isset($_GET["s"])) ? $_GET['s'] : '' ;
  $order = isset($_GET['orderby']) ? $_GET['orderby'] : '';


  if ($showTitle){
    $heading = substr(get_the_archive_title(),10);
    $category = get_queried_object_id();
  }



  switch ($view){
    case ("favorites view"):
      $args = [
        'post_type' => ['place', 'event'],
        'posts_per_page' => $atts['count'],
        'location' => ['lat' => $lat, 'lng' => $lng],
        'is_favorite' => true,
        'orderby' => $order
      ];

      break;

    case ("all view"):
      $args = [
        'post_type' => ['place', 'event'],
        'posts_per_page' => $atts['count'],
        'location' => ['lat' => $lat, 'lng' => $lng],
        'orderby' => $order
      ];
    break;

    case ("normal view"):
      $categoryIDs = array_map(function($term) {
        return $term['id'];
      }, $atts['categories']);

      $args = [
        'post_type' => ['place', 'event'],
        'posts_per_page' => $atts['count'],
        'location' => ['lat' => $lat, 'lng' => $lng],
        'cat' => $category,
        's' => $searchTerms,
        'orderby' => $order
      ];

      if (!empty($categoryIDs)) {
        foreach($categoryIDs as $cat)
          $args['cat'] .= $cat .',' ;
      }


      break;
  }

 
  $query = new WP_Query($args);
  if ($query->have_posts()) {
    foreach ($query->posts as $post) {
        $grouped_posts[$post->post_type][] = $post; // Group by post type
    }
  }
  wp_reset_postdata(); 
  ob_start(); ?>

  <!-- START main container -->
  <div class="wp-block-ept-pe-query"> 
    <div id='sort-root'></div> 

    <?php if (!empty($grouped_posts['place'])){ ?>
      <!-- START Places block -->
      <div class="inner-page-header">
        <h1><?php _e('Places', 'e-potis'); ?></h1> 
      </div> 
      <div class="posts">
        <?php foreach($grouped_posts['place'] as $post) {
          $postID = $post->ID;
          $location = get_post_meta($postID,'place_location',true);
          if ($location != ''){
            $location_string_parts = explode(", ", trim($location, "()"));
            $location = $location_string_parts[1];
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
          
          if($userID > 0)$isFavorite = in_array(strval($postID),$userFavoritesString) ? true : false ; ?>
          
          <!-- START single place post -->
          <div class="single-post" data-image-urls='<?php echo json_encode($image_urls); ?>' data-post-url='<?php the_permalink($postID);?>'>
            <div class="button-data post-buttons"
              data-logged-in="<?php echo is_user_logged_in(); ?>"
              data-post-id="<?php echo $postID; ?>"
              data-user-id="<?php echo $userID; ?>"
              data-is-favorite="<?php echo $isFavorite; ?>"
            >
              <button class="heart-button"> 
                <i class="bi bi-heart favorite"></i>
              </button>
            </div>
            <div class="image-container">
              <div class="single-post-image image-root">
                <img src="<?php echo (wp_get_attachment_url($thumbnail)); ?>" alt="">
              </div>
            </div>
            <div class="single-post-detail">
              <a class="post-title" href="<?php echo(get_permalink($postID)); ?>">
                <?php echo($post->post_title); ?>
              </a>
              <div class="button-aligner">
                <div class="place-info">
                  <span class="place-location">
                    <?php _e("Location : ",'e-potis'); echo($location); ?>
                  </span>
                  <br>
                  <span class="place-location">
                    <?php 
                    $distance = isset($post->distance) ? $post->distance : 0;
                    if ($distance > 1000) {
                      _e("Distance : ",'e-potis'); echo(round($distance/1000,1) . " km" ); 
                    } else {
                      _e("Distance : ",'e-potis'); echo(round($distance,0) . " m" ); 
                    } ?>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- END single place post -->
        <?php } ?>
      </div>
      <!-- END Places block -->
    <?php } ?>

    <?php if(!empty($grouped_posts['event'])){ ?>
      <!-- START Events block -->
      <div class="inner-page-header">
        <h1><?php _e('Events', 'e-potis'); ?></h1> 
      </div> 
      <div class="posts">
        <?php foreach($grouped_posts['event'] as $post) {
          $postID = $post->ID;
          $date = get_post_meta($postID,'event_date',true);
          $title =  get_the_title($postID);
          $placeID = get_post_meta($postID, 'event_location', true);
          if (!$postID == '') {
            $placeTitle = get_the_title($placeID);
            $placeUrl = get_permalink($placeID);
          } else {
            $placeTitle = '';
            $placeUrl = '';
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
          
          if($userID > 0)$isFavorite = in_array(strval($postID),$userFavoritesString) ? true : false ; ?>
          
          <!-- START single event post -->
          <div class="single-post" data-image-urls='<?php echo json_encode($image_urls); ?>' data-post-url='<?php the_permalink($postID);?>'>
            <div class="button-data post-buttons"
              data-logged-in="<?php echo is_user_logged_in(); ?>"
              data-post-id="<?php echo $postID; ?>"
              data-user-id="<?php echo $userID; ?>"
              data-is-favorite="<?php echo $isFavorite; ?>"
            >
              <button class="heart-button"> 
                <i class="bi bi-heart favorite"></i>
              </button>
            </div>
            <div class="image-container">
              <div class="single-post-image image-root">
                <img src="<?php echo (wp_get_attachment_url($thumbnail)); ?>" alt="">
              </div>
            </div>
            <div class="single-post-detail">
              <a class="post-title" href="<?php echo(get_permalink($postID)); ?>">
                <?php echo(get_the_title($postID)); ?>
              </a>
              <span class="event-date">
                <?php _e("Date : ",'e-potis'); echo($date); ?>
              </span>
              <span class="event-location">
                <?php _e("Location : ",'e-potis'); ?>
                <a href="<?php echo($placeUrl); ?>">
                  <?php echo($placeTitle); ?>
                </a> <br>
              </span>
              <span class="event-distance">
                <?php
                $distance = isset($post->distance) ? $post->distance : 0;
                if ($distance > 1000) {
                  _e("Distance : ",'e-potis'); echo(round($distance/1000,1) . " km" ); 
                } else {
                  _e("Distance : ",'e-potis'); echo(round($distance,0) . " m" ); 
                }
                ?>
              </span>
            </div>
          </div>
          <!-- END single event post -->
        <?php } ?>
      </div>
      <!-- END Events block -->
    <?php } ?>
  </div>
  <!-- END main container -->

  <?php
  $output = ob_get_contents();
  ob_end_clean();

  return $output;
}
