/* ========================================
   CALZADO SHOGUN - Base de datos productos
   ======================================== */

const PRODUCTOS = [
  {
    id: 1,
    nombre: "Clásico Urbano",
    categoria: "hombre",
    precio: 189000,
    precioOriginal: 220000,
    colores: ["#1a1a2e", "#c8a96e", "#ffffff"],
    tallas: ["39", "40", "41", "42", "43", "44"],
    badge: "Nuevo",
    descripcion: "Zapato casual de cuero sintético con suela antideslizante. Ideal para el día a día.",
    imagen: null // Reemplaza con: "img/productos/clasico-urbano.jpg"
  },
  {
    id: 2,
    nombre: "Elegance Pro",
    categoria: "mujer",
    precio: 215000,
    precioOriginal: null,
    colores: ["#8b0000", "#1a1a2e", "#d4af7a"],
    tallas: ["35", "36", "37", "38", "39", "40"],
    badge: "Popular",
    descripcion: "Tacón bajo con diseño refinado. Comodidad y elegancia en cada paso.",
    imagen: null
  },
  {
    id: 3,
    nombre: "Runner X200",
    categoria: "deportivo",
    precio: 245000,
    precioOriginal: 290000,
    colores: ["#e94560", "#1a1a2e", "#4a90d9"],
    tallas: ["38", "39", "40", "41", "42", "43", "44"],
    badge: "Oferta",
    descripcion: "Zapatilla deportiva con tecnología de amortiguación. Perfecta para correr.",
    imagen: null
  },
  {
    id: 4,
    nombre: "Street Style",
    categoria: "unisex",
    precio: 175000,
    precioOriginal: null,
    colores: ["#ffffff", "#1a1a2e", "#c8a96e"],
    tallas: ["36", "37", "38", "39", "40", "41", "42"],
    badge: null,
    descripcion: "Tenis casuales de estilo urbano. Versátiles y cómodos para cualquier look.",
    imagen: null
  },
  {
    id: 5,
    nombre: "Mini Star",
    categoria: "nino",
    precio: 135000,
    precioOriginal: 155000,
    colores: ["#4a90d9", "#e94560", "#90c990"],
    tallas: ["28", "29", "30", "31", "32", "33", "34"],
    badge: "Nuevo",
    descripcion: "Zapato escolar resistente y cómodo. Suela flexible para los más pequeños.",
    imagen: null
  },
  {
    id: 6,
    nombre: "Oxford Formal",
    categoria: "hombre",
    precio: 265000,
    precioOriginal: null,
    colores: ["#1a1a2e", "#3b2314", "#555555"],
    tallas: ["39", "40", "41", "42", "43", "44", "45"],
    badge: null,
    descripcion: "Zapato formal de cuero con puntera clásica. Para ocasiones especiales.",
    imagen: null
  },
  {
    id: 7,
    nombre: "Boho Chic",
    categoria: "mujer",
    precio: 198000,
    precioOriginal: 230000,
    colores: ["#d4af7a", "#8b5e3c", "#ffffff"],
    tallas: ["35", "36", "37", "38", "39"],
    badge: "Oferta",
    descripcion: "Sandalia con detalles artesanales. Estilo bohemio para el verano.",
    imagen: null
  },
  {
    id: 8,
    nombre: "Trail Blazer",
    categoria: "deportivo",
    precio: 278000,
    precioOriginal: null,
    colores: ["#3b5323", "#8b4513", "#1a1a2e"],
    tallas: ["38", "39", "40", "41", "42", "43"],
    badge: "Popular",
    descripcion: "Bota deportiva para senderismo. Impermeabilidad y agarre en terreno difícil.",
    imagen: null
  }
];

/* ========================================
   FUNCIONES UTILITARIAS
   ======================================== */

// Formatear precio en pesos colombianos
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio);
}

// Obtener productos por categoría
function obtenerPorCategoria(categoria) {
  if (!categoria || categoria === 'todos') return PRODUCTOS;
  return PRODUCTOS.filter(p => p.categoria === categoria);
}

// Obtener producto por ID
function obtenerPorId(id) {
  return PRODUCTOS.find(p => p.id === parseInt(id));
}

// Buscar productos
function buscarProductos(termino) {
  const t = termino.toLowerCase().trim();
  return PRODUCTOS.filter(p =>
    p.nombre.toLowerCase().includes(t) ||
    p.categoria.toLowerCase().includes(t) ||
    p.descripcion.toLowerCase().includes(t)
  );
}

