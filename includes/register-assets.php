<?php 

function ept_pe_register_assets(){ 
  $adminAssets = include(EPT_PE_PLUGIN_DIR . 'build/admin/index.asset.php');

  wp_register_style(
    'ept_pe_admin',
    plugins_url('/build/admin/index.css', EPT_PE_PLUGIN_FILE),
    $adminAssets['version'],
  );

  wp_register_script(
    'ept_pe_admin',
    plugins_url('build/admin/index.js', EPT_PE_PLUGIN_FILE),
    $adminAssets['dependencies'],
    $adminAssets['version'],
    true
  );

}