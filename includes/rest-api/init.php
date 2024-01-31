<?php

function ept_pe_rest_api_init(){
    //example.com/wp-json/ept/v1/favorite
    register_rest_route('ept/v1', '/favorite', [
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => 'ept_pe_rest_api_add_favorite_handler',
        'permission_callback' => 'is_user_logged_in'
    ]);
  }