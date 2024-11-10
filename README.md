inmobiliaria-api/
├── node_modules/
├── public/            👈 Archivos estáticos como imágenes, CSS, JS
|   ├── images/
|   ├── styles/
|   └── scripts/
├── src/
│   ├── rutas/           👈 Maneja las peticiones HTTP y las redirige a los controladores
│   │   ├── propiedadesRura.js
│   │   ├── agentesRura.js
│   │   ├── interesesRura.js
│   │   └── clientesRura.js
│   ├── controladores/      👈 Contiene la lógica de la aplicación, llama a los modelos y retorna la respuesta adecuada
│   │   ├── propiedadControlador.js
│   │   ├── agenteControlador.js
│   │   ├── interesesControlador.js
│   │   └── clienteControlador.js
│   ├── modelos/           👈 Define las estructuras de datos y las interacciones con la base de datos
│   │   ├── Propiedad.js
│   │   ├── Agente.js
│   │   ├── Intereses.js        
│   │   └── Cliente.js
│   ├── middleware/       👈 Para autenticación, validación, manejo de errores, etc.
│   │   ├── auth.js
│   │   └── fileImageUpload.js
│   ├── config/           👈 Configuración de la base de datos y otras configuraciones globales
│   │   └── db.js
│   ├── utilidades/            👈 Funciones auxiliares en este caso para enviar mails. La cual tiene errores
│   │   └── emailService.js
│   
└── app.js            👈 Configura Express, conecta middlewares y rutas
├── .env                  👈 Variables de entorno para información sensible
├── .gitignore            👈 Archivos y carpetas que no se deben subir al control de versiones
└── package.json

### Descripción de cada carpeta

- **public**: Contiene archivos estáticos como imágenes, CSS y JavaScript.
- **src**: Es el corazón de la aplicación, donde reside toda la lógica.
  - **rutas**: Maneja las rutas HTTP y redirige las peticiones a los controladores correspondientes.
  - **controladores**: Contiene la lógica de negocio, llama a los modelos y retorna las respuestas adecuadas.
  - **modelos**: Define las estructuras de datos y las interacciones con la base de datos.
  - **middleware**: Incluye lógica de interceptación como autenticación, validación y manejo de errores.
  - **config**: Configuración de la base de datos y otras configuraciones globales.
  - **utilidades**: Funciones auxiliares y utilitarias.
  - **app.js**: Configura Express, conecta middlewares y rutas; es el punto de entrada de la aplicación.

### Explicación MVC

La arquitectura MVC (Modelo-Vista-Controlador) es un patrón de diseño que separa una aplicación en tres componentes principales:

- **Modelo (Model)**: 
  - Representa la estructura de los datos y la lógica de negocio.
  - Se encarga de la gestión de la base de datos, las validaciones y las reglas de negocio.
  - En una aplicación Node.js, los modelos suelen estar definidos en la carpeta `models`.

- **Vista (View)**: 
  - Es la interfaz de usuario, lo que el usuario ve y con lo que interactúa.
  - Se encarga de presentar los datos al usuario de manera adecuada.
  - En aplicaciones web, las vistas pueden ser archivos HTML, plantillas renderizadas por el servidor o componentes frontend.

- **Controlador (Controller)**: 
  - Actúa como intermediario entre el modelo y la vista.
  - Recibe las peticiones del usuario, llama al modelo para obtener los datos necesarios y selecciona la vista adecuada para mostrar esos datos.
  - En una aplicación Node.js, los controladores suelen estar definidos en la carpeta `controllers`.

Este patrón ayuda a organizar el código de manera que sea más fácil de mantener y escalar, separando claramente las responsabilidades de cada componente.



### Express  

Es un framework web para Node.js
Nos ayuda a crear el servidor web y manejar:

Rutas (URLs de la API)
Middlewares
Peticiones HTTP (GET, POST, PUT, DELETE)

### MySQL2

Es el driver que permite conectar Node.js con MySQL
Nos permite ejecutar consultas a la base de datos
Conexión manual a la bd.

### dotenv

Permite manejar variables de entorno
Útil para guardar datos sensibles (contraseñas, claves API)
Se crea en un archivo .env

### nodemon (dependencia de desarrollo)

Reinicia automáticamente el servidor cuando detecta cambios en el código
Solo se usa durante el desarrollo
Por eso se instala con --save-dev
Ejecutar npm run dev

