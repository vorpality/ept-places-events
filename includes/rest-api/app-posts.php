<?php 
function ept_pe_rest_api_handle_app_posts($request) {
  $params = $request->get_query_params();
  $location = isset($params['location']) ? sanitize_text_field($params['location']) : '';
  $type = isset($params['type']) ? sanitize_text_field($params['type']) : '';
  $distance = isset($params['distance']) ? sanitize_text_field($params['distance']) : '';
  $date = isset($params['date']) ? sanitize_text_field($params['date']) : '';
  $post_type = isset($params['post']) ? sanitize_text_field($params['post']) : array('place', 'event');

  // Define your query arguments based on filters
  $args = [
      'post_type' => $post_type,
      'posts_per_page' => -1, // Adjust as needed
      'meta_query' => array(),
  ];

  // Add category or taxonomy filter
  if (!empty($type)) {
      $args['tax_query'] = array(
          array(
              'taxonomy' => 'category', // Adjust if using a custom taxonomy
              'field' => 'slug',
              'terms' => $type,
          ),
      );
  }
  // For event date filter
  if ($post_type === 'event' && !empty($date)) {
      $args['meta_query'][] = array(
          'key' => 'event_date', // Adjust if using a different meta key
          'value' => $date,
          'compare' => '=',
          'type' => 'DATE',
      );
  }

  $query = new WP_Query($args);
  $posts = [];

  if ($query->have_posts()) {
      while ($query->have_posts()) {
          $query->the_post();
          $id = get_the_ID();

          // Get primary image ID and URL
          $primary_image_id = get_post_meta($id, 'primary_image', true);
          $primary_image_url = wp_get_attachment_url($primary_image_id);

          // Get custom images (assuming they are stored as an array in a meta field)
          $custom_images = get_post_meta($id, 'custom_images', true);

          // Get location
          $post_location = get_post_meta($id, 'place_location', true);

          // Add the post data to the response array
          $posts[] = array(
            'ID' => $id,
            'title' => get_the_title(),
            'content' => get_the_content(),
            'permalink' => get_permalink(),
            'location' => $post_location,
            'custom_images' => $custom_image_urls,
            'primary_image' => $primary_image_url,
            'date' => get_post_meta($id, 'event_date', true),
            'type' => get_post_type($id),
            'place_lat' => get_post_meta($id, 'place_lat', true),
            'place_lng' => get_post_meta($id, 'place_lng', true),
            'is_favorite' => $isFavorite,
            'distance' => $distance,
            'place_url' => $placeUrl,
            'place_title' => $placeTitle,
        );
      }
  }

  wp_reset_postdata();

  return new WP_REST_Response($posts, 200);
}