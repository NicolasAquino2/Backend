const ProductsController = require('../controllers/ProductsController')
const productsController = new ProductsController()
const uploader = require('../middlewares/uploader')
const BaseRouter = require('./BaseRouter')

class ProductsRouter extends BaseRouter {
    init() {
        this.get('/', productsController.getProducts.bind(productsController))
        this.get('/:pid', productsController.getProductById.bind(productsController))
        this.post('/', uploader.array('thumbnails'), productsController.addProduct.bind(productsController))
        this.put('/:pid', productsController.updateProduct.bind(productsController))
        this.delete('/:pid', productsController.deleteProduct.bind(productsController))
    }
}

module.exports = ProductsRouter
