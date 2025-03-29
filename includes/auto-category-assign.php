<?php

function ept_auto_assign_categories_on_save($post_id) {
  // Avoid infinite loop by ensuring this is not running during autosave
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return $post_id;

  // Check if post type is 'place' or 'event'
  if (get_post_type($post_id) === 'place') {
      // Get the category ID for the 'places' category
      $places_category = get_term_by('slug', 'places', 'category');
      if ($places_category) {
          // Assign the 'places' category to the 'place' post
          wp_set_post_terms($post_id, [$places_category->term_id], 'category', true);
      }
  } elseif (get_post_type($post_id) === 'event') {
      // Get the category ID for the 'events' category
      $events_category = get_term_by('slug', 'events', 'category');
      if ($events_category) {
          // Assign the 'events' category to the 'event' post
          wp_set_post_terms($post_id, [$events_category->term_id], 'category', true);
      }
  }

  return $post_id;
}