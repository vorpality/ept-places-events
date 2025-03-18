<?php 
function ept_pe_rest_api_handle_filter_posts($request) {
    $params = $request->get_json_params();
    $orderBy = isset($params['order']) ? sanitize_text_field($params['order']) : 'relevance';
    $location = isset($params['location']) ? $params['location'] : null;
    $distance = isset($params['distance']) ? floatval($params['distance']) : 0;
    $date = isset($params['date']) ? sanitize_text_field($params['date']) : '';
    $post_type = isset($params['post_type']) && ($params['post_type']!=='any') ? sanitize_text_field($params['post_type']) : array('place', 'event');

    // Define query arguments
    $args = [
        'post_type' => 'place',
        'posts_per_page' => -1, // Adjust as needed
        'meta_query' => array(),
        'orderby' => $orderBy, // Order by distance if set globally
    ];

    // Apply location filtering via global filters
    if (isset($location) && $distance > 0) {
        $args['location'] = $location;
        $args['distance'] = $distance; // Global filter will handle it
    }
    // Apply event date filtering
    if ($post_type === 'event' && !empty($date)) {
        $args['meta_query'][] = [
            'key' => 'event_date',
            'value' => $date,
            'compare' => '=',
            'type' => 'DATE',
        ];
    }

    // Run WP_Query
    $query = new WP_Query($args);
    $posts = [];

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $id = get_the_ID();

            // Get primary image ID and URL
            $primary_image_id = get_post_meta($id, 'primary_image', true);
            $primary_image_url = wp_get_attachment_url($primary_image_id);

            // Get custom images
            $custom_images = get_post_meta($id, 'custom_images', true);

            // Get location
            $post_location = get_post_meta($id, 'place_location', true);


            // Add the post data to response
            $posts[] = [
                'ID' => $id,
                'title' => get_the_title(),
                'content' => get_the_content(),
                'permalink' => get_permalink(),
                'location' => $post_location,
                'custom_images' => $custom_images,
                'primary_image' => $primary_image_url,
                'date' => get_post_meta($id, 'event_date', true),
                'type' => get_post_type($id),
                'distance' => calculate_distance($id, $location['lat'], $location['lng']), // Debugging: Shows calculated distance
            ];
        }
    }

    wp_reset_postdata();

    return new WP_REST_Response($posts, 200);
}
