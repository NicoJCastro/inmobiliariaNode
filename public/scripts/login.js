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