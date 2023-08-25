

const socket = io();
const updateProductListUI = require('./realTimeProduts'); 

socket.on('newProduct', (newProduct) => {
  updateProductListUI([newProduct]);
  console.log(newProduct)
});



socket.on('newProduct', (newProduct) => {

  updateProductListUI([newProduct]);
});





socket.on('productDeleted', (productId) => {
  products = products.filter(product => product.id !== productId);
  updateProductList(products);
});
