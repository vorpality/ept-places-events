<?php

function ept_modify_query_for_distance_filtering($query) {
  global $wpdb;


  // Extract parameters from the query
  $orderBy = isset($query->query_vars['orderby']) ? $query->query_vars['orderby'] : '';
  $location = isset($query->query_vars['location']) ? $query->query_vars['location'] : null;
  $maxDistance = isset($query->query_vars['distance']) ? floatval($query->query_vars['distance']) * 1000 : 0;
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

add_action('pre_get_posts', 'ept_modify_query_for_distance_filtering');
