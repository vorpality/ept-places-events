<?php

function ept_pq_rest_api_init1(){
    //example.com/wp-json/ept/v1/favorite
    register_rest_route('ept/v1', '/favorite', [
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => 'ept_pq_rest_api_add_favorite_handler',
        'permission_callback' => 'is_user_logged_in'
    ]);
    
    //example.com/wp-json/ept/v1/addtocart
    register_rest_route('ept/v1', '/addtocart', [
        'methods' => WP_REST_SERVER::EDITABLE,
        'callback' => 'ept_pq_rest_api_add_to_cart_handler',
        'permission_callback' => 'is_user_logged_in'
    ]);

    //example.com/wp-json/ept/v1/cartfiddle
    register_rest_route('ept/v1', '/cartfiddle', [
        'methods' => WP_REST_SERVER::EDITABLE,
        'callback' => 'ept_pq_rest_api_cart_fiddle_handler',
        'permission_callback' => '__return_true'
    ]);

    //example.com/wp-json/ept/v1/getcart
    register_rest_route('ept/v1', '/getcart', [
        'methods' => WP_REST_SERVER::EDITABLE,
        'callback' => 'ept_pq_rest_api_get_cart_handler',
        'permission_callback' => '__return_true'
    ]);
  }