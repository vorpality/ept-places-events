<?php 
function ept_pe_filter_button_render_cb($atts){
  ob_start();
  ?>
  <div class="wp-block-ept-pe-filter-button">

    <div id="filter-root">
    <?php
      
      /*
      <form class = "filter-form">
        <div class = "wrap-duo">
          <label> Location </label>
          <input type = "checkbox" 
            class = "filter-item" 
            id="loc-box"> 
          </input>
        </div>
        <div class = "wrap-duo">
          <label> text </label>
          <input type = "text" 
            class = "filter-item" 
            id="text"> 
          </input>
      </div>
      <button type="submit">
        <?php esc_html_e('Apply filters', 'e-potis'); ?>
      </button>
      </form>
      
      foreach($atts['content'] as $field){

      }
      */
      ?>
    </div>
  </div>
  <?php

  $output = ob_get_contents();
  ob_end_clean();
  
  return $output;

}