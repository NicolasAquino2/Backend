const mongoose = require('mongoose');
const ProductManagerMongo = require('./desafio2'); // Asegúrate de tener la ruta correcta

const MONGODB_CONECT = 'mongodb+srv://nicolasAquino:yosoynicoa@cluster0.1upobe4.mongodb.net/Products?retryWrites=true&w=majority'; // Tu conexión a la base de datos

mongoose.connect(MONGODB_CONECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productManager = new ProductManagerMongo();

const productsData = [
  {
    title: 'remera',
    description: 'Descripción del remera',
    price: 100,
    code: 1001,
    stock: 50,
    category: 'remeras',
    thumbnails: [],
   
  },
 
  {
    title: 'bufanda',
    description: 'Descripción del bufanda',
    price: 80,
    code: 1005,
    stock: 50,
    category: 'bufanda',
    thumbnails: [],
  },

  {
    title: 'short',
    description: 'Descripción del short',
    price: 120,
    code: 1004,
    stock: 50,
    category: 'short',
    thumbnails: [],
  },

  {
    title: 'buzo',
    description: 'Descripción del buzo',
    price: 200,
    code: 1003,
    stock: 50,
    category: 'buzo',
    thumbnails: [],
  },

  {
    title: 'pantalon',
    description: 'Descripción del pantalon',
    price: 150,
    code: 1002,
    stock: 50,
    category: 'pantalones',
    thumbnails: [],
  },
];

async function createProducts() {
  try {
    for (const productData of productsData) {
      await productManager.addProduct(productData);
    }
    console.log('Productos creados exitosamente');
  } catch (error) {
    console.error('Error al crear los productos:', error);
  } finally {
    mongoose.disconnect();
  }
}

createProducts();

module.exports = productManager;
