const API_URL = 'http://localhost:3000/api';

// Elementos DOM
const propertiesGrid = document.getElementById('propertiesGrid');
const filterForm = document.getElementById('filterForm');
const propertyModal = document.getElementById('propertyModal');
const propertyForm = document.getElementById('propertyForm');
const addPropertyBtn = document.getElementById('addPropertyBtn');
const closeModal = document.querySelector('.close-modal');

document.addEventListener('DOMContentLoaded', () => {
    loadProperties();

    //Evento de click en agregar propiedad y se abre el modal.
    addPropertyBtn.addEventListener('click', () => {
        propertyModal.style.display = 'flex';
        propertyForm.reset();
        loadAgents();
        propertyForm.onsubmit = (e) => handlePropertyFormSubmit(e);
    });
});

closeModal.addEventListener('click', () => {
    propertyModal.style.display = 'none';
});

// se cargan las propiedades
async function loadProperties(filters = {}) {
    console.log('Cargando propiedades con filtros:', filters);
    try {
        const params = new URLSearchParams(filters).toString();
        const url = `${API_URL}/propiedades${params ? `/search?${params}` : ''}`;
        
        console.log('Fetching URL:', url);    

        const response = await fetch(url);
        console.log('Response:', response);
        const data = await response.json();
        console.log('API Response:', data);

        if (data.success && Array.isArray(data.data)) {
            displayProperties(data.data);
        } else {
            console.warn('La respuesta de la API no contiene un array de propiedades');
            displayProperties([]);
        }
    } catch (error) {
        console.error('Error cargando propiedades:', error);
        alert('Error al cargar las propiedades');
    }
}

// Se cargan los agentes en el modal!!!
async function loadAgents() {
    try {
        const response = await fetch(`${API_URL}/agentes`);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
            const agentSelect = propertyForm.elements['agente_id'];
            agentSelect.innerHTML = '<option value="">Seleccione un agente</option>'; // Limpiar opciones anteriores

            data.data.forEach(agent => {
                const option = document.createElement('option');
                option.value = agent.id;
                option.textContent = agent.nombre;
                agentSelect.appendChild(option);
            });
        } else {
            console.warn('La respuesta de la API no contiene un array de agentes');
        }
    } catch (error) {
        console.error('Error cargando agentes:', error);
        alert('Error al cargar los agentes');
    }
}

async function checkPermissions() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/agentes/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error verificando token:', error);
        return null;
    }
}

function displayProperties(properties) {
    if (!Array.isArray(properties)) {
        console.error('displayProperties: properties no es un array', properties);
        return;
    }

    const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
    propertiesGrid.innerHTML = properties.length 
        ? properties.map(property => renderPropertyCard(property, userPermissions)).join('') 
        : '<p>No hay propiedades disponibles.</p>';

    document.getElementById('addPropertyBtn').style.display = userPermissions.canAdd ? 'block' : 'none';
}

function renderPropertyCard(property, userPermissions) {
    
     console.log('Ruta Imagen', property.imagen);

    if (property.imagen) {
        imagePath = '/public' + property.imagen;
    } else {
        imagePath = '/public/images/default.jpg';
    }
    
    const actionButtons = [
        userPermissions.canEdit ? `<button onclick="editProperty(${property.id})" class="btn btn-edit"><i class="fas fa-edit"></i> Editar</button>` : '',
        userPermissions.canDelete ? `<button onclick="deleteProperty(${property.id})" class="btn btn-delete"><i class="fas fa-trash"></i> Eliminar</button>` : ''
    ].filter(Boolean).join('');

    return `
        <div class="property-card">
            <img src="${imagePath}" alt="${property.titulo}" class="property-image" onerror="this.style.display='none'">
            <div class="property-info">
                <h3>${property.titulo}</h3>
                <p class="property-code">Código: ${property.codigo}</p>
                <p class="property-price">$${property.precio.toLocaleString()}</p>
                <p class="property-address">${property.direccion}</p>
                <p class="property-type">${property.tipo}</p>
                <p class="property-status">${property.estado}</p>
                ${actionButtons ? `<div class="property-actions">${actionButtons}</div>` : ''}
            </div>
        </div>
    `;
}

