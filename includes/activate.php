<?php

function ept_pe_activate_plugin() {
    // 6.0 < 5.9
    if(version_compare(get_bloginfo('version'), '5.9', '<' )) {
        wp_die(__('You must update wordpress to use this plugin', 'ept-products'));
    }

    ept_pe_event_post_type();
    ept_pe_place_post_type();
    flush_rewrite_rules();
} 
