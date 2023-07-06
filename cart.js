const fs = require('fs');
const ProductManager = require('./desafio2');

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.lastCartId = 0;
  }

  createCart() {
    this.lastCartId++;
    const cartId = this.lastCartId.toString();
    const newCart = { id: cartId, products: [] };
    this.carts.push(newCart);
    this.saveCarts();

    return cartId;
  }

  async addToCart(cartId, productId, quantity) {
    const productManager = new ProductManager('./data.json');
    const product = await productManager.getProductById(productId);

    if (!product) {
      console.log(`Error: El producto con ID ${productId} no existe.`);
      return;
    }

    const cart = this.getCartById(cartId);
    if (!cart) {
      console.log(`Error: El carrito con ID ${cartId} no existe.`);
      return;
    }

    const existingProduct = cart.products.find((p) => p.id === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      const newProduct = { id: productId, quantity };
      cart.products.push(newProduct);
    }

    this.saveCarts();
    console.log(`Producto con ID ${productId} agregado al carrito ${cartId}.`);
  }

  getCartById(cartId) {
    return this.carts.find((cart) => cart.id === cartId);
  }

  saveCarts() {
    try {
      const data = JSON.stringify(this.carts, null, 2);
      fs.writeFileSync(this.path, data, 'utf-8');
      console.log('Carritos guardados correctamente.');
    } catch (err) {
      console.log('Error al guardar los carritos:', err);
    }
  }
}

module.exports = CartManager;