const fs = require('fs');

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.lastCartId = 0;

    // Leer los carritos existentes en el archivo al iniciar
    this.loadCarts();
  }

  createCart() {
    this.lastCartId++;
    const cartId = this.lastCartId.toString();
    const newCart = { id: cartId, products: [] };
    this.carts.push(newCart);
    this.saveCarts();
  
    return cartId;
  }
  

  getCartById(cartId) {
    const parsedCartId = cartId.toString();
    return this.carts.find((cart) => cart.id === parsedCartId);
  }

  addToCart(cartId, productId, quantity) {
    const cart = this.getCartById(cartId);
    if (!cart) {
      console.log(`Error: El carrito con ID ${cartId} no existe.`);
      return;
    }
  
    const existingProductIndex = cart.products.findIndex((p) => p.product === productId);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      const newProduct = { product: productId, quantity: 1 };
      cart.products.push(newProduct);
    }
  
    this.saveCarts();
    console.log(`Producto con ID ${productId} agregado al carrito ${cartId}.`);
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
  
  
  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      if (data) {
        this.carts = JSON.parse(data);
        // Actualizar lastCartId según el carrito con el ID más alto encontrado
        const cartIds = this.carts.map((cart) => parseInt(cart.id));
        this.lastCartId = Math.max(...cartIds);
      }
    } catch (err) {
      console.log('Error al cargar los carritos:', err);
    }
  }
  
  getCarts() {
    return this.carts;
  }
  

}

module.exports = CartManager;
