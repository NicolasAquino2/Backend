const express = require('express');
const path = require('path')
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const handleSocketConnection = require('./utils/socketHandlers')
const { Server } = require('socket.io')
const passport = require('passport')
const initializePassport = require('./config/passport.config')
const flash = require('connect-flash')
const session = require('express-session');
const cookieParser = require('cookie-parser')
const app = express();

const mongoose = require('mongoose')
const MONGODB_CONECT = 'mongodb+srv://nicolasAquino:yosoynicoa@cluster0.1upobe4.mongodb.net/productsMongo?retryWrites=true&w=majority'

mongoose.connect(MONGODB_CONECT)
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
    process.exit(1);
  });

 
  app.use(cookieParser('secretkey'))

  // Configuración de session
  app.use(session({
      store: MongoStore.create({
          mongoUrl: MONGODB_CONECT,
          mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
          ttl: 240,
      }),
      secret: 'secretkey',
      resave: true,
      saveUninitialized: true
  }));


  app.use(flash())
  initializePassport()
  app.use(passport.initialize())
  app.use(passport.session())
  
  // Configuración handlebars
  app.engine('handlebars', handlebars.engine());
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'handlebars')
  
  // Seteo de forma estática la carpeta public
  app.use(express.static(__dirname + '/public'));
  
  // Crear el servidor HTTP
  const httpServer = app.listen(8080, () => {
      console.log(`Servidor express escuchando en el puerto 8080`);
  });
  
  // Crear el objeto `io` para la comunicación en tiempo real
  const io = new Server(httpServer);
  handleSocketConnection(io);
  
 // Implementación de enrutadores
const ProductsRouter = require('./routers/productRouter')
const productsRouter = new ProductsRouter()
const CartsRouter = require('./routers/cartRouter')
const cartsRouter = new CartsRouter()
const ViewsRouter = require('./routers/viewsRouter')
const viewsRouter = new ViewsRouter();
const SessionRouter = require('./routers/viewsRouter');
const sessionRouter = new SessionRouter()
  
 // Rutas base de enrutadores
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/sessions', sessionRouter.getRouter());
app.use('/', viewsRouter.getRouter());
  
  // Ruta de health check
  app.get('/healthCheck', (req, res) => {
      res.json({
          status: 'running',
          date: new Date(),
      });
  });
  
  module.exports = io