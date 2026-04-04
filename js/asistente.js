/* ========================================
   CALZADO SHOGUN - Asistente Shogi (GRATIS)
   Motor de respuestas local, sin API externa
   ======================================== */

const ASISTENTE_CONFIG = {
  nombre: "Shogi",
  saludo: "¡Hola! 👋 Soy **Shogi**, tu asistente de Calzado Shogun. ¿En qué te puedo ayudar hoy?",
  whatsapp: "573154300377"
};

let historialChat = [];
let asistenteListo = false;

/* ========================================
   BASE DE CONOCIMIENTO DEL NEGOCIO
   ======================================== */

const CONOCIMIENTO = {
  negocio: {
    nombre: "Calzado Shogun",
    ubicacion: "Florida, Valle del Cauca, Colombia",
    whatsapp: "+57 315 430 0377",
    email: "jhonjairog336@gmail.com",
    envios: "A toda Colombia",
    tiempoEntrega: "2-4 días en ciudades principales, 4-7 días en municipios",
    factura: "Sí, emitimos factura electrónica según normativa DIAN Colombia"
  },
  pagos: [
    { nombre: "Nequi", descripcion: "Transfiere fácil desde tu celular al instante. Solo necesitas tener la app de Nequi y enviar el pago al número que te indiquemos por WhatsApp." },
    { nombre: "Bancolombia", descripcion: "Puedes hacer transferencia bancaria desde la app de Bancolombia, por PSE, o en una sucursal. Te damos los datos de la cuenta por WhatsApp." },
    { nombre: "PayPal", descripcion: "Pago internacional seguro con tarjeta de crédito o débito a través de PayPal. Ideal si estás fuera de Colombia." },
    { nombre: "WhatsApp", descripcion: "Coordina tu pedido y pago directamente con nosotros por WhatsApp. Te guiamos paso a paso." }
  ],
  comoComprar: [
    "1️⃣ Elige el producto que te gusta en nuestro catálogo.",
    "2️⃣ Selecciona tu talla y color preferido.",
    "3️⃣ Agrégalo al carrito o escríbenos por WhatsApp.",
    "4️⃣ Coordina el pago (Nequi, Bancolombia, PayPal).",
    "5️⃣ ¡Listo! Te enviamos tu pedido a la puerta de tu casa. 🚚"
  ]
};

/* ========================================
   MOTOR DE RESPUESTAS INTELIGENTE
   ======================================== */

