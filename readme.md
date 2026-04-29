# Tienda Virtual: SportyStyle

Proyecto para la asignatura "Taller de plataformas Web". Aplicación web de venta de ropa deportiva con autenticación y gestión de carrito.

## Documentación Técnica

### 1. Flujo de autenticación (Auth0)
La aplicación utiliza el SDK de cliente de Auth0 para gestionar la autenticación. Al iniciar sesión, el SDK maneja automáticamente los tokens JWT y la validación de la sesión. Una vez autenticado, la tienda identifica al usuario y muestra un mensaje de bienvenida personalizado en la interfaz.

### 2. Proceso de selección de productos
La tienda cuenta con productos categorizados (camisetas, pantalones y accesorios). Al presionar el botón "Agregar al carrito", la información del producto se captura y se guarda en el `Session Storage` del navegador, lo que permite que el carrito se actualice dinámicamente y persista mientras la sesión esté activa.

### 3. Protección de la sesión con Session Storage
Utilizamos `Session Storage` para mantener el estado del carrito durante la navegación del usuario. Los datos se eliminan automáticamente al cerrar sesión o al finalizar la compra, asegurando que la información de la sesión no persista innecesariamente en el navegador.

## Funcionalidades implementadas
- [x] Autenticación con Auth0 (login/logout).
- [x] Selección de productos (catálogo con descripción, precio e imagen).
- [x] Carrito de compras funcional (con cálculo de total).
- [x] Formulario de pago con validaciones simples (correo electrónico y formato de teléfono).
- [x] Persistencia de datos mediante Session Storage.

## Cómo ejecutar el proyecto

1. Clona el repositorio:
   ```
   git clone https://github.com/fcarrasco1992/CIB302-Semana-6.git
   ```
2. Instala las dependencias necesarias:
   ```
   npm install
   ```
3. Inicia el servidor:
   ```
   node server.js
   ```

## Autor
- Felipe Carrasco González