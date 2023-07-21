async function deleteProduct(productId) {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
  
      if (data.message === 'Producto eliminado') {
        const productElement = document.getElementById(`product-${productId}`);
        if (productElement) {
          productElement.remove();
          console.log('Producto eliminado correctamente');
        }
        socket.emit('productDeleted', productId);
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  }
  document.addEventListener('click', async (event) => {
    if (event.target.matches('.delete-button')) {
      const productId = event.target.dataset.productId;
      deleteProduct(parseInt(productId));
    }
  });
  