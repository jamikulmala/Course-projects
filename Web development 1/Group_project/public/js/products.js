const addToCart = (productId, productName) => {
  // TODO 9.2
  addProductToCart(productId);
  createNotification(`Added ${productName} to cart!`, "notifications-container", true);
  // you can use addProductToCart(), available already from /public/js/utils.js
  // for showing a notification of the product's creation, /public/js/utils.js  includes createNotification() function
};

(async() => {
  const productContainerOG = document.getElementById('products-container');
  const productTemplate = document.getElementById('product-template');

  const allProducts = await getJSON("api/products");

  //going through product information
  allProducts.forEach(product => {
    
    //template clone
  const productContainer = productTemplate.content.cloneNode(true);
  
  //getting elements from html  
  const name_ = productContainer.querySelector('.product-name');
  const desc_ = productContainer.querySelector('.product-description');
  const price_ = productContainer.querySelector('.product-price');
  const button_ = productContainer.querySelector('button');

    //adding id to elements
    name_.id = `name-${product._id}`;
    desc_.id = `description-${product._id}`;
    price_.id = `price-${product._id}`;
    button_.id = `add-to-cart-${product._id}`;
    
    //making text appear 
    name_.innerText = product.name;
    desc_.innerText = product.description;
    price_.innerText = product.price;
    
    productContainerOG.append(productContainer);
    //if clicked
    button_.addEventListener('click', () => {addToCart(product._id, product.name)});
  });

  //TODO 9.2 
  // - get the 'products-container' element from the /products.html *
  // - get the 'product-template' element from the /products.html  *
  // - save the response from await getJSON(url) to get all the products. getJSON(url) is  *
  // - available to this script in products.html, as "js/utils.js" script has been added to products.html before this script file 
  // - then, loop throug the products in the response, and for each of the products:
  //    * clone the template * 
  //    * add product information to the template clone
  //    * remember to add an event listener for the button's 'click' event, and call addToCart() in the event listener's callback
  // - remember to add the products to the the page
})();