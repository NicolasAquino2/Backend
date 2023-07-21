const express = require('express');
const handlebars = require('express-handlebars');
const viewRouter = require('./routers/viewsRouter');
const productRouter = require('./routers/productRouter');
const { Server } = require('socket.io');
const { setupSocketEvents } = require('./utils');

const app = express();
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

app.use('/api/products', productRouter);
app.use('/', viewRouter);
app.use('/', viewRouter);


