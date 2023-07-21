
const express = require('express');
const viewRouter = express.Router();
const ProductManager = require('../desafio2');
const { Server } = require('socket.io');

const productManager = new ProductManager('./data.json');
const io = new Server();

viewRouter.get('/home', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

viewRouter.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

viewRouter.post('/realtimeproducts', async (req, res) => {
  try {
    const productData = req.body;
    await productManager.addProductDos(productData);
    io.emit('newProduct', productData);
    res.redirect('/realtimeproducts'); 
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).send('Error interno del servidor');
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
  })


module.exports = viewRouter;

