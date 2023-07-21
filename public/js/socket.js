const socket = io();



socket.on('newProduct', (product) => {
  const productList = document.getElementById('productList');
  const li = document.createElement('li');
  li.textContent = `${product.title} - ${product.price}`;
  productList.appendChild(li);
});

socket.on('productDeleted', (deletedProductId) => {
  const productElement = document.getElementById(`product-${deletedProductId}`);
  if (productElement) {
    productElement.remove();
  }
});


