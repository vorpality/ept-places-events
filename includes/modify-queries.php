<?php

function ept_modify_query_for_distance_filtering($query) {
  global $wpdb;


  // Extract parameters from the query
  $orderBy = isset($query->query_vars['orderby']) ? $query->query_vars['orderby'] : '';
  $location = isset($query->query_vars['location']) ? $query->query_vars['location'] : null;
  $maxDistance = isset($query->query_vars['distance']) ? floatval($query->query_vars['distance']) * 1000 : 99999999;
  $isFavorite = isset($query->query_vars['is_favorite']) ? filter_var($query->query_vars['is_favorite'], FILTER_VALIDATE_BOOLEAN) : false;

  // If no location is set, we don't modify the query
  if ($location != null && isset($location['lat']) && isset($location['lng'])) {
    $userLat = floatval($location['lat']);
    $userLng = floatval($location['lng']);

    // Add the filter to modify WHERE clause for distance
    add_filter('posts_where', function ($where, $wp_query) use ($userLat, $userLng, $maxDistance, $wpdb) {
      if ($wp_query->get('location')) {
        $where .= $wpdb->prepare(
          " AND EXISTS (
              SELECT 1 FROM {$wpdb->prefix}post_locations pl
              WHERE pl.post_id = {$wpdb->posts}.ID
              AND ST_Distance_Sphere(POINT(%f, %f), pl.location) <= %f
          )",
          $userLat, $userLng, $maxDistance
        );
      }
      return $where;
    }, 10, 2);
   

    // Modify order by distance if requested
    if ($orderBy === 'distance') {
        add_filter('posts_orderby', function ($orderby, $wp_query) use ($userLat, $userLng, $wpdb) {
            if ($wp_query->get('location')) {
                return $wpdb->prepare(
                    " ST_Distance_Sphere(POINT(%f, %f), 
                    (SELECT location FROM {$wpdb->prefix}post_locations WHERE post_id = {$wpdb->posts}.ID LIMIT 1)) ASC",
                    $userLat, $userLng
                );
            }
            return $orderby;
        }, 10, 2);
    }
    add_filter('posts_clauses', function ($clauses, $wp_query) use ($userLat, $userLng, $wpdb) {
      // Check if we're filtering by location
      if ($wp_query->get('location')) {
          // Add the distance to the SELECT clause
          $clauses['fields'] .= ", ST_Distance_Sphere(POINT($userLat, $userLng), 
          (SELECT location FROM {$wpdb->prefix}post_locations WHERE post_id = {$wpdb->posts}.ID LIMIT 1)) AS distance";
          
          // Add ordering by distance to the ORDER BY clause
          $clauses['orderby'] = 'distance ASC'; // Order by the calculated distance
      }
      return $clauses;
  }, 10, 2);

  // You can now access the distance in the query results.
  add_filter('the_posts', function ($posts, $wp_query) {
      if ($wp_query->get('location')) {
          foreach ($posts as $post) {
              // Adding distance to post data
              $post->distance = isset($post->distance) ? $post->distance : null;
          }
      }
      return $posts;
  }, 10, 2);
    }

  

  // Modify the query to show only favorite posts if requested

  if ($isFavorite && is_user_logged_in()) {
    $currentUserID = get_current_user_id();
    $userFavoritesString = get_user_meta($currentUserID, 'favorites', false);
    $favoritePostIDs = ($userFavoritesString)?  array_map('intval', $userFavoritesString) : [] ; 

    if (!empty($favoritePostIDs)) {
        add_filter('posts_where', function ($where) use ($favoritePostIDs, $wpdb) {
            $placeholders = implode(',', array_fill(0, count($favoritePostIDs), '%d'));
            return $where . $wpdb->prepare(" AND {$wpdb->posts}.ID IN ($placeholders)", ...$favoritePostIDs);
        });
    } else {
        // If no favorites, return an empty result
        $query->set('post__in', [0]);
    }
}

  add_filter('posts_request', function ($sql) {
      return $sql;
  });
}

function ept_modify_query_for_post_grouping($groupby, $query){

  if (isset($query->query_vars['post_type']) && is_array($query->query_vars['post_type'])) {
    global $wpdb;
    $groupby = "{$wpdb->posts}.post_type, {$wpdb->posts}.ID";
  }
  return $groupby;
}


function ept_add_distance_column($sql) {
  global $wpdb;

  // Ensure this is only for 'place' post type and location filter is applied
      // Check if the location is provided
      if (isset($_GET['location']) && isset($_GET['location']['lat']) && isset($_GET['location']['lng'])) {
          $userLat = floatval($_GET['location']['lat']);
          $userLng = floatval($_GET['location']['lng']);

          // Add the distance calculation as a new column in SELECT clause
          $sql = preg_replace(
              '/SELECT(.*?)FROM/',
              "SELECT {$wpdb->posts}.*, 
              ST_Distance_Sphere(POINT($userLat, $userLng), 
                  (SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id = {$wpdb->posts}.ID AND meta_key = 'lat' LIMIT 1), 
                  (SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id = {$wpdb->posts}.ID AND meta_key = 'lng' LIMIT 1)) AS distance,",
              $sql
          );
      }
  

  return $sql;
}