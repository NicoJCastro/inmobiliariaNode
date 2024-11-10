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
   const loginInfo = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
   }
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    const loginUrl = tipoUsuario === 'agente' ? '/api/agentes/login' : '/api/clientes/login';

    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginInfo)
        });
        const data = await response.json();    

        console.log("Respuesta completa del servidor:", data);

        if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.data));
            window.location.href = tipoUsuario === 'agente' ? 'agentes.html' : 'clientes.html';
        } else {
            const messageElement = document.getElementById("loginMessage");
            messageElement.textContent = data.message || 'Error en el inicio de sesión';
            messageElement.classList.remove('d-none');
        }
    } catch (error) {
        console.error("Error:", error);
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
    const tipoUsuarioElement = document.getElementById('tipoUsuarioRegistrar');
    

    if (!nombre || !apellido || !email || !password || !tipoUsuarioElement.value) {
        const messageElement = document.getElementById("registerMessage");
        messageElement.textContent = 'Todos los campos son obligatorios';
        messageElement.classList.remove('d-none');
        return;
    }

    const tipoUsuario = tipoUsuarioElement.value;   

    const registerInfo = {
        nombre,
        apellido,
        email,
        password,
        telefono,
        tipoUsuario,        
    };

    const registerUrl = tipoUsuario === 'agente' ? '/api/agentes/register' : '/api/clientes';

    try {
        const response = await fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerInfo)
        });
        const data = await response.json();

        console.log("Respuesta completa del servidor:", data);

        if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.data));
            window.location.href = tipoUsuario === 'agente' ? 'agentes.html' : 'clientes.html';
        } else {
            const messageElement = document.getElementById("registerMessage");
            messageElement.textContent = data.message || 'Error en el registro';
            messageElement.classList.remove('d-none');
        }
    } catch (error) {
        console.error("Error:", error);
        const messageElement = document.getElementById("registerMessage");
        messageElement.textContent = 'Error al conectar con el servidor';
        messageElement.classList.remove('d-none');
    }
});