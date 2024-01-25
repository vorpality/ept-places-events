<?php
function ept_pe_admin_enqueue($hook_suffix) {
  if ($hook_suffix == 'post-new.php' || $hook_suffix == 'post.php'){
    wp_enqueue_script('ept_pe_admin');
  }
}  