/* ========================================
   CALZADO SHOGUN - Asistente IA de Ventas
   ======================================== */

const ASISTENTE_CONFIG = {
  nombre: "Shogi",
  saludo: "¡Hola! 👋 Soy **Shogi**, tu asistente de Calzado Shogun. ¿En qué te puedo ayudar hoy?",
  whatsapp: "573000000000" // ← Cambia por tu número real
};

// Historial de conversación
let historialChat = [];
let asistenteListo = false;

/* ========================================
   CREAR INTERFAZ DEL CHAT
   ======================================== */

function crearInterfazChat() {
  const estilos = document.createElement('style');
  estilos.textContent = `
    /* Botón flotante IA */
    .ia-btn-flotante {
      position: fixed;
      bottom: 6rem;
      right: 2rem;
      width: 58px;
      height: 58px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 998;
      box-shadow: 0 4px 20px rgba(102,126,234,0.5);
      border: none;
      transition: all 0.3s ease;
      animation: pulsoIA 2.5s ease-in-out infinite;
    }

    .ia-btn-flotante:hover {
      transform: scale(1.12);
    }

    @keyframes pulsoIA {
      0%, 100% { box-shadow: 0 4px 20px rgba(102,126,234,0.5); }
      50%       { box-shadow: 0 4px 35px rgba(102,126,234,0.8); }
    }

    .ia-btn-flotante i {
      font-size: 1.5rem;
      color: white;
    }

    /* Burbuja de bienvenida */
    .ia-burbuja {
      position: fixed;
      bottom: 10.5rem;
      right: 1rem;
      background: white;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #1a1a2e;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
      max-width: 200px;
      text-align: center;
      z-index: 997;
      animation: aparecerBurbuja 0.4s ease;
      font-family: 'Montserrat', sans-serif;
    }

    .ia-burbuja::after {
      content: '';
      position: absolute;
      bottom: -6px;
      right: 24px;
      width: 12px;
      height: 12px;
      background: white;
      transform: rotate(45deg);
      box-shadow: 2px 2px 4px rgba(0,0,0,0.05);
    }

    @keyframes aparecerBurbuja {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Panel del chat */
    .ia-panel {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      width: 360px;
      max-height: 560px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      z-index: 1100;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0.8) translateY(20px);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: 'Montserrat', sans-serif;
    }

    .ia-panel.abierto {
      transform: scale(1) translateY(0);
      opacity: 1;
      visibility: visible;
    }

    /* Header del chat */
    .ia-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .ia-avatar {
      width: 42px;
      height: 42px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      flex-shrink: 0;
    }

    .ia-header-info h4 {
      color: white;
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 0.1rem;
    }

    .ia-estado {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.85);
    }

    .ia-estado-punto {
      width: 7px;
      height: 7px;
      background: #4ade80;
      border-radius: 50%;
      animation: parpadeo 1.5s infinite;
    }

    @keyframes parpadeo {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }

    .ia-btn-cerrar {
      margin-left: auto;
      background: rgba(255,255,255,0.15);
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .ia-btn-cerrar:hover {
      background: rgba(255,255,255,0.3);
    }

    /* Área de mensajes */
    .ia-mensajes {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background: #f8f7f4;
      min-height: 300px;
      max-height: 350px;
      scroll-behavior: smooth;
    }

    .ia-mensajes::-webkit-scrollbar { width: 4px; }
    .ia-mensajes::-webkit-scrollbar-track { background: transparent; }
    .ia-mensajes::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 4px;
    }

    /* Mensajes */
    .mensaje {
      display: flex;
      gap: 0.5rem;
      align-items: flex-end;
      animation: entradaMensaje 0.3s ease;
    }

    @keyframes entradaMensaje {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .mensaje-ia { justify-content: flex-start; }
    .mensaje-usuario { justify-content: flex-end; }

    .mensaje-avatar-ia {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      color: white;
      flex-shrink: 0;
    }

    .mensaje-burbuja {
      max-width: 80%;
      padding: 0.7rem 0.9rem;
      border-radius: 14px;
      font-size: 0.85rem;
      line-height: 1.5;
    }

    .mensaje-ia .mensaje-burbuja {
      background: white;
      color: #2d2d2d;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .mensaje-usuario .mensaje-burbuja {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-bottom-right-radius: 4px;
    }

    /* Typing indicator */
    .typing {
      display: flex;
      gap: 4px;
      padding: 0.7rem 0.9rem;
      background: white;
      border-radius: 14px;
      border-bottom-left-radius: 4px;
      width: fit-content;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .typing span {
      width: 7px;
      height: 7px;
      background: #667eea;
      border-radius: 50%;
      animation: typing 1.2s infinite;
    }

    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30%            { transform: translateY(-6px); opacity: 1; }
    }

    /* Sugerencias rápidas */
    .ia-sugerencias {
      padding: 0.6rem 1rem;
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
      background: white;
      border-top: 1px solid #f0ede8;
    }

    .sugerencia-btn {
      padding: 0.4rem 0.85rem;
      background: #f0ede8;
      border: none;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Montserrat', sans-serif;
      color: #1a1a2e;
      white-space: nowrap;
    }

    .sugerencia-btn:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      transform: translateY(-1px);
    }

    /* Input del chat */
    .ia-input-wrap {
      padding: 0.85rem 1rem;
      background: white;
      border-top: 1px solid #f0ede8;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    #iaInput {
      flex: 1;
      padding: 0.65rem 1rem;
      border: 1.5px solid #e8e4dc;
      border-radius: 50px;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.85rem;
      outline: none;
      transition: all 0.2s;
      color: #2d2d2d;
      background: #f8f7f4;
    }

    #iaInput:focus {
      border-color: #667eea;
      background: white;
    }

    #iaInput::placeholder { color: #aaa; }

    .ia-btn-enviar {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .ia-btn-enviar:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(102,126,234,0.4);
    }

    /* Tarjeta de producto en chat */
    .producto-chat-card {
      background: white;
      border: 1px solid #e8e4dc;
      border-radius: 12px;
      overflow: hidden;
      margin-top: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .producto-chat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      border-color: #c8a96e;
    }

    .producto-chat-info {
      padding: 0.75rem;
    }

    .producto-chat-nombre {
      font-size: 0.85rem;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 0.2rem;
    }

    .producto-chat-categoria {
      font-size: 0.7rem;
      color: #c8a96e;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.35rem;
    }

    .producto-chat-precio {
      font-size: 0.95rem;
      font-weight: 700;
      color: #e94560;
    }

    .producto-chat-btn {
      width: 100%;
      padding: 0.6rem;
      background: #1a1a2e;
      color: white;
      border: none;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
    }

    .producto-chat-btn:hover { background: #c8a96e; color: #1a1a2e; }

    /* Botón WhatsApp en chat */
    .wa-chat-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #25d366;
      color: white;
      padding: 0.65rem 1rem;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 700;
      margin-top: 0.5rem;
      cursor: pointer;
      border: none;
      font-family: 'Montserrat', sans-serif;
      transition: all 0.2s;
      width: 100%;
      justify-content: center;
    }

    .wa-chat-btn:hover {
      background: #1da851;
      transform: translateY(-1px);
    }

    /* Responsive móvil */
    @media (max-width: 480px) {
      .ia-panel {
        width: calc(100vw - 2rem);
        right: 1rem;
        bottom: 1rem;
        max-height: 80vh;
      }

      .ia-btn-flotante {
        bottom: 5rem;
        right: 1rem;
      }
    }
  `;
  document.head.appendChild(estilos);

  // HTML del asistente
  document.body.insertAdjacentHTML('beforeend', `

    <!-- Burbuja de bienvenida -->
    <div class="ia-burbuja" id="iaBurbuja">
      🤖 ¿Te ayudo a encontrar tu zapato ideal?
    </div>

    <!-- Botón flotante -->
    <button class="ia-btn-flotante" id="iaBtnFlotante" title="Asistente IA">
      <i class="fas fa-robot"></i>
    </button>

    <!-- Panel del chat -->
    <div class="ia-panel" id="iaPanel">

      <!-- Header -->
      <div class="ia-header">
        <div class="ia-avatar">🤖</div>
        <div class="ia-header-info">
          <h4>Shogi - Asistente IA</h4>
          <div class="ia-estado">
            <div class="ia-estado-punto"></div>
            En línea ahora
          </div>
        </div>
        <button class="ia-btn-cerrar" id="iaBtnCerrar">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Mensajes -->
      <div class="ia-mensajes" id="iaMensajes"></div>

      <!-- Sugerencias rápidas -->
      <div class="ia-sugerencias" id="iaSugerencias">
        <button class="sugerencia-btn" onclick="enviarSugerencia('Ver zapatos de hombre')">
          👞 Hombre
        </button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('Ver zapatos de mujer')">
          👠 Mujer
        </button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('Ver zapatos de niño')">
          👟 Niño
        </button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('Ver zapatos deportivos')">
          🏃 Deportivo
        </button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('¿Cómo compro?')">
          🛒 ¿Cómo compro?
        </button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('¿Hacen envíos?')">
          🚚 Envíos
        </button>
      </div>

      <!-- Input -->
      <div class="ia-input-wrap">
        <input
          type="text"
          id="iaInput"
          placeholder="Escribe tu pregunta..."
          onkeydown="if(event.key==='Enter') enviarMensajeIA()"
        />
        <button class="ia-btn-enviar" onclick="enviarMensajeIA()">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>

    </div>
  `);
}

