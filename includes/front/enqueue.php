<?php

function ept_pe_enqueue_scripts() {
    ept_pe_enqueue_rest_shorts();
    wp_register_script('ept-gmaps-handle', '', [], false, true);

    $inline_script = <<<EOD
        (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.googleapis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({key: "AIzaSyDY56cwNRUcmVLV3LpSUUwjPWx4TQJHr3I", v: "weekly"});
        EOD;

    // Enqueue the dummy script
    wp_enqueue_script('ept-gmaps-handle');

    // Add the inline script to the dummy handle
    wp_add_inline_script('ept-gmaps-handle', $inline_script);

    };

function ept_pe_enqueue_rest_shorts() {
    $eventURLS = json_encode([
        'update' => esc_url_raw(rest_url('ept/v1/update-event'))
    ]);
    $placeURLS = json_encode([
        'update' => esc_url_raw(rest_url('ept/v1/update-place'))
    ]);
    $postURLS = json_encode([
        'retrieve' => esc_url_raw(rest_url('ept/v1/retrieve-post'))
    ]);
    

    wp_add_inline_script(
        'ept-pe-update-event-view-script',          
        "const ept_events = {$eventURLS}",
        'before' //after
    );
    wp_add_inline_script(
        'ept-pe-update-event-view-script',          
        "const ept_posts = {$postURLS}",
        'before' //after
    );
    wp_add_inline_script(
        'ept-pe-update-place-view-script',          
        "const ept_posts = {$postURLS}",
        'before' //after
    );
    wp_add_inline_script(
        'ept-pe-update-place-view-script',          
        "const ept_places = {$placeURLS}",
        'before' //after
    );
}


