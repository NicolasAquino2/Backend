const socket = io();

socket.on('newProduct', (product) => {
  const productList = document.getElementById('productList');
  const li = document.createElement('li');
  li.textContent = `Título: ${product.title} - Precio: ${product.price}`;
  productList.appendChild(li);
});

document.addEventListener('DOMContentLoaded', () => {
  const addProductForm = document.getElementById('addProductForm');
  const addProductButton = document.getElementById('addProductButton');

  addProductButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const title = addProductForm.querySelector('[name="title"]').value;
    const price = addProductForm.querySelector('[name="price"]').value;

    if (!title || !price) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const productData = { title, price };
    
    try {
      const response = await fetch('/realtimeproducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        addProductForm.reset();
        
        // Emitir el evento solo si la solicitud POST fue exitosa
        socket.emit('newProduct', productData);

        alert('Producto agregado correctamente.');
      } else {
        alert('Error al agregar el producto.');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  });
});