function generarRespuesta(mensaje) {
  const msg = mensaje.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // --- SALUDOS ---
  if (/^(hola|hey|buenas|buenos dias|buenas tardes|buenas noches|hi|hello|que tal|saludos|ey|epa)/.test(msg)) {
    return pickRandom([
      "¡Hola! 😊 Bienvenido/a a Calzado Shogun. ¿Qué tipo de zapato estás buscando? Tenemos para hombre, mujer, niño, unisex y deportivos.",
      "¡Hola! 👋 ¡Qué gusto saludarte! ¿Te ayudo a encontrar tu par perfecto? Puedes preguntarme por precios, tallas, formas de pago o lo que necesites.",
      "¡Hey! 😄 Bienvenido/a a Shogun. Estoy aquí para ayudarte. ¿Buscas algo en particular?"
    ]);
  }

  // --- DESPEDIDAS ---
  if (/^(gracias|muchas gracias|genial|perfecto|excelente|vale|ok gracias|chao|adios|bye|hasta luego)/.test(msg)) {
    return pickRandom([
      "¡Con mucho gusto! 😊 Si necesitas algo más, aquí estaré. ¡Que tengas un excelente día!",
      "¡Gracias a ti por visitarnos! 🙌 Recuerda que por WhatsApp te atendemos de forma personalizada. ¡Hasta pronto!",
      "¡Fue un placer ayudarte! 😄 No dudes en escribirnos si tienes más preguntas. ¡Te esperamos!"
    ]);
  }

  // --- VER TODOS LOS PRODUCTOS ---
  if (/todos los productos|catalogo completo|que tienen|que venden|que productos|todo lo que tienen|ver todo/.test(msg)) {
    let resp = "📋 **Nuestro catálogo completo:**\n\n";
    PRODUCTOS.forEach(p => {
      const precio = formatearPrecio(p.precio);
      const oferta = p.precioOriginal ? ` ~~${formatearPrecio(p.precioOriginal)}~~` : "";
      const badge = p.badge ? ` 🏷️ ${p.badge}` : "";
      resp += `👟 **${p.nombre}** (${p.categoria}) — ${precio}${oferta}${badge}\n`;
    });
    resp += "\n¿Te interesa alguno? Dime el nombre y te cuento más detalles. 😊";
    return resp;
  }

  // --- CATEGORIAS ESPECÍFICAS ---
  if (/zapatos? (de |para )?hombre|calzado hombre|para hombre|categoria hombre/.test(msg)) {
    return responderCategoria("hombre", "👞 Zapatos de Hombre");
  }
  if (/zapatos? (de |para )?mujer|calzado mujer|para mujer|categoria mujer/.test(msg)) {
    return responderCategoria("mujer", "👠 Zapatos de Mujer");
  }
  if (/zapatos? (de |para )?(nino|niños?|infantil|chicos?|peques?)|para nino|ninos/.test(msg)) {
    return responderCategoria("nino", "👟 Zapatos de Niño");
  }
  if (/zapatos? (de )?(deporte|deportivos?)|deportivo|correr|running|tenis deportivo/.test(msg)) {
    return responderCategoria("deportivo", "🏃 Zapatos Deportivos");
  }
  if (/unisex|para todos/.test(msg)) {
    return responderCategoria("unisex", "🧑‍🤝‍🧑 Zapatos Unisex");
  }
  if (/categorias?|tipos?|que tipo/.test(msg)) {
    return "📂 **Nuestras categorías:**\n\n👞 **Hombre** — Clásico, formal y casual\n👠 **Mujer** — Elegantes y bohemios\n🧑‍🤝‍🧑 **Unisex** — Estilo para todos\n👟 **Niño** — Cómodos y resistentes\n🏃 **Deportivo** — Running y senderismo\n\n¿Cuál categoría te gustaría explorar? 😊";
  }

  // --- BÚSQUEDA POR NOMBRE DE PRODUCTO ---
  const productoEncontrado = PRODUCTOS.find(p => msg.includes(p.nombre.toLowerCase()));
  if (productoEncontrado) {
    return responderProductoDetalle(productoEncontrado);
  }

  // --- PRECIOS GENERALES ---
  if (/precios?|cuanto cuesta|cuanto vale|que precio|rango de precio|cuanto es|valor/.test(msg)) {
    const precios = PRODUCTOS.map(p => p.precio);
    const min = Math.min(...precios);
    const max = Math.max(...precios);
    let resp = `💰 **Nuestros precios van desde ${formatearPrecio(min)} hasta ${formatearPrecio(max)}.**\n\n`;
    resp += "Aquí algunos destacados:\n\n";
    PRODUCTOS.forEach(p => {
      const oferta = p.precioOriginal ? ` (antes ~~${formatearPrecio(p.precioOriginal)}~~) 🔥` : "";
      resp += `• **${p.nombre}** — ${formatearPrecio(p.precio)}${oferta}\n`;
    });
    resp += "\n¿Algún producto te interesa? Puedo darte más detalles. 😊";
    return resp;
  }

  // --- OFERTAS Y DESCUENTOS ---
  if (/ofertas?|descuentos?|promocion|rebajas?|mas barato|economico|ganga/.test(msg)) {
    const ofertas = PRODUCTOS.filter(p => p.precioOriginal);
    if (ofertas.length === 0) return "Actualmente no tenemos ofertas activas, pero puedes escribirnos por WhatsApp para ofertas exclusivas. 📱";
    let resp = "🔥 **¡Productos en oferta!**\n\n";
    ofertas.forEach(p => {
      const descuento = Math.round((1 - p.precio / p.precioOriginal) * 100);
      resp += `🏷️ **${p.nombre}** — ${formatearPrecio(p.precio)} (antes ~~${formatearPrecio(p.precioOriginal)}~~) **-${descuento}%**\n`;
    });
    resp += "\n¡Aprovecha antes de que se agoten! ¿Te interesa alguno?";
    return resp;
  }

  // --- TALLAS ---
  if (/tallas?|talla disponible|que tallas|medida|numero|tallaje|que numeros/.test(msg)) {
    let resp = "📏 **Tallas disponibles por producto:**\n\n";
    PRODUCTOS.forEach(p => {
      resp += `• **${p.nombre}** (${p.categoria}): ${p.tallas.join(", ")}\n`;
    });
    resp += "\n💡 **Tip:** Si no estás seguro de tu talla, mide tu pie en cm y escríbenos por WhatsApp, ¡te ayudamos a elegir! 😊";
    return resp;
  }

  // --- FORMAS DE PAGO ---
  if (/pago|como pago|forma.* pago|metodo.* pago|puedo pagar|nequi|bancolombia|paypal|transferencia|tarjeta|efectivo/.test(msg)) {
    let resp = "💳 **Formas de pago disponibles:**\n\n";
    CONOCIMIENTO.pagos.forEach(p => {
      const icono = p.nombre === "Nequi" ? "📱" : p.nombre === "Bancolombia" ? "🏦" : p.nombre === "PayPal" ? "💻" : "💬";
      resp += `${icono} **${p.nombre}:** ${p.descripcion}\n\n`;
    });
    resp += "Todas las transacciones son seguras. Emitimos factura electrónica según normativa DIAN. 🔒\n\n¿Te gustaría proceder con algún pedido?";
    return resp;
  }

  // --- CÓMO COMPRAR ---
  if (/como compro|como hago|como pido|como ordeno|proceso de compra|quiero comprar|como adquiero|pasos para/.test(msg)) {
    let resp = "🛒 **¿Cómo comprar en Calzado Shogun?** ¡Es muy fácil!\n\n";
    CONOCIMIENTO.comoComprar.forEach(paso => { resp += paso + "\n"; });
    resp += "\n📞 Si prefieres, puedes hacer todo el proceso directamente por WhatsApp. ¡Te atendemos con gusto!";
    return resp;
  }

  // --- ENVÍOS ---
  if (/envios?|envio|envian|hacen envio|mandan|despacho|domicilio|llega|demora|cuanto tarda|tiempo de entrega|entregan/.test(msg)) {
    return `🚚 **Información de envíos:**\n\n📦 **Cobertura:** Envíos a toda Colombia\n⏱️ **Tiempos de entrega:**\n• Ciudades principales: 2-4 días hábiles\n• Municipios: 4-7 días hábiles\n\n📋 Recibes factura electrónica con tu compra.\n\n¿Te gustaría hacer un pedido? Puedes agregarlo al carrito o escribirnos por WhatsApp. 😊`;
  }

  // --- CONTACTO ---
  if (/contacto|contactar|comunicar|hablar|telefono|numero|llamar|escribir|whatsapp|correo|email|mail/.test(msg)) {
    return `📞 **¡Contáctanos!**\n\n💬 **WhatsApp:** ${CONOCIMIENTO.negocio.whatsapp}\n📧 **Correo:** ${CONOCIMIENTO.negocio.email}\n📍 **Ubicación:** ${CONOCIMIENTO.negocio.ubicacion}\n\nPor WhatsApp te respondemos más rápido. ¡Estamos para servirte! 😊`;
  }

  // --- UBICACIÓN ---
  if (/donde estan|ubicacion|direccion|ciudad|tienda fisica|donde queda/.test(msg)) {
    return `📍 **Nuestra ubicación:**\n\n${CONOCIMIENTO.negocio.ubicacion}\n\nSomos una tienda en línea con envíos a toda Colombia. 🇨🇴\n\nPara más info, escríbenos por WhatsApp al ${CONOCIMIENTO.negocio.whatsapp}. 📲`;
  }

  // --- DEVOLUCIONES / GARANTÍA ---
  if (/devolucion|garantia|cambio|devolver|no me quedo|no me gusto|defecto/.test(msg)) {
    return "🔄 **Cambios y devoluciones:**\n\nPara gestionar un cambio o devolución, contáctanos directamente por WhatsApp y te guiamos con el proceso. Queremos que quedes 100% satisfecho/a con tu compra. 🤝\n\nEscríbenos para resolver tu caso de forma personalizada. 😊";
  }

  // --- FACTURA ---
  if (/factura|facturacion|dian/.test(msg)) {
    return "🧾 **Facturación electrónica:**\n\nSí, emitimos factura electrónica con cada compra según la normativa DIAN de Colombia. Recibirás tu factura junto con la confirmación de tu pedido. ✅\n\n¿Necesitas algo más?";
  }

  // --- HORARIO ---
  if (/horario|atienden|hora|cuando abren|disponible/.test(msg)) {
    return "🕐 **Horario de atención:**\n\nNuestro catálogo está disponible las 24 horas. Para atención personalizada por WhatsApp te respondemos lo más pronto posible.\n\n¿En qué te puedo ayudar? 😊";
  }

  // --- SOBRE NOSOTROS ---
  if (/quienes son|sobre ustedes|historia|empresa|negocio|de que se trata/.test(msg)) {
    return "🏬 **Sobre Calzado Shogun:**\n\nNacimos del amor por el buen calzado y el deseo de ofrecer a las familias colombianas zapatos de calidad, durabilidad y estilo, a precios justos. ❤️\n\n✅ Calidad garantizada\n✅ Atención personalizada\n✅ Envíos seguros a toda Colombia\n✅ Factura electrónica incluida\n\n¿Te gustaría ver nuestro catálogo?";
  }

  // --- MÁS BARATO / MÁS CARO ---
  if (/mas barato|mas economico|menor precio|barato/.test(msg)) {
    const masBarato = [...PRODUCTOS].sort((a, b) => a.precio - b.precio)[0];
    return responderProductoDetalle(masBarato, "💰 ¡Este es nuestro producto más económico!");
  }
  if (/mas caro|premium|mejor|mayor precio|exclusivo/.test(msg)) {
    const masCaro = [...PRODUCTOS].sort((a, b) => b.precio - a.precio)[0];
    return responderProductoDetalle(masCaro, "⭐ ¡Nuestro producto premium!");
  }

  // --- POPULARES / NUEVOS ---
  if (/popular|mas vendido|favorito|recomendado|mejor valorado/.test(msg)) {
    const populares = PRODUCTOS.filter(p => p.badge === "Popular");
    if (populares.length > 0) {
      let resp = "⭐ **Nuestros más populares:**\n\n";
      populares.forEach(p => { resp += `🔥 **${p.nombre}** (${p.categoria}) — ${formatearPrecio(p.precio)}\n`; });
      resp += "\n¿Quieres saber más detalles de alguno?";
      return resp;
    }
    return "Todos nuestros productos son excelentes opciones. ¿Te gustaría ver el catálogo completo? 😊";
  }
  if (/nuevo|recien llegado|novedad|ultima coleccion/.test(msg)) {
    const nuevos = PRODUCTOS.filter(p => p.badge === "Nuevo");
    if (nuevos.length > 0) {
      let resp = "✨ **Novedades recién llegadas:**\n\n";
      nuevos.forEach(p => { resp += `🆕 **${p.nombre}** (${p.categoria}) — ${formatearPrecio(p.precio)}\n`; });
      resp += "\n¿Te interesa alguno? Te puedo dar más info. 😊";
      return resp;
    }
  }

  // --- COLORES ---
  if (/colores?|que colores|color disponible/.test(msg)) {
    let resp = "🎨 **Colores disponibles por producto:**\n\n";
    PRODUCTOS.forEach(p => { resp += `• **${p.nombre}**: ${p.colores.length} opciones de color\n`; });
    resp += "\nPara ver los colores exactos, visita la página del producto o pregúntame por uno específico. 😊";
    return resp;
  }

  // --- BÚSQUEDA INTELIGENTE POR PALABRAS CLAVE ---
  const resultados = buscarPorPalabras(msg);
  if (resultados.length > 0) {
    let resp = `🔍 Encontré ${resultados.length} producto(s) que podrían interesarte:\n\n`;
    resultados.forEach(p => {
      const oferta = p.precioOriginal ? ` (antes ~~${formatearPrecio(p.precioOriginal)}~~)` : "";
      resp += `👟 **${p.nombre}** (${p.categoria}) — ${formatearPrecio(p.precio)}${oferta}\n`;
    });
    resp += "\n¿Te gustaría más detalles de alguno?";
    return resp;
  }

  // --- RESPUESTA POR DEFECTO ---
  return pickRandom([
    "🤔 No estoy seguro de entender tu pregunta. Puedo ayudarte con:\n\n👟 Información de **productos y precios**\n💳 **Formas de pago** (Nequi, Bancolombia, PayPal)\n🚚 **Envíos** a toda Colombia\n📞 **Datos de contacto**\n🛒 **Cómo comprar**\n\n¿Sobre cuál te gustaría saber? O si prefieres, escríbenos por WhatsApp para atención personalizada. 😊",
    "Hmm, no tengo esa información exacta 🤷 Pero puedo ayudarte con precios, tallas, formas de pago, envíos o contacto.\n\n¿Qué te gustaría saber? También puedes escribirnos por WhatsApp al ${CONOCIMIENTO.negocio.whatsapp} para atención directa. 📲"
  ]);
}

