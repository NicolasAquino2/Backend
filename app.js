const express = require('express');
const viewRouter = require('./routers/viewsRouter');
const productRouter = require('./routers/productRouter');
const cartRouter = require('./routers/cartRouter');
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

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/home', viewRouter);
app.use('/realtimeproducts', viewRouter);

app.use(express.static('public'));


