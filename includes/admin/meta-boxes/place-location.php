<?php

function ept_pe_place_add_location($post){
  $oldLocation = get_post_meta($post->ID, 'place_location', true);
  $oldLat = get_post_meta($post->ID, 'lat', true);
  $oldLng = get_post_meta($post->ID, 'lng', true);
  ?>
  <tr class="form-field">
      <th>
      <label> <?php _e('Location', 'e-potis')?></label>
      </th>
      <td>
          <input type="text" name="ept_pe_place_location" id="location-input" 
            value="<?php
            if($oldLocation) {echo $oldLocation; }
          ?>"/>
          <p class="description"><?php _e('The place\'s location.', 'e-potis')?> </p>
          <input type="hidden" name="ept_pe_lat" id = "location-lat"
            value="<?php 
                if($oldLat) {echo $oldLat; }?>"
          />
          <input type="hidden" name="ept_pe_lng"  id="location-lng"
            value="<?php 
                if($oldLng) {echo $oldLng; }?>"
          />
      </td>
  </tr>   
  <?php
}

