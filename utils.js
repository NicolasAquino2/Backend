const { Server } = require('socket.io');

function setupSocketEvents(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');


    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });


    socket.on('mensajeCliente', (mensaje) => {
      console.log(`Mensaje recibido del cliente: ${mensaje}`);

    
      socket.emit('mensajeServidor', '¡Mensaje recibido en el servidor!');
    });
  });
}

module.exports = { setupSocketEvents };
