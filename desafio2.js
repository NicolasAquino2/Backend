const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(product) {
    const data = await fs.promises.readFile(this.path, 'utf-8');
    this.products = JSON.parse(data);

    const newProduct = {
      id: this.products.length + 1,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock
    };

    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      return console.log("Error: Todos los campos son obligatorios.");
    }

    const existingProduct = this.products.find((p) => p.code === product.code);
    if (existingProduct) {
      return console.log("Error: El código del producto ya existe.");
    }

    this.products.push(newProduct);
    this.guardarProductos();
    console.log("Producto agregado correctamente.");
  }
  async addProductDos(product) {
    const data = await fs.promises.readFile(this.path, 'utf-8');
    this.products = JSON.parse(data);

    const newProduct = {
      id: this.products.length + 1,
      title: product.title,
      price: product.price
     
    };

    if (!product.title || !product.price) {
      return console.log("Error: Todos los campos son obligatorios.");
    }

    this.products.push(newProduct);
    this.guardarProductos();
    console.log("Producto agregado correctamente.");
    
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      return this.products;
    } catch (error) {
      console.log('Error al leer el archivo', { error });
      this.products = [];
      return this.products;
    }
  }

  getProductById(id) {
    return this.getProducts()
      .then((products) => {
        const product = products.find((product) => product.id === id);
        if (product) {
          return product;
        } else {
          console.log('Producto no encontrado');
        }
      })
      .catch((error) => {
        console.error('Error al obtener el producto:', error);
      });
  }

  updateProduct(id, updateProduct) {
    this.getProducts()
      .then((products) => {
        const productIndex = products.findIndex((product) => product.id === id);

        if (productIndex === -1) {
          return console.log('Error al actualizar, no se encontró un producto');
        }

        products[productIndex].title = updateProduct.title;
        products[productIndex].description = updateProduct.description;
        products[productIndex].price = updateProduct.price;
        products[productIndex].thumbnail = updateProduct.thumbnail;
        products[productIndex].code = updateProduct.code;
        products[productIndex].stock = updateProduct.stock;

        this.guardarProductos(products);
        console.log('Producto actualizado');
      })
      .catch((e) => {
        console.log('Error al obtener el producto:', e);
        return e;
      });
  }

  async deleteProduct(id) {
    const data = await fs.promises.readFile(this.path, 'utf-8');
    this.products = JSON.parse(data);

    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return console.log('Producto no encontrado');
    }

    this.products.splice(productIndex, 1);
    this.guardarProductos();

    console.log('Producto eliminado');
  }

  guardarProductos(products) {
    try {
      const data = JSON.stringify(products || this.products, null, 2);
      fs.writeFileSync(this.path, data, 'utf-8');
      console.log('Productos guardados correctamente');
    } catch (err) {
      console.log('Error al guardar los productos');
    }
  }
}

module.exports = ProductManager;
