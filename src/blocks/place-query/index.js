import { registerBlockType } from '@wordpress/blocks'
import { 
  useBlockProps, 
  InspectorControls, 
  RichText
} from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { 
  PanelBody, 
  QueryControls,
  ToggleControl,
  SelectControl
} from '@wordpress/components'
import {useSelect} from '@wordpress/data'
import { RawHTML } from '@wordpress/element'
import icons from '../../icons.js'
import './main.css'
import block from './block.json'

registerBlockType(block.name, { 
  icon: {
    src: icons.post_details
  },
	edit({ attributes, setAttributes }) {
    const { content, showCategory, count, categories, view, cartEnabled } = attributes
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
          <PanelBody title={__('Settings', 'e-potis')}>
            <ToggleControl
              label={__('Show page title', 'e-potis')}
              checked={showCategory}
              onChange={showCategory => setAttributes({ showCategory })}
              help={ 
                showCategory ? 
                __('Category title shown.', 'e-potis') : 
                __('Custom title shown.', 'e-potis')
              }
            />
            <SelectControl 
              label = {__('Select what is shown in query.', 'e-potis')}
              value = {view}
              options = {[
                {
                  label: __('Select Categories', 'e-potis'),
                  value: 'normal view'
                },
                {
                  label: __('Show Favorites', 'e-potis'),
                  value: 'favorites view'
                },
                {
                  label: __('Show All Products', 'e-potis'),
                  value: 'all view'
                }
                
              ]}
              onChange={view => setAttributes({view})}
              
            />
            {switchPost}
            <ToggleControl
              label={__('Enable cart', 'e-potis')}
              checked={cartEnabled}
              onChange={cartEnabled => setAttributes({ cartEnabled })}
              help={ 
                cartEnabled ? 
                __('Cart Enabled.', 'e-potis') : 
                __('Cart Disabled.', 'e-potis')
              }
            />
            </PanelBody>
          </InspectorControls>
          <div {...blockProps}>
            <div className ="inner-page-header">
              {
                showCategory ? 
                <h1>{__('Some Category', 'e-potis')}</h1> : 
                <RichText 
                    tagName="h1" 
                    placeholder={__('Heading', 'e-potis')}
                    value={content}
                    onChange={content => setAttributes({ content })}
                />
              }
            </div>
            
            {

            posts?.map((post) => {
              const featuredImage = 
                post._embedded && 
                post._embedded['wp:featuredmedia'] &&
                post._embedded['wp:featuredmedia'].length > 0 &&
               
                post._embedded['wp:featuredmedia'][0];
              
              return (
                <div class="single-post">
                  {featuredImage && (
                    <a class="single-post-image" href={post.link}>
                      <img 
                        src={featuredImage.media_details.sizes.thumbnail.source_url} 
                        alt={featuredImage.alt_text} />
                    </a>
                  )}

                  <div class="single-post-detail">
                    <a href={post.link}>
                      <RawHTML>{post.title.rendered}</RawHTML>
                    </a>
                    <span>
                      by <a href={post.link}>{post._embedded.author[0].name}</a>
                    </span>
                  </div>
                </div>
              )
            })
          }

        </div>
      </>
    );
  }
});