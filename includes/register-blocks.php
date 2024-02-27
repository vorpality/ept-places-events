<?php

function ept_pe_register_blocks() {
    $blocks = [
        [ 'name' => 'pe-query', 'options' => [
            'render_callback' => 'ept_pe_query_render_cb'
        ]],
        [ 'name' => 'filter-button', 'options' => [
            'render_callback' => 'ept_pe_filter_button_render_cb'
        ]],
        [ 'name' => 'locator'],
        [ 'name' => 'single-post-details', 'options' => [
            'render_callback' => 'ept_products_single_post_details_render_cb'
        ]],
        
    ];
 
    foreach($blocks as $block){
        register_block_type(
            EPT_PE_PLUGIN_DIR . 'build/blocks/'. $block['name'] .'/block.json',
            isset($block['options']) ? $block['options'] : []
        );
    } 
} 