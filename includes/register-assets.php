<?php 

function ept_pe_register_assets(){ 
  $adminAssets = include(EPT_PE_PLUGIN_DIR . 'build/admin/meta-boxes.asset.php');

  wp_register_style(
    'ept_pe_admin',
    plugins_url('/build/admin/meta-boxes.css', EPT_PE_PLUGIN_FILE),
    $adminAssets['version'],
  );

  wp_register_script(
    'ept_pe_admin',
    plugins_url('build/admin/meta-boxes.js', EPT_PE_PLUGIN_FILE),
    $adminAssets['dependencies'],
    $adminAssets['version'],
    true
  );

  
  // Register JSON importer assets
  $jsonImporterAssets = include(EPT_PE_PLUGIN_DIR . 'build/admin/json-importer.asset.php');

  wp_register_style(
    'json_importer_style',
    plugins_url('/build/admin/json-importer.css', EPT_PE_PLUGIN_FILE),
    [], // Add CSS dependencies if needed
    $jsonImporterAssets['version'] ?? null
  );

  wp_register_script(
    'json_importer_script',
    plugins_url('/build/admin/json-importer.js', EPT_PE_PLUGIN_FILE),
    $jsonImporterAssets['dependencies'] ?? ['wp-element', 'wp-api-fetch'],
    $jsonImporterAssets['version'] ?? filemtime(EPT_PE_PLUGIN_DIR . 'build/json-importer/index.js'),
    true
  );
}