const { Router } = require('express')
const CartManager = require('../dao/CartsManagerMongo')
/* const cartManager = new CartManager('./src/carrito.json') */
const cartManager = new CartManager()
const cartsRouter = Router()


cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        return res.status(200).json({ status: 'success', payload: carts })
    } catch (error) {
        const commonErrorMessage = 'Error al obtener los carritos'
        if (error.message = 'No se encuentran carritos en nuestra base de datos') {
            return res.status(404).json({ status: 'error', error: commonErrorMessage, message: error.message });
        }
        return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
    }
})

cartsRouter.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    try {
        const cart = await cartManager.getCartById(cid)
        return res.status(200).json({ status: 'success', payload: cart })
    } catch (error) {
        const commonErrorMessage = 'Error al obtener el carrito'
        if (error.message = 'No se encuentra el carrito') {
            return res.status(404).json({ status: 'error', error: commonErrorMessage, message: error.message });
        }
        return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
    }
})

cartsRouter.post('/', async (req, res) => {
    try {
        await cartManager.addCart();
        return res.status(201).json({ status: 'success', message: 'Carrito agregado exitosamente' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al agregar el carrito', message: error.message });
    }
})

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try {
        await cartManager.addProductToCart(cid, pid)
        return res.status(201).json({ status: 'success', message: 'Se ha guardado el producto en el carrito exitosamente' })
    } catch (error) {
        const commonErrorMessage = 'Error al guardar el producto en el carrito'
        if (error.message === 'Producto no encontrado en el inventario' || 'No se encuentra el carrito') {
            return res.status(404).json({ status: 'error', error: commonErrorMessage, message: error.message });
        }
        return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
    }
})

cartsRouter.put('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const newProducts = req.body.products;
    try {
        await cartManager.updateCartProducts(cid, newProducts);
        return res.status(200).json({ status: 'success', message: 'Productos del carrito actualizados' });
    } catch (error) {
        const commonErrorMessage = 'Error al actualizar los productos del carrito';
        if (error.message === 'No se encuentra el carrito') {
            return res.status(404).json({ status: 'error', error: commonErrorMessage, message: error.message });
        }
        return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
    }
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const { quantity } = req.body
    try {
        await cartManager.updateCartProduct(cid, pid, quantity)
        return res.status(201).json({ status: 'success', message: 'Se ha actualizado la cantidad del producto en el carrito', })
    } catch (error) {
        const commonErrorMessage = 'Error al actualizar el producto del carrito'
        if (error.message === 'Producto no encontrado en el inventario' || 'No se encuentra el carrito' || 'El producto que intentas actualizar no existe en el carrito') {
            return res.status(404).json({ status: 'error', error: commonErrorMessage, message: error.message });
        }
        return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
    }
})

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try {
        await cartManager.deleteProductFromCart(cid, pid)
        return res.status(201).json({ status: 'success', message: 'Se ha eliminado el producto del carrito' })
    } catch (error) {
        const commonErrorMessage = 'Error al eliminar el producto del carrito'
        if (error.message === 'Producto no encontrado en el inventario' || 'No se encuentra el carrito' || 'El producto que intentas eliminar no existe en el carrito') {
            return res.status(404).json({ status: 'error', error: commonErrorMessage, message: error.message });
        }
        return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
    }
})

cartsRouter.delete('/:cid', async (req, res) => {
    const cid = req.params.cid
    try {
        await cartManager.deleteProductsFromCart(cid)
    } catch (error) {
        const commonErrorMessage = 'Error al eliminar los productos del carrito'
        if (error.message === 'No se encuentra el carrito') {
            return res.status(404).json({ status: 'error', error: commonErrorMessage, message: error.message });
        }
        return res.status(500).json({ status: 'error', error: commonErrorMessage, message: error.message });
    }
})
module.exports = cartsRouter