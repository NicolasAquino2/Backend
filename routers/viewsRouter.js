const BaseRouter = require('./BaseRouter')
const ProductManager = require('../dao/ProductManagerMongo')
const productManager = new ProductManager()
const CartManager = require('../dao/CartsManagerMongo');
const cartManager = new CartManager()
const { requireLogin, requireAdmin, haveSession } = require('../middlewares/sessionMiddlewares')

class ViewsRouter extends BaseRouter {

    handleProductsRoutes = async (req, res, viewName) => {
        const user = req.user;
        const filters = {};
        const { page = 1, limit = 10, sort, category, availability } = req.query;
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
        const availabilityOption = availability === 'available' ? true : availability === 'notavailable' ? false : undefined;
        const query = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption,
        };

        if (category) {
            filters.category = category;
        }

        if (availability) {
            filters.status = availabilityOption;
        }

        try {
            const productsData = await productManager.getProducts(filters, query);
            const products = productsData.docs.map(p => p.toObject());
            const locals = {
                title: viewName === 'productsViews/products' ? 'Products' : 'Real Time Products',
                products: products,
                productsData,
                user,
                generatePaginationLink: (page) => {
                    const newQuery = { ...req.query, ...filters, page: page };
                    return `/${viewName.split('/')[1]}?` + new URLSearchParams(newQuery).toString();
                },
            };

            res.renderView({
                view: viewName,
                locals: locals,
            });
        } catch (error) {
            res.renderView({
                view: 'error', locals: { title: 'Error', errorMessage: error.message },
            });
        }
    }

    init() {
        this.get('/realtimeproducts', /* requireLogin, requireAdmin, */ async (req, res) => {
            this.handleProductsRoutes(req, res, 'productsViews/realTimeProducts');
        });

        this.get('/products', requireLogin, async (req, res) => {
            this.handleProductsRoutes(req, res, 'productsViews/products');
        });

        this.get('/products/:pid', requireLogin, async (req, res) => {
            const user = req.user
            const pid = req.params.pid
            try {
                const product = await productManager.getProductById(pid)
                res.renderView({ view: 'productsViews/productDetail', locals: { title: 'Product Detail', product, user } })
            } catch (error) {
                res.renderView({
                    view: 'error', locals: { title: 'Error', errorMessage: error.message },
                });
            }
        })

        this.get('/carts/:cid', requireLogin, async (req, res) => {
            const user = req.user
            const cid = req.params.cid
            try {
                const cart = await cartManager.getCartById(cid)
                const productsInCart = cart[0].products.map(p => p.toObject());
                res.renderView({ view: 'productsViews/cartDetail', locals: { title: 'Cart Detail', productsInCart, user } })
            } catch (error) {
                res.renderView({
                    view: 'error', locals: { title: 'Error', errorMessage: error.message },
                });
            }
        })

        this.get('/chat', async (req, res) => {
            try {
                res.renderView({ view: 'chat', locals: { title: 'Chat' } })
            } catch (error) {
                res.renderView({
                    view: 'error', locals: { title: 'Error', errorMessage: error.message },
                });
            }
        })

        this.get('/register', haveSession, async (req, res) => {
            const messageError = req.flash('error')[0]
            try {
                res.renderView({ view: 'loginSystem/register', locals: { title: 'Register', messageError, hasError: messageError !== undefined } })
            } catch (error) {
                res.renderView({
                    view: 'error', locals: { title: 'Error', errorMessage: error.message },
                });
            }
        })

        this.get('/', haveSession, async (req, res) => {
            const messageError = req.flash('error')[0]
            try {
                res.renderView({ view: 'loginSystem/login', locals: { title: 'Login', messageError, hasError: messageError !== undefined } })
            } catch (error) {
                res.renderView({
                    view: 'error', locals: { title: 'Error', errorMessage: error.message },
                });
            }
        })

        this.get('/recoverypassword', haveSession, async (req, res) => {
            try {
                res.renderView({ view: 'loginSystem/recoveryPassword', locals: { title: 'Recovery Password' } })
            } catch (error) {
                res.renderView({
                    view: 'error', locals: { title: 'Error', errorMessage: error.message },
                });
            }
        })

        this.get('/profile', requireLogin, async (req, res) => {
            const user = req.user
            try {
                res.renderView({ view: 'loginSystem/profile', locals: { user, title: 'Profile' } })
            } catch (error) {
                res.renderView({
                    view: 'error', locals: { title: 'Error', errorMessage: error.message },
                });
            }
        })

        this.get('/logout', (req, res) => {
            req.session.destroy(err => {
                if (!err) {
                    res.redirect('/')
                } else {
                    res.renderView({
                        view: 'error', locals: { title: 'Error', errorMessage: err.message },
                    });
                }
            })
        })

        this.get('/error', async (req, res) => {
            const errorMessage = req.query.errorMessage || 'An error has occurred';
            res.renderView({
                view: 'error', locals: { title: 'Error', errorMessage: errorMessage }
            });
        });

    }
}

module.exports = ViewsRouter