<?php
function ept_pe_create_tables(){

  ept_create_bar_owners_table();
  ept_add_foreign_keys_to_bar_owners_table();

  ept_create_events_places_table();
  ept_add_foreign_keys_to_places_events_table();
  
  ept_create_place_locations_table();
  ept_add_foreign_keys_to_place_locations_table();
  ept_populate_place_locations_table();

}



