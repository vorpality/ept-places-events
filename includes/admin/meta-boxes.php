<?php

function ept_pe_event_add_meta_boxes_cb($post){
  add_meta_box('date', __('Event Date','e-potis'), 'ept_pe_event_add_date');
  add_meta_box('location', __('Happening at', 'e-potis'), 'ept_pe_event_add_location');


}
   
function ept_pe_place_add_meta_boxes_cb($post){
  add_meta_box('location', __('Place Location','e-potis'), 'ept_pe_place_add_location');
    add_meta_box(
    'ept_pe_place_images',          
    __('Place Images', 'e-potis'),                
    'ept_pe_place_images_content'                      
  );
}