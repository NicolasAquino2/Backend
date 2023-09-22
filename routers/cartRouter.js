const CartController = require('../controllers/CartsController');
const BaseRouter = require('./BaseRouter');


class CartsRouter extends BaseRouter {
    init() {
        const cartsController = new CartController()
        this.get('/', cartsController.getCarts.bind(cartsController))
        this.get('/:cid', cartsController.getCartById.bind(cartsController))
        this.post('/', cartsController.addCart.bind(cartsController))
        this.post('/:cid/products/:pid', cartsController.addProductToCart.bind(cartsController))
        this.put('/:cid', cartsController.updateCartProducts.bind(cartsController))
        this.put('/:cid/products/:pid', cartsController.updateCartProduct.bind(cartsController))
        this.delete('/:cid/products/:pid', cartsController.deleteProductFromCart.bind(cartsController))
        this.delete('/:cid', cartsController.deleteProductsFromCart.bind(cartsController))
    }
}

module.exports = CartsRouter