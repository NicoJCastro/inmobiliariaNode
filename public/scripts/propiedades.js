const API_URL = 'http://localhost:3000/api';

// Elementos DOM
const propertiesGrid = document.getElementById('propertiesGrid');
const filterForm = document.getElementById('filterForm');
const propertyModal = document.getElementById('propertyModal');
const propertyForm = document.getElementById('propertyForm');
const addPropertyBtn = document.getElementById('addPropertyBtn');
const closeModal = document.querySelector('.close-modal');

// Funciones
async function loadProperties(filters = {}) {
    try {
        let url = `${API_URL}/propiedades`;
        if (Object.keys(filters).length > 0) {
            const params = new URLSearchParams(filters);
            url = `${API_URL}/propiedades/search?${params}`;
        }

        console.log('Fetching URL:', url); // Verifica la URL

        const response = await fetch(url);
        const data = await response.json();

        console.log('API Response:', data); // Verifica la respuesta

        if (data.success) {
            if (Array.isArray(data.data)) {
                displayProperties(data.data);
            } else {
                console.warn('La respuesta de la API no contiene un array de propiedades');
                displayProperties([]); 
            }
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error cargando propiedades:', error);
        alert('Error al cargar las propiedades');
    }
}

async function chequearPermisos(){
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/agentes/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.data;
    }catch (error) {
        console.error('Error verificando token:', error);
        return null;
} 
}

function displayProperties(properties) {
    if (!Array.isArray(properties)) {
        console.error('displayProperties: properties no es un array', properties);
        return;
    }

    if (properties.length === 0) {
        propertiesGrid.innerHTML = '<p>No hay propiedades disponibles.</p>';
        return;
    }

    const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
    const canEdit = userPermissions.canEdit;
    const canDelete = userPermissions.canDelete;
    const canAdd = userPermissions.canAdd;

    // Mostrar/ocultar botón de agregar propiedad
    const addPropertyBtn = document.getElementById('addPropertyBtn');
    if (addPropertyBtn) {
        addPropertyBtn.style.display = canAdd ? 'block' : 'none';
    }

    propertiesGrid.innerHTML = properties.map(property => {
        console.log('property.imagen:', property.imagen); // Imprime el valor de property.imagen

        // Verifica si property.imagen es válido antes de usar startsWith
        const imagePath = property.imagen && property.imagen.startsWith('/images/') ? property.imagen : `/images/${property.imagen || 'default.jpg'}`;

            // Generar botones de acciones según permisos
            const actionButtons = [];
        
            if (canEdit) {
                actionButtons.push(`
                    <button onclick="editProperty(${property.id})" class="btn btn-edit">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                `);
            }
            
            if (canDelete) {
                actionButtons.push(`
                    <button onclick="deleteProperty(${property.id})" class="btn btn-delete">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                `);
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
                    ${actionButtons.length > 0 ? `
                        <div class="property-actions">
                            ${actionButtons.join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

async function createProperty(formData) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/propiedades`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData // Usar formData directamente
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Sesión expirada');
            }
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();

        if (data.success) {
            return data;
        } else {
            throw new Error(data.error || 'Error al crear la propiedad');
        }
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

            // Guardar la imagen actual en un campo oculto VER en HTLM <input type="hidden" name="currentImage" value="">
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
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
        const url = id ? `${API_URL}/propiedades/${id}` : `${API_URL}/propiedades`; // Si tengo un ID uso la URL de actualización, de lo contrario la de creación

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}` // Enviar el token de autenticación en el encabezado de la solicitud
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

        const data = await response.json(); // Esperar la respuesta de la API y convertirla a JSON para leerla correctamente 

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

// Event Listeners para abrir y cerrar el modal de propiedades y para enviar el formulario de filtros y el de propiedades 
filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(filterForm);
    const filters = Object.fromEntries(formData.entries());
    loadProperties(filters);
});

addPropertyBtn.addEventListener('click', () => { // Abrir el modal de propiedades al hacer click en el botón de agregar propiedad 
    propertyModal.style.display = 'flex';
    propertyForm.reset();
    propertyForm.elements['imagen'].required = true; // Hacer que la imagen sea obligatoria al agregar una nueva propiedad

    // Cambiar el evento submit del formulario para crear una nueva propiedad
    propertyForm.onsubmit = (e) => handlePropertyFormSubmit(e);
});

closeModal.addEventListener('click', () => {
    propertyModal.style.display = 'none';
});


// Cargar propiedades al iniciar
loadProperties();