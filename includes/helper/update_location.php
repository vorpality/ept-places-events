<?php
function update_place_location($post_id, $lat, $lng) {
  global $wpdb;
  $table_name = $wpdb->prefix . 'post_locations';

  // Validate the latitude and longitude
  if (!is_numeric($lat) || !is_numeric($lng)) {
      // Invalid lat or lng, you might want to handle this case appropriately
      return false;
  }

  // Prepare the POINT value
  $point = sprintf('POINT(%f %f)', floatval($lat), floatval($lng));

  // Check if there's already an entry for this post_id
  $exists = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_name WHERE post_id = %d", $post_id));

  if ($exists) {
      // Update the existing location
      $wpdb->query($wpdb->prepare("UPDATE $table_name SET location = ST_GeomFromText(%s) WHERE post_id = %d", $point, $post_id));
  } else {
      // Insert new location
      $wpdb->insert(
          $table_name,
          ['post_id' => $post_id, 'location' => $point],
          ['%d', 'geometry']
      );
      // Update geometry data directly due to wpdb->insert not supporting spatial data directly
      $wpdb->query($wpdb->prepare("UPDATE $table_name SET location = ST_GeomFromText(%s) WHERE post_id = %d", $point, $post_id));
  }

  return true;
}

function update_event_location($event_id, $place_id) {
    global $wpdb;
    // Ensure input is integer to prevent SQL injection
    $event_id = intval($event_id);
    $place_id = intval($place_id);

    // The name of the table
    $table_name = $wpdb->prefix . 'events_places';

    // Check if an entry already exists
    $exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM $table_name WHERE event_id = %d",
        $event_id
    ));

    if ($exists) {
        // Update the existing entry
        $wpdb->update(
            $table_name,
            ['place_id' => $place_id], // Data to update
            ['event_id' => $event_id]  // Where clause
        );
    } else {
        // Insert a new entry
        $wpdb->insert(
            $table_name,
            [
                'event_id' => $event_id,
                'place_id' => $place_id
            ]
        );
    }
}
