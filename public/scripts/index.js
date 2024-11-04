document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:3000/api';
    const destacadasContainer = document.getElementById('featuredProperties'); // Obtener el contenedor de propiedades destacadas

    // Verificar si estamos en la página correcta
    if (!destacadasContainer) {
        console.warn('No se encontró el contenedor de propiedades destacadas');
        return;
    }

    // Cargar propiedades destacadas al iniciar
    loadDestacadasPropiedades();

    async function loadDestacadasPropiedades() {
        try {
            const response = await fetch(`${API_URL}/propiedades`);
            const data = await response.json();

            if (data.success) {
                if (Array.isArray(data.data)) {
                    displayDestacadasPropiedades(data.data);
                } else {
                    console.warn('La respuesta de la API no contiene un array de propiedades');
                    displayDestacadasPropiedades([]);
                }
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error cargando propiedades destacadas:', error);
            alert('Error al cargar las propiedades destacadas');
        }
    }

    function displayDestacadasPropiedades(properties) { // Mostrar propiedades destacadas en la página web (HTML) 
        if (!Array.isArray(properties)) {
            console.error('displayDestacadasPropiedades: properties no es un array', properties);
            return;
        }

        if (properties.length === 0) {
            destacadasContainer.innerHTML = '<p>No hay propiedades destacadas disponibles.</p>';
            return;
        }

        destacadasContainer.innerHTML = properties.map(property => {
            const imagePath = property.imagen && property.imagen.startsWith('/images/') ? property.imagen : `/images/${property.imagen || 'default.jpg'}`;

            return `
                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <img src="${imagePath}" class="card-img-top" alt="${property.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${property.titulo}</h5>
                            <p class="property-address">${property.direccion}</p>
                            <p class="property-type">${property.tipo}</p>
                            <p class="property-status">${property.estado}</p>
                            <p class="card-text">${property.descripcion}</p>
                            <p class="card-text fw-bold">$${property.precio.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
});

// Función para manejar el logout
function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userPermissions');
        localStorage.removeItem('agente');
        
        // Redirigir al login
        window.location.href = '/public/index.html';
    }
}

// Función para actualizar la visibilidad de los botones
function actualizarBotonesAuth() {
    const token = localStorage.getItem('token');
    const loginBtn = document.querySelector('.login-btn');
    const logoutBtn = document.querySelector('.logout-btn');

    if (!loginBtn || !logoutBtn) {
        console.error('No se encontraron los botones de login/logout');
        return;
    }

    if (token) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Cargado');
    
    // Agregar event listener al botón de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
        console.log('Event listener de logout agregado');
    } else {
        console.error('No se encontró el botón de logout');
    }

    // Actualizar visibilidad de botones
    actualizarBotonesAuth();
});

// Verificar sesión al cargar la página
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No hay token, mostrando botón de login');
    } else {
        console.log('Token encontrado, mostrando botón de logout');
    }
    actualizarBotonesAuth();
});