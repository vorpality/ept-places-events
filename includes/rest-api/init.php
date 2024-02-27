<?php

function ept_pe_rest_api_init(){
    //example.com/wp-json/ept/v1/favorite
    register_rest_route('ept/v1', '/favorite', [
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => 'ept_pe_rest_api_add_favorite_handler',
        'permission_callback' => 'is_user_logged_in'
    ]);

    register_rest_route('ept/v1', '/edit_post', [
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => 'ept_pe_rest_api_edit_post_handler',
        'permission_callback' => 'is_user_logged_in'
    ]);

    register_rest_route('ept/v1', '/update-event', [
        'methods' => WP_REST_SERVER::CREATABLE,
        'callback' => 'ept_pe_rest_api_update_event_handler',
        'permission_callback' => '__return_true'
    ]);

    register_rest_route('ept/v1', '/retrieve-post', [
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => 'ept_pe_rest_api_retrieve_post_handler',
        'permission_callback' => '__return_true'
    ]);
  }