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

        if (response.ok) {
            // Guarda el token en localStorage
            localStorage.setItem("token", data.token);
            
            // Establecer permisos por defecto o usar los proporcionados por el servidor
            const defaultPermissions = {
                canEdit: false,
                canDelete: false,
                canAdd: false
            };

            // Si el servidor envía permisos, los combinamos con los valores por defecto
            const userPermissions = {
                ...defaultPermissions,
                ...(data.permissions || {}),
                // Si el usuario es admin, otorgar todos los permisos
                ...(data.isAdmin ? {
                    canEdit: true,
                    canDelete: true,
                    canAdd: true
                } : {})
            };

            // Guardar los permisos en localStorage
            localStorage.setItem("userPermissions", JSON.stringify(userPermissions));
            
            // Redirigir a la página de propiedades
            window.location.href = 'propiedades.html';
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