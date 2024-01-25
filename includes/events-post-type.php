<?php

function ept_pe_event_post_type(){

    $labels = array(
		'name'                  => _x( 'Events', 'Post type general name', 'e-potis' ),
		'singular_name'         => _x( 'Event', 'Post type singular name', 'e-potis' ),
		'menu_name'             => _x( 'Events', 'Admin Menu text', 'e-potis' ),
		'name_admin_bar'        => _x( 'Event', 'Add New on Toolbar', 'e-potis' ),
		'add_new'               => __( 'Add New', 'e-potis' ),
		'add_new_item'          => __( 'Add New Event', 'e-potis' ),
		'new_item'              => __( 'New Event', 'e-potis' ),
		'edit_item'             => __( 'Edit Event', 'e-potis' ),
		'view_item'             => __( 'View Event', 'e-potis' ),
		'all_items'             => __( 'All Events', 'e-potis' ),
		'search_items'          => __( 'Search Events', 'e-potis' ),
		'parent_item_colon'     => __( 'Parent Events:', 'e-potis' ),
		'not_found'             => __( 'No Events found.', 'e-potis' ),
		'not_found_in_trash'    => __( 'No Events found in Trash.', 'e-potis' ),
		'featured_image'        => _x( 'Event Image', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'e-potis' ),
		'set_featured_image'    => _x( 'Set Event image', 'Overrides the “Set featured image” phrase for this post type. Added in 4.3', 'e-potis' ),
		'remove_featured_image' => _x( 'Remove Event image', 'Overrides the “Remove featured image” phrase for this post type. Added in 4.3', 'e-potis' ),
		'use_featured_image'    => _x( 'Use as Event image', 'Overrides the “Use as featured image” phrase for this post type. Added in 4.3', 'e-potis' ),
		'archives'              => _x( 'Event archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'e-potis' ),
		'insert_into_item'      => _x( 'Insert into Event', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4', 'e-potis' ),
		'uploaded_to_this_item' => _x( 'Uploaded to this Event', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4', 'e-potis' ),
		'filter_items_list'     => _x( 'Filter Events list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4', 'e-potis' ),
		'items_list_navigation' => _x( 'Events list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4', 'e-potis' ),
		'items_list'            => _x( 'Events list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4', 'e-potis' ),

	);

	$args = array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'event' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => 20,
		'supports'           => array( 'title', 'availabity', 'thumbnail', 'excerpt' ),
		'show_in_rest'       => true,
		'description'        => __('A custom post type for events', 'e-potis'),
		'taxonomies'         => ['category', 'post_tag'],
		'register_meta_box_cb' => 'ept_pe_event_add_meta_boxes_cb'
		
			
	);

    register_post_type( 'event', $args );
}