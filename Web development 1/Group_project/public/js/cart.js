const addToCart = productId => {
  // TODO 9.2
  // use addProductToCart(), available already from /public/js/utils.js
  // call updateProductAmount(productId) from this file
  addProductToCart(productId);
  updateProductAmount(productId);
};

const decreaseCount = productId => {
  // TODO 9.2
  // Decrease the amount of products in the cart, /public/js/utils.js provides decreaseProductCount()
  // Remove product from cart if amount is 0,  /public/js/utils.js provides removeElement = (containerId, elementId
  const dec = decreaseProductCount(productId);
  if(dec === 0){
    removeElement('cart-container',productId);
  }
  else{
    updateProductAmount(productId);
  }
};

const updateProductAmount = productId => {
  // TODO 9.2
  // - read the amount of products in the cart, /public/js/utils.js provides getProductCountFromCart(productId)
  // - change the amount of products shown in the right element's innerText
  const updated = getProductCountFromCart(productId);
  const item = document.getElementById(`amount-${productId}`);
  item.innerText = updated + 'x';
};

const placeOrder = async() => {
  // TODO 9.2
  // Get all products from the cart, /public/js/utils.js provides getAllProductsFromCart()
  // show the user a notification: /public/js/utils.js provides createNotification = (message, containerId, isSuccess = true)
  // for each of the products in the cart remove them, /public/js/utils.js provides removeElement(containerId, elementId)
  getAllProductsFromCart();
  createNotification('Successfully created an order!','notifications-container',isSuccess = true);
  clearCart();
  const cart = document.getElementById('cart-container');
  cart.querySelectorAll('div').forEach(element => element.remove());
  
  
};

(async() => {
  // TODO 9.2
  // - get the 'cart-container' element
  // - use getJSON(url) to get the available products
  // - get all products from cart
  // - get the 'cart-item-template' template
  // - for each item in the cart
  //    * copy the item information to the template
  //    * hint: add the product's ID to the created element's as its ID to 
  //        enable editing ith 
  //    * remember to add event listeners for cart-minus-plus-button
  //        cart-minus-plus-button elements. querySelectorAll() can be used 
  //        to select all elements with each of those classes, then its 
  //        just up to finding the right index.  querySelectorAll() can be 
  //        used on the clone of "product in the cart" template to get its two
  //        elements with the "cart-minus-plus-button" class. Of the resulting
  //        element array, one item could be given the ID of 
  //        `plus-${product_id`, and other `minus-${product_id}`. At the same
  //        time we can attach the event listeners to these elements. Something 
  //        like the following will likely work:
  //          clone.querySelector('button').id = `add-to-cart-${prodouctId}`;
  //          clone.querySelector('button').addEventListener('click', () => addToCart(productId, productName));
  //
  // - in the end remember to append the modified cart item to the cart 
  const cart = document.getElementById('cart-container');
  const json = await getJSON('api/products');
  const temp = document.getElementById('cart-item-template');
  var products = getAllProductsFromCart();
  json.forEach(product => {
    for(var i of products){
      if(i.id === product._id){
    const cloned = temp.content.cloneNode(true);
    cloned.querySelector('div').id = product._id;
    const buttons = cloned.querySelectorAll('.cart-minus-plus-button');
    buttons[0].id = `plus-${product._id}`;
    buttons[0].addEventListener('click', () => addToCart(product._id, product.name));
    buttons[1].id = `minus-${product._id}`;
    buttons[1].addEventListener('click', () => decreaseCount(product._id));
    name_ = cloned.querySelector(".product-name")
    name_.id = `name-${product._id}`;
    price_ = cloned.querySelector(".product-price")
    price_.id = `price-${product._id}`;
    amount_ = cloned.querySelector(".product-amount")
    amount_.id = `amount-${product._id}`;
    name_.innerText = product.name;
    price_.innerText = product.price;
    amount_.innerText = getProductCountFromCart(product._id) + 'x';
    cart.append(cloned);
      }
    }
  });
  
  document.getElementById('place-order-button').addEventListener('click', () => {
    placeOrder();
  })

})();