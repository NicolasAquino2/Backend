const { Router } = require('express');
const productRouter = Router();
const ProductManagerMongo = require('../desafio2');
const manager = new ProductManagerMongo();

productRouter.get('/', async (req, res) => {
  try {
    const limit =req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const query = req.query.query || '';

  



    const filter = {
      $or: [
        { category: query },
        { status: query }
      ]
    };

    const totalProducts = await manager.model.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
console.log(totalProducts)
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const prevLink = hasPrevPage ? `/realTimeProducts?limit=${limit}&page=${page - 1}&sort=${req.query.sort}&query=${query}` : null;
const nextLink = hasNextPage ? `/realTimeProducts?limit=${limit}&page=${page + 1}&sort=${req.query.sort}&query=${query}` : null;

    const products = await manager.model
      .find(filter)
      .sort({ price: sort })
      .skip((page - 1) * limit)
      .limit(limit);

    const response = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page - 1,
      nextPage: page + 1,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'An error occurred' });
  }
});

productRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await manager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

productRouter.post('/', async (req, res) => {
  try {
    const productData = req.body;

    const products = await manager.getProducts();

    const newProductId = products.length + 1;

    const newProduct = { ...productData, id: newProductId };

    const createdProduct = await manager.addProduct(newProduct);

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

productRouter.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProductData = req.body;

    const existingProduct = await manager.getProductById(productId);

    if (existingProduct) {
      const updatedProduct = await manager.updateProduct(productId, updatedProductData);

      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

module.exports = productRouter;
