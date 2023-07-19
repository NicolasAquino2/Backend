const socket = io();

socket.on('newProduct', (product) => {
  const productList = document.getElementById('productList');
  const li = document.createElement('li');
  li.textContent = `${product.title} - ${product.price}`;
  productList.appendChild(li);
});

socket.on('productDeleted', (productId) => {
  const productList = document.getElementById('productList');
  const productItem = productList.querySelector(`li[data-product-id="${productId}"]`);
  if (productItem) {
    productItem.remove();
  }
});
