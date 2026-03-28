/* ========================================
   CALZADO SHOGUN - Filtros y Buscador
   ======================================== */

// Estado de filtros
let filtroActual    = 'todos';
let busquedaActual  = '';
let ordenActual     = 'default';

/* ========================================
   FILTRAR Y RENDERIZAR
   ======================================== */

function aplicarFiltros() {
  let resultado = [...PRODUCTOS];

  // Filtro por categoría
  if (filtroActual !== 'todos') {
    resultado = resultado.filter(p => p.categoria === filtroActual);
  }

  // Filtro por búsqueda
  if (busquedaActual.trim() !== '') {
    const t = busquedaActual.toLowerCase();
    resultado = resultado.filter(p =>
      p.nombre.toLowerCase().includes(t)      ||
      p.categoria.toLowerCase().includes(t)   ||
      p.descripcion.toLowerCase().includes(t)
    );
  }

  // Ordenar
  switch (ordenActual) {
    case 'precio-asc':
      resultado.sort((a, b) => a.precio - b.precio);
      break;
    case 'precio-desc':
      resultado.sort((a, b) => b.precio - a.precio);
      break;
    case 'nombre-asc':
      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    default:
      break;
  }

  renderizarProductos(resultado, 'listadoProductos');
  actualizarContadorResultados(resultado.length);
}

/* ========================================
   CAMBIAR FILTRO DE CATEGORÍA
   ======================================== */

function cambiarCategoria(categoria) {
  filtroActual = categoria;

  // Actualizar botones activos
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.toggle('activo', btn.dataset.categoria === categoria);
  });

  aplicarFiltros();
}

/* ========================================
   CAMBIAR ORDEN
   ======================================== */

function cambiarOrden(valor) {
  ordenActual = valor;
  aplicarFiltros();
}

/* ========================================
   LIMPIAR FILTROS
   ======================================== */

function limpiarFiltros() {
  filtroActual   = 'todos';
  busquedaActual = '';
  ordenActual    = 'default';

  const inputBusq = document.getElementById('inputCatalogo');
  if (inputBusq) inputBusq.value = '';

  const selectOrden = document.getElementById('selectOrden');
  if (selectOrden) selectOrden.value = 'default';

  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.toggle('activo', btn.dataset.categoria === 'todos');
  });

  aplicarFiltros();
}

/* ========================================
   CONTADOR DE RESULTADOS
   ======================================== */

function actualizarContadorResultados(cantidad) {
  const el = document.getElementById('contadorResultados');
  if (el) {
    el.textContent = cantidad === 1
      ? '1 producto encontrado'
      : `${cantidad} productos encontrados`;
  }
}

/* ========================================
   LEER PARÁMETROS DE URL
   ======================================== */

function leerParametrosURL() {
  const params = new URLSearchParams(window.location.search);

  const categoria = params.get('categoria');
  if (categoria) {
    filtroActual = categoria;
  }

  const buscar = params.get('buscar');
  if (buscar) {
    busquedaActual = buscar;
    const inputBusq = document.getElementById('inputCatalogo');
    if (inputBusq) inputBusq.value = buscar;
  }
}

/* ========================================
   INICIALIZAR CATÁLOGO
   ======================================== */

function inicializarCatalogo() {
  leerParametrosURL();

  // Marcar botón activo según categoría URL
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.toggle('activo', btn.dataset.categoria === filtroActual);
  });

  // Evento buscador del catálogo
  const inputCatalogo = document.getElementById('inputCatalogo');
  if (inputCatalogo) {
    inputCatalogo.addEventListener('input', (e) => {
      busquedaActual = e.target.value;
      aplicarFiltros();
    });
  }

  // Evento selector de orden
  const selectOrden = document.getElementById('selectOrden');
  if (selectOrden) {
    selectOrden.addEventListener('change', (e) => {
      cambiarOrden(e.target.value);
    });
  }
  
  aplicarFiltros();
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('listadoProductos')) {
    inicializarCatalogo();
  }
});