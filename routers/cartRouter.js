const express = require('express');
const cartRouter = express.Router();
const CartManager = require('../cart');

const cartManager = new CartManager('./cart.json');


cartRouter.post('/', (req, res) => {
  const cartId = cartManager.lastCartId + 1;
  const cart = { id: cartId, products: [] };
  cartManager.carts.push(cart);
  cartManager.lastCartId = cartId;
  cartManager.saveCarts();
  res.status(201).json(cart);
});

cartRouter.get('/:cid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = cartManager.getCartById(cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

cartRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = 1;

  const cart = cartManager.getCartById(cartId);
  if (!cart) {
    res.status(404).json({ error: 'Carrito no encontrado' });
    return;
  }

  const existingProduct = cart.products.find((product) => product.id === productId);
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    const newProduct = { id: productId, quantity };
    cart.products.push(newProduct);
  }

  cartManager.saveCarts();
  res.json(cart);
});

module.exports = cartRouter;
