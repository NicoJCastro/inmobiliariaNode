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
            const imagePath = property.imagen.startsWith('/images/') ? property.imagen : `/images/${property.imagen}`;

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