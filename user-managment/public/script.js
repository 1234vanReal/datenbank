const form = document.getElementById('user-form');
const userList = document.getElementById('user-list');

// Benutzer abrufen und anzeigen
function fetchUsers() {
    fetch('/api/users')
        .then((response) => response.json())
        .then((users) => {
            userList.innerHTML = '';
            users.forEach((user) => {
                const li = document.createElement('li');
                li.textContent = `${user.name} (${user.email})`;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Löschen';
                deleteButton.onclick = () => deleteUser(user.id);
                li.appendChild(deleteButton);
                userList.appendChild(li);
            });
        });
}

// Benutzer hinzufügen
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    })
        .then((response) => response.json())
        .then(() => {
            form.reset();
            fetchUsers();
        });
});

// Benutzer löschen
function deleteUser(id) {
    fetch(`/api/users/${id}`, {
        method: 'DELETE',
    }).then(() => fetchUsers());
}

// Benutzer beim Laden der Seite abrufen
fetchUsers();