<?php
function update_place_location($post_id, $lat, $lng) {
  global $wpdb;
  $table_name = $wpdb->prefix . 'place_locations';


  // Validate the latitude and longitude
  if (!is_numeric($lat) || !is_numeric($lng)) {
      // Invalid lat or lng, you might want to handle this case appropriately
      print_r([$lat, $lng]);
      exit();
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
      $insert_result = $wpdb->query(
        $wpdb->prepare(
            "INSERT INTO $table_name (post_id, location) VALUES (%d, ST_GeomFromText(%s))",
            $post_id, $point
        )
    );
    
    if ($insert_result !== false) {
        // Success: Record was inserted
        error_log('Insert successful! Last inserted ID: ' . $wpdb->insert_id);
    } else {
        // Failure: Something went wrong
        error_log('Insert failed. Error: ' . $wpdb->last_error);
    }
      // Update geometry data directly due to wpdb->insert not supporting spatial data directly
      $wpdb->query($wpdb->prepare("UPDATE $table_name SET location = ST_GeomFromText(%s) WHERE post_id = %d", $point, $post_id));
  }

  return true;
}

function update_event_location($event_id, $place_id) {
    global $wpdb;
    // Ensure input is integer to prevent SQL injection
    if ($event_id <= 0 || $place_id <= 0) {
        error_log('Invalid event_id or place_id');
        return false;
    }
    
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
        if ($wpdb->update($table_name, ['place_id' => $place_id], ['event_id' => $event_id]) === false) {
            error_log('290325 Update failed. Error: ' . $wpdb->last_error);
        } else {
            error_log('290325 Update successful.');
        }
    } else {
        // Insert a new entry
        if ($wpdb->insert($table_name, ['event_id' => $event_id, 'place_id' => $place_id]) === false) {
            error_log('290325 Insert failed. Error: ' . $wpdb->last_error);
        } else {
            error_log('290325 Insert successful.');
        }
    }
}
