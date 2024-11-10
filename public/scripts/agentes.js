const AGENTES_API_URL = 'http://localhost:3000/api/agentes';

// DOM
const agentesGrid = document.getElementById('agentesGrid');
const agenteSelect = document.querySelector('select[name="agente_id"]');

// Verificar si el usuario es administrador
const agenteData = localStorage.getItem('agente');
let isAdmin = false;

let usuarioAdmin;

if (agenteData) {
    const agente = JSON.parse(agenteData).agente; // Accede al objeto anidado 'agente'
    const nombre = agente.nombre;
    isAdmin = nombre === 'admin';
    usuarioAdmin = {
        nombre: nombre,
        isAdmin: isAdmin
    };
} else {
    usuarioAdmin = {      
        isAdmin: false
    };
}

console.log(usuarioAdmin);

document.addEventListener('DOMContentLoaded', () => {
    const addPropertyBtn = document.getElementById('addPropertyBtn');
    if (addPropertyBtn) {
        if (usuarioAdmin.isAdmin) {
            addPropertyBtn.style.display = 'block';
        } else {
            addPropertyBtn.style.display = 'none';
        }

        addPropertyBtn.addEventListener('click', getAgentes);
    }

    // También podrías cargar los agentes al inicio si lo deseas
    getAgentes();
});

// Funciones necesarias
async function getAgentes() {
    try {
        const response = await fetch(AGENTES_API_URL);
        const data = await response.json();

        if (data.success) {
            if (agentesGrid) {
                displayAgentes(data.data);
            }
            if (agenteSelect) {
                populateAgenteSelect(data.data);
            }
            console.log('Agentes obtenidos:', data.data);
        } else {
            console.error('Error al obtener agentes:', data.error);
        }
    } catch (error) {
        console.error('Error al obtener agentes:', error);
    }
}

// Función para poblar el select de agentes
function populateAgenteSelect(agentes) {
    if (!agenteSelect) return; // Si no existe el select, salir

    // Limpiar opciones existentes
    agenteSelect.innerHTML = '<option value="">Seleccione un agente</option>';

    // Agregar cada agente como una opción
    agentes.forEach(agente => {
        if (agente.nombre !== 'admin') { // Excluir al administrador
            const option = document.createElement('option');
            option.value = agente.id;
            option.textContent = `${agente.nombre} ${agente.apellido}`;
            agenteSelect.appendChild(option);
        }
    });
}

async function editarAgente(id) {
    try {
        const response = await fetch(`${AGENTES_API_URL}/${id}`);
        const data = await response.json();
        if (data.success) {
            // Aquí abrirías un modal o un formulario para editar
            // y lo rellenarías con los datos del agente
            console.log('Datos del agente para editar:', data.data);
            // Implementa la lógica para abrir y rellenar el formulario
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error al obtener datos del agente:', error);
        alert('Error al obtener datos del agente');
    }
}

async function eliminarAgente(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este agente?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${AGENTES_API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                alert('Agente eliminado con éxito');
                getAgentes(); // Recargar la lista de agentes
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error al eliminar agente:', error);
            alert('Error al eliminar agente');
        }
    }
}

function displayAgentes(agentes) {
    if (!Array.isArray(agentes)) {
        console.error('displayAgentes: agentes no es un array', agentes);
        return;
    }

    if (agentes.length === 0) {
        agentesGrid.innerHTML = '<tr><td colspan="5">No hay agentes disponibles.</td></tr>';
        return;
    }

    agentesGrid.innerHTML = agentes
        .filter(agente => agente.nombre !== 'admin') // Excluir al administrador
        .map(agente => `
            <tr>
                <td>${agente.nombre}</td>
                <td>${agente.apellido}</td>
                <td>${agente.email}</td>
                <td>${agente.telefono}</td>
                <td>
                    ${usuarioAdmin.isAdmin ? `
                        <button onclick="editarAgente(${agente.id})" class="btn btn-primary btn-sm">Editar</button>
                        <button onclick="eliminarAgente(${agente.id})" class="btn btn-danger btn-sm">Eliminar</button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
}