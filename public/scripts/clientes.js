const CLIENTES_API_URL = '/api/clientes';
const INTERESES_API_URL = '/api/intereses';

async function fetchIntereses() {
    try {
        const response = await fetch(INTERESES_API_URL);
        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (data.success) {
            return data.data; // Devuelve los datos de los intereses
        } else {
            console.error(data.message || 'Error al cargar los intereses');
            return [];
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        return [];
    }
}

async function fetchClientes() {
    try {
        const [clientesResponse, intereses] = await Promise.all([
            fetch(CLIENTES_API_URL),
            fetchIntereses()
        ]);

        const clientesData = await clientesResponse.json();

        if (clientesData.success) {
            const clientTableBody = document.getElementById('clientTableBody');
            clientTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

            clientesData.data.forEach(cliente => {
                const tipoInteres = intereses.find(interes => interes.cliente_id === cliente.id) || { tipo_interes: 'N/A' };

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cliente.id}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefono || 'N/A'}</td>
                    <td>${tipoInteres.tipo_interes}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="editCliente(${cliente.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCliente(${cliente.id})">Eliminar</button>
                    </td>
                `;
                clientTableBody.appendChild(row);
            });
        } else {
            console.error(clientesData.message || 'Error al cargar los clientes');
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
}

// Llamar a la función al cargar la página
window.onload = fetchClientes;

// Funciones para editar y eliminar clientes
async function editCliente(clienteId) {
    try {
        const clienteResponse = await fetch(`${CLIENTES_API_URL}/${clienteId}`);
        const clienteData = await clienteResponse.json();

        if (clienteData.success) {
            const cliente = clienteData.data;
            document.getElementById('editClientId').value = cliente.id;
            document.getElementById('editClientNombre').value = cliente.nombre;
            document.getElementById('editClientApellido').value = cliente.apellido;
            document.getElementById('editClientEmail').value = cliente.email;
            document.getElementById('editClientTelefono').value = cliente.telefono;
            document.getElementById('editClientPassword').value = cliente.password;

            // Mostrar el modal
            const editClientModal = new bootstrap.Modal(document.getElementById('editClientModal'));
            editClientModal.show();
        } else {
            console.error(clienteData.message || 'Error al cargar los datos del cliente');
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
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

// Manejar el envío del formulario del MODAL de edición
document.getElementById('editClientForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const clienteId = document.getElementById('editClientId').value;
    const nombre = document.getElementById('editClientNombre').value;
    const apellido = document.getElementById('editClientApellido').value;
    const email = document.getElementById('editClientEmail').value;
    const telefono = document.getElementById('editClientTelefono').value;
    const password = document.getElementById('editClientPassword').value;

    try {
        const clienteResponse = await fetch(`${CLIENTES_API_URL}/${clienteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ nombre, apellido, email, telefono, password })
        });
        const clienteData = await clienteResponse.json();

        if (clienteData.success) {
            alert('Cliente actualizado exitosamente');
            fetchClientes(); // Actualizar la lista de clientes
            const editClientModal = bootstrap.Modal.getInstance(document.getElementById('editClientModal'));
            editClientModal.hide();
        } else {
            alert(clienteData.message || 'Error al actualizar el cliente');
        }
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        alert('Error al conectar con el servidor');
    }
});