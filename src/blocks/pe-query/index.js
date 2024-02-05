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
	edit({ attributes, setAttributes }) {
    const { content, showCategory, count, categories, view, queryType } = attributes
    const blockProps = useBlockProps()


    const terms = useSelect((select) => { 
      return select('core').getEntityRecords(
        'taxonomy',
        'category',
        {
          per_page: -1
        }
      );
    });
    const suggestions = {};
  
    terms?.forEach((term) => {
      suggestions[term.name] = term;
    });

    const categoryIDs = categories.map((term) => term.id);
    const posts = useSelect( 
      (select) => {
        return select('core').getEntityRecords('postType', 'recipe', {
          per_page: count,
          _embed: true,
          category : categoryIDs,
          order: 'desc',
        });
    },
    [count,categoryIDs] // variable watch 
    );

    const switchPost = (view =='normal view') ?
    <QueryControls 
      numberOfItems={count}
      minItems={1}
      maxItems={20}
      onNumberOfItemsChange={count => setAttributes({ count })}
      categorySuggestions = {suggestions}
      onCategoryChange={(newTerms) => {
        const newCategories = []
        newTerms.forEach((category) => {
          if(typeof category === 'object'){
            return newCategories.push(category);
          }

          const categoryTerm = terms?.find(
            (term) => term.name === category
          );

          if(categoryTerm) newCategories.push(categoryTerm);
        });

        setAttributes({categories: newCategories});
      }}
      selectedCategories= {categories }
    />
  : ''

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
              onChange={queryType => setAttributes({ queryType})}
            />
            <SelectControl
              label={__('View', 'e-potis')}
              value={view}
              options={[
                { label: __('Everything', 'e-potis'), value: 'all view' },
                { label: __('Favorites', 'e-potis'), value: 'favorites view' },
                { label: __('Normal', 'e-potis'), value: 'normal view' }
              ]}
              onChange={view => setAttributes({ view })}
            />
            <ToggleControl
              label={__('Show Category', 'e-potis')}
              checked={showCategory}
              onChange={(newShowCategory) => setAttributes({ showCategory: newShowCategory })}
            />
            {switchPost}
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
