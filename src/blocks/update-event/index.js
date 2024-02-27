import { registerBlockType } from '@wordpress/blocks'
import { 
  useBlockProps, ToggleControl, InspectorControls 
} from '@wordpress/block-editor'
import { __ } from "@wordpress/i18n"
import './main.css'
import block from './block.json'

registerBlockType(block.name, {
  edit({ attributes, setAttributes }) {
    const { edit } = attributes;
    const blockProps = useBlockProps();

    return (
      <>
        <InspectorControls>
        <ToggleControl 
            label = {__('Edit event', 'e-potis')}
            help = {
                edit ? 
                __('Editing event', 'e-potis') : 
                __('Adding event', 'e-potis')
            }
            checked ={edit}
            onChange = { edit => setAttributes({edit})}
            />
        </InspectorControls>
        <div {...blockProps}>
        </div>
      </>
    )
  }
})