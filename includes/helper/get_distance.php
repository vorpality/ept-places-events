<?php
function get_distance($postID) {
  global $wpdb;

  $postID = intval($postID);

  $userLat = isset($_COOKIE['location_lat']) ? (float)$_COOKIE['location_lat'] : null;
  $userLng = isset($_COOKIE['location_lng']) ? (float)$_COOKIE['location_lng'] : null;

  if ($userLat === null || $userLng === null) {
      return null; // User location not available
  }

  $post_type = get_post_type($postID);
  if ($post_type == 'event') {
    $events_places_table = $wpdb->prefix . 'events_places';
    $placeID = $wpdb->get_var($wpdb->prepare(
      "SELECT place_id FROM $events_places_table WHERE event_id = %d",
      $postID
    ));
    if (!$placeID) {
      return null; // No associated place found for the event
    }
  } else {
    $placeID = $postID; // For places, the place ID is the post ID
  }

  // The name of the table where places' locations are stored
  $table_name = $wpdb->prefix . 'post_locations';

  // Query to calculate the distance between user location and place location
  $query = $wpdb->prepare("
    SELECT ST_Distance_Sphere(POINT(%f, %f), pl.location) AS distance
    FROM {$wpdb->prefix}posts p
    LEFT JOIN {$wpdb->prefix}post_locations pl ON p.ID = pl.post_id
    LEFT JOIN {$wpdb->prefix}events_places ep ON p.ID = ep.event_id
    WHERE p.ID = {$placeID}
  ", $userLat, $userLng);

  // Execute the query
  $distance = $wpdb->get_var($query);
  // Return the distance in meters
  return $distance;
}

function calculate_distance($postID, $userLat, $userLng) {
  global $wpdb;

  $postID = intval($postID);


  $post_type = get_post_type($postID);
  if ($post_type == 'event') {
    $events_places_table = $wpdb->prefix . 'events_places';
    $placeID = $wpdb->get_var($wpdb->prepare(
      "SELECT place_id FROM $events_places_table WHERE event_id = %d",
      $postID
    ));
    if (!$placeID) {
      return null; // No associated place found for the event
    }
  } else {
    $placeID = $postID; // For places, the place ID is the post ID
  }

  // The name of the table where places' locations are stored
  $table_name = $wpdb->prefix . 'post_locations';

  // Query to calculate the distance between user location and place location
  $query = $wpdb->prepare("
    SELECT ST_Distance_Sphere(POINT(%f, %f), pl.location) AS distance
    FROM {$wpdb->prefix}posts p
    LEFT JOIN {$wpdb->prefix}post_locations pl ON p.ID = pl.post_id
    LEFT JOIN {$wpdb->prefix}events_places ep ON p.ID = ep.event_id
    WHERE p.ID = {$placeID}
  ", $userLat, $userLng);

  // Execute the query
  $distance = $wpdb->get_var($query);
  // Return the distance in meters
  return $distance / 1000; // in km
}

function find_within_distance($userLat, $userLng, $maxDistance) {
  global $wpdb;

 
  // The name of the table where places' locations are stored
  $table_name = $wpdb->prefix . 'post_locations';

  // Query to calculate the distance between user location and place location
  $query = $wpdb->prepare("
    SELECT ST_Distance_Sphere(POINT(%f, %f), pl.location) AS distance
    FROM {$wpdb->prefix}posts p
    LEFT JOIN {$wpdb->prefix}post_locations pl ON p.ID = pl.post_id
    LEFT JOIN {$wpdb->prefix}events_places ep ON p.ID = ep.event_id
    HAVING distance <= %f
  ");

  $query = $wpdb->prepare($sql, $user_lat, $user_lng, $maxDistance * 1000);

  // Execute the query
  $results = $wpdb->get_results($query);

  return $results;
}
