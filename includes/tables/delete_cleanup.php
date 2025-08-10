<?php
function delete_bar_related_data($post_id) {
    global $wpdb;

    if (get_post_type($post_id) !== 'place') {
        return;
    }

    // Delete entries from related tables
    $wpdb->delete("{$wpdb->prefix}bar_owners", [ 'post_id' => $post_id ], [ '%d' ]);
    $wpdb->delete("{$wpdb->prefix}place_locations", [ 'post_id' => $post_id ], [ '%d' ]);
    $wpdb->delete("{$wpdb->prefix}events_places", [ 'place_id' => $post_id ], [ '%d' ]);

    // Delete post meta if not automatically removed (usually WP deletes postmeta automatically)
    $wpdb->delete("{$wpdb->prefix}postmeta", [ 'post_id' => $post_id ], [ '%d' ]);

    // Optional: log for debugging
    error_log("Custom cleanup done for bar ID {$post_id}");
}