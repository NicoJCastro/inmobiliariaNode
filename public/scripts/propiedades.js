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

// PAGINACION DE PROPIEDADES

function paginacionPropiedades(total, paginaActual, limite) {
    const containerPaginacion = document.getElementById('paginacion');
    const totalPaginas = Math.ceil(total / limite);
    let paginacionHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
        paginacionHTML += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
    }

    containerPaginacion.innerHTML = paginacionHTML;

    document.querySelectorAll('.pagination-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const page = e.target.getAttribute('data-page');
            document.getElementById('page').value = page;
            document.getElementById('filterForm').dispatchEvent(new Event('submit'));
        });
    });

}

// Evento de submit en el formulario de filtros
document.getElementById('filterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const filters = Object.fromEntries(formData.entries());
    loadProperties(filters);
});

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
    console.log('Permisos de usuario:', userPermissions);
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

    let interestButtons = '';
    if (property.tipo === 'alquiler') {
        interestButtons = `<button class="btn" onclick="showInterestForm('alquilar', ${property.id})">Alquilar</button>`;
    } else if (property.tipo === 'venta') {
        interestButtons = `<button class="btn" onclick="showInterestForm('comprar', ${property.id})">Comprar</button>`;
    }

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
                ${interestButtons ? `<div class="property-interest">${interestButtons}</div>` : ''}
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

        const data = await response.json(); 

        if (data.success) {  
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

// Cliente quiere comprar o alquilar
function showInterestForm(tipoInteres, propertyId) {
    const interestForm = document.getElementById('interestForm');
    const interestMessage = document.getElementById('interestMessage');
    
    // Resetear el formulario y los mensajes
    document.getElementById('clientInterestForm').reset();
    if (interestMessage) {
        interestMessage.classList.add('d-none');
    }
    
    // Establecer los valores ocultos
    document.getElementById('interestType').value = tipoInteres;
    document.getElementById('propertyId').value = propertyId;
    
    // Mostrar el modal
    interestForm.style.display = 'flex';
}

function closeInterestForm() {
    const interestForm = document.getElementById('interestForm');
    const clientInterestForm = document.getElementById('clientInterestForm');
    const interestMessage = document.getElementById('interestMessage');
    
    interestForm.style.display = 'none';
    clientInterestForm.reset();
    if (interestMessage) {
        interestMessage.classList.add('d-none');
    }
}

// Agregar event listener para cerrar el modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('interestForm');
    if (event.target === modal) {
        closeInterestForm();            
    }
}

// Actualizar el event listener existente para el formulario de interés
document.getElementById('clientInterestForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const messageElement = document.getElementById('interestMessage');
    
    // Obtener todos los valores del formulario
    const clientName = document.getElementById('clientName').value;
    const clientLastName = document.getElementById('clientLastName').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPassword = document.getElementById('clientPassword').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const interestType = document.getElementById('interestType').value;
    const propertyId = document.getElementById('propertyId').value;

    // Validación de campos obligatorios
    if (!clientName || !clientLastName || !clientEmail || !clientPassword) {
        if (messageElement) {
            messageElement.textContent = 'Todos los campos son obligatorios';
            messageElement.classList.remove('d-none');
            messageElement.classList.add('alert-danger');
        } else {
            alert('Todos los campos son obligatorios');
        }
        return;
    }

    try {
        // 1. Registrar al cliente
        const clientResponse = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: clientName,
                apellido: clientLastName,
                email: clientEmail,
                password: clientPassword,
                telefono: clientPhone,
                tipoUsuario: 'cliente'
            })
        });

        const clientData = await clientResponse.json();

        if (!clientData.success) {
            throw new Error(clientData.message || 'Error al registrar el cliente');
        }

        // 2. Registrar el interés
        const interestResponse = await fetch(`${API_URL}/intereses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clienteId: clientData.data.id,
                propiedadId: propertyId,
                tipoInteres: interestType
            })
        });

        const interestData = await interestResponse.json();

        if (interestData.success) {
            // Guardar token y datos del usuario
            localStorage.setItem("token", clientData.token);
            localStorage.setItem("user", JSON.stringify(clientData.data));

            // Mostrar mensaje de éxito
            if (messageElement) {
                messageElement.textContent = 'Registro exitoso!';
                messageElement.classList.remove('d-none', 'alert-danger');
                messageElement.classList.add('alert-success');
            } else {
                alert('Registro exitoso!');
            }

            // Cerrar el modal y redirigir después de un breve delay
            setTimeout(() => {
                closeInterestForm();
                window.location.href = 'clientes.html';
            }, 2000);
        } else {
            throw new Error(interestData.message || 'Error al registrar el interés');
        }
    } catch (error) {
        console.error('Error:', error);
        if (messageElement) {
            messageElement.textContent = error.message || 'Error al procesar la solicitud';
            messageElement.classList.remove('d-none');
            messageElement.classList.add('alert-danger');
        } else {
            alert(error.message || 'Error al procesar la solicitud');
        }
    }
});

