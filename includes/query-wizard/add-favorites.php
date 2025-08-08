<?php
function queries_isFavorite($isFavorite, $wpdb){
    if ($isFavorite && is_user_logged_in()) {
    $currentUserID = get_current_user_id();
    $userFavoritesString = get_user_meta($currentUserID, 'favorites', false);
    $favoritePostIDs = ($userFavoritesString)?  array_map('intval', $userFavoritesString) : [] ; 

    if (!empty($favoritePostIDs)) {
        add_filter('posts_where', function ($where) use ($favoritePostIDs, $wpdb) {
            $placeholders = implode(',', array_fill(0, count($favoritePostIDs), '%d'));
            return $where . $wpdb->prepare(" AND {$wpdb->posts}.ID IN ($placeholders)", ...$favoritePostIDs);
        });
    } else {
        // If no favorites, return an empty result
        $query->set('post__in', [0]);
    }
}

  add_filter('posts_request', function ($sql) {
      return $sql;
  });
}