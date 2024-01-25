import { registerBlockType } from '@wordpress/blocks';
import { 
  useBlockProps
} from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import block from './block.json'
import './main.css';

registerBlockType(block.name, {
  edit() {
    const blockProps = useBlockProps();
    
    return (

        <div {...blockProps}>
        <input type="text" id = "locator"> </input>
        <input type="hidden" id = "location-lat"> </input>
        <input type="hidden" id = "location-lng"> </input>
        </div>
    );
  },
  save() {
    const blockProps = useBlockProps.save();

    return (
      <div {...blockProps}>
        <input type="text" id = "locator"> </input>
        <input type="hidden" id = "location-lat"> </input>
        <input type="hidden" id = "location-lng"> </input>
      </div>
    )
  }
});

