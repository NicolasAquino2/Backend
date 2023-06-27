const express = require ('express')
const ProductManager = require('./desafio2')
const manager = new ProductManager('./data.json')
const app = express()


app.get('/products', async (req, res) => {
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
  
  app.get('/products/:pid', async (req, res) => {
    try {
      const productId = parseInt(req.params.pid);
      const product = await manager.getProductById(productId);
  
      if (product) {
        res.json(product);
      } else {
        console.log('producto no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener el producto:', error);
     
    }
  });
  
  app.listen(8080, () => {
    console.log('servidor express escuchando en el puerto 8080')
})
 


