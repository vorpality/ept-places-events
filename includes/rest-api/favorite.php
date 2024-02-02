<?php
function ept_pe_rest_api_add_favorite_handler($request){
  $response['status'] = 1;
  $params = $request->get_json_params();
  $response['params'] = $params;

  if(
    !isset($params['favorite'], $params['postID']) ||
    !($params['favorite'] === true || $params['favorite'] === false) ||
    empty($params['postID'])
  )
  {
    $response['message'] = 'failed initial check';
    $response['check'] = '!isset($params[favorite], $params[postID])';
    $resposne['result'] = !isset($params['favorite']) ;

    return $response;
  }

  $favorite = $params['favorite'];
  $postID = absint($params['postID']);
  $userID = absint($params['userID']);
 
  $currentFavorites = get_user_meta($userID, 'favorites', false);

  if((count($currentFavorites) == 0) && (!$favorite)){
    add_user_meta($userID, 'favorites', strval($postID));
    $response['status'] = 2;
    return $response;
  }

  if ($favorite){

    if(!in_array(strval($postID),$currentFavorites)){
      return $response;
    }
    else {
      delete_user_meta($userID, 'favorites', strval($postID));
      $response['status'] = 2;
      return $response;
    }
  }
  else {
    if(in_array(strval($postID),$currentFavorites)){
      return $response;
    }
    else {
      add_user_meta($userID, 'favorites', strval($postID));
      $response['status'] = 2;
      return $response;
    }
  }
      


  $response['status'] = 2;
  return $response;
}