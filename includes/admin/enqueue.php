<?php
function ept_pe_admin_enqueue($hook_suffix) {
  if ($hook_suffix == 'post-new.php' || $hook_suffix == 'post.php'){
    if (method_exists(get_current_screen(), 'is_block_editor') && !get_current_screen()->is_block_editor()) {
    wp_enqueue_script('ept_pe_admin');
    wp_enqueue_style('ept_pe_admin');
    }
  }
  if ($hook_suffix === 'toplevel_page_json-importer') {
    wp_enqueue_script('json_importer_script');
    wp_enqueue_style('json_importer_style');
  }
}   