async function createProperty(formData) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/propiedades`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Error al crear la propiedad');

        return data;
    } catch (error) {
        console.error('Error creando propiedad:', error);
        throw error;
    }
}

async function editProperty(id) {
    const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
    if (!userPermissions.canEdit) {
        alert('No tienes permisos para editar propiedades');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/propiedades/${id}`);
        const data = await response.json();

        if (data.success) {
            const property = data.data;

            // Limpiar el evento submit anterior
            propertyForm.onsubmit = null;

            // Rellenar el formulario con los datos de la propiedad
            for (const key in property) {
                if (propertyForm.elements[key] && key !== 'imagen') {
                    propertyForm.elements[key].value = property[key];
                }
            }

            // Guardar la imagen actual en un campo oculto
            const currentImageInput = propertyForm.elements['currentImage'];
            if (currentImageInput) {
                currentImageInput.value = property.imagen || '';
            }

            propertyModal.style.display = 'flex';
            propertyForm.elements['imagen'].required = false;

            // Sobrescribir el evento submit para manejar la actualización
            propertyForm.onsubmit = (e) => handlePropertyFormSubmit(e, id);
        }
    } catch (error) {
        console.error('Error obteniendo propiedad:', error);
        alert('Error al obtener la propiedad: ' + error.message);
    }
}

async function deleteProperty(id) {
    const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
    const token = localStorage.getItem('token');
    if (!userPermissions.canDelete) {
        alert('No tienes permisos para eliminar propiedades');
        return;
    }

    if (!token) {
        alert('No hay sesión activa. Por favor, inicie sesión nuevamente.');
        window.location.href = 'login.html';
        return;
    }

    if (confirm('¿Estás seguro de querer eliminar esta propiedad?')) {
        try {
            const response = await fetch(`${API_URL}/propiedades/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Sesión expirada. Por favor, inicie sesión nuevamente.');
                    window.location.href = 'login.html';
                    return;
                }
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                loadProperties();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error eliminando propiedad:', error);
            alert('Error al eliminar la propiedad');
        }
    }
}

function getToken() {
    return localStorage.getItem('token');
}

async function handlePropertyFormSubmit(e, id = null) {
    e.preventDefault();
    const formData = new FormData(propertyForm);
    const token = getToken();

    if (!token) {
        alert('No hay un token de autenticación válido');
        window.location.href = 'login.html';
        return;
    }

    // Si no se selecciona una nueva imagen y hay una imagen actual
    const currentImageInput = propertyForm.elements['currentImage'];
    if (!formData.get('imagen').size && currentImageInput && currentImageInput.value) {
        formData.set('imagen', currentImageInput.value);
    }

    try {
        const method = id ? 'PUT' : 'POST'; // Si tengo un ID es una actualización, de lo contrario es una creación 
        const url = id ? `${API_URL}/propiedades/${id}` : `${API_URL}/propiedades`; // URL de actualización o creación

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}` // Enviar el token de autenticación
            },
            body: formData
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('Sesión expirada. Por favor, inicie sesión nuevamente.');
                window.location.href = 'login.html';
                return;
            }
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json(); // Esperar la respuesta de la API

        if (data.success) {  // Verificar si la respuesta de la API fue exitosa
            alert(`Propiedad ${id ? 'actualizada' : 'creada'} exitosamente`);
            propertyForm.reset();
            propertyModal.style.display = 'none';
            loadProperties();
        } else {
            throw new Error(data.error || `Error al ${id ? 'actualizar' : 'crear'} la propiedad`);
        }
    } catch (error) {
        console.error(`Error ${id ? 'actualizando' : 'creando'} propiedad:`, error);
        alert(`Error al ${id ? 'actualizar' : 'crear'} la propiedad: ` + error.message);
    }
}