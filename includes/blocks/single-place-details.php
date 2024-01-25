<?php

function ept_products_single_place_details_render_cb($atts) {
  $userID = get_current_user_id();
  $postID = get_the_ID();
  $isFavorite = false;


  $location = get_post_meta($postID,'place_location',true);
  if($userID != 0){
    $userFavorites = get_user_meta($userID, 'favorites', false);
    if(count($userFavorites) > 0){
      $isFavorite = (in_array(strval($postID), $userFavorites));
    }
  $place_lat = get_post_meta($postID,'lat',true);
  $place_lng = get_post_meta($postID,'lng',true);
  }
  ob_start();

  ?>
  <div class ="wp-block-ept-pe-single-place-details">
    <div class ="single-place">
      <div class ="single-place-detail">
        <div class = "place-info">
          <span id="place-location">
          <?php echo(__('Location', 'e-potis')); ?> : 
            <?php echo($location); ?>
          </span>
        </div>
      </div>
    </div> 
    <div id="place-map" 
      lat = "<?php echo $place_lat;?>"
      lng = "<?php echo $place_lng;?>"
      style="width: 320px; height: 480px;">
      <script>(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
        ({key: "AIzaSyDY56cwNRUcmVLV3LpSUUwjPWx4TQJHr3I", v: "weekly"});</script>
    </div>
  </div>
  <?php

  $output = ob_get_contents();
  ob_end_clean();

  return $output;
}