const CartsService = require('../services/CartsService')

class CartsController {
    constructor() {
        this.service = new CartsService()
    }

    async getCarts(req, res) {
        try {
            const carts = await this.service.getCarts()
            if (carts.length === 0) {
                return res.sendError(404, 'Carts not found')
            }
            return res.sendSuccess(200, carts)
        } catch (error) {
            return res.sendError(500, 'Error fetching carts', error);
        }
    }

    async getCartById(req, res) {
        const { cid } = req.params
        try {
            const cart = await this.service.getCartById(cid)
            if (cart.length === 0) {
                return res.sendError(404, 'Error fetching cart', 'Cart not found')
            }
            return res.sendSuccess(200, cart)
        } catch (error) {
            return res.sendError(500, 'Error fetching cart', error);
        }
    }

    async addCart(req, res) {
        try {
            await this.service.addCart()
            return res.sendSuccess(201, 'Successfully added')
        } catch (error) {
            return res.sendError(500, 'Error adding the cart', error);
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params
        try {
            await this.service.addProductToCart(cid, pid)
            return res.sendSuccess(201, 'Successfully added')
        } catch (error) {
            if (error.message = 'Product not found in inventory' || error.message === 'Cart not found') {
                return res.sendError(404, 'Error adding the product to cart', error.message);
            }
            return res.sendError(500, 'Error adding the product to cart', error);
        }
    }

    async updateCartProducts(req, res) {
        const { newProducts } = req.body
        const { cid } = req.params
        try {
            if (!newProducts) {
                return res.sendError(409, 'Cannot update product list without any products')
            }
            await this.service.updateCartProducts(cid, newProducts)
            return res.sendSuccess(200, 'Successfully updated')
        } catch (error) {
            return res.sendError(500, 'Error updating cart', error);
        }
    }

    async updateCartProduct(req, res) {
        const { cid, pid } = req.params
        const { quantity } = req.body
        try {
            if (quantity === null || quantity === undefined) {
                return res.sendError(409, 'Cannot update product without quantity')
            }
            if (quantity < 0) {
                return res.sendError(409, 'The quantity cannot be less than zero')
            }
            await this.service.updateCartProduct(cid, pid, quantity)
            return res.sendSuccess(200, 'Successfully updated')
        } catch (error) {
            if (error.message === 'Product not found in inventory' || error.message === 'Cart not found' || error.message === 'The product you are trying to update does not exist in the cart') {
                return res.sendError(404, 'Error updating cart products', error.message)
            }
            return res.sendError(500, 'Error updating cart products', error)
        }
    }

    async deleteProductFromCart(req, res) {
        const { cid, pid } = req.params
        try {
            await this.service.deleteProductFromCart(cid, pid);
            return res.sendSuccess(200, 'Successfully deleted');
        } catch (error) {
            if (error.message === 'Product not found in inventory' || error.message === 'Cart not found' || error.message === 'The product you are trying to delete does not exist in the cart') {
                return res.sendError(404, error.message);
            }
            return res.sendError(500, 'Error deleting product from cart', error);
        }
    }

    async deleteProductsFromCart(req, res) {
        const { cid } = req.params
        try {
            await this.service.deleteProductsFromCart(cid);
            return res.sendSuccess(200, 'Successfully deleted');
        } catch (error) {
            if (error.message === 'Cart not found') {
                return res.sendError(404, error.message);
            }
            if (error.message === 'No products to delete') {
                return res.sendError(409, error.message);
            }
            return res.sendError(500, 'Error deleting cart products', error);
        }
    }
}

module.exports = CartsController