

const socket = io();


const updateProductList = (products) => {
 
  const productList = document.querySelector('#productList');
  productList.innerHTML = ''; 

  products.forEach(product => {
    const productItem = document.createElement('li');
    productItem.innerHTML = `
      <h2>${product.title}</h2>
      <p>Price: ${product.price}</p>
      <p>Description: ${product.description}</p>
      <!-- You can add more details here -->
    `;
    productList.appendChild(productItem);
  });
};


socket.on('newProduct', (newProduct) => {

  updateProductList([newProduct, ...products]);
});


socket.on('productDeleted', (productId) => {
 
  products = products.filter(product => product.id !== productId);
  updateProductList(products);
});