/* ========================================
   ABRIR Y CERRAR CHAT
   ======================================== */

function abrirChatIA() {
  const panel   = document.getElementById('iaPanel');
  const burbuja = document.getElementById('iaBurbuja');
  panel.classList.add('abierto');
  if (burbuja) burbuja.style.display = 'none';

  // Mostrar saludo solo la primera vez
  if (!asistenteListo) {
    asistenteListo = true;
    setTimeout(() => {
      agregarMensajeIA(ASISTENTE_CONFIG.saludo);
      setTimeout(() => {
        agregarMensajeIA("Puedo ayudarte a encontrar el zapato perfecto, contarte sobre nuestros productos, precios, tallas y envíos. ¿Por dónde empezamos? 😊");
      }, 1000);
    }, 400);
  }
}

function cerrarChatIA() {
  document.getElementById('iaPanel').classList.remove('abierto');
}

/* ========================================
   ENVIAR Y RECIBIR MENSAJES
   ======================================== */

async function enviarMensajeIA() {
  const input = document.getElementById('iaInput');
  const texto = input.value.trim();
  if (!texto) return;

  input.value = '';
  agregarMensajeUsuario(texto);
  mostrarTyping();

  try {
    const respuesta = await llamarAPI(texto);
    ocultarTyping();
    agregarMensajeIA(respuesta);
  } catch (error) {
    ocultarTyping();
    agregarMensajeIA("Lo siento, tuve un problema técnico 😅 Por favor escríbenos directamente por WhatsApp.");
    mostrarBotonWhatsApp("Hablar con nosotros");
  }
}

