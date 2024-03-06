<?php 
function sort_places(){
  global $wpdb;
  $userLat = floatval($_COOKIE['location_lat'] ?? '0');
  $userLng = floatval($_COOKIE['location_lng'] ?? '0');
  $place_ids_sql = $wpdb->prepare(
    "SELECT post_id, 
            ST_Distance_Sphere(point(%f, %f), location) AS distance 
     FROM {$wpdb->prefix}post_locations 
     ORDER BY distance ASC",
    $userLng, $userLat
  );
  return $wpdb->get_results($place_ids_sql, ARRAY_A);
}