const fs = require('fs');



  class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }
  

 async addProduct(product) {

  const data = await fs.promises.readFile(this.path, 'utf-8')
  this.products = JSON.parse(data)
  
const newProduct = {
        id: this.products.length + 1, 
        title: product.title,
        description: product.description,
        price: product.price,
        thumbanail: product.thumbnails,
        code: product.code,
        stock: product.stock
}
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnails ||
      !product.code ||
      !product.stock
    ) {
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

  async getProducts() {
    try {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        this.products = JSON.parse(data)
        return this.products
    } catch (error) {
        console.log('Error al leer el archivo', { error })
        this.products =  []
         
        return this.products
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
          return console.log('error al actualizar, no se encontro un producto');
        }

        products[productIndex].title = updateProduct.title;
        products[productIndex].description = updateProduct.description;
        products[productIndex].price = updateProduct.price;
        products[productIndex].thumbnails = updateProduct.thumbnails;
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
    const data = await fs.promises.readFile(this.path, 'utf-8')
    this.products = JSON.parse(data)
    
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





const manager = new ProductManager('./data.json');

manager.addProduct({
  title: "Zapatillas",
  description: "Zapatillas deportivas",
  price: 59.99,
  thumbnails: "img/zapatillas.jpg",
  code: "2345",
  stock: 10,
});

manager.addProduct({
  title: "remeron",
  description: "remera deportivas",
  price: 80,
  thumbnails: "img/zapatillas.jpg",
  code: "9809",
  stock: 3,
});

manager.addProduct({
  title: "musculosa",
  description: "musculosa deportivas",
  price: 80,
  thumbnails: "img/musculosa.jpg",
  code: "8760",
  stock: 10,
});

manager.addProduct({
  title: "buzo",
  description: "buzo de algodon",
  price: 100,
  thumbnails: "img/buzo.jpg",
  code: "7635",
  stock: 100,
}); 

manager.addProduct({
  title: "medias",
  description: "medias negras",
  price: 88,
  thumbnails: "img/medias.jpg",
  code: "0936",
  stock: 100,
});

manager.addProduct({
  title: "campera",
  description: "campera desportiva",
  price: 200,
  thumbnails: "img/campera.jpg",
  code: "1463",
  stock: 388,
});

manager.addProduct({
  title: "musculosa",
  description: "musculosa deportivas",
  price: 80,
  thumbnails: "img/musculosa.jpg",
  code: "8760",
  stock: 10,
});

manager.addProduct({
  title: "chaqueta",
  description: "chaqueta de cuero",
  price: 200,
  thumbnails: "img/chaqueta.jpg",
  code: "6730",
  stock: 10,
});

manager.addProduct({
  title: "short",
  description: "short deportivas",
  price: 80,
  thumbnails: "img/short.jpg",
  code: "6301",
  stock: 50,
});

manager.addProduct({
  title: "camperon",
  description: "camperon de invierno",
  price: 300,
  thumbnails: "img/camperon.jpg",
  code: "1835",
  stock: 102,
});

manager.addProduct({
  title: "polera",
  description: "polera de lana",
  price: 200,
  thumbnails: "img/polera.jpg",
  code: "3832",
  stock: 100,
});





module.exports = ProductManager