/* ========================================
   FUNCIONES AUXILIARES
   ======================================== */

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Sanitizar texto del usuario para evitar inyección de HTML/XSS
function sanitizarHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function responderCategoria(cat, titulo) {
  const prods = PRODUCTOS.filter(p => p.categoria === cat);
  if (prods.length === 0) return `No tenemos productos en esa categoría por ahora. ¿Te gustaría ver otras opciones?`;
  let resp = `${titulo}\n\n`;
  prods.forEach(p => {
    const oferta = p.precioOriginal ? ` (antes ~~${formatearPrecio(p.precioOriginal)}~~) 🔥` : "";
    const badge = p.badge ? ` 🏷️ ${p.badge}` : "";
    resp += `• **${p.nombre}** — ${formatearPrecio(p.precio)}${oferta}${badge}\n  Tallas: ${p.tallas.join(", ")}\n\n`;
  });
  resp += "¿Quieres más detalles de alguno? Solo dime el nombre. 😊";
  return resp;
}

function responderProductoDetalle(prod, introExtra) {
  const oferta = prod.precioOriginal
    ? `\n🔥 **¡EN OFERTA!** Precio anterior: ~~${formatearPrecio(prod.precioOriginal)}~~ → Ahora: **${formatearPrecio(prod.precio)}** (-${Math.round((1 - prod.precio / prod.precioOriginal) * 100)}%)`
    : `\n💰 **Precio:** ${formatearPrecio(prod.precio)}`;
  const badge = prod.badge ? `\n🏷️ **Etiqueta:** ${prod.badge}` : "";
  const intro = introExtra ? `${introExtra}\n\n` : "";

  return `${intro}👟 **${prod.nombre}**\n📂 Categoría: ${prod.categoria}${oferta}${badge}\n📏 Tallas: ${prod.tallas.join(", ")}\n🎨 Colores: ${prod.colores.length} opciones\n📝 ${prod.descripcion}\n\n¿Te gustaría agregarlo al carrito o pedirlo por WhatsApp? 😊`;
}

