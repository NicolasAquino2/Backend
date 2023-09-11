const { Router } = require('express')
const ProductManagerMongo = require('../dao/ProductManagerMongo');
const productManager = new ProductManagerMongo
const CartManagerMongo = require('../dao/CartsManagerMongo');
const cartManager = new CartManagerMongo
const viewsRouter = new Router()
const { haveSession, requireAdmin, requireLogin } = require('../middlewares/sessionMiddlewares')

/* VISTAS DE PRODUCTOS */

viewsRouter.get('/realtimeproducts', requireLogin, requireAdmin, async (req, res) => {
    const user = req.user
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

        const productsData = await productManager.getProducts(filters, query);
        const products = productsData.docs.map(p => p.toObject());

        if (productsData.docs.length === 0) {
            return res.render('realTimeProducts', { title: 'Real Time Products', style: 'styles.css', noProducts: true, user: user });
        }

        return res.render('productsViews/realTimeProducts', {
            title: 'Real Time Products', style: 'styles.css',
            products: products, productsData, user: user,
            generatePaginationLink: (page) => {
                const newQuery = { ...req.query, ...filters, page: page };
                return '/realtimeproducts?' + new URLSearchParams(newQuery).toString();
            }
        });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/products', requireLogin, async (req, res) => {
    const user = req.user
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

        const productsData = await productManager.getProducts(filters, query);
        const products = productsData.docs.map(p => p.toObject());


        if (productsData.docs.length === 0) {
            return res.render('products', { title: 'Products', style: 'styles.css', noProducts: true, user: user });
        }

        return res.render('productsViews/products', {
            title: 'Products', style: 'styles.css',
            products: products, productsData: productsData, user: user,
            generatePaginationLink: (page) => {
                const newQuery = { ...req.query, ...filters, page: page };
                return '/products?' + new URLSearchParams(newQuery).toString();
            }
        });

    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/products/:pid', requireLogin, async (req, res) => {
    const user = req.user
    const pid = req.params.pid
    try {
        const product = await productManager.getProductById(pid)
        return res.render('productsViews/productDetail', { title: 'Product Detail', style: 'styles.css', product: product, user: user });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

/* VISTA DE CARRITO */

viewsRouter.get('/carts/:cid', requireLogin, async (req, res) => {
    const user = req.user
    const cid = req.params.cid
    try {
        const cart = await cartManager.getCartById(cid)
        const productsInCart = cart[0].products.map(p => p.toObject());
        return res.render('productsViews/cartDetail', { title: 'Cart Detail', style: 'styles.css', productsInCart: productsInCart, user: user });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

/* VISTA DE CHAT */

viewsRouter.get('/chat', async (req, res) => {
    try {
        //en esta instancia no se pasan los mensajes para evitar que se puedan visualzar antes de identificarse
        return res.render('chat', { title: 'Chat', style: 'styles.css' });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

/* VISTAS DE SISTEMA DE LOGIN */

viewsRouter.get('/register', haveSession, async (req, res) => {
    const messageError = req.flash('error')[0]
    try {
        return res.render('login/register', { title: 'Register', style: 'styles.css', messageError: messageError, hasError: messageError !== undefined });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

//LOGIN
viewsRouter.get('/', haveSession, async (req, res) => {
    const messageError = req.flash('error')[0]
    try {
        return res.render('login/login', { title: 'Login', style: 'styles.css', messageError: messageError, hasError: messageError !== undefined });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/recoverypassword', haveSession, async (req, res) => {
    try {
        return res.render('login/recoveryPassword', { title: 'Recovery Password', style: 'styles.css' });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/profile', requireLogin, (req, res) => {
    try {
        const user = req.user
        return res.render('login/profile', { user: user, title: 'Profile', style: 'styles.css' })
    } catch (error) {
        return res.render('error', { title: 'Error', errorMessage: error.message });
    }
})

viewsRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            return res.redirect('/')
        } else {
            return res.status(500).json({ status: 'error', error: 'Error al cerrar sesión', message: err.message });
        }
    })
});

/* VISTA DE ERROR */

viewsRouter.get('/error', (req, res) => {
    const errorMessage = req.query.errorMessage || 'Ha ocurrido un error';
    if (errorMessage) {
        res.render('error', { title: 'Error', errorMessage: errorMessage });
    } else {
        res.render('error', { title: 'Error', errorMessage: error.message });
    }
});



module.exports = viewsRouter