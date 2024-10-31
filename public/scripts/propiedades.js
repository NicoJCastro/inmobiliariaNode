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

function displayProperties(properties) {
    if (!Array.isArray(properties)) {
        console.error('displayProperties: properties no es un array', properties);
        return;
    }

    if (properties.length === 0) {
        propertiesGrid.innerHTML = '<p>No hay propiedades disponibles.</p>';
        return;
    }

    propertiesGrid.innerHTML = properties.map(property => {
        console.log('property.imagen:', property.imagen); // Imprime el valor de property.imagen

        // Ajusta la ruta de la imagen para evitar duplicados
        const imagePath = property.imagen.startsWith('/images/') ? property.imagen : `/images/${property.imagen}`;

        return `
            <div class="property-card">
                ${property.imagen ? `<img src="${imagePath}" alt="${property.titulo}" class="property-image" onerror="this.style.display='none'">` : ''}
                <div class="property-info">
                    <h3>${property.titulo}</h3>
                    <p class="property-code">Código: ${property.codigo}</p>
                    <p class="property-price">$${property.precio.toLocaleString()}</p>
                    <p class="property-address">${property.direccion}</p>
                    <p class="property-type">${property.tipo}</p>
                    <p class="property-status">${property.estado}</p>
                    <div class="property-actions">
                        <button onclick="editProperty(${property.id})" class="btn btn-edit">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="deleteProperty(${property.id})" class="btn btn-delete">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function createProperty(formData) {
    try {
        console.log('Form Data:', [...formData]);
        const response = await fetch(`${API_URL}/propiedades`, {
            method: 'POST',
            body: formData // Aquí usamos el FormData en lugar de JSON.stringify
        });

        const data = await response.json();

        if (data.success) {
            alert('Propiedad creada exitosamente');
            loadProperties(); // Recarga las propiedades después de crear una nueva
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error creando propiedad:', error);
        alert('Error al crear la propiedad');
    }
}

propertyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(propertyForm); // Usamos FormData para enviar archivos
    createProperty(formData);
});

async function deleteProperty(id) {
    if (confirm('¿Estás seguro de querer eliminar esta propiedad?')) {
        try {
            const response = await fetch(`${API_URL}/propiedades/${id}`, {
                method: 'DELETE'
            });

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

// Event Listeners
filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(filterForm);
    const filters = Object.fromEntries(formData.entries());
    loadProperties(filters);
});

addPropertyBtn.addEventListener('click', () => {
    propertyModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    propertyModal.style.display = 'none';
});

propertyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(propertyForm);
    const propertyData = Object.fromEntries(formData.entries());
    createProperty(propertyData);
});

window.addEventListener('click', (e) => {
    if (e.target === propertyModal) {
        propertyModal.style.display = 'none';
    }
});

// Cargar propiedades al iniciar
loadProperties();