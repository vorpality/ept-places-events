<?php
function get_distance($placeID) {
  global $wpdb;

  // Ensure placeID is an integer to prevent SQL injection
  $placeID = intval($placeID);

  // Retrieve user's location from cookies
  $userLat = isset($_COOKIE['location_lat']) ? (float)$_COOKIE['location_lat'] : null;
  $userLng = isset($_COOKIE['location_lng']) ? (float)$_COOKIE['location_lng'] : null;

  // Check if user location is available
  if ($userLat === null || $userLng === null) {
      return null; // User location not available
  }

  // The name of the table where places' locations are stored
  $table_name = $wpdb->prefix . 'post_locations';

  // Query to calculate the distance between user location and place location
  // This uses the ST_Distance_Sphere function available in MySQL 5.7.6 and later
  // For earlier versions, consider using a different approach or a custom stored procedure
  $query = $wpdb->prepare(
      "SELECT ST_Distance_Sphere(POINT(%f, %f), location) AS distance 
      FROM $table_name 
      WHERE post_id = %d",
      $userLat, $userLng, $placeID
  );

  // Execute the query
  $distance = $wpdb->get_var($query);

  // Return the distance in meters
  return $distance;
}