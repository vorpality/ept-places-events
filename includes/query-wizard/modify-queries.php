<?php
function ept_pe_modify_query($query) {
  global $wpdb;

  //error_log('Current query vars: ' . print_r($query->query_vars, true));
  if(isset($query->query_vars['location'])) {
    $location = $query->query_vars['location'];
    $userLat = floatval($location['lat']);
    $userLng = floatval($location['lng']);
  }
  else {
      $userLat = isset($_COOKIE['location_lat']) ? (float)$_COOKIE['location_lat'] : null;
      $userLng = isset($_COOKIE['location_lng']) ? (float)$_COOKIE['location_lng'] : null;
  }
  if ($userLat && $userLng) {
    $maxDistance = isset($query->query_vars['distance']) ? $query->query_vars['distance'] * 1000 : 0;
    //error_log("Max distance set to: $maxDistance");
    queries_add_distance_stuff($maxDistance, $userLat, $userLng, $wpdb);
  }

  if(isset($query->query_vars['is_favorite'])){
    $isFavorite = filter_var($query->query_vars['is_favorite'], FILTER_VALIDATE_BOOLEAN);
    queries_isFavorite($isFavorite, $wpdb);
  }


  if (isset($query->query_vars['orderby'])){

    $orderBy = $query->query_vars['orderby'];

    if ($orderBy === 'distance' && isset($location)){
      queries_orderby_location($orderBy, $location, $wpdb);
    }
  }
}

function ept_modify_query_for_post_grouping($groupby, $query){

  if (isset($query->query_vars['post_type']) && is_array($query->query_vars['post_type'])) {
    global $wpdb;
    $groupby = "{$wpdb->posts}.post_type, {$wpdb->posts}.ID";
  }
  return $groupby;
}


function ept_add_vars_to_query_vars($vars) {
  $vars[] = 'location';
  $vars[] = 'distance';
  $vars[] = 'is_favorite';
  $vars[] = 'orderby';
  return $vars;
}