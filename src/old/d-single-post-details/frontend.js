import {render, useState} from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import {__} from '@wordpress/i18n'
import { Spinner } from '@wordpress/components'

function FavoritePost(props){
  const [permission] = useState(props.loggedIn)
  const [favorite, setFavorite] = useState(props.isFavorite)
  const className = "favorite-button "+favorite ? "favorite-button is-favorite" : ""
  const fill = favorite ? "-fill" : ""
  
  return (    
    <button class={className}
      onClick = {async event => {

        if(!permission) {
          return alert('You may need to log in.')
        }

        const response = await apiFetch({
          //example.com/wp-json/up/v1/favorite
          path: 'up/v1/favorite',
          method: 'POST',
          data: {
            userID: props.userID,
            postID: props.postID,
            favorite
          }
        })

        if(response.status ==2) {
          setFavorite(!favorite)
        }
      }}>
    
      <i class={`bi bi-heart${fill}`}></i>
  </button>
  )
}

function AddToCartSP(props){
  const [permission] = useState(props.loggedIn)
  const [inCart, setCart] = useState(props.inCart)
  const [spinner, setSpinner] = useState(false)
  const renderEl = [];
  const [futureCart, setFutureCart] = useState(inCart);
  let tmp;
  if (inCart==0) { 
    renderEl.push(
      <>
      {(spinner) ? <Spinner /> :
        <button 
          id = "solo-btn"
          onClick = {async (event) => {

            if(!permission) {
              return alert('You may need to log in.')
            }
            setSpinner(true)
            const response = await apiFetch({
              //example.com/wp-json/up/v1/favorite
              path: 'ept/v1/cartfiddle',
              method: 'POST',
              data: {
                userID: props.userID,
                postID: props.postID,
                action:"add"
              }
            })
            setSpinner(false);
            if(response.status ==2) {
              tmp = 1;
              setCart(tmp);
              setFutureCart(tmp)
            }

          }}
        > 
        { __('Add to cart', 'e-potis')}
        </button>
      }
      </>
    )
  }
  else {
   renderEl.push(
    <>
    {spinner? '' :
      <button
        className="quantity-button quantity-minus"
        onClick = {async event => {

          if(!permission) {
            return alert('You may need to log in.')
          }
          setSpinner(true)
          const cartResponse = await apiFetch({
            //example.com/wp-json/ept/v1/cartfiddle
            path: 'ept/v1/cartfiddle',
            method: 'POST',
            data: {
              userID: props.userID,
              postID: props.postID,
              action: "remove"
            }
          })
          setSpinner(false);
          
          if(cartResponse.status ==2) {
            tmp = (inCart-1)
            setCart(tmp);
            setFutureCart(tmp);
          }
        }}>
        <i class="bi bi-dash-square quantity-button"></i>
      </button>
    }
    </>
    )
    renderEl.push(
      <>
      {(spinner) ? <Spinner className="cart-spinner" /> :
        <input 
          type = "text"
          class = "quantity-box"
          value={futureCart}
          data_user_id={props.userID}
          data_post_id={props.postID}
          onChange={(e) =>
            {
              setFutureCart(e.target.value)
            }
          }
          onBlur= {async () =>{
            tmp = (futureCart != parseInt(futureCart))? 0 : futureCart
            setSpinner(true)
            const cartResponse = await apiFetch({
              //example.com/wp-json/ept/v1/cartfiddle
              path: 'ept/v1/cartfiddle',
              method: 'POST',
              data: {
                userID: props.userID,
                postID: props.postID,
                amount: tmp
              }
            })
            
            if(cartResponse.status ==2) {
              setCart(tmp);
              setFutureCart(tmp);
            }
            setSpinner(false)

          }}
        ></input>
      }
      </>
    )
    renderEl.push(
      <>
      {spinner ? '' :
        <button 
          className = "quantity-button quantity-plus"
          onClick = {async event => {

            if(!permission) {
              return alert('You may need to log in.')
            }
            setSpinner(true)
            const cartResponse = await apiFetch({
              //example.com/wp-json/ept/v1/cartfiddle
              path: 'ept/v1/cartfiddle',
              method: 'POST',
              data: {
                userID: props.userID,
                postID: props.postID,
                action:"add"
              }
            })
            setSpinner(false)
            if(cartResponse.status ==2) {
              tmp = (inCart+1)
              setCart(tmp)
              setFutureCart(tmp);
            }
          }}
        >
          <i class="bi bi-plus-square"></i>
        </button>
      }
      </>
   )
  }
  return (
    <div className='add-to-cart'>
    {renderEl}
    </div>
  )
}

  


  document.addEventListener('DOMContentLoaded', () => {
    const block= document.querySelector('.wp-block-ept-products-single-post-details .button-data')
    const postID = parseInt(block.dataset.postId)
    const userID = parseInt(block.dataset.userId)
    const loggedIn = !!block.dataset.loggedIn
    const isFavorite = !!block.dataset.isFavorite
    const inCart = parseInt(block.dataset.inCart)
    

    render(
      <>
      <FavoritePost 
        postID={postID} 
        userID={userID}
        isFavorite = {isFavorite}
        loggedIn={loggedIn}
      />
      <AddToCartSP
        postID={postID} 
        userID={userID}
        loggedIn={loggedIn}
        inCart={inCart}
      />
      </>, block
    )
    
    //render({toRender});
}) 
