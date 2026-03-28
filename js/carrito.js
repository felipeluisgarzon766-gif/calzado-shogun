/* ========================================
   CALZADO SHOGUN - Carrito de Compras
   ======================================== */

// Estado del carrito
let carrito = JSON.parse(localStorage.getItem('shogun_carrito')) || [];

/* ========================================
   FUNCIONES PRINCIPALES
   ======================================== */

// Agregar producto al carrito
function agregarAlCarrito(productoId) {
  const producto = obtenerPorId(productoId);
  if (!producto) return;

  // Obtener talla seleccionada
  const tarjeta = document.querySelector(`.producto-card[data-id="${productoId}"]`);
  const tallaActiva = tarjeta
    ? tarjeta.querySelector('.talla-btn.activo')?.dataset.talla
    : producto.tallas[0];

  // Obtener color seleccionado
  const colorActivo = tarjeta
    ? tarjeta.querySelector('.color-circulo.activo')?.style.background
    : producto.colores[0];

  // Clave única por producto + talla + color
  const claveItem = `${productoId}-${tallaActiva}-${colorActivo}`;

  const itemExistente = carrito.find(item => item.clave === claveItem);

  if (itemExistente) {
    itemExistente.cantidad += 1;
    mostrarToast(`✓ Se agregó otra unidad de ${producto.nombre}`);
  } else {
    carrito.push({
      clave:     claveItem,
      id:        producto.id,
      nombre:    producto.nombre,
      precio:    producto.precio,
      talla:     tallaActiva,
      color:     colorActivo,
      imagen:    producto.imagen,
      cantidad:  1
    });
    mostrarToast(`✓ ${producto.nombre} agregado al carrito`);
  }

  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
  abrirCarrito();
}

// Eliminar item del carrito
function eliminarDelCarrito(clave) {
  carrito = carrito.filter(item => item.clave !== clave);
  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
}

// Cambiar cantidad de un item
function cambiarCantidad(clave, delta) {
  const item = carrito.find(i => i.clave === clave);
  if (!item) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    eliminarDelCarrito(clave);
    return;
  }

  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
}

// Vaciar carrito completo
function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
}

/* ========================================
   GUARDAR Y CARGAR
   ======================================== */

function guardarCarrito() {
  localStorage.setItem('shogun_carrito', JSON.stringify(carrito));
}

/* ========================================
   ACTUALIZAR UI
   ======================================== */

// Actualizar número del contador
function actualizarContador() {
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const contadores = document.querySelectorAll('#carritoContador');
  contadores.forEach(c => {
    c.textContent = total;
    c.style.display = total === 0 ? 'none' : 'flex';
  });
}

