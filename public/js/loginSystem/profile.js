const deleteForm = document.getElementById('deleteForm');
const deleteButton = deleteForm.querySelector('.deleteButton');
const userId = deleteButton.getAttribute('data-userid');

deleteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {

        const response = await fetch(`/api/sessions/${userId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            Swal.fire({
                text: 'Account deleted successfully',
                icon: 'success',
                timer: 3000,
                willClose: () => {
                    window.location.href = '/';
                }
            });
        }

    } catch (error) {
        Swal.fire({
            text: 'An error occurred while deleting the account',
            icon: 'error',
            timer: 3000,
        });
    }
});