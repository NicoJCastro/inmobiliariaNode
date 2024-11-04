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

    try {
        const response = await fetch('/api/agentes/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        console.log("Respuesta completa del servidor:", data);

        if (response.ok) {
            // Verificar la estructura de la respuesta
            if (data.success && data.data) {
                // Estructura: { success: true, data: { token, agente } }
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("agente", JSON.stringify(data.data.agente));
            } else if (data.token && data.agente) {
                // Estructura: { token, agente }
                localStorage.setItem("token", data.token);
                localStorage.setItem("agente", JSON.stringify(data.agente));
            } else {
                console.error("Estructura de respuesta inesperada:", data);
                throw new Error("Respuesta del servidor no válida");
            }

            if (localStorage.getItem("token")) {
                console.log("Token guardado en localStorage");
            } else {
                console.error("No se ha recibido token");
            }

            if (localStorage.getItem("agente")) {
                console.log("Agente guardado en localStorage");
            } else {
                console.error("No se ha recibido agente");
            }
            
            // Establecer permisos por defecto
            const defaultPermissions = {
                canEdit: true,
                canDelete: true,
                canAdd: true
            };

            // Guardar los permisos en localStorage
            localStorage.setItem("userPermissions", JSON.stringify(defaultPermissions));
            
            // Redirigir a la página de lista de agentes
            window.location.href = 'agentes.html';
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

