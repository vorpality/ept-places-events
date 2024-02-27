<?php

function ept_products_single_post_details_render_c1b($atts) {
  $userID = get_current_user_id();
  $postID = get_the_ID();
  $isFavorite = false;
  $areInCart = 0;

  $availability = get_post_meta($postID,'product_avail',true);
  if($userID != 0){
    $userFavorites = get_user_meta($userID, 'favorites', false);
    if(count($userFavorites) > 0){
      $isFavorite = (in_array(strval($postID), $userFavorites));
    }
    $itemsInCart = get_user_meta($userID, 'cartItem', false);
    
    if(count($itemsInCart) > 0){
      $tmp = array_count_values($itemsInCart);

      if(array_key_exists($postID,$tmp)){
      $areInCart = $tmp[$postID];  
      }
    }
  }
  ob_start();

  ?>
  <div class ="wp-block-ept-products-single-post-details">
    <div class ="single-post">
      <div class ="single-post-detail">
        <div class = "product-info">
          <span id="product-price">
          <?php echo(__('Price', 'e-potis')); ?> : 
            <?php echo(get_post_meta( $postID,'product_price', true)); ?>€
          </span>
          <span id="product-availability">
          <?php  if($availability){ echo (__('The product is available','e-potis')); } else { echo (__('The product is not available','e-potis')); }?>
          </span>
        </div>
        <div class = "post-buttons button-data"
          data-logged-in="<?php echo is_user_logged_in(); ?>"
          data-post-id="<?php echo $postID; ?>"
          data-user-id="<?php echo $userID; ?>"
          data-is-favorite="<?php echo $isFavorite; ?>"
          data-in-cart="<?php echo $areInCart; ?>"
          >
          <button class = favorite-button> 
            <i class="bi bi-heart favorite-button"></i>
          </button>
          <div class = "add-to-cart">
            <?php if($areInCart==0) {
            ?>
            <button>
              <?php echo(__('Add to cart', 'e-potis')); ?>
            </button>
            <?php }else{
              ?>
            <div class = "quantity-stuff">
              <span> <?php echo(__('In cart : ', 'e-potis').$areInCart);?></span>
            </div>
              <?php
              }
              ?>
            </div>
          </div>
        </div>
      </div>
    </div> 
  <?php

  $output = ob_get_contents();
  ob_end_clean();

  return $output;
}