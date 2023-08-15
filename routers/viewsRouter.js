const express = require('express');
const viewRouter = express.Router();
const ProductManagerMongo = require('../desafio2'); 
const { Server } = require('socket.io');

const io = new Server();
const productManager = new ProductManagerMongo(io); 

viewRouter.get('/home', async (req, res) => {
  try {
    const products = await productManager.getProducts(); 
    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});


viewRouter.get('/realTimeProducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
   
    res.render('realTimeProducts', { products }); 
  } catch (error) {
    res.status(500).send('Error al cargar los productos');
  }
});


viewRouter.post('/', async (req, res) => {
  try {
    const productData = req.body;
    const createdProduct = await productManager.addProduct(productData); 

    io.emit('newProduct', createdProduct);
    
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

viewRouter.delete('/api/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    await productManager.deleteProduct(productId); 
    res.json({ message: 'Producto eliminado' });
    req.app.get('io').emit('productDeleted', productId);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});


module.exports = viewRouter;
