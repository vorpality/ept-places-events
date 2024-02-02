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

    const terms = useSelect((select) => {
      const eventCats = select('core').getEntityRecords('taxonomy', 'event_category', {
        per_page: -1
      }) || [];      
      const placeCats = select('core').getEntityRecords('taxonomy', 'place_category', {
        per_page: -1
      }) || [];
      return [...eventCats, ...placeCats];
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
            <SelectControl
              label={__('View', 'e-potis')}
              value={view}
              options={[
                { label: __('Everything', 'e-potis'), value: 'all view' },
                { label: __('Favorites', 'e-potis'), value: 'favorites view' },
                { label: __('Normal', 'e-potis'), value: 'normal view' }
              ]}
              onChange={(value) => setAttributes({ queryType: value })}
            />
            <ToggleControl
              label={__('Show Category', 'e-potis')}
              checked={showCategory}
              onChange={(newShowCategory) => setAttributes({ showCategory: newShowCategory })}
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