function buscarPorPalabras(msg) {
  const palabras = ["zapato", "bota", "sandalia", "tenis", "tacón", "formal", "casual", "cuero",
    "correr", "senderismo", "escolar", "urbano", "elegante", "bohemio"];
  const encontradas = palabras.filter(p => msg.includes(p));
  if (encontradas.length === 0) return [];
  return PRODUCTOS.filter(p => {
    const texto = `${p.nombre} ${p.descripcion} ${p.categoria}`.toLowerCase();
    return encontradas.some(pal => texto.includes(pal));
  });
}

/* ========================================
   CREAR INTERFAZ DEL CHAT
   ======================================== */

function crearInterfazChat() {
  const estilos = document.createElement('style');
  estilos.textContent = `
    .ia-btn-flotante {
      position: fixed; bottom: 6rem; right: 2rem;
      width: 58px; height: 58px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 998; border: none;
      box-shadow: 0 4px 20px rgba(102,126,234,0.5);
      transition: all 0.3s ease;
      animation: pulsoIA 2.5s ease-in-out infinite;
    }
    .ia-btn-flotante:hover { transform: scale(1.12); }
    @keyframes pulsoIA {
      0%, 100% { box-shadow: 0 4px 20px rgba(102,126,234,0.5); }
      50%       { box-shadow: 0 4px 35px rgba(102,126,234,0.8); }
    }
    .ia-btn-flotante i { font-size: 1.5rem; color: white; }

    .ia-burbuja {
      position: fixed; bottom: 10.5rem; right: 1rem;
      background: white; padding: 0.75rem 1rem; border-radius: 12px;
      font-size: 0.82rem; font-weight: 600; color: #1a1a2e;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12); max-width: 200px;
      text-align: center; z-index: 997;
      animation: aparecerBurbuja 0.4s ease;
      font-family: 'Montserrat', sans-serif;
    }
    .ia-burbuja::after {
      content: ''; position: absolute; bottom: -6px; right: 24px;
      width: 12px; height: 12px; background: white;
      transform: rotate(45deg); box-shadow: 2px 2px 4px rgba(0,0,0,0.05);
    }
    @keyframes aparecerBurbuja {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .ia-panel {
      position: fixed; bottom: 1.5rem; right: 1.5rem;
      width: 370px; max-height: 560px; background: white;
      border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      z-index: 1100; display: flex; flex-direction: column; overflow: hidden;
      transform: scale(0.8) translateY(20px); opacity: 0; visibility: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: 'Montserrat', sans-serif;
    }
    .ia-panel.abierto { transform: scale(1) translateY(0); opacity: 1; visibility: visible; }

    .ia-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      padding: 1rem 1.25rem; display: flex; align-items: center; gap: 0.75rem;
    }
    .ia-avatar {
      width: 42px; height: 42px; background: rgba(255,255,255,0.2);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; flex-shrink: 0;
    }
    .ia-header-info h4 { color: white; font-size: 0.95rem; font-weight: 700; margin-bottom: 0.1rem; }
    .ia-estado { display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; color: rgba(255,255,255,0.85); }
    .ia-estado-punto { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; animation: parpadeo 1.5s infinite; }
    @keyframes parpadeo { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .ia-btn-cerrar {
      margin-left: auto; background: rgba(255,255,255,0.15); border: none;
      width: 30px; height: 30px; border-radius: 50%; color: white;
      cursor: pointer; font-size: 1rem;
      display: flex; align-items: center; justify-content: center; transition: all 0.2s;
    }
    .ia-btn-cerrar:hover { background: rgba(255,255,255,0.3); }

    .ia-mensajes {
      flex: 1; overflow-y: auto; padding: 1rem;
      display: flex; flex-direction: column; gap: 0.75rem;
      background: #f8f7f4; min-height: 300px; max-height: 350px;
      scroll-behavior: smooth;
    }
    .ia-mensajes::-webkit-scrollbar { width: 4px; }
    .ia-mensajes::-webkit-scrollbar-track { background: transparent; }
    .ia-mensajes::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

    .mensaje { display: flex; gap: 0.5rem; align-items: flex-end; animation: entradaMensaje 0.3s ease; }
    @keyframes entradaMensaje { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .mensaje-ia { justify-content: flex-start; }
    .mensaje-usuario { justify-content: flex-end; }
    .mensaje-avatar-ia {
      width: 28px; height: 28px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; color: white; flex-shrink: 0;
    }
    .mensaje-burbuja { max-width: 80%; padding: 0.7rem 0.9rem; border-radius: 14px; font-size: 0.85rem; line-height: 1.5; }
    .mensaje-ia .mensaje-burbuja { background: white; color: #2d2d2d; border-bottom-left-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .mensaje-usuario .mensaje-burbuja { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-bottom-right-radius: 4px; }

    .typing { display: flex; gap: 4px; padding: 0.7rem 0.9rem; background: white; border-radius: 14px; border-bottom-left-radius: 4px; width: fit-content; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .typing span { width: 7px; height: 7px; background: #667eea; border-radius: 50%; animation: typing 1.2s infinite; }
    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-6px); opacity: 1; } }

    .ia-sugerencias { padding: 0.6rem 1rem; display: flex; gap: 0.4rem; flex-wrap: wrap; background: white; border-top: 1px solid #f0ede8; }
    .sugerencia-btn {
      padding: 0.4rem 0.85rem; background: #f0ede8; border: none; border-radius: 50px;
      font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
      font-family: 'Montserrat', sans-serif; color: #1a1a2e; white-space: nowrap;
    }
    .sugerencia-btn:hover { background: linear-gradient(135deg, #667eea, #764ba2); color: white; transform: translateY(-1px); }

    .ia-input-wrap { padding: 0.85rem 1rem; background: white; border-top: 1px solid #f0ede8; display: flex; gap: 0.5rem; align-items: center; }
    #iaInput {
      flex: 1; padding: 0.65rem 1rem; border: 1.5px solid #e8e4dc; border-radius: 50px;
      font-family: 'Montserrat', sans-serif; font-size: 0.85rem; outline: none;
      transition: all 0.2s; color: #2d2d2d; background: #f8f7f4;
    }
    #iaInput:focus { border-color: #667eea; background: white; }
    #iaInput::placeholder { color: #aaa; }
    .ia-btn-enviar {
      width: 38px; height: 38px; background: linear-gradient(135deg, #667eea, #764ba2);
      border: none; border-radius: 50%; color: white; cursor: pointer; font-size: 0.9rem;
      display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;
    }
    .ia-btn-enviar:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(102,126,234,0.4); }

    .producto-chat-card { background: white; border: 1px solid #e8e4dc; border-radius: 12px; overflow: hidden; margin-top: 0.5rem; cursor: pointer; transition: all 0.2s; }
    .producto-chat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); border-color: #c8a96e; }
    .producto-chat-info { padding: 0.75rem; }
    .producto-chat-nombre { font-size: 0.85rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.2rem; }
    .producto-chat-categoria { font-size: 0.7rem; color: #c8a96e; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.35rem; }
    .producto-chat-precio { font-size: 0.95rem; font-weight: 700; color: #e94560; }
    .producto-chat-btn {
      width: 100%; padding: 0.6rem; background: #1a1a2e; color: white; border: none;
      font-size: 0.78rem; font-weight: 700; cursor: pointer;
      font-family: 'Montserrat', sans-serif; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    }
    .producto-chat-btn:hover { background: #c8a96e; color: #1a1a2e; }

    .wa-chat-btn {
      display: flex; align-items: center; gap: 0.5rem; background: #25d366; color: white;
      padding: 0.65rem 1rem; border-radius: 10px; font-size: 0.82rem; font-weight: 700;
      margin-top: 0.5rem; cursor: pointer; border: none; text-decoration: none;
      font-family: 'Montserrat', sans-serif; transition: all 0.2s; width: 100%; justify-content: center;
    }
    .wa-chat-btn:hover { background: #1da851; transform: translateY(-1px); }

    @media (max-width: 480px) {
      .ia-panel { width: calc(100vw - 2rem); right: 1rem; bottom: 1rem; max-height: 80vh; }
      .ia-btn-flotante { bottom: 5rem; right: 1rem; }
    }
  `;
  document.head.appendChild(estilos);

  document.body.insertAdjacentHTML('beforeend', `
    <div class="ia-burbuja" id="iaBurbuja">🤖 ¿Te ayudo a encontrar tu zapato ideal?</div>
    <button class="ia-btn-flotante" id="iaBtnFlotante" title="Asistente Shogi"><i class="fas fa-robot"></i></button>
    <div class="ia-panel" id="iaPanel">
      <div class="ia-header">
        <div class="ia-avatar">🤖</div>
        <div class="ia-header-info">
          <h4>Shogi - Asistente</h4>
          <div class="ia-estado"><div class="ia-estado-punto"></div> En línea ahora</div>
        </div>
        <button class="ia-btn-cerrar" id="iaBtnCerrar"><i class="fas fa-times"></i></button>
      </div>
      <div class="ia-mensajes" id="iaMensajes"></div>
      <div class="ia-sugerencias" id="iaSugerencias">
        <button class="sugerencia-btn" onclick="enviarSugerencia('Ver zapatos de hombre')">👞 Hombre</button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('Ver zapatos de mujer')">👠 Mujer</button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('Ver zapatos de niño')">👟 Niño</button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('Ver zapatos deportivos')">🏃 Deportivo</button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('¿Cómo compro?')">🛒 ¿Cómo compro?</button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('Formas de pago')">💳 Pagos</button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('¿Hacen envíos?')">🚚 Envíos</button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('Ver precios')">💰 Precios</button>
        <button class="sugerencia-btn" onclick="enviarSugerencia('Ofertas')">🔥 Ofertas</button>
      </div>
      <div class="ia-input-wrap">
        <input type="text" id="iaInput" placeholder="Escribe tu pregunta..." onkeydown="if(event.key==='Enter') enviarMensajeIA()" />
        <button class="ia-btn-enviar" onclick="enviarMensajeIA()"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  `);
}

