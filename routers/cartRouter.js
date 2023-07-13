const express = require('express');
const cartRouter = express.Router();
const CartManager = require('../cart');

const cartManager = new CartManager('./cart.json');

cartRouter.post('/', async (req, res) => {
  const cartId = cartManager.createCart();
  const cart = await cartManager.getCartById(cartId);
  cartManager.saveCarts();
  res.status(201).json(cart);
});

cartRouter.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = await cartManager.getCartById(cartId);
  if (cart) {
    const carts = cartManager.getCarts();
    res.json({ cart, allCarts: carts });
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = 1;

  await cartManager.addToCart(cartId, productId, quantity);
  cartManager.saveCarts();
  const cart = await cartManager.getCartById(cartId);
  res.json(cart);
});

module.exports = cartRouter;
