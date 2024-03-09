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

  $searchTerms = (isset($_GET["s"])) ? $_GET['s'] : '' ;
  $order = isset($_GET['orderby']) ? $_GET['orderby'] : '';

  $preElim = [];
  if ($order == 'distance'){
    $preElim = sort_places();
  }

  if ($showTitle){
    $heading = substr(get_the_archive_title(),10);
    $category = get_queried_object_id();
  }



  switch ($view){
    case ("favorites view"):
      if (isset($preElim)){
        usort($favoriteIDs, function($a, $b) use ($preElim) {
          $posA = array_search($a, $preElim);
          $posB = array_search($b, $preElim);
      
          if ($posA === $posB) {
              return 0;
          }
      
          return ($posA < $posB) ? -1 : 1;
      });
      }
      $place_args = [
        'post__in'=> $favoriteIDs,
        'post_type' => 'place',
        'posts_per_page' => $atts['count'],
        'orderby' => 'post__in'
      ];
      
      $event_args = [
        'post__in'=> $favoriteIDs,
        'post_type' => 'event',
        'posts_per_page' => $atts['count'],
      ];

      break;
    case ("all view"):
      $place_args = [
        'post__in' => $preElim,
        'post_type' => 'place',
        'posts_per_page' => $atts['count'],
        'orderby' => 'post__in'
      ];
      $event_args =[
        'post__in' => $preElim,
        'post_type' => 'event',
        'posts_per_page' => $atts['count'],
        'orderby' => 'post__in'
      ];
      if ($order){
        $place_args += [
          'post__in' => $preElim,
          'orderby' => 'post_in'
        ];
        $event_args += [
          'post__in' => $preElim,
          'orderby' => 'post_in'
        ];
      }
      break;
    case ("normal view"):
      $categoryIDs = array_map(function($term) {
        return $term['id'];
      }, $atts['categories']);



      $place_args = [
        'post_type' => 'place',
        'posts_per_page' => $atts['count'],
        'cat' => $category,
        's' => $searchTerms
      ];

      $event_args = [
        'post_type' => 'event',
        'posts_per_page' => $atts['count'],
        'cat' => $category,
        's' => $searchTerms
      ];
      if ($order){
        $place_args += [
          'post__in' => $preElim,
          'orderby' => 'post_in'
        ];
        $event_args += [
          'post__in' => $preElim,
          'orderby' => 'post_in'
        ];
      }
      if (!empty($categoryIDs)) {
        foreach($categoryIDs as $cat)
          $place_args['cat'] .= $cat .',' ;
          $event_args['cat'] .= $cat .',' ;
      }

      break;
  }

  ob_start(); ?>
  <div class="wp-block-ept-pe-query"> 
    <div id = 'sort-root'></div> <?php
  if ($queryType == 'places' || $queryType == 'both'){
    $query = new WP_Query($place_args);
    if($query->have_posts()) {
    ?>
      <div class="inner-page-header">
        <h1><?php _e('Places', 'e-potis'); ?></h1> 
      </div> 
      <div class="posts">
        <?php 
          while($query->have_posts()) {
            $query->the_post();
            $postID = get_the_ID();
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
            
            if($userID > 0)$isFavorite = in_array(strval($postID),$userFavoritesString) ? true : false ;

            ?>
            <div class ="single-post" data-image-urls='<?php echo json_encode($image_urls); ?>' data-post-url= '<?php the_permalink();?>'>
      
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
              <div class ="image-container">
                <div class ="single-post-image image-root">
                  <img src="<?php  echo (wp_get_attachment_url($thumbnail)); ?>" alt="">
                </div>
              </div>
              <div class ="single-post-detail">
                <a class ="post-title" href="<?php the_permalink(); ?>">
                  <?php the_title(); ?>
                </a>
                <div class = "button-aligner">
                  <div class = "place-info">
                    <span class="place-location">
                      <?php  _e("Location : ",'e-potis'); echo($location); ?>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <?php
          } 
        }
        ?>
      </div>
      <?php wp_reset_postdata(); 
  }
  if ($queryType == 'events' || $queryType == 'both'){
      $query = new WP_Query($event_args);
      if($query->have_posts()) {
      ?>
    <div class="inner-page-header">
      <h1><?php _e('Events', 'e-potis'); ?></h1> 
    </div> 
    <div class="posts">
      <?php 
        while($query->have_posts()) {
          $query->the_post();
          $postID = get_the_ID();
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
          
          if($userID > 0)$isFavorite = in_array(strval($postID),$userFavoritesString) ? true : false ;
          ?>
          <div class ="single-post" data-image-urls='<?php echo json_encode($image_urls); ?>' data-post-url= '<?php the_permalink();?>'>

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
            <div class ="image-container">
              <div class ="single-post-image image-root">
                <img src="<?php  echo (wp_get_attachment_url($thumbnail)); ?>" alt="">
              </div>
            </div>
            <div class ="single-post-detail">
              <a class ="post-title" href="<?php the_permalink(); ?>">
                <?php the_title(); ?>
              </a>
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
          </div>
          <?php
        }
      }
      ?>
    </div>
  </div>
  <?php
  wp_reset_postdata();
  }
  $output = ob_get_contents();
  ob_end_clean();


  return $output;
}