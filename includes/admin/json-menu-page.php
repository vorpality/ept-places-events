<?php
function add_json_menu_page(){
  add_menu_page(
    'JSON Importer',      // Page title
    'JSON Importer',      // Menu title
    'manage_options',     // Capability
    'json-importer',      // Menu slug
    'render_json_importer_page', // Callback to render page
    'dashicons-upload',   // Icon
    20                    // Position
  );
};

function render_json_importer_page() {
  ?>
  <div id="json-importer-root">
    <?php echo '<h1>' . __('JSON Importer', 'e-potis') . '</h1>'; ?>
  </div>
  <?php
}