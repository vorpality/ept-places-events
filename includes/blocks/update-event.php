<?php

function ept_pe_update_event_form_render_cb($atts) {
  global $wpdb;
  $user = wp_get_current_user();
  if (!get_user_meta($user->ID, 'business_owner', true) && !is_admin()){
    wp_redirect(home_url());
  }
  $table_name = $wpdb->prefix . 'bar_owners';

  $header = __("Add new event", 'e-potis');
  $current_post = 0;
  $current_title = '';
  $current_description = '';
  $current_date = date("Y-m-d");

  if(isset($_GET['pid'])) {
    $header = __("Edit event", 'e-potis');
    $current_post = $_GET['pid'];
    $current_title = get_the_title($current_post);
    $current_description = get_the_excerpt($current_post);
    $current_date = get_post_meta($current_post, 'event_date', true);
  }

  $query = $wpdb->prepare(
    "SELECT post_id FROM $table_name WHERE user_id = %d",
    $user->ID
  );

  $results = $wpdb->get_results($query);

  $businesses = [];

  if (!empty($results)) {
      foreach ($results as $row) {
          $businesses[] = $row->post_id;
      }
  }
  ob_start();
  ?>
  <div class="wp-block-ept-pe-update-event" 
    data-post-id = "<?php echo $current_post; ?>"
  >
    <form method = "post"
      id="add-event-form"
      action = ""
      autocomplete="off"
      enctype="multipart/form-data"
    >
      <div id ='form-status'>
      </div>

      <fieldset>
        <h2 id ="add-new-event-label">
          <?php echo $header;?>
        </h2>
        <h3>
          <?php echo (__('Event Title','e-potis'));?>
        </h3>
        <input 
          value="<?php echo $current_title;?>"
          type="text" 
          name="event_title" 
          id="event-title">
        </input >
        <h3>
          <?php echo (__('Event description','e-potis'));?>
        </h3>
        <textarea 
          value="<?php echo $current_description;?>"
          rows="5"
          cols="40"
          name="event_description" 
          id="event-description" 
        ></textarea>      
        <h3>
          <?php echo (__('Event date','e-potis'));?>
        </h3>
        <input
          type = "date"
          value = <?php echo $current_date; ?>
          id = "event-date"
          />
        <h3>
          <?php echo (__('Event location','e-potis'));?>
        </h3>
        <select 
        name="event_location" 
        id = "event-location"
        > <?php
          foreach($businesses as $business){ ?>
            <option value="<?php
              echo($business); ?>"> <?php
              echo(esc_html(get_the_title($business)))?>
              </option> <?php
          } ?>
        </select>
        <h3><?php echo __('Event Images', 'e-potis'); ?></h3>
        <div class="file-upload-wrapper">
        </div>
        <input type="hidden" name="form-id" value = "021"></input>
        <input type="hidden" id="user-id" value = "<?php echo $user->ID?>"></input>
        <div class='btn-wrapper'>
            <button type="submit" class='open-confirmation-modal'><?php _e('Submit', 'e-potis'); ?></button>
        </div>
      </fieldset>
    </form>
  </div>
  <?php

  $output = ob_get_contents();
  ob_end_clean();
  return $output;
}