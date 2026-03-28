/* ========================================
   CALZADO SHOGUN - Animaciones
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------
     ANIMACIÓN AL HACER SCROLL
     Elementos aparecen suavemente al entrar
     en la pantalla
  ---------------------------------------- */

  // Estilos base para animación
  const estiloAnimacion = document.createElement('style');
  estiloAnimacion.textContent = `
    .animar {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animar.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .animar-izq {
      opacity: 0;
      transform: translateX(-30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animar-izq.visible {
      opacity: 1;
      transform: translateX(0);
    }
    .animar-der {
      opacity: 0;
      transform: translateX(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animar-der.visible {
      opacity: 1;
      transform: translateX(0);
    }
  `;
  document.head.appendChild(estiloAnimacion);

  // Agregar clases de animación a elementos
  const selectoresAnimar = [
    { selector: '.categoria-card',    clase: 'animar'     },
    { selector: '.producto-card',     clase: 'animar'     },
    { selector: '.pago-card',         clase: 'animar'     },
    { selector: '.contacto-card',     clase: 'animar'     },
    { selector: '.nosotros-texto',    clase: 'animar-der' },
    { selector: '.nosotros-imagen',   clase: 'animar-izq' },
    { selector: '.seccion-titulo',    clase: 'animar'     },
    { selector: '.banner-cta-contenido', clase: 'animar'  },
  ];

  selectoresAnimar.forEach(({ selector, clase }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(clase);
      // Delay escalonado para elementos en grid
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  // Observador de intersección
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  // Observar todos los elementos animables
  document.querySelectorAll('.animar, .animar-izq, .animar-der')
    .forEach(el => observador.observe(el));

  /* ----------------------------------------
     EFECTO HOVER EN TARJETAS DE CATEGORÍA
  ---------------------------------------- */
  document.querySelectorAll('.categoria-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--color-secundario)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'var(--color-borde)';
    });
  });

  /* ----------------------------------------
     SCROLL SUAVE PARA ANCLAS INTERNAS
  ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
      const destino = document.querySelector(enlace.getAttribute('href'));
      if (destino) {
        e.preventDefault();
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------
     EFECTO RIPPLE EN BOTONES PRIMARIOS
  ---------------------------------------- */
  document.querySelectorAll('.btn-primario, .btn-agregar-carrito').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.5s ease-out;
        pointer-events: none;
      `;

      this.style.position   = 'relative';
      this.style.overflow   = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Keyframe para ripple
  if (!document.getElementById('rippleStyle')) {
    const rippleStyle = document.createElement('style');
    rippleStyle.id    = 'rippleStyle';
    rippleStyle.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(rippleStyle);
  }

  /* ----------------------------------------
     CONTADOR ANIMADO (para números)
  ---------------------------------------- */
  function animarContador(elemento, fin, duracion = 1500) {
    let inicio   = 0;
    const paso   = duracion / fin;
    const timer  = setInterval(() => {
      inicio += Math.ceil(fin / (duracion / 30));
      if (inicio >= fin) {
        elemento.textContent = fin;
        clearInterval(timer);
      } else {
        elemento.textContent = inicio;
      }
    }, 30);
  }

  // Observar estadísticas si existen
  document.querySelectorAll('[data-contador]').forEach(el => {
    const obsContador = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animarContador(el, parseInt(el.dataset.contador));
          obsContador.unobserve(el);
        }
      });
    });
    obsContador.observe(el);
  });
  
  /* ----------------------------------------
     IMAGEN HERO: efecto parallax suave
  ---------------------------------------- */
  
  const heroImagen = document.querySelector('.hero-imagen');
  if (heroImagen) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < 600) {
        heroImagen.style.transform = `translateY(${scroll * 0.08}px)`;
      }
    });
  }

});