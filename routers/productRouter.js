const { Router } = require('express') 
const productRouter = Router()
const ProductManager = require('../desafio2')
const manager = new ProductManager('./data.json');

productRouter.get('/', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit);
      const products = await manager.getProducts();
  
      if (isNaN(limit)) {
        res.json(products);
      } else {
        res.json(products.slice(0, limit));
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
     
    }
  });
  
  productRouter.get('/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const product = await manager.getProductById(productId);
  
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  productRouter.post('/', async (req, res) => {
    try {
      const productData = req.body; 
      
      const products = await manager.getProducts();
    
      const newProductId = products.length + 1;
      
      const newProduct = { ...productData, id: newProductId };
      
      const createdProduct = await manager.addProduct(newProduct);
      
      res.status(201).json(createdProduct); 
    } catch (error) {
      console.error('Error al crear el producto:', error);
      res.status(500).json({ error: 'Error al crear el producto' });
}
    
});
    productRouter.put('/:pid', async (req, res) => {
        try {
          const productId = parseInt(req.params.pid); 
          const updatedProductData = req.body; 
      
        
          const existingProduct = await manager.getProductById(productId);
          
          if (existingProduct) {
            
            const updatedProduct = manager.updateProduct(productId, updatedProductData); 
            
            res.json(updatedProduct); 
          } else {
            res.status(404).json({ error: 'Producto no encontrado' }); 
          }
        } catch (error) {
          console.error('Error al actualizar el producto:', error);
          res.status(500).json({ error: 'Error al actualizar el producto' });
        }
      });
      
 
      productRouter.delete('/:pid', async (req, res) => {
        try {
          const productId = parseInt(req.params.pid); 
          const products = await manager.getProducts();
          const productIndex = products.findIndex(product => product.id === productId);
      
          if (productIndex !== -1) {
            
            products.splice(productIndex, 1); 
      
            manager.guardarProductos(products);
      
            res.json({ message: 'Producto eliminado correctamente' }); 
          } else {
            res.status(404).json({ error: 'Producto no encontrado' });
          }
        } catch (error) {
          console.error('Error al eliminar el producto:', error);
          res.status(500).json({ error: 'Error al eliminar el producto' });
        }
      });
    
  module.exports = productRouter 