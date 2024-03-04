<?php
function ept_create_post_locations_table() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'post_locations';
  $charset_collate = $wpdb->get_charset_collate();
  
  $sql = "CREATE TABLE IF NOT EXISTS $table_name (
    post_id BIGINT(20) UNSIGNED NOT NULL,
    location POINT NOT NULL,
    SPATIAL INDEX(location),
    PRIMARY KEY (post_id)
  ) ENGINE=InnoDB $charset_collate;";
  
  $wpdb->query($sql);
}

function ept_add_foreign_keys_to_post_locations_table() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'post_locations';

  $fk_exists = $wpdb->get_var("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '$table_name' AND CONSTRAINT_NAME = 'fk_post_locations_post_id'");
  
  $sql = "";

  if (!$fk_exists){
    $sql.= "ALTER TABLE $table_name
    ADD CONSTRAINT fk_post_locations_post_id FOREIGN KEY (post_id) REFERENCES {$wpdb->prefix}posts(ID) ON DELETE CASCADE;";
  }

  if (!empty($sql)) {
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    $wpdb->query($sql);
  }
}


function ept_populate_post_locations_table() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'post_locations';

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