function enviarSugerencia(texto) {
  document.getElementById('iaInput').value = texto;
  enviarMensajeIA();
}

/* ========================================
   LLAMAR A LA API DE CLAUDE
   ======================================== */

async function llamarAPI(mensajeUsuario) {

  // Construir catálogo para el contexto
  const catalogoTexto = PRODUCTOS.map(p =>
    `- ${p.nombre} | Categoría: ${p.categoria} | Precio: ${formatearPrecio(p.precio)}${p.precioOriginal ? ` (antes ${formatearPrecio(p.precioOriginal)})` : ''} | Tallas: ${p.tallas.join(', ')} | Colores: ${p.colores.length} opciones | ${p.badge ? `Etiqueta: ${p.badge}` : ''}`
  ).join('\n');

  const systemPrompt = `Eres Shogi, el asistente virtual de ventas de Calzado Shogun, una tienda colombiana de zapatos de calidad. Tu personalidad es amigable, cálida, entusiasta y profesional.

CATÁLOGO ACTUAL DE PRODUCTOS:
${catalogoTexto}

INFORMACIÓN DEL NEGOCIO:
- Nombre: Calzado Shogun
- País: Colombia
- Envíos: A toda Colombia
- Tiempos de entrega: 2-4 días ciudades principales, 4-7 días municipios
- Métodos de pago: Nequi, Bancolombia, PayPal, WhatsApp
- Atención: Por WhatsApp
- Factura electrónica: Sí, incluida en cada compra

INSTRUCCIONES IMPORTANTES:
1. Responde SIEMPRE en español
2. Sé breve y claro, máximo 3 párrafos cortos
3. Cuando recomiendes productos menciona el nombre y precio
4. Usa emojis con moderación para ser más amigable
5. Si el cliente quiere comprar, anímalo a usar WhatsApp o el carrito
6. Si preguntan por tallas, ayúdalos a elegir la correcta
7. Si no sabes algo, di que pueden preguntar por WhatsApp
8. Nunca inventes productos que no están en el catálogo
9. Cuando menciones precios usa el formato colombiano
10. Termina siempre ofreciendo más ayuda`;

  // Agregar mensaje al historial
  historialChat.push({
    role: "user",
    content: mensajeUsuario
  });

  // Mantener historial corto (últimos 6 mensajes)
  if (historialChat.length > 6) {
    historialChat = historialChat.slice(-6);
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: historialChat
    })
  });

  const data = await response.json();
  const respuestaTexto = data.content[0].text;

  // Agregar respuesta al historial
  historialChat.push({
    role: "assistant",
    content: respuestaTexto
  });

  return respuestaTexto;
}

