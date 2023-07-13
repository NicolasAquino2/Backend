const { Server } = require('socket.io');

function setupSocketEvents(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Evento para manejar cuando un cliente se desconecta
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });

    // Evento personalizado para recibir mensajes del cliente
    socket.on('mensajeCliente', (mensaje) => {
      console.log(`Mensaje recibido del cliente: ${mensaje}`);

      // Enviar un mensaje de respuesta al cliente
      socket.emit('mensajeServidor', '¡Mensaje recibido en el servidor!');
    });
  });
}

module.exports = { setupSocketEvents };
