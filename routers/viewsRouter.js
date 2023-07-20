

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
    const products = await productManager.getProducts();
    io.emit('newProduct', productData);
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = viewRouter;

