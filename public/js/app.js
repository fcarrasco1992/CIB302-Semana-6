const productos = [
    { id: 1, nombre: "Camiseta Dryfit", descripcion: "Camiseta deportiva de secado rápido", precio: 14990, categoria: "Camisetas Deportivas", imagen: "img/dryfit.jpg" },
    { id: 2, nombre: "Camiseta Running", descripcion: "Camiseta ligera para correr", precio: 12990, categoria: "Camisetas Deportivas", imagen: "img/running.jpg" },
    { id: 3, nombre: "Camiseta Elasticada Gimnasio", descripcion: "Camiseta para entrenamientos elasticada", precio: 10990, categoria: "Camisetas Deportivas", imagen: "img/elasticada.jpg" },
    { id: 4, nombre: "Short Elasticado", descripcion: "Pantalón corto elasticado", precio: 16990, categoria: "Pantalones Deportivos", imagen: "img/short_el.jpg" },
    { id: 5, nombre: "Buzo Jogger", descripcion: "Buzo de algodón", precio: 19990, categoria: "Pantalones Deportivos", imagen: "img/jogger.jpg" },
    { id: 6, nombre: "Short Running", descripcion: "Pantalón corto ligero para correr", precio: 14990, categoria: "Pantalones Deportivos", imagen: "img/short_run.jpg" },
    { id: 7, nombre: "Botella Deportiva", descripcion: "Botella térmica 1000 mL", precio: 9990, categoria: "Accesorios Deportivos", imagen: "img/botella.jpg" },
    { id: 8, nombre: "Guantes Gimnasio", descripcion: "Guantes para levantamiento de pesas", precio: 8990, categoria: "Accesorios Deportivos", imagen: "img/guantes.jpg" },
    { id: 9, nombre: "Rodilleras Deportivas", descripcion: "Rodilleras de compresión para gimnasio", precio: 12990, categoria: "Accesorios Deportivos", imagen: "img/rodilleras.jpg" }
];

// ─── Auth0 ────────────────────────────────────────────────────────────────────

let auth0Client;

async function initAuth() {
    auth0Client = await auth0.createAuth0Client({
        domain: "dev-qaoeyz8r8w361i38.us.auth0.com",
        clientId: "KBshJpC7nWcydYp6tM5LijdktwKdvrCE",
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    });

    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        try {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
            console.log("Error en callback:", e);
        }
    }

    await updateUI();
}

async function login() {
    await auth0Client.loginWithRedirect();
}

async function logout() {
    sessionStorage.clear();
    await auth0Client.logout({
        logoutParams: { returnTo: window.location.origin }
    });
}

async function updateUI() {
    const isAuthenticated = await auth0Client.isAuthenticated();
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const welcomeMsg = document.getElementById('welcome-message');

    if (isAuthenticated) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        const user = await auth0Client.getUser();
        if (welcomeMsg) {
            welcomeMsg.textContent = `Bienvenido, ${user.name}`;
            welcomeMsg.style.display = 'block';
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (welcomeMsg) welcomeMsg.style.display = 'none';
    }
}

document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('logout-btn').addEventListener('click', logout);

// ─── Productos ────────────────────────────────────────────────────────────────

const productList = document.getElementById('product-list');

function formatearPrecio(precio) {
    return "$" + precio.toLocaleString('es-CL');
}

function renderizarProductos(listaParaMostrar = productos) {
    productList.innerHTML = '';

    listaParaMostrar.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'producto-card';
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width:100%; max-height:200px; object-fit:cover;">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>Precio: ${formatearPrecio(producto.precio)}</strong></p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        productList.appendChild(tarjeta);
    });
}

function filtrarProductos(categoria) {
    if (categoria === 'Todos') {
        renderizarProductos(productos);
    } else {
        const productosFiltrados = productos.filter(p => p.categoria === categoria);
        renderizarProductos(productosFiltrados);
    }
}

// ─── Carrito ──────────────────────────────────────────────────────────────────

let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    const itemEnCarrito = carrito.find(item => item.id === productoId);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarritoUI();
    guardarCarritoEnSessionStorage();
}

function aumentarCantidad(productoId) {
    const item = carrito.find(p => p.id === productoId);
    if (item) {
        item.cantidad++;
        actualizarCarritoUI();
        guardarCarritoEnSessionStorage();
    }
}

function disminuirCantidad(productoId) {
    const item = carrito.find(p => p.id === productoId);
    if (item) {
        item.cantidad--;
        if (item.cantidad === 0) {
            eliminarProducto(productoId);
        } else {
            actualizarCarritoUI();
            guardarCarritoEnSessionStorage();
        }
    }
}

function eliminarProducto(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    actualizarCarritoUI();
    guardarCarritoEnSessionStorage();
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarritoUI();
    guardarCarritoEnSessionStorage();
}

function actualizarCarritoUI() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';

    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        cartItems.innerHTML += `
            <p>
                ${item.nombre} - ${formatearPrecio(item.precio)}
                <button onclick="disminuirCantidad(${item.id})">-</button>
                <span>${item.cantidad}</span>
                <button onclick="aumentarCantidad(${item.id})">+</button>
                <button onclick="eliminarProducto(${item.id})">Eliminar</button>
            </p>`;
    });

    cartTotal.innerText = total.toLocaleString('es-CL');
}

function guardarCarritoEnSessionStorage() {
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
}

// ─── Modal formulario ─────────────────────────────────────────────────────────

function abrirFormulario() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }
    document.getElementById('modal-formulario').style.display = 'block';
}

function cerrarFormulario() {
    document.getElementById('modal-formulario').style.display = 'none';
}

// ─── Formulario y confirmación ────────────────────────────────────────────────

document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('name').value.trim();
    const direccion = document.getElementById('address').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('phone').value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingresa un correo electrónico válido.');
        return;
    }

    const telefonoRegex = /^\d{8,12}$/;
    if (!telefonoRegex.test(telefono)) {
        alert('Por favor ingresa un teléfono válido (solo números, entre 8 y 12 dígitos).');
        return;
    }

    const orderSummary = document.getElementById('order-summary');
    let resumen = `<p><strong>Nombre:</strong> ${nombre}</p>`;
    resumen += `<p><strong>Dirección:</strong> ${direccion}</p>`;
    resumen += `<p><strong>Correo:</strong> ${email}</p>`;
    resumen += `<p><strong>Teléfono:</strong> ${telefono}</p>`;
    resumen += `<hr><h3>Productos:</h3>`;

    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        resumen += `<p>${item.nombre} x${item.cantidad} — ${formatearPrecio(subtotal)}</p>`;
    });

    resumen += `<p><strong>Total: ${formatearPrecio(total)}</strong></p>`;
    orderSummary.innerHTML = resumen;

    cerrarFormulario();
    document.getElementById('confirmation-section').style.display = 'block';
});

// ─── Inicialización ───────────────────────────────────────────────────────────

renderizarProductos();
actualizarCarritoUI();
initAuth();