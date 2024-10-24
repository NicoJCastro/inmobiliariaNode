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
                displayProperties([]); // Maneja el caso donde data.data no es un array
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

    propertiesGrid.innerHTML = properties.map(property => `
        <div class="property-card">
            <img src="/api/placeholder/400/320" alt="Propiedad" class="property-image">
        </div>
    `).join('');
}

async function createProperty(propertyData) {
    try {
        const response = await fetch(`${API_URL}/propiedades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(propertyData)
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