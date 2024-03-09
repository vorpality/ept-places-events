<?php 
function sort_places(){
  global $wpdb;
  $userLat = floatval($_COOKIE['location_lat'] ?? '0');
  $userLng = floatval($_COOKIE['location_lng'] ?? '0');

  $place_ids_sql = $wpdb->prepare("
  SELECT p.ID, 
         CASE 
           WHEN p.post_type = 'event' THEN ST_Distance_Sphere(POINT(%f, %f), event_location.location)
           ELSE ST_Distance_Sphere(POINT(%f, %f), pl.location) 
         END AS distance,
         p.post_type
  FROM {$wpdb->prefix}posts p
  LEFT JOIN {$wpdb->prefix}post_locations pl ON p.ID = pl.post_id
  LEFT JOIN {$wpdb->prefix}events_places ep ON p.ID = ep.event_id
  LEFT JOIN {$wpdb->prefix}post_locations event_location ON ep.place_id = event_location.post_id
  WHERE p.post_type IN ('place', 'event')
  AND (
      (p.post_type = 'place' AND pl.location IS NOT NULL)
      OR
      (p.post_type = 'event' AND ep.place_id IS NOT NULL AND event_location.location IS NOT NULL)
  )
  GROUP BY p.ID
  ORDER BY distance ASC
", $userLat, $userLng, $userLat, $userLng);

   
  $result = $wpdb->get_results($place_ids_sql, ARRAY_A);
  $postIds = array_column($result, 'ID');
  return $postIds;
}