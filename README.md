# ⚙️ Coffee E-Commerce — Backend (Strapi CMS)

Servidor y panel de administración *Headless CMS* desarrollado con **Strapi** para gestionar el catálogo de productos, categorías, órdenes y contenido multimedia del e-commerce de café.

🌐 **Tienda en Vivo (Frontend):** [Ir a la aplicación en Vercel](https://ecommerce-coffe-65yf.vercel.app/)  
💻 **Repositorio Frontend:** [Ver código en Next.js](https://ecommerce-coffe-backend-6st6.onrender.com/admin/auth/login)

---

## 🛠️ Stack Tecnológico

* **CMS & API:** Strapi (Node.js)
* **Base de Datos:** PostgreSQL (Alojada en Neon DB)
* **Almacenamiento Multimedia:** Cloudinary (Optimización y CDN de imágenes)
* **Despliegue:** Render

---

## ✨ Arquitectura y Características

* **API RESTful:** Endpoints estructurados y optimizados para el consumo directo desde el cliente en Next.js.
* **Base de Datos en la Nube:** Persistencia relacional configurada en producción con **PostgreSQL** sobre **Neon**.
* **Gestión de Archivos:** Integración nativa con el proveedor de **Cloudinary** para evitar la pérdida de imágenes en despliegues efímeros.
* **Control de Acceso:** Configuración de roles y permisos públicos para lectura segura de productos y categorías.

---

## 🚀 Instalación y Uso Local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com
   cd tu-repo-backend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto y completa los valores correspondientes a tu base de datos y credenciales de Cloudinary:
   ```env
   HOST=0.0.0.0
   PORT=1337
   APP_KEYS="tu_app_key_1,tu_app_key_2"
   API_TOKEN_SALT=tu_api_token_salt
   ADMIN_JWT_SECRET=tu_admin_jwt_secret
   TRANSFER_TOKEN_SALT=tu_transfer_token_salt
   JWT_SECRET=tu_jwt_secret

   # Base de datos (PostgreSQL / Neon)
   DATABASE_CLIENT=postgres
   DATABASE_URL=postgresql://usuario:password@host/nombre_db?sslmode=require

   # Almacenamiento de imágenes (Cloudinary)
   CLOUDINARY_NAME=tu_cloud_name
   CLOUDINARY_KEY=tu_api_key
   CLOUDINARY_SECRET=tu_api_secret
   ```

4. **Inicia el servidor en modo desarrollo:**
   ```bash
   npm run develop
   ```
   Accede al panel de administración en [http://localhost:1337/admin](http://localhost:1337/admin).
