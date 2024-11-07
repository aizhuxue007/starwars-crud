const update = document.querySelector('#update-button')

update.addEventListener('click', _ => {
  fetch('/quotes', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Darth Vader',
      quote: 'I find your lack of faith disturbing.',
    }),
  })  
})

const deleteButton = document.querySelector('#delete-button');
const messageDiv = document.querySelector('#message');

deleteButton.addEventListener('click', _ => {
  fetch('/quotes', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Darth Vader' })
  })
    .then(res => res.json()) // Parse JSON response
    .then(response => {
      if (response.message === 'No quote to delete') {
        messageDiv.textContent = 'No Darth Vader quote to delete';
      } else {
        messageDiv.textContent = response.message; // Show success message
        window.location.reload(); // Optionally reload to update the list
      }
    })
    .catch(error => console.error('Error:', error));
});

