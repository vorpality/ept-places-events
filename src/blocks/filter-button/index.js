import { registerBlockType } from '@wordpress/blocks'
import { 
  useBlockProps, 
  InspectorControls
} from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { 
  PanelBody, 
  TextControl,
  RangeControl,
  SelectControl,
  ColorPalette,
  CheckboxControl
} from '@wordpress/components'
import icons from '../../icons.js'
import './main.css'
import block from './block.json'

registerBlockType(block.name, { 
  edit({ attributes, setAttributes }) {
    const {content, fieldNumber} = attributes;
    const blockProps = useBlockProps();
console.log(content);
    [content]


    return (
      <>
      <InspectorControls>
        <PanelBody>
          <RangeControl 
              label={__('Fields', 'e-potis')}
              onChange={fieldNumber => setAttributes({fieldNumber})}
              value={fieldNumber}
              min={1}
              max={10}
            />
        </PanelBody>
      </InspectorControls>
        <MultiField
          N={fieldNumber}
          content = {content}

        />
      </>
    )
  }
});


function Field(id, content){
  let newVals = content;

  return (
    <PanelBody title={__('Field ' + (id+1), 'e-potis')}>
      <TextControl
        label={"Field name"}
        value={newVals[id].field_name}
        onChange={(enteredVal) => {
          newVals[id].field_name = enteredVal;
          setAttributes({content:newVals})
        }}
        help={__(
          ("Enter field "+(id + 1)+ " name"),
          "e-potis"
        )}
      />
      <SelectControl 
        label={__('Field '+ (id+1) + ' type', 'e-potis')}
        value = {content[id].type}
        options={[
          {
            label: 'Checkbox',
            value: "checkbox"
          },
          {
            label: 'Slider',
            value: "slider"
          }
        ]}
        onChange={(enteredVal) => {
          newVals[id].type = enteredVal;
          setAttributes({content:newVals})
        }}
      />
    </PanelBody>
  )
}

function MultiField({N, content, blockProps}){
  const buttonProps ={
    id:"submit",

  }
  const to_renderInspector =[];
  for (let i = 0; i<N; i++){
      to_renderInspector.push(
        <Field
          id={i}
          content={content}
        />
      )
  }
}