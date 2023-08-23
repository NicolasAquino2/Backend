
// socket.js
const socket = io();
const updateProductListUI = require('./realTimeProducts'); // Asegúrate de que la ruta sea correcta

socket.on('newProduct', (newProduct) => {
  // Actualizar la lista de productos en tiempo real
  updateProductListUI([newProduct]);
  console.log(newProduct)
});

// Otras funciones y lógica relacionada con socket.io



// Listen for the 'newProduct' event
// socket.js


socket.on('newProduct', (newProduct) => {

  updateProductListUI([newProduct]);
});

// Otras funciones y lógica relacionada con socket.io


// Listen for the 'productDeleted' event
socket.on('productDeleted', (productId) => {
  // Update the UI by removing the deleted product
  products = products.filter(product => product.id !== productId);
  updateProductList(products);
});
