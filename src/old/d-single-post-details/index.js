import { registerBlockType } from '@wordpress/blocks';
import { 
  useBlockProps, RichText, InspectorControls
} from '@wordpress/block-editor';
import {PanelBody, ToggleControl} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

import icons from '../../icons.js'
import './main.css'

registerBlockType('ept-products/single-post-details', {
  icon: icons.post_details,
	edit({ attributes, setAttributes }) {
        const { content,showCategory } = attributes    
        const blockProps = useBlockProps();

        return (
        <>

        </>
        );
    }
});