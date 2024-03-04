<?php
function get_location($postID) {
  global $wpdb;
  // Ensure postID is an integer to prevent SQL injection
  $postID = intval($postID);

  // Query to retrieve POINT as text
  $query = $wpdb->prepare(
      "SELECT ST_AsText(location) AS location FROM {$wpdb->prefix}post_locations WHERE post_id = %d",
      $postID
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
