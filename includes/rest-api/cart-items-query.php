<?php
function ept_pq_rest_api_get_cart_handler1($request){
  $response['status'] = 1;
  $params = $request->get_json_params();

  if(
    !isset($params['userID'])
  )
  { 
    return $response;
  }
  
  $userID = absint($params['userID']);
  $userCartedString = get_user_meta($userID, 'cartItem', false);
  $inCart = array_map('intval', $userCartedString);
  $uniqueItem=[];
  foreach($inCart as $cartItem){
    if(!$uniqueItem[$cartItem]){
      $uniqueItem[]=[
        'id' => $cartItem,
        'quantity' => 1,
        'title' => get_the_title($cartItem),
        'availability' => get_post_meta($cartItem,'product_avail',true),
        'price' => get_post_meta($cartItem,'product_price', true),
        'url' => get_the_permalink($cartItem),
        'image' => get_the_post_thumbnail($cartItem,'thumbnail')

      ];
    }
    else{
      $uniqueItem[$cartItem] ++;
    }
  }
  $response['status']=2;
  $response['data']=$uniqueItem;
  return $response;
}