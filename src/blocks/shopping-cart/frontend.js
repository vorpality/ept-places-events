import {render, useState, useEffect} from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'

function CartPost(props){
  const [permission] = useState(props.loggedIn)
  const [quantity, setQuantity] = useState(props.quantity)

  return (     
  <>
    <button class="quantity-button quantity-minus"
      onClick = {async event => {

        if(!permission) {
          return alert('You may need to log in.')
        }
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
      
        
        if(cartResponse.status ==2) {
          setQuantity(quantity-1)
        }
      }}>
      <i class="bi bi-dash-square"></i>
    </button>

    <input 
      type="text" 
      class="quantity-box " 
      value={quantity}
      data_user_id={props.userID}
      data_post_id={props.postID}
      onChange= {async event =>{
        const newVal = event.target.value
        const cartResponse = await apiFetch({
          //example.com/wp-json/ept/v1/cartfiddle
          path: 'ept/v1/cartfiddle',
          method: 'POST',
          data: {
            userID: props.userID,
            postID: props.postID,
            amount: newVal
          }
        })
        if(cartResponse.status === 2){
          setQuantity(newVal) 
        }
      }}
    ></input>
    <button class="quantity-button quantity-plus" 
    onClick = {async event => {

      if(!permission) {
        return alert('You may need to log in.')
      }
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
    
      
      if(cartResponse.status ==2) {
        setQuantity(quantity+1)
      }
    }}>
      <i class="bi bi-plus-square"></i>
    </button>
  </>
  )}


document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.post-buttons')

  blocks.forEach( block => {
  const postID = parseInt(block.dataset.postId)
  const userID = parseInt(block.dataset.userId)
  const loggedIn = !!block.dataset.loggedIn
  const quantity = parseInt(block.dataset.quantity)
  render(
    <CartPost 
    postID={postID} 
    userID={userID}
    loggedIn={loggedIn}
    quantity={quantity}
    />, block)
  })
});

document.addEventListener('DOMContentLoaded', () => {
  const remove_all = document.querySelector('#remove-all-button')
  const userID = parseInt(remove_all.dataset.userId)
  remove_all.addEventListener('click', async event => {
    event.preventDefault()
    const cartResponse = await apiFetch({
      //example.com/wp-json/ept/v1/cartfiddle
      path: 'ept/v1/cartfiddle',
      method: 'POST',
      data: {
        userID: userID,
        amount: 0
      }
    })
    if(cartResponse.status === 2){
      location.reload();
    }
  })
})