<?php
function get_location($postID) {
  global $wpdb;
  // Ensure postID is an integer to prevent SQL injection
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
  $query = $wpdb->prepare(
      "SELECT ST_AsText(location) AS location FROM {$wpdb->prefix}place_locations WHERE post_id = %d",
      $placeID
  );

  // Execute the query
  $location = $wpdb->get_var($query);

  // Initialize default values
  $lat = null;
  $lng = null;

  // Extract latitude and longitude from the POINT value
  if (!empty($location)) {
      // POINT data is returned in the format 'POINT(lat lng)', so we need to parse it
      $location = str_replace('POINT(', '', $location);
      $location = str_replace(')', '', $location);
      list($lat, $lng) = explode(' ', $location);
  }

  // Return latitude and longitude
  return array($lat, $lng);
}
