## Levantar el proyecto:
1. Clonar repositorio 
2. Abrir terminal en raiz del proyecto
3. Escribir:  

    ```bash
    docker-compose up --build
    ```

## Estructura

El proyecto esta construido en una arquitectura monorepo.  
Lo que permite separar el `backend/`y  `frontend/` 


### Raíz
```bash
.
├── backend/                # Servidor PostgreSQL      
├── docker-compose.yml      # Levanta backend y frontend
├── frontend/               # Frontend con componeentes
└── README.md               # Este archivo
```
### frontend/
```bash
.
├── Dockerfile
├── eslint.config.js    # Reglas de estilo
├── index.html          # Pagina del navegador. React inyecta el code de forma dinamica
├── package.json
├── package-lock.json
├── public/             # Archivos estaticos (PDFs, iconos de pestañas)
├── src
│   ├── App.css         # Estilo App.jsx
│   ├── App.jsx         # Organiza y renderiza las vistas. Mantiene estructura global (ej: navbar, footer)
│   ├── assets/         # Archivos multimedia
│   ├── components/     # Componentes reutilizables (ej: boton, navbar)
│   ├── index.css       # Estilos globales de todo el proyecto (ej: tipografia, color por defecto)
│   ├── main.jsx        # Enlace del codigo de React con el HTML
│   ├── services/       # Peticiones al backend
│   └── views/          # Paginas completas
└── vite.config.js
```

### backend/
```bash
.
├── Dockerfile
├── package.json
├── package-lock.json
└── src/
    ├── config/ 
    │   └── db.js       # Gestiona las consultas con la BDD
    └── index.js        # Verifica que la base de datos responda
```