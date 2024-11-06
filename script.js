// script.js
const urlBase = 'https://jsonplaceholder.typicode.com/posts'; // URL a interactuar
let posts = []; // Inicializamos los posteos con un array vacío

function getData() {
    fetch(urlBase)
        .then(res => res.json())
        .then(data => {
            posts = data;
            renderPostList();
        })
        .catch(error => console.error('Error al llamar a la API: ', error));
}

// Llamada inicial para obtener los posts
getData();

function renderPostList() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('postItem');
        listItem.innerHTML = `
            <strong>${post.title}</strong>
            <p>${post.body}</p>
            <button onclick="editPost(${post.id})">Editar</button>
            <button onclick="deletePost(${post.id})">Borrar</button>
            
            <div id="editForm-${post.id}" class="editForm" style="display:none">
                <label for="editTitle">Título: </label>
                <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
                <label for="editBody">Comentario</label>
                <textarea id="editBody-${post.id}" required>${post.body}</textarea>
                <button onclick="updatePost(${post.id})">Actualizar</button>
            </div>
        `;
        postList.appendChild(listItem); // Cambiado `append` a `appendChild`
    });
}

function postData() {
    const postTitle = document.getElementById('postTitle').value;
    const postBody = document.getElementById('postBody').value;

    if (postTitle.trim() === '' || postBody.trim() === '') {
        alert('Los campos son obligatorios');
        return;
    }

    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        posts.unshift(data); // Añade el nuevo post al inicio de la lista
        renderPostList();
        document.getElementById('postTitle').value = ''; // Limpiar campos
        document.getElementById('postBody').value = '';
    })
    .catch(error => console.error('Error al querer crear posteo: ', error));
}

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display === 'none') ? 'block' : 'none';
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        const index = posts.findIndex(post => post.id === data.id);
        if (index !== -1) {
            posts[index] = data;
        } else {
            alert('Hubo un error al actualizar la información del posteo');
        }
        renderPostList();
    })
    .catch(error => console.error('Error al querer actualizar posteo: ', error));
}

function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok) {
            posts = posts.filter(post => post.id !== id);
            renderPostList();
        } else {
            alert('Hubo un error y no se pudo eliminar el posteo');
        }
    })
    .catch(error => console.error('Hubo un error: ', error));
}
