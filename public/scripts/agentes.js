const AGENTES_API_URL = 'http://localhost:3000/api/agentes';

// DOM
const agentesGrid = document.getElementById('agentesGrid');
const agenteSelect = document.querySelector('select[name="agente_id"]');

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
        const option = document.createElement('option');
        option.value = agente.id;
        option.textContent = `${agente.nombre} ${agente.apellido}`;
        agenteSelect.appendChild(option);
    });
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

// Llamar a getAgentes cuando se abra el modal
document.addEventListener('DOMContentLoaded', () => {
    const addPropertyBtn = document.getElementById('addPropertyBtn');
    if (addPropertyBtn) {
        addPropertyBtn.addEventListener('click', getAgentes);
    }
    
    // También podrías cargar los agentes al inicio si lo deseas
    getAgentes();
});