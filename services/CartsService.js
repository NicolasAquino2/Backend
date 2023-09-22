const CartsManager = require('../dao/CartsManagerMongo')
const productModel = require('../dao/ProductManagerMongo')

class CartsService {
    constructor() {
        this.cartsManager = new CartsManager();
    }

    async getCarts() {
        try {
            return this.cartsManager.getCarts();
        } catch (error) {
            throw error
        }
    }

    async getCartById(id) {
        try {
            return this.cartsManager.getCartById(id)
        } catch (error) {
            throw error
        }
    }

    async addCart() {
        try {
            return this.cartsManager.addCart()
        } catch (error) {
            throw error
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const product = await productModel.findById(pid)
            const cart = await this.cartsManager.getCartById(cid)

            if (!cart) {
                throw new Error('Cart not found')
            }

            if (!product) {
                throw new Error('Product not found in inventory')
            }

            return this.cartsManager.addProductToCart(cid, pid)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async updateCartProducts(cid, newProducts) {
        try {
            const products = await productModel.find()
            const cart = await this.cartsManager.getCartById(cid)

            if (!cart) {
                throw new Error('Cart not found');
            }

            newProducts.forEach(p => {
                const pId = p.product;
                const quantity = p.quantity;

                if (!pId || !quantity) {
                    throw new Error('Each product must contain its ID and quantity');
                }

                const inventoryProductId = products.find(p => p._id.toString() === pId)

                if (!inventoryProductId) {
                    throw new Error('Check the IDs in your cart as they do not correspond to our inventory data')
                }

            })

            return this.cartsManager.updateCartProducts(cid, newProducts)
        } catch (error) {
            throw error;
        }
    }

    async updateCartProduct(cid, pid, quantity) {
        try {
            const product = await productModel.findById(pid)
            const cart = await this.cartsManager.getCartById(cid)

            if (!cart) {
                throw new Error('Cart not found');
            }

            if (!product) {
                throw new Error('Product not found in inventory')
            }

            const existingProductInCart = cart[0].products.findIndex((p) => p.product._id.toString() === pid);

            if (existingProductInCart === -1) {
                throw new Error('The product you are trying to update does not exist in the cart');
            }

            return this.cartsManager.updateCartProduct(cid, pid, quantity);
        } catch (error) {
            throw error
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const product = await productModel.findById(pid)
            const cart = await this.cartsManager.getCartById(cid)

            if (!cart) {
                throw new Error('Cart not found');
            }

            if (!product) {
                throw new Error('Product not found in inventory')
            }

            const existingProductInCart = cart[0].products.findIndex((p) => p.product._id.toString() === pid);
            if (existingProductInCart === -1) {
                throw new Error('The product you are trying to delete does not exist in the cart')
            }

            return this.cartsManager.deleteProductFromCart(cid, pid)
        } catch (error) {
            throw error
        }
    }

    async deleteProductsFromCart(cid) {
        try {
            const cart = await this.cartsManager.getCartById(cid)

            if (!cart) {
                throw new Error('Cart not found');
            }

            if (cart[0].products.length === 0) {
                throw new Error('No products to delete');
            }

            return this.cartsManager.deleteProductsFromCart(cid)
        } catch (error) {
            throw error
        }
    }
}

module.exports = CartsService
