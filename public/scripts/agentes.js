const API_URL = 'http://localhost:3000/api/agentes';

// DOM
const agentesGrid = document.getElementById('agentesGrid');

// Funciones necesarias
async function getAgentes() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.success) {
            displayAgentes(data.data);
            console.log('Agentes obtenidos:', data.data);
        } else {
            console.error('Error al obtener agentes:', data.error);
        }
    } catch (error) {
        console.error('Error al obtener agentes:', error);
    }
}

function displayAgentes(agentes) {
    if (!Array.isArray(agentes)) {
        console.error('displayAgentes: agentes no es un array', agentes);
        return;
    }

    if (agentes.length === 0) {
        agentesGrid.innerHTML = '<tr><td colspan="4">No hay agentes disponibles.</td></tr>';
        return;
    }

    agentesGrid.innerHTML = agentes.map(agente => `
        <tr>
            <td>${agente.nombre}</td>
            <td>${agente.apellido}</td>
            <td>${agente.email}</td>
            <td>${agente.telefono}</td>
        </tr>
    `).join('');
}

// Llamar a getAgentes al cargar la página
document.addEventListener('DOMContentLoaded', getAgentes);