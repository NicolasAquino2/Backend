const ProductManager = require('../dao/ProductManagerMongo')

class ProductsService {
    constructor() {
        this.productManager = new ProductManager();
    }

    async getProducts(filters, query) {
        return this.productManager.getProducts(filters, query);
    }

    async getProductById(id) {
        return this.productManager.getProductById(id);
    }

    async addProduct(data) {
        const exist = await this.productManager.getProductByCode(data.code);

        if (exist) {
            throw new Error(`There is already a product with the code '${data.code}'`);
        }

        const newProduct = await this.productManager.addProduct(data);
        return newProduct
    }

    async updateProduct(id, data) {
        return this.productManager.updateProduct(id, data);
    }

    async deleteProduct(id) {
        return this.productManager.deleteProduct(id);
    }
}

module.exports = ProductsService
