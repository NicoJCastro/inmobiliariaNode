const CLIENTES_API_URL = '/api/clientes';

async function fetchClientes() {
    try {
        const response = await fetch(CLIENTES_API_URL);
        const data = await response.json();

        if (data.success) {
            const clientTableBody = document.getElementById('clientTableBody');
            clientTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            data.data.forEach(cliente => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cliente.id}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefono || 'N/A'}</td>
                    <td>${cliente.tipo_interes || 'N/A'}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="editCliente(${cliente.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCliente(${cliente.id})">Eliminar</button>
                    </td>
                `;
                clientTableBody.appendChild(row);
            });
        } else {
            console.error(data.message || 'Error al cargar los clientes');
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
}

// Llamar a la función al cargar la página
window.onload = fetchClientes;

// Funciones para editar y eliminar clientes
function editCliente(clienteId) {
    // Lógica para editar cliente
    // Por ejemplo, puedes redirigir a un formulario de edición pasando el ID del cliente
    window.location.href = `editarCliente.html?id=${clienteId}`;
}

async function deleteCliente(clienteId) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        try {
            const response = await fetch(`${CLIENTES_API_URL}/${clienteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Asegúrate de enviar el token JWT si es necesario
                }
            });
            const data = await response.json();

            if (data.success) {
                alert('Cliente eliminado exitosamente');
                fetchClientes(); // Actualizar la lista de clientes
            } else {
                alert(data.message || 'Error al eliminar el cliente');
            }
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
            alert('Error al conectar con el servidor');
        }
    }
}