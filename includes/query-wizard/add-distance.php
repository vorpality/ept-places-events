<?php
//Checks max distance and adds distance parameters to queries
function queries_add_distance_stuff($maxDistance, $userLat, $userLng, $wpdb){
  if ($maxDistance > 0) {     


    add_filter('posts_where', function ($where, $wp_query) use ($userLat, $userLng, $maxDistance, $wpdb) {
      $lng = floatval($userLng);
      $lat = floatval($userLat);

      $post_type = $wp_query->get('post_type');
      $need_place = (is_array($post_type) && in_array('place', $post_type)) || $post_type === 'place';
      $need_event = (is_array($post_type) && in_array('event', $post_type)) || $post_type === 'event';
      
      $clauses = [];

      if ($need_place) {
      error_log("md = " . $maxDistance);
        $clauses[] = $wpdb->prepare(
          "({$wpdb->posts}.post_type = 'place' AND EXISTS (
            SELECT 1 FROM {$wpdb->prefix}place_locations pl
            WHERE pl.post_id = {$wpdb->posts}.ID
            AND ST_Distance_Sphere(POINT(%f, %f), pl.location) <= %f
          ))",
          $lat, $lng, $maxDistance
        );
      } 

      if ($need_event) {
        $clauses[] = $wpdb->prepare(
          "({$wpdb->posts}.post_type = 'event' AND EXISTS (
            SELECT 1 FROM {$wpdb->prefix}events_places ep
            JOIN {$wpdb->prefix}place_locations pl ON pl.post_id = ep.place_id
            WHERE ep.event_id = {$wpdb->posts}.ID
            AND ST_Distance_Sphere(POINT(%f, %f), pl.location) <= %f
          ))",
          $lat, $lng, $maxDistance
        );
      }
      
      if ($clauses) {
        $where .= ' AND (' . implode(' OR ', $clauses) . ')';
      }
      return $where;
    }, 10, 2);
  }

  add_filter('posts_clauses', function ($clauses, $wp_query) use ($userLat, $userLng, $wpdb) {
    // Check if we're filtering by location
    if ($wp_query->get('location')) {
        // Add the distance to the SELECT clause for both post and event locations
        $clauses['fields'] .= ", 
            ST_Distance_Sphere(POINT($userLat, $userLng), 
            (SELECT location FROM {$wpdb->prefix}place_locations WHERE post_id = {$wpdb->posts}.ID LIMIT 1)) AS distance";
        $clauses['fields'] .= ", 
            ST_Distance_Sphere(POINT($userLat, $userLng), 
            (SELECT location FROM {$wpdb->prefix}place_locations pl_event 
            LEFT JOIN {$wpdb->prefix}events_places ep ON ep.place_id = pl_event.post_id
            WHERE ep.event_id = {$wpdb->posts}.ID LIMIT 1)) AS e_distance";
    }
    return $clauses;
  }, 10, 2);
  
  // Add the distances to the posts in the loop
  add_filter('the_posts', function ($posts, $wp_query) {
    if ($wp_query->get('location')) {
      foreach ($posts as $post) {
        if ($post->post_type === 'place') {
            // Adding distance to place post data
            $post->distance = isset($post->distance) ? $post->distance : null;
        }
        else if ($post->post_type === 'event') {
            // Adding event distance to event post data
            $post->distance = isset($post->e_distance) ? $post->e_distance : null;
        }
      }
    }
    return $posts;
    }, 10, 2);
  }
