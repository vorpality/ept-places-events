<?php

function ept_pe_event_add_date($post){
  $oldDate = get_post_meta($post->ID, 'event_date', true);
  ?>
  <tr class="form-field">
      <th>
      <label> <?php _e('Date', 'e-potis')?></label>
      </th>
      <td>
          <input type="date" name="ept_pe_event_date"
          value=
          <?php
          if($oldDate) {echo $oldDate;}
            ?> />
          <p class="description"><?php _e('The event\'s date.', 'e-potis')?> </p>  
      </td>
  </tr>   
  <?php
}





