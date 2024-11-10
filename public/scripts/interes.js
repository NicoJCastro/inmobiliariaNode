const API_URL_INTERESES = 'http://localhost:3000/api';

document.getElementById('clientInterestForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Obtener todos los campos del formulario
    const clientName = document.getElementById('clientName').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientLastName = document.getElementById('clientLastName').value; 
    const clientPhone = document.getElementById('clientPhone').value; 
    const password = document.getElementById('clientPassword').value; 
    const interestType = document.getElementById('interestType').value;
    const propertyId = document.getElementById('propertyId').value;

    // Validación de campos obligatorios
    if (!clientName || !clientEmail || !clientLastName || !password || !interestType || !propertyId) {
        const messageElement = document.getElementById("interestMessage");
        messageElement.textContent = 'Todos los campos son obligatorios';
        messageElement.classList.remove('d-none');
        return;
    }

    try {

    // Consulto si el cliente ya existe
    const clienteExisteResp = await fetch(`${API_URL_INTERESES}/clientes?email=${clientEmail}`);
    const clienteExiste = await clienteExisteResp.json();

    let clienteId;
    if (clienteExiste.success && clienteExiste.data){
        clienteId = clienteExiste.data.id;
    } else {

    // Preparar datos del cliente
    const clientInfo = {
        nombre: clientName,
        apellido: clientLastName,
        email: clientEmail,
        password: password,
        telefono: clientPhone,
        tipoUsuario: 'cliente'
    };

      // Registrar al cliente
        const clientResponse = await fetch(`${API_URL_INTERESES}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientInfo)
        });

        const clientData = await clientResponse.json();

        if (!clientData.success) {
            const messageElement = document.getElementById("interestMessage");
            messageElement.textContent = clientData.message || 'Error al registrar el cliente';
            messageElement.classList.remove('d-none');
            return;
        }

        clienteId = clientData.data.id;
        localStorage.setItem("token", clientData.token);
        localStorage.setItem("user", JSON.stringify(clientData.data));
    }

        // Si el cliente se registró exitosamente, registrar el interés
        const interestInfo = {
            clienteId: clientData.data.id,
            propiedadId: propertyId,
            tipoInteres: interestType
        };

        const interestResponse = await fetch(`${API_URL}/intereses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(interestInfo)
        });

        const interestData = await interestResponse.json();

        if (interestData.success) {
            // Guardar token y datos del usuario como en el login
            localStorage.setItem("token", clientData.token);
            localStorage.setItem("user", JSON.stringify(clientData.data));

            // Mostrar mensaje de éxito
            const messageElement = document.getElementById("interestMessage");
            messageElement.textContent = 'Registro e interés guardados exitosamente';
            messageElement.classList.remove('d-none');
            messageElement.classList.remove('alert-danger');
            messageElement.classList.add('alert-success');

            // Opcional: redirigir al usuario
            setTimeout(() => {
                window.location.href = 'clientes.html';
            }, 2000);
        } else {
            const messageElement = document.getElementById("interestMessage");
            messageElement.textContent = interestData.message || 'Error al registrar el interés';
            messageElement.classList.remove('d-none');
        }
    } catch (error) {
        console.error("Error:", error);
        const messageElement = document.getElementById("interestMessage");
        messageElement.textContent = 'Error al conectar con el servidor';
        messageElement.classList.remove('d-none');
    }
});