/* ========================================
   RENDERIZAR MENSAJES
   ======================================== */

function agregarMensajeIA(texto) {
  const mensajes = document.getElementById('iaMensajes');

  // Convertir **texto** en negrita
  const textoFormateado = texto
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  mensajes.insertAdjacentHTML('beforeend', `
    <div class="mensaje mensaje-ia">
      <div class="mensaje-avatar-ia">🤖</div>
      <div class="mensaje-burbuja">${textoFormateado}</div>
    </div>
  `);

  // Mostrar productos si la respuesta menciona alguno
  mostrarProductosRelevantes(texto);
  scrollAlFinal();
}

function agregarMensajeUsuario(texto) {
  const mensajes = document.getElementById('iaMensajes');
  mensajes.insertAdjacentHTML('beforeend', `
    <div class="mensaje mensaje-usuario">
      <div class="mensaje-burbuja">${texto}</div>
    </div>
  `);
  scrollAlFinal();
}

function mostrarTyping() {
  const mensajes = document.getElementById('iaMensajes');
  mensajes.insertAdjacentHTML('beforeend', `
    <div class="mensaje mensaje-ia" id="typingIndicator">
      <div class="mensaje-avatar-ia">🤖</div>
      <div class="typing">
        <span></span><span></span><span></span>
      </div>
    </div>
  `);
  scrollAlFinal();
}

function ocultarTyping() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

function scrollAlFinal() {
  const mensajes = document.getElementById('iaMensajes');
  setTimeout(() => {
    mensajes.scrollTop = mensajes.scrollHeight;
  }, 100);
}

/* ========================================
   MOSTRAR PRODUCTOS RELEVANTES
   ======================================== */

function mostrarProductosRelevantes(textoRespuesta) {
  const texto = textoRespuesta.toLowerCase();
  const mensajes = document.getElementById('iaMensajes');

  // Buscar productos mencionados en la respuesta
  const productosEncontrados = PRODUCTOS.filter(p =>
    texto.includes(p.nombre.toLowerCase()) ||
    texto.includes(p.categoria.toLowerCase())
  ).slice(0, 2);

  if (productosEncontrados.length === 0) return;

  const tarjetas = productosEncontrados.map(p => `
    <div class="producto-chat-card" onclick="verDetalle(${p.id})">
      <div class="producto-chat-info">
        <div class="producto-chat-categoria">${p.categoria}</div>
        <div class="producto-chat-nombre">${p.nombre}</div>
        <div class="producto-chat-precio">${formatearPrecio(p.precio)}</div>
      </div>
      <button class="producto-chat-btn">
        <i class="fas fa-eye"></i> Ver producto completo
      </button>
    </div>
  `).join('');

  mensajes.insertAdjacentHTML('beforeend', `
    <div class="mensaje mensaje-ia">
      <div class="mensaje-avatar-ia">🤖</div>
      <div style="flex:1">${tarjetas}</div>
    </div>
  `);

  scrollAlFinal();
}

function mostrarBotonWhatsApp(texto) {
  const mensajes = document.getElementById('iaMensajes');
  const msg = encodeURIComponent("Hola! Necesito ayuda para elegir un zapato 👟");
  mensajes.insertAdjacentHTML('beforeend', `
    <div class="mensaje mensaje-ia">
      <div class="mensaje-avatar-ia">🤖</div>
      <div style="flex:1">
        <a href="https://wa.me/${ASISTENTE_CONFIG.whatsapp}?text=${msg}"
           target="_blank" class="wa-chat-btn">
          <i class="fab fa-whatsapp"></i> ${texto}
        </a>
      </div>
    </div>
  `);
  scrollAlFinal();
}

/* ========================================
   INICIALIZAR
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  crearInterfazChat();

  // Botón flotante
  document.getElementById('iaBtnFlotante')
    .addEventListener('click', abrirChatIA);

  // Botón cerrar
  document.getElementById('iaBtnCerrar')
    .addEventListener('click', cerrarChatIA);

  // Ocultar burbuja después de 5 segundos
  setTimeout(() => {
    const burbuja = document.getElementById('iaBurbuja');
    if (burbuja) {
      burbuja.style.opacity = '0';
      burbuja.style.transition = 'opacity 0.5s';
      setTimeout(() => burbuja.remove(), 500);
    }
  }, 5000);
});