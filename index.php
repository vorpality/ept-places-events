<?php
/*
 * Plugin Name:       Epotis Places/Events
 * Description:       A set of blocks registering custom types "Events" and "Bars" as well as other related functions
 * Version:           1.0.0
 * Requires at least: 5.9
 * Requires PHP:      7.2
 * Author:            Epotis team
 * Text Domain:       e-potis
 */

if(!function_exists('add_action')) {
    echo 'Seems like you stumbled here by accident.';
    exit;
}

//  Setup
define('EPT_PE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('EPT_PE_PLUGIN_FILE', __FILE__);

//  Includes
$rootFiles = glob(EPT_PE_PLUGIN_DIR . 'includes/*.php');
$subDirectoryFiles = glob(EPT_PE_PLUGIN_DIR . 'includes/**/*.php');
$subSubDirectoryFiles = glob(EPT_PE_PLUGIN_DIR . 'includes/**/**/*.php');
$allFiles = array_merge($rootFiles, $subDirectoryFiles, $subSubDirectoryFiles);

foreach($allFiles as $filename){
    include_once($filename);
}
 
//  Hooks
register_activation_hook(__FILE__, 'ept_pe_activate_plugin');
add_action('init','ept_pe_register_blocks');
add_action('init', 'ept_pe_register_assets');
add_action('init', 'ept_pe_event_post_type');
add_action('init', 'ept_pe_place_post_type');
add_action('rest_api_init', 'ept_pe_rest_api_init');
add_action('admin_enqueue_scripts', 'ept_pe_admin_enqueue');
add_action('transition_post_status', 'ept_pe_publish_custom_post_meta',10,3);
//add_action('init', 'ept_pe_load_php_translations');
//add_action('wp_enqueue_scripts', 'ept_pe_load_block_translations',100); 