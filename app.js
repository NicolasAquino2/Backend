const express = require('express');
const handlebars = require('express-handlebars');
const viewRouter = require('./routers/viewsRouter');
const productRouter = require('./routers/productRouter');
const { Server } = require('socket.io');
const { setupSocketEvents } = require('./utils');


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




const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


const io = new Server(server);
setupSocketEvents(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));







app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars')
app.set('views', './views');


app.use('/home', viewRouter);
app.use('/realTimeProducts', viewRouter);
app.use('/api/products/:id', viewRouter)
app.use('/', productRouter)




