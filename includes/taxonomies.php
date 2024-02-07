<?php

function ept_pe_taxonomy_rules(){
    register_taxonomy('place_category', 'place', array(
        'labels' => array(
            'name' => 'Place Categories',
            'singular_name' => 'Place Category',
        ),
        'public' => true,
        'hierarchical' => true,
        'rewrite' => array('slug' => 'places')
    ));

    register_taxonomy('event_category', 'event', array(
        'labels' => array(
            'name' => 'Event Categories',
            'singular_name' => 'Event Category',
        ),
        'public' => true,
        'hierarchical' => true,
        'rewrite' => array('slug' => 'events')
    ));
}
    
function load_custom_taxonomy_template($template) {
    if (is_tax('place_category') || is_tax('event_categories')) {
        $new_template = locate_template(array('taxonomy.php'));
        if ('' != $new_template) {
            return $new_template;
        }
    }
    return $template;
}

