<?php
function ept_pe_create_tables(){
  ept_create_bar_owners_table();
  ept_add_foreign_keys_to_bar_owners_table();
}
function ept_create_bar_owners_table() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'bar_owners';
  $charset_collate = $wpdb->get_charset_collate();
  $sql = "CREATE TABLE $table_name (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT(20) UNSIGNED NULL,
    post_id BIGINT(20) UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY unique_bar_owner (post_id)
  ) $charset_collate;";
  require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  dbDelta($sql);

  $places = get_posts(['post_type' => 'place', 'numberposts' => -1]);
  foreach ($places as $place) {
    $exists = $wpdb->get_var($wpdb->prepare(
      "SELECT COUNT(*) FROM $table_name WHERE post_id = %d",
      $place->ID
    ));

    if (!$exists) {
      $wpdb->insert(
        $table_name,
        ['user_id' => NULL, 'post_id' => $place->ID], // Set user_id to NULL for unowned
        ['%d', '%d']
      );
    }
  }
}

function ept_add_foreign_keys_to_bar_owners_table() {
  global $wpdb;
  $table_name = $wpdb->prefix . 'bar_owners';

  $sql = "ALTER TABLE $table_name
          ADD CONSTRAINT fk_bar_owners_user_id FOREIGN KEY (user_id) REFERENCES {$wpdb->prefix}users(ID) ON DELETE SET NULL,
          ADD CONSTRAINT fk_bar_owners_post_id FOREIGN KEY (post_id) REFERENCES {$wpdb->prefix}posts(ID) ON DELETE CASCADE;";
  
  require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  $wpdb->query($sql);
}