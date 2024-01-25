<?php

function ept_pe_event_add_location($post){
  $oldLocation = get_post_meta($post->ID, 'event_location', true);
  $oldPlaceId = get_post_meta($post->ID, 'event_place_id', true);

  // Fetch places from your 'place' custom post type
  $places = get_posts(array('post_type' => 'place', 'numberposts' => -1));

  ?>
  <tr class="form-field">
      <th>
          <label> <?php _e('Location', 'e-potis')?></label>
      </th>
      <td>
          <input list="places-list" type="text" name="ept_pe_event_location" id="place-location" value="<?php echo esc_attr($oldLocation); ?>"/>
          <datalist id="places-list">
              <?php foreach ($places as $place) {
                  echo '<option value="' . esc_attr($place->post_title) . '" data-place-id="' . esc_attr($place->ID) . '"></option>';
              } ?>
          </datalist>
          <p class="description"><?php _e('The event\'s location.', 'e-potis')?> </p>
          <input type="hidden" name="ept_pe_place_id" id="place-id" value="<?php echo esc_attr($oldPlaceId); ?>"/>
      </td>
  </tr>
  <script>
      document.getElementById('place-location').addEventListener('input', function(e) {
          var option = document.querySelector('#places-list option[value="' + e.target.value + '"]');
          document.getElementById('place-id').value = option ? option.getAttribute('data-place-id') : '';
      });
  </script>
  <?php
}
