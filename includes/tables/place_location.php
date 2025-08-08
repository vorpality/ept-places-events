<?php
function ept_create_place_locations_table() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'place_locations';
  $charset_collate = $wpdb->get_charset_collate();
  
  $sql = "CREATE TABLE IF NOT EXISTS $table_name (
    post_id BIGINT(20) UNSIGNED NOT NULL,
    location POINT NOT NULL,
    SPATIAL INDEX(location),
    PRIMARY KEY (post_id)
  ) ENGINE=InnoDB $charset_collate;";
  
  $wpdb->query($sql);
}

function ept_add_foreign_keys_to_place_locations_table() {
    global $wpdb;

    $table_place_locations = $wpdb->prefix . 'place_locations';
    $table_events_places   = $wpdb->prefix . 'events_places';
    $table_posts           = $wpdb->prefix . 'posts';

    $sql = '';

    // 1. Foreign key: place_locations.post_id → posts.ID
    $fk1_exists = $wpdb->get_var("
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = '{$table_place_locations}'
          AND CONSTRAINT_NAME = 'fk_place_locations_post_id'
    ");

    if (!$fk1_exists) {
        $sql .= "ALTER TABLE {$table_place_locations}
                 ADD CONSTRAINT fk_place_locations_post_id
                 FOREIGN KEY (post_id) REFERENCES {$table_posts}(ID) ON DELETE CASCADE;";
    }

    // 2. Foreign key: events_places.place_id → place_locations.post_id
    $fk2_exists = $wpdb->get_var("
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = '{$table_events_places}'
          AND CONSTRAINT_NAME = 'fk_events_places_place_id'
    ");

    if (!$fk2_exists) {
        $sql .= "ALTER TABLE {$table_events_places}
                 ADD CONSTRAINT fk_events_places_place_id
                 FOREIGN KEY (place_id) REFERENCES {$table_place_locations}(post_id) ON DELETE CASCADE;";
    }

    if (!empty($sql)) {
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        $wpdb->query($sql);
    }
}



function ept_populate_place_locations_table() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'place_locations';

  $posts = get_posts(['post_type' => 'any', 'numberposts' => -1, 'meta_query' => [
      'relation' => 'AND',
      ['key' => 'lat', 'compare' => 'EXISTS'],
      ['key' => 'lng', 'compare' => 'EXISTS'],
  ]]);

  foreach ($posts as $post) {
      $lat = get_post_meta($post->ID, 'lat', true);
      $lng = get_post_meta($post->ID, 'lng', true);

      // Ensure lat and lng are valid before attempting to insert
      if (is_numeric($lat) && is_numeric($lng)) {
          // Prepare the POINT value as a string
          $location = sprintf("ST_GeomFromText('POINT(%f %f)')", $lat, $lng);

          // Check if there's already an entry for this post_id
          $exists = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_name WHERE post_id = %d", $post->ID));

          if (!$exists) {
              // Use a direct SQL query to insert both post_id and location
              $wpdb->query($wpdb->prepare("INSERT INTO $table_name (post_id, location) VALUES (%d, $location)", $post->ID));
          }
      }
  }
}