/* ========================================
   ABRIR Y CERRAR CHAT
   ======================================== */

function abrirChatIA() {
  const panel = document.getElementById('iaPanel');
  const burbuja = document.getElementById('iaBurbuja');
  panel.classList.add('abierto');
  if (burbuja) burbuja.style.display = 'none';

  if (!asistenteListo) {
    asistenteListo = true;
    setTimeout(() => {
      agregarMensajeIA(ASISTENTE_CONFIG.saludo);
      setTimeout(() => {
        agregarMensajeIA("Puedo ayudarte con productos, precios, tallas, formas de pago, envíos y más. ¡Pregúntame lo que quieras! 😊");
      }, 800);
    }, 400);
  }
}

function cerrarChatIA() {
  document.getElementById('iaPanel').classList.remove('abierto');
}

/* ========================================
   ENVIAR Y RECIBIR MENSAJES
   ======================================== */

function enviarMensajeIA() {
  const input = document.getElementById('iaInput');
  const texto = input.value.trim();
  if (!texto) return;

  input.value = '';
  agregarMensajeUsuario(texto);
  mostrarTyping();

  // Simular un pequeño delay para parecer natural
  const delay = 400 + Math.random() * 800;
  setTimeout(() => {
    ocultarTyping();
    const respuesta = generarRespuesta(texto);
    agregarMensajeIA(respuesta);
  }, delay);
}

