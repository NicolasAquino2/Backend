// public/realTimeProducts.js
const socket = io();

// Función para actualizar la lista de productos en la interfaz de usuario
function updateProductListUI(products) {
  const productList = document.getElementById('productList');



  // Agregar los productos actualizados a la lista
  products.forEach(product => {
    const productRow = document.createElement('tr');
    productRow.innerHTML = `
      <td>${product.title}</td>
      <td>${product.price}</td>
      <td>${product.category}</td>
    `;
    productList.appendChild(productRow);
  });
}

// Escuchar el evento 'newProduct' y actualizar la interfaz de usuario
socket.on('newProduct', (newProduct) => {
  updateProductListUI([newProduct]);
});


