<?php

function ept_place_query_render_cb($atts) {

  $title = esc_html($atts['title']);

  $userID = get_current_user_id();
  $userFavoritesString = get_user_meta($userID, 'favorites', false);
  $favoriteIDs = ($userFavoritesString)?  array_map('intval', $userFavoritesString) : [] ;
  $heading = esc_html($atts['content']);
  $showTitle = $atts['showCategory'];
  $category = '';
  $searchTerms = (isset($_GET["s"])) ? $_GET['s'] : '' ;
  $view = $atts['view'];
  
    if ($showTitle){
      $heading = substr(get_the_archive_title(),10);
      $category = get_queried_object_id();
    }
  switch ($view){
    case ("favorites view"):
      $args = [
        'post__in'=> $favoriteIDs,
        'post_type' => 'place',
        'posts_per_page' => $atts['count'],
      ];
      break;
    case ("all view"):
      $args = [
        'post_type' => 'place',
        'posts_per_page' => $atts['count']
      ];
      break;
    case ("normal view"):
      $categoryIDs = array_map(function($term) {
        return $term['id'];
      }, $atts['categories']);

      $args = [
        'post_type' => 'place',
        'posts_per_page' => $atts['count'],
        'cat' => $category,
        's' => $searchTerms
      ];

      if (!empty($categoryIDs)) {
        foreach($categoryIDs as $cat)
        $args['cat'] .= $cat .',' ;
      }
      break;
  }
  $query = new WP_Query($args);
  ob_start();
  ?>
  <div class="wp-block-ept-pe-place-query">
    <div class="inner-page-header">
      <h1><?php echo $heading; ?></h1> 
    </div> 
    <div class="posts">
      <?php 
      if($query->have_posts()) {
        while($query->have_posts()) {
          $query->the_post();
          $postID = get_the_ID();
          $location = get_post_meta($postID,'place_location',true);
          if($userID)$isFavorite = in_array(strval($postID),$userFavoritesString) ? true : false ;

          ?>
          <div class ="single-post">
     
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
              <a class ="single-post-image" href= "<?php the_permalink(); ?>">
                <?php the_post_thumbnail('thumbnail'); ?>
              </a>
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
  </div>
  <?php
  wp_reset_postdata();

  $output = ob_get_contents();
  ob_end_clean();

  return $output;
}