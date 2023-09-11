const socket = io()

const productDetailForm = document.querySelector('.productDetailFooter form');

productDetailForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cid = productDetailForm.querySelector('#inputCartId').value;
    const pid = productDetailForm.getAttribute('id');

    socket.emit('addProductToCart', { cid, pid });

    productDetailForm.reset();
});

socket.on('notification', notif => {
    Swal.fire({
        text: notif.message,
        icon: notif.type === 'success' ? 'success' : 'error',
        timer: 3000,
    });
});