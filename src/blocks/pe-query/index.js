import { registerBlockType } from '@wordpress/blocks';
import {
  useBlockProps,
  InspectorControls,
  RichText
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
  PanelBody,
  SelectControl,
  ToggleControl,
  QueryControls
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './main.css'
import block from './block.json';

registerBlockType(block.name, {
  title: block.title,
  category: block.category,
  attributes: block.attributes,
  edit: ({ attributes, setAttributes }) => {
    const {
      queryType,
      title,
      count,
      categories,
      view,
      showCategory,
      cartEnabled,
      content
    } = attributes;

    // Fetch terms for category selection
    const terms = useSelect((select) => {
      return select('core').getEntityRecords('taxonomy', 'category', {
        per_page: -1
      });
    }, []);

    // Prepare category options for QueryControls
    const categoryOptions = terms ? terms.map(term => ({ value: term.id, label: term.name })) : [];

    // Handle category selection change
    const onCategoryChange = (newCategories) => {
      setAttributes({ categories: newCategories });
    };

    // Prepare the block properties
    const blockProps = useBlockProps();

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Query Settings', 'e-potis')}>
            <SelectControl
              label={__('Query Type', 'e-potis')}
              value={queryType}
              options={[
                { label: __('Places', 'e-potis'), value: 'places' },
                { label: __('Events', 'e-potis'), value: 'events' },
                { label: __('Both', 'e-potis'), value: 'both' }
              ]}
              onChange={(value) => setAttributes({ queryType: value })}
            />
            <ToggleControl
              label={__('Show Category', 'e-potis')}
              checked={showCategory}
              onChange={(newShowCategory) => setAttributes({ showCategory: newShowCategory })}
            />
            <ToggleControl
              label={__('Enable Cart', 'e-potis')}
              checked={cartEnabled}
              onChange={(newCartEnabled) => setAttributes({ cartEnabled: newCartEnabled })}
            />
            <QueryControls
              numberOfItems={count}
              onNumberOfItemsChange={(newCount) => setAttributes({ count: newCount })}
              categoriesList={categoryOptions}
              selectedCategoryId={categories}
              onCategoryChange={onCategoryChange}
            />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <div className="inner-page-header">
            {showCategory ? (
              <h1>{__('Some Category', 'e-potis')}</h1>
            ) : (
              <RichText
                tagName="h1"
                placeholder={__('Heading', 'e-potis')}
                value={content}
                onChange={(newContent) => setAttributes({ content: newContent })}
              />
            )}
          </div>
        </div>
      </>
    );
  }
});
