const ProductsService = require('../services/ProductsService')
class ProductsController {
    constructor() {
        this.service = new ProductsService();
    }

    async getProducts(req, res) {
        const filters = {}
        const { page = 1, limit = 10, sort, category, availability } = req.query
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
        const availabilityOption = availability === 'available' ? true : availability === 'notavailable' ? false : undefined;
        const query = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption
        }
        try {
            if (category) {
                filters.category = category
            }

            if (availability) {
                filters.status = availabilityOption;
            }

            const products = await this.service.getProducts(filters, query)

            if (products.length === 0) {
                return res.sendError(404, 'Error fetching products', 'Products not found')
            }

            const generatePageLink = (page) => {
                const newQuery = { ...req.query, ...filters, page: page };
                return '/api/products?' + new URLSearchParams(newQuery).toString();
            };

            const result = {
                products: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? generatePageLink(products.prevPage) : null,
                nextLink: products.hasNextPage ? generatePageLink(products.nextPage) : null
            }

            return res.sendSuccess(200, result);
        } catch (error) {
            return res.sendError(500, 'Error fetching products', error);
        }
    }

    async getProductById(req, res) {
        const { pid } = req.params
        try {
            const product = await this.service.getProductById(pid);
            return res.sendSuccess(200, product);
        } catch (error) {
            if (error.message === 'Product not found') {
                return res.sendError(404, 'Error fetching product', error.message);
            }
            return res.sendError(500, 'Error fetching product', error);
        }
    }

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            (req.files && Array.isArray(req.files))
                ? newProduct.thumbnails = req.files.map((file) => file.path)
                : newProduct.thumbnails = [];

            await this.service.addProduct(newProduct);
            return res.sendSuccess(201, 'Successfully added');
        } catch (error) {
            if (error.message === `There is already a product with the code '${newProduct.code}'` || error.message === 'All fields are required') {
                return res.sendError(409, 'Error adding product', error.message);
            }
            return res.sendError(500, 'Error adding product', error);
        }
    }

    async updateProduct(req, res) {
        const { pid } = req.params
        const updatedProduct = req.body
        try {
            await this.service.updateProduct(pid, updatedProduct);
            return res.sendSuccess(200, 'Successfully updated');
        } catch (error) {
            if (error.message === 'Product not found') {
                return res.sendError(404, 'Error updating product', error.message);
            }
            if (error.code === 11000) {
                return res.sendError(409, `The code ${updatedProduct.code} is already in use`);
            }
            return res.sendError(500, 'Error updating product', error);
        }
    }

    async deleteProduct(req, res) {
        const { pid } = req.params
        try {
            await this.service.deleteProduct(pid);
            return res.sendSuccess(200, 'Successfully deleted');
        } catch (error) {
            if (error.message === 'Product not found') {
                return res.sendError(404, 'Error deleting product', error.message);
            }
            return res.sendError(500, 'Error deleting product', error);
        }
    }
}

module.exports = ProductsController;