<?php 
function ept_pe_load_php_translations() {
  load_plugin_textdomain(
    'e-potis',
    false,
    "ept-pe/languages"
  );
}

function ept_pe_load_block_translations(){
  $blocks = [
    'ept-pe-single-post-details-editor-script',
    'ept-pe-product-query-editor-script',
    'ept-pe-shopping-cart-editor-script',
    'ept-pe-mini-cart-editor-script',
    'ept-pe-single-post-details-view-script',
    'ept-pe-product-query-view-script',
    'ept-pe-shopping-cart-view-script',
    'ept-pe-mini-cart-view-script'
  ];

  foreach($blocks as $block){
    wp_set_script_translations(
      $block,
      'e-potis',
      EPT_PE_PLUGIN_DIR . "languages"
    );
  }
}