// Generar HTML de una tarjeta de producto
function generarTarjetaProducto(producto) {
  const precioFormateado = formatearPrecio(producto.precio);
  const precioOriginalHTML = producto.precioOriginal
    ? `<span class="producto-precio-original">${formatearPrecio(producto.precioOriginal)}</span>`
    : '';
  const badgeHTML = producto.badge
    ? `<span class="producto-badge">${producto.badge}</span>`
    : '';

  // Círculos de colores
  const coloresHTML = producto.colores.map((color, i) =>
    `<div class="color-circulo ${i === 0 ? 'activo' : ''}"
          style="background:${color}"
          title="${color}"
          onclick="seleccionarColor(this, ${producto.id})"></div>`
  ).join('');

  // Botones de tallas
  const tallasHTML = producto.tallas.map((talla, i) =>
    `<button class="talla-btn ${i === 0 ? 'activo' : ''}"
             onclick="seleccionarTalla(this, ${producto.id})"
             data-talla="${talla}">${talla}</button>`
  ).join('');

  // Imagen o placeholder
  const imagenHTML = producto.imagen
    ? `<img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" />`
    : `<div class="producto-imagen-placeholder">
         <i class="fas fa-shoe-prints"></i>
         <span>Foto próximamente</span>
       </div>`;

  // Mensaje WhatsApp
  const msgWA = encodeURIComponent(
    `Hola! Me interesa el producto: *${producto.nombre}* por ${precioFormateado}. ¿Tienen disponibilidad?`
  );

  return `
    <div class="producto-card" data-id="${producto.id}" data-categoria="${producto.categoria}">
      <div class="producto-imagen-wrap">
        ${imagenHTML}
        ${badgeHTML}
        <div class="producto-acciones-rapidas">
          <button class="btn-accion-rapida" title="Ver detalle"
                  onclick="verDetalle(${producto.id})">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="producto-info">
        <span class="producto-categoria-tag">${producto.categoria}</span>
        <h3 class="producto-nombre">${producto.nombre}</h3>
        <div class="producto-precio">
          ${precioOriginalHTML}${precioFormateado}
        </div>
        <div class="producto-colores">${coloresHTML}</div>
        <div class="producto-tallas">${tallasHTML}</div>
        <div class="producto-botones">
          <button class="btn-agregar-carrito"
                  onclick="agregarAlCarrito(${producto.id})">
            <i class="fas fa-shopping-bag"></i> Agregar al carrito
          </button>
          <a href="https://wa.me/+57 315 4300377?text=${msgWA}"
             target="_blank"
             class="btn-whatsapp-producto">
            <i class="fab fa-whatsapp"></i> Comprar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;
}

// Renderizar lista de productos en un contenedor
function renderizarProductos(productos, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  if (productos.length === 0) {
    contenedor.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--color-texto-suave);">
        <i class="fas fa-search" style="font-size:3rem; opacity:0.2; display:block; margin-bottom:1rem;"></i>
        <p>No encontramos productos con ese criterio.</p>
        <button onclick="limpiarFiltros()" class="btn-primario" style="margin-top:1rem;">
          Ver todos
        </button>
      </div>`;
    return;
  }

  contenedor.innerHTML = productos.map(generarTarjetaProducto).join('');
}

// Seleccionar color en tarjeta
function seleccionarColor(elemento, productoId) {
  const tarjeta = elemento.closest('.producto-card');
  tarjeta.querySelectorAll('.color-circulo').forEach(c => c.classList.remove('activo'));
  elemento.classList.add('activo');
}

// Seleccionar talla en tarjeta
function seleccionarTalla(elemento, productoId) {
  const tarjeta = elemento.closest('.producto-card');
  tarjeta.querySelectorAll('.talla-btn').forEach(b => b.classList.remove('activo'));
  elemento.classList.add('activo');
}

// Ver detalle (redirige a producto.html)
function verDetalle(id) {
  
  window.location.href = `producto.html?id=${id}`;
}

// Al cargar el DOM, mostrar destacados en index
document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('productosDestacados');
  if (contenedor) {
    // Mostrar solo los primeros 4 como destacados
    renderizarProductos(PRODUCTOS.slice(0, 4), 'productosDestacados');
  }
});
