<?php


function queries_orderby_location($orderBy, $location, $wpdb) {
  $userLat = floatval($location['lat']);
  $userLng = floatval($location['lng']);

  if ($orderBy === 'distance' && $location) {

    //for places: distance from place_locations
    add_filter('posts_orderby', function ($orderby) use ($userLat, $userLng, $wpdb) {
      return $wpdb->prepare(
        "ST_Distance_Sphere(POINT(%f, %f),
        (SELECT location FROM {$wpdb->prefix}place_locations WHERE post_id = {$wpdb->posts}.ID LIMIT 1)) ASC",
        $userLat, $userLng
      );
    }, 10, 2);

    // For events: distance from place_locations joined via events_places
    add_filter('posts_orderby', function ($orderby) use ($userLat, $userLng, $wpdb) {
      return $wpdb->prepare(
        "ST_Distance_Sphere(POINT(%f, %f),
        (SELECT pl.location
          FROM {$wpdb->prefix}events_places ep
          JOIN {$wpdb->prefix}place_locations pl ON ep.place_id = pl.post_id
          WHERE ep.event_id = {$wpdb->posts}.ID
          LIMIT 1)) ASC",
        $userLat, $userLng
      );
    }, 10, 2); 
  }
}