function enviarSugerencia(texto) {
  document.getElementById('iaInput').value = texto;
  enviarMensajeIA();
}

/* ========================================
   RENDERIZAR MENSAJES
   ======================================== */

function agregarMensajeIA(texto) {
  const mensajes = document.getElementById('iaMensajes');
  const textoFormateado = texto
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    .replace(/\n/g, '<br>');

  mensajes.insertAdjacentHTML('beforeend', `
    <div class="mensaje mensaje-ia">
      <div class="mensaje-avatar-ia">🤖</div>
      <div class="mensaje-burbuja">${textoFormateado}</div>
    </div>
  `);
  mostrarProductosRelevantes(texto);
  scrollAlFinal();
}

function agregarMensajeUsuario(texto) {
  const mensajes = document.getElementById('iaMensajes');
  const textoSeguro = sanitizarHTML(texto);
  mensajes.insertAdjacentHTML('beforeend', `
    <div class="mensaje mensaje-usuario">
      <div class="mensaje-burbuja">${textoSeguro}</div>
    </div>
  `);
  scrollAlFinal();
}

function mostrarTyping() {
  const mensajes = document.getElementById('iaMensajes');
  mensajes.insertAdjacentHTML('beforeend', `
    <div class="mensaje mensaje-ia" id="typingIndicator">
      <div class="mensaje-avatar-ia">🤖</div>
      <div class="typing"><span></span><span></span><span></span></div>
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
  setTimeout(() => { mensajes.scrollTop = mensajes.scrollHeight; }, 100);
}

/* ========================================
   MOSTRAR PRODUCTOS RELEVANTES
   ======================================== */

function mostrarProductosRelevantes(textoRespuesta) {
  const texto = textoRespuesta.toLowerCase();
  const mensajes = document.getElementById('iaMensajes');

  const productosEncontrados = PRODUCTOS.filter(p =>
    texto.includes(p.nombre.toLowerCase())
  ).slice(0, 2);

  if (productosEncontrados.length === 0) return;

  const tarjetas = productosEncontrados.map(p => `
    <div class="producto-chat-card" onclick="verDetalle(${p.id})">
      <div class="producto-chat-info">
        <div class="producto-chat-categoria">${p.categoria}</div>
        <div class="producto-chat-nombre">${p.nombre}</div>
        <div class="producto-chat-precio">${formatearPrecio(p.precio)}</div>
      </div>
      <button class="producto-chat-btn"><i class="fas fa-eye"></i> Ver producto completo</button>
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

  document.getElementById('iaBtnFlotante').addEventListener('click', abrirChatIA);
  document.getElementById('iaBtnCerrar').addEventListener('click', cerrarChatIA);

  // Ocultar burbuja después de 6 segundos
  setTimeout(() => {
    const burbuja = document.getElementById('iaBurbuja');
    if (burbuja) {
      burbuja.style.opacity = '0';
      burbuja.style.transition = 'opacity 0.5s';
      setTimeout(() => burbuja.remove(), 500);
    }
  }, 6000);
});