// Renderizar items en el panel
function renderizarCarrito() {
  const listaEl    = document.getElementById('carritoItems');
  const vacioEl    = document.getElementById('carritoVacio');
  const footerEl   = document.getElementById('carritoFooter');
  const totalEl    = document.getElementById('carritoTotal');

  if (!listaEl) return;

  if (carrito.length === 0) {
    listaEl.innerHTML = '';
    if (vacioEl)  vacioEl.style.display  = 'flex';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (vacioEl)  vacioEl.style.display  = 'none';
  if (footerEl) footerEl.style.display = 'block';

  // Calcular total
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  if (totalEl) totalEl.textContent = formatearPrecio(total);

  // Renderizar cada item
  listaEl.innerHTML = carrito.map(item => {
    const imagenHTML = item.imagen
      ? `<img src="${item.imagen}" alt="${item.nombre}" />`
      : `<i class="fas fa-shoe-prints"></i>`;

    return `
      <li class="carrito-item">
        <div class="carrito-item-imagen">${imagenHTML}</div>
        <div class="carrito-item-info">
          <span class="carrito-item-nombre">${item.nombre}</span>
          <span class="carrito-item-detalle">
            Talla: ${item.talla}
            <span style="display:inline-block; width:14px; height:14px;
                         border-radius:50%; background:${item.color};
                         border:1px solid #ccc; vertical-align:middle;
                         margin-left:6px;"></span>
          </span>
          <span class="carrito-item-precio">${formatearPrecio(item.precio * item.cantidad)}</span>
          <div class="carrito-item-cantidad">
            <button class="btn-cantidad" onclick="cambiarCantidad('${item.clave}', -1)">−</button>
            <span class="cantidad-numero">${item.cantidad}</span>
            <button class="btn-cantidad" onclick="cambiarCantidad('${item.clave}', 1)">+</button>
          </div>
        </div>
        <button class="btn-eliminar-item" onclick="eliminarDelCarrito('${item.clave}')"
                title="Eliminar">
          <i class="fas fa-times"></i>
        </button>
      </li>`;
  }).join('');
}

/* ========================================
   ABRIR / CERRAR PANEL
   ======================================== */

function abrirCarrito() {
  const panel   = document.getElementById('carritoPanel');
  const overlay = document.getElementById('overlay');
  if (panel)   panel.classList.add('abierto');
  if (overlay) overlay.classList.add('activo');
  document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
  const panel   = document.getElementById('carritoPanel');
  const overlay = document.getElementById('overlay');
  if (panel)   panel.classList.remove('abierto');
  if (overlay) overlay.classList.remove('activo');
  document.body.style.overflow = '';
}

/* ========================================
   PEDIDO POR WHATSAPP
   ======================================== */

function enviarPedidoWhatsApp() {
  if (carrito.length === 0) return;

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  let mensaje = '🛍️ *Nuevo pedido - Calzado Shogun*\n\n';
  carrito.forEach((item, i) => {
    mensaje += `${i + 1}. *${item.nombre}*\n`;
    mensaje += `   • Talla: ${item.talla}\n`;
    mensaje += `   • Cantidad: ${item.cantidad}\n`;
    mensaje += `   • Precio: ${formatearPrecio(item.precio * item.cantidad)}\n\n`;
  });
  mensaje += `━━━━━━━━━━━━━━━━\n`;
  mensaje += `💰 *Total: ${formatearPrecio(total)}*\n\n`;
  mensaje += `Por favor confirmar disponibilidad y datos de envío. ¡Gracias!`;

  const url = `https://wa.me/573000000000?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

/* ========================================
   TOAST / NOTIFICACIÓN
   ======================================== */

function mostrarToast(mensaje) {
  // Eliminar toast anterior si existe
  const toastAnterior = document.querySelector('.toast');
  if (toastAnterior) toastAnterior.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${mensaje}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('salida');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ========================================
   EVENTOS AL CARGAR LA PÁGINA
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Botón abrir carrito
  const btnCarrito = document.getElementById('btnCarrito');
  if (btnCarrito) btnCarrito.addEventListener('click', abrirCarrito);

  // Botón cerrar carrito
  const btnCerrar = document.getElementById('btnCerrarCarrito');
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarCarrito);

  // Overlay cierra carrito y menú
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.addEventListener('click', () => {
    cerrarCarrito();
    cerrarMenu();
  });

  // Botón pedido WhatsApp
  const btnWA = document.getElementById('btnPedidoWhatsapp');
  if (btnWA) btnWA.addEventListener('click', enviarPedidoWhatsApp);

  // Inicializar contador y carrito
  actualizarContador();
  renderizarCarrito();

  // Header con sombra al hacer scroll
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
  });

  // Menú hamburguesa
  const btnHamburguesa = document.getElementById('btnHamburguesa');
  const navPrincipal   = document.getElementById('navPrincipal');

  if (btnHamburguesa && navPrincipal) {
    btnHamburguesa.addEventListener('click', () => {
      const abierto = navPrincipal.classList.toggle('abierto');
      btnHamburguesa.classList.toggle('activo', abierto);
      if (overlay) overlay.classList.toggle('activo', abierto);
      document.body.style.overflow = abierto ? 'hidden' : '';
    });
  }

  // Buscador mini toggle
  const btnBuscador  = document.getElementById('btnBuscador');
  const buscadorMini = document.getElementById('buscadorMini');
  const inputBusq    = document.getElementById('inputBusqueda');

  if (btnBuscador && buscadorMini) {
    btnBuscador.addEventListener('click', () => {
      buscadorMini.classList.toggle('activo');
      if (buscadorMini.classList.contains('activo') && inputBusq) {
        inputBusq.focus();
      }
    });

    // Buscar al presionar Enter
    if (inputBusq) {
      inputBusq.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') buscar();
      });
    }
  }
});

// Cerrar menú móvil
function cerrarMenu() {
  const nav     = document.getElementById('navPrincipal');
  const btn     = document.getElementById('btnHamburguesa');
  const overlay = document.getElementById('overlay');
  if (nav) nav.classList.remove('abierto');
  if (btn) btn.classList.remove('activo');
  if (overlay) overlay.classList.remove('activo');
  document.body.style.overflow = '';
}

// Función búsqueda global

function buscar() {
  const input = document.getElementById('inputBusqueda');
  if (!input) return;
  const termino = input.value.trim();
  if (!termino) return;
  window.location.href = `catalogo.html?buscar=${encodeURIComponent(termino)}`;
}