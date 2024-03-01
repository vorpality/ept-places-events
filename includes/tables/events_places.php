<?php
function ept_create_events_places_table() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'events_places';

  $charset_collate = $wpdb->get_charset_collate();
  $sql = "CREATE TABLE $table_name (
    event_id BIGINT(20) UNSIGNED NOT NULL,
    place_id BIGINT(20) UNSIGNED NULL,
    PRIMARY KEY (event_id)
  ) $charset_collate;";
  require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  dbDelta($sql);

  $events = get_posts(['post_type' => 'event', 'numberposts' => -1]);

  foreach ($events as $event) {
    $placeID = get_post_meta($event->ID, 'event_location', true);
    $exists = $wpdb->get_var($wpdb->prepare(
      "SELECT COUNT(*) FROM $table_name WHERE event_id = %d",
      $event->ID
    ));

    if (!$exists) {
      $wpdb->insert(
        $table_name,
        ['event_id' => $event->ID, 'place_id' => $placeID], 
        ['%d', '%d']
      );
    }
  }
}

function ept_add_foreign_keys_to_places_events_table() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'events_places';

  $fk_exists = $wpdb->get_var("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '$table_name' AND CONSTRAINT_NAME = 'fk_ep_events_places'");
  
  $sql = $fk_exists ? '' : "ALTER TABLE $table_name ADD CONSTRAINT fk_ep_events_places FOREIGN KEY (event_id) REFERENCES {$wpdb->prefix}posts(ID) ON DELETE CASCADE;";

  if (!empty($sql)) {
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    $wpdb->query($sql);
  }
}