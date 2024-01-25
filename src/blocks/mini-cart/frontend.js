import {render, setTime, useState, useEffect} from '@wordpress/element'
import React from 'react';
import {hydrateRoot} from 'react-dom'
import apiFetch from '@wordpress/api-fetch'

function MiniCartPost(props){
  const [quantity, setQuantity] = useState(props.quantity)
  const [userID] = useState(props.userID)
  const [postID] = useState(props.postID) 
  const checkedInput = []
  if (quantity==0) {
    return ''
  }
    checkedInput.push(
      <Input
        value = {quantity}
        userID = {userID}
        postID = {postID}
        setQuantity={setQuantity}
        onChange = {changeQuantity}
      />
    )
    checkedInput.push(
      <Button
        onClick={removeQuantity}
        userID = {userID}
        postID = {postID}
        setQuantity={setQuantity}
      />
    )
  //}
  return (
    <>
     {checkedInput}
    </>
  );
}

  function Button({onClick, userID, postID, setQuantity}){
  return (
  <button class="quantity-button quantity-minus"
    onClick = {() =>onClick(postID,userID,setQuantity)}
  >
    <i class="bi bi-dash-circle quantity-button"></i>
  </button>
  )
}

async function removeQuantity(postID,userID, setQuantity){
  const cartResponse = await apiFetch({
    //example.com/wp-json/ept/v1/cartfiddle
    path: 'ept/v1/cartfiddle',
    method: 'POST',
    data:{
      userID: userID,
      postID: postID,
      amount: 0
    }
  })
  if(cartResponse.status ==2) {
    setQuantity(0);
    location.reload();
  }
}

function Input({value, onChange, userID, postID, setQuantity}){
  return (
    <input
      className="mini-quantity-box"
      value = {value}
      onChange = {(e) => onChange(e, userID,postID, setQuantity)}
    />
  )
}


async function changeQuantity(e, userID, postID, setQuantity){
  const newVal = e.target.value
  const cartResponse = await apiFetch({
    //example.com/wp-json/ept/v1/cartfiddle
    path: 'ept/v1/cartfiddle',
    method: 'POST',
    data: {
      userID: userID,
      postID: postID,
      amount: newVal
    }
  })
  if(cartResponse.status ==2) {
    setQuantity(newVal);
  }
}
function MiniCartDot({quantity}){
  return (
    <span
      className='mini-cart-dot'
    >
      {quantity}
    </span>
  )
}
document.addEventListener('DOMContentLoaded', () => {


  const blocks = document.querySelectorAll('.mini-post-buttons')
  blocks.forEach( block => {
  const postID = parseInt(block.dataset.postId)
  const userID = parseInt(block.dataset.userId)
  const loggedIn = !!block.dataset.loggedIn
  const quantity = parseInt(block.dataset.quantity)
  

  render(
    <MiniCartPost 
    postID={postID} 
    userID={userID}
    loggedIn={loggedIn}
    quantity={quantity}
    
    />, block)
  })
})


document.addEventListener('DOMContentLoaded', () => {


  const blocks = document.querySelectorAll('.post-buttons')
  blocks.forEach( block => {
    const postID = parseInt(block.dataset.postId)
    const quantity = parseInt(block.dataset.quantity)
    const userID = parseInt(block.dataset.userId)
    const loggedIn = !!block.dataset.loggedIn

    const observer = new MutationObserver(() =>get_go(postID,userID,loggedIn,quantity));
    observer.observe(block, {
      attributes:true
    })
  })
})




document.addEventListener('DOMContentLoaded', () => {
  const block = document.querySelector('.mini-cart-bubble')
  if (block){
  const observer = new MutationObserver(re_render);
  observer.observe(block, {
    attributes:true
  });
  const quantity = parseInt(block.dataset.quantity)
  render(
    <MiniCartDot 
      quantity={quantity}
    />, block)
    
  }


})

function re_render(){
  const block = document.querySelector('.mini-cart-bubble')
  const quantity = parseInt(block.dataset.quantity)
  render(
    <MiniCartDot 
    quantity={quantity}
    //wV = {watchBlocks}

    />, block)
    
  }

  function get_go(pid,uid,loggedIn,quantity){
    const blocks = document.querySelectorAll('.mini-post-buttons')
    blocks.forEach( block => {
      hydrateRoot(block)
      })

    }
/*
    if(blocks){
      const newBlocks=[]
    let found = false;
    let y ;
    blocks.forEach( block => {
      const postID = parseInt(block.dataset.postId)
      if(postID == pid){
        block.dataset.quantity=0
        y = block;
        found=true;
        return
      }
      const userID = parseInt(block.dataset.userId)
      const loggedIn = !!block.dataset.loggedIn
      const quantity = parseInt(block.dataset.quantity)

    newBlocks.push(
      <MiniCartPost 
      postID={postID} 
      userID={userID}
      loggedIn={loggedIn}
      quantity={quantity}
      
      />, block)
    })
  
    newBlocks.forEach(block =>{
      console.log(block)
      
    }
    )
  }
  }
*/



