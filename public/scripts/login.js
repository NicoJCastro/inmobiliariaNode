const AGENTES_API_URL = '/api/agentes';

document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const tipoUsuario = document.getElementById("tipoUsuario").value;

    const loginUrl = tipoUsuario === 'agente' ? '/api/agentes/login' : '/api/clientes';

    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        console.log("Respuesta completa del servidor:", data);

        if (response.ok) {
            // Usamos la estructura de respuesta esperada para guardar el token en localStorage
            if (data.success && data.data) {                
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("user", JSON.stringify(data.data.agente || data.data.cliente));

                if (tipoUsuario === 'agente') {
                    window.location.href = 'agentes.html';
                } else {
                    window.location.href = 'clientes.html';
                }

                const isAdmin = data.data.agente && (data.data.agente.nombre === 'admin' || data.data.agente.email === 'admin@ejemplo.com');
                localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
                
            } else if (data.token && (data.agente || data.cliente)) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.agente || data.cliente));
                const isAdmin = data.agente && (data.agente.nombre === 'admin' || data.agente.email === 'admin@ejemplo.com');
                localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
            } else {
                console.error("Estructura de respuesta inesperada:", data);
                throw new Error("Respuesta del servidor no válida");
            }

            if (localStorage.getItem("token")) {
                console.log("Token guardado en localStorage");
            } else {
                console.error("No se ha recibido token");
            }

            if (localStorage.getItem("user")) {
                console.log("Usuario guardado en localStorage");
            } else {
                console.error("No se ha recibido usuario");
            }
            
            // Establecer permisos por defecto
            const defaultPermissions = {
                canEdit: true,
                canDelete: true,
                canAdd: true
            };

            // Guardar los permisos en localStorage
            localStorage.setItem("userPermissions", JSON.stringify(defaultPermissions));
            
            // Redirigir a la página de lista de agentes o clientes
            window.location.href = tipoUsuario === 'agente' ? 'agentes.html' : 'clientes.html';
        } else {
            // Mostrar mensaje de error
            const messageElement = document.getElementById("loginMessage");
            messageElement.textContent = data.message || 'Error en el inicio de sesión';
            messageElement.classList.remove('d-none');
        }
    } catch (error) {
        console.error("Error:", error);
        // Mostrar mensaje de error genérico
        const messageElement = document.getElementById("loginMessage");
        messageElement.textContent = 'Error al conectar con el servidor';
        messageElement.classList.remove('d-none');
    }
});

document.getElementById('showRegisterForm').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
});

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('registerNombre').value;
    const apellido = document.getElementById('registerApellido').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const telefono = document.getElementById('registerTelefono').value;

    try {
        const response = await fetch(`${AGENTES_API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, apellido, email, password, telefono })
        });
        const data = await response.json();

        if (data.success) {
            alert('Registro exitoso. Por favor, inicia sesión.');
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        } else {
            throw new Error(data.error || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        alert('Error en el registro: ' + error.message);
    }
});