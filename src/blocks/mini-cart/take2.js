import {render, setTime, useState, useEffect} from '@wordpress/element'
import {React} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import apiFetch from '@wordpress/api-fetch'
const HOME_URL="http://petkarellas.local";

function PostContainer({userID}){
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const response = apiFetch({
      path: 'ept/v1/getcart',
      method: 'POST',
      data: {
        userID: userID
      }
    })
    .then((response)=> {return (response.status==2)? response.data : [];})
    .then(
      (result) =>{
        setIsLoaded(true);
        setBlocks(result);
      },
      (error) =>{
        setIsLoaded(true);
        setError(error);
      }
    )
  },[])
  if (error){
    return <div>Error: {error.message}</div>; 
  }
  else if (!isLoaded){
    return '';
  }
  else if (posts!=[]){
    let totalQuantity = 0;
    const miniCartPosts=[];
    blocks.forEach(block =>{
      totalQuantity++;
      miniCartPosts.push
      (<MiniCartPost
        block={block}
        />)
        
  })
  return(
    <>
      <div class="icon-coupler">
        <button class = "mini-cart-icon">
          <a href={`${HOME_URL}/cart`}>
            <div class = "mini-cart-bubble">
              <MiniCartDot
                quantity={totalQuantity}
              />
            </div>
            <i class="bi bi-cart2"></i> 
          </a>
        </button>
      </div>
      <div class="posts">
        {miniCartPosts}
        <button id="checkout-button">
          <a href={`${HOME_URL}/checkout`}>
            Checkout
          </a>
        </button>
      </div>
      </>
  )}
  else{
    return(
      <>
        <div class="icon-coupler">
          <button class = "mini-cart-icon">
            <a href={`${HOME_URL}/cart`}>
              <div class = "mini-cart-bubble">
                <MiniCartDot
                  quantity={totalQuantity}
                />
              </div>
              <i class="bi bi-cart2"></i> 
            </a>
          </button>
        </div>
        <div class="posts">
          {posts}
          <button id="checkout-button">
            <a href={`${HOME_URL}/checkout`}>
              Checkout
            </a>
          </button>
        </div>
        </>
      )
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

function MiniCartPost({block}){
  const { userID, postID, url, title, image, price} = block
  const [quantity, setQuantity] = useState(block.quantity)
  console.log(url)
  const checkedInput = []
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
  
  return (
    <div className="single-post">
      <div className="image-container">
        <a className ="single-post-image" href= {url}>
          <div dangerouslySetInnerHTML={{__html: image}} />
        </a>
      </div>
      <div class ="single-post-detail">
        <a href={url}>
          {title}
        </a>
        <div class = "button-aligner">
          <div class = "product-info">
            <span class="product-price">
              {price}€
            </span>
          </div>
          <div class ="button-data mini-post-buttons">
            {checkedInput}
          </div>
        </div>
      </div>
    </div>
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


function Input({value, onChange, userID, postID, setQuantity}){
  return (
    <input
      className="mini-quantity-box"
      value = {value}
      onChange = {(e) => onChange(e, userID,postID, setQuantity)}
    />
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
    setQuantity(0)
  }
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

async function getPosts(userID){
  
}


document.addEventListener('DOMContentLoaded', () => {
  const element = document.querySelector('.wp-block-ept-products-mini-cart .content')
  const userID = parseInt(element.dataset.userId)
  //const root = createRoot(element)
  //root.render(<PostContainer userID={userID} />)
  
  render(
    <PostContainer userID={userID} />,
    element
  )
})



