// Configuración avanzada de Reveal.js para la presentación DHL
Reveal.initialize({
    // Configuración básica
    hash: true,
    controls: true,
    progress: true,
    center: true,
    touch: true,
    loop: false,
    rtl: false,
    
    // Configuración de navegación
    keyboard: true,
    overview: true,
    disableLayout: false,
    
    // Transiciones premium
    transition: 'slide', // none/fade/slide/convex/concave/zoom
    transitionSpeed: 'default', // default/fast/slow
    backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom
    
    // Configuración de vista optimizada
    viewDistance: 3,
    mobileViewDistance: 2,
    
    // Configuración de display
    display: 'block',
    hideInactiveCursor: true,
    hideCursorTime: 3000,
    
    // Configuración de presentación
    autoSlide: 0, // Tiempo en ms para avance automático (0 = deshabilitado)
    autoSlideStoppable: true,
    autoSlideMethod: null,
    
    // Configuración de fragmentos
    fragments: true,
    fragmentInURL: false,
    
    // Configuración de embebido
    embedded: false,
    
    // Configuración de ayuda
    help: true,
    showNotes: false,
    
    // Configuración de tamaño optimizado
    width: 1920,
    height: 1080,
    margin: 0.04,
    minScale: 0.2,
    maxScale: 2.0,
    
    // Plugins y dependencias avanzadas
    dependencies: [
        // Plugin de notas del presentador
        { 
            src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/plugin/notes/notes.min.js', 
            async: true 
        },
        // Plugin de zoom con Alt+Click
        { 
            src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/plugin/zoom/zoom.min.js', 
            async: true 
        },
        // Plugin de búsqueda con Ctrl+Shift+F
        { 
            src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/plugin/search/search.min.js', 
            async: true 
        },
        // Plugin de markdown (si se necesita)
        { 
            src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/plugin/markdown/markdown.min.js', 
            async: true 
        }
    ],
    
    // Configuración de teclado personalizada
    keyboard: {
        13: 'next', // Enter para siguiente
        27: function() { // ESC para overview/salir
            if (Reveal.isOverview()) {
                Reveal.toggleOverview();
            } else {
                Reveal.toggleOverview();
            }
        },
        32: 'next', // Espacio para siguiente
        37: 'left', // Flecha izquierda
        38: 'up', // Flecha arriba
        39: 'right', // Flecha derecha
        40: 'down', // Flecha abajo
        72: function() { // H para ayuda
            Reveal.toggleHelp();
        },
        80: function() { // P para modo presentador
            window.open(location.href + '?print-pdf', '_blank');
        }
    }
});

// Variables globales para efectos
let particleSystem = null;
let currentSlideIndex = 0;
let slideAnimations = [];

// Event listeners principales
Reveal.addEventListener('ready', function(event) {
    console.log('🚚 Presentación DHL Express cargada correctamente');
    
    // Agregar clase al body para estilos específicos
    document.body.classList.add('dhl-presentation');
    
    // Inicializar efectos visuales
    initializeVisualEffects();
    
    // Configurar título dinámico
    updateTitle(event.indexh + 1);
    
    // Inicializar sistema de partículas
    initializeParticleSystem();
    
    // Configurar animaciones de entrada
    setupSlideAnimations();
    
    console.log('✨ Efectos visuales inicializados');
});

Reveal.addEventListener('slidechanged', function(event) {
    // Actualizar título con número de slide
    updateTitle(event.indexh + 1);
    
    // Ejecutar animaciones específicas del slide
    executeSlideAnimations(event.indexh);
    
    // Actualizar sistema de partículas
    updateParticleSystem(event.indexh);
    
    // Log para tracking
    console.log(`📊 Slide actual: ${event.indexh + 1}/${Reveal.getTotalSlides()}`);
    
    // Efectos de sonido sutiles (opcional)
    playSlideTransitionSound();
});

Reveal.addEventListener('fragmentshown', function(event) {
    // Animaciones para fragmentos
    animateFragment(event.fragment, 'show');
});

Reveal.addEventListener('fragmenthidden', function(event) {
    // Animaciones para fragmentos ocultos
    animateFragment(event.fragment, 'hide');
});

// Función para actualizar el título de la página
function updateTitle(slideNumber) {
    const totalSlides = Reveal.getTotalSlides();
    document.title = `DHL Express - Mejora Continua (${slideNumber}/${totalSlides})`;
    
    // Actualizar barra de progreso personalizada
    updateCustomProgressBar(slideNumber, totalSlides);
}

// Sistema de partículas dinámico
function initializeParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.15';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Configurar canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Crear partículas
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: Math.random() > 0.5 ? '#D40511' : '#FFCC00',
            alpha: Math.random() * 0.5 + 0.2
        };
    }
    
    // Inicializar partículas - reducidas para mejor rendimiento
    for (let i = 0; i < 20; i++) {
        particles.push(createParticle());
    }
    
    // Animar partículas
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Mover partícula
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Rebotar en bordes
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -1;
            }
            
            // Dibujar partícula
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Inicializar efectos visuales - simplificado
function initializeVisualEffects() {
    // Efectos de hover para elementos interactivos
    setupHoverEffects();
    
    // Configurar indicadores visuales
    setupVisualIndicators();
    
    // Sin efectos de typing ni paralaje que afecten la legibilidad
}

// Efectos de hover simplificados
function setupHoverEffects() {
    // Para cajas de métricas - efectos más sutiles
    document.querySelectorAll('.metric-box, .stat-item').forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Efectos de typing eliminados para mejor legibilidad
function setupTypingEffects() {
    // Función deshabilitada - los títulos se muestran normalmente
    return;
}

// Configurar animaciones específicas por slide - simplificado
function setupSlideAnimations() {
    slideAnimations = [
        // Slide 0: Título - solo mantener el logo animado suavemente
        () => {
            const logo = document.querySelector('.dhl-logo');
            if (logo) {
                // Ya tiene su animación CSS, no agregar más
            }
        },
        
        // Slides restantes sin animaciones complejas
        () => {}, // Slide 1
        () => {}, // Slide 2
        () => {}, // Slide 3
        // ... etc
    ];
}

// Ejecutar animaciones específicas del slide - simplificado
function executeSlideAnimations(slideIndex) {
    if (slideAnimations[slideIndex]) {
        slideAnimations[slideIndex]();
    }
    
    // Sin animaciones complejas que afecten la legibilidad
    const currentSlide = document.querySelector('.present');
    if (currentSlide) {
        const elements = currentSlide.querySelectorAll('.metric-box, .problem-box, .solution-box, .stat-item');
        elements.forEach((element) => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }
}

// Actualizar sistema de partículas según el slide
function updateParticleSystem(slideIndex) {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    // Cambiar densidad de partículas según el contenido del slide
    const densityMap = {
        0: 0.8, // Título - más partículas
        1: 0.6, // Problema - partículas moderadas
        2: 0.4, // Solución - menos partículas
        // ... etc
    };
    
    const density = densityMap[slideIndex] || 0.3;
    canvas.style.opacity = density;
}

// Barra de progreso personalizada
function updateCustomProgressBar(current, total) {
    let progressBar = document.getElementById('custom-progress');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'custom-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #D40511, #FFCC00);
            transition: width 0.3s ease;
            z-index: 1000;
        `;
        document.body.appendChild(progressBar);
    }
    
    const percentage = (current / total) * 100;
    progressBar.style.width = percentage + '%';
}

// Efectos de sonido sutiles (opcional)
function playSlideTransitionSound() {
    // Solo si el usuario ha interactuado con la página
    if (document.body.classList.contains('user-interacted')) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Configurar indicadores visuales
function setupVisualIndicators() {
    // Indicador de slide actual
    const slideIndicator = document.createElement('div');
    slideIndicator.id = 'slide-indicator';
    slideIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(212, 5, 17, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        backdrop-filter: blur(10px);
    `;
    document.body.appendChild(slideIndicator);
    
    // Actualizar indicador
    function updateIndicator() {
        const current = Reveal.getIndices().h + 1;
        const total = Reveal.getTotalSlides();
        slideIndicator.textContent = `${current} / ${total}`;
    }
    
    Reveal.addEventListener('slidechanged', updateIndicator);
    updateIndicator();
}

// Efectos de paralaje eliminados
function setupParallaxEffects() {
    // Función deshabilitada para mejor rendimiento y legibilidad
    return;
}

// Animaciones para fragmentos - simplificado
function animateFragment(fragment, action) {
    // Sin animaciones complejas en fragmentos
    if (action === 'show') {
        fragment.style.opacity = '1';
    } else {
        fragment.style.opacity = '0.5';
    }
}

// Navegación con gestos en móvil mejorada
if ('ontouchstart' in window) {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        const timeDiff = endTime - startTime;
        
        // Detectar swipe rápido
        if (timeDiff < 300 && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                Reveal.next();
            } else {
                Reveal.prev();
            }
        }
        
        // Detectar tap para zoom
        if (timeDiff < 200 && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
            // Zoom en elemento tocado
            const target = e.target.closest('.metric-box, .stat-item');
            if (target) {
                target.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    target.style.transform = '';
                }, 200);
            }
        }
        
        startX = startY = 0;
    }, { passive: true });
}

// Configuración de impresión mejorada
window.addEventListener('beforeprint', function() {
    // Ocultar elementos innecesarios para impresión
    document.querySelectorAll('#particles-canvas, #custom-progress, #slide-indicator').forEach(el => {
        el.style.display = 'none';
    });
    
    // Asegurar que todas las slides sean visibles
    Reveal.configure({ embedded: true });
});

window.addEventListener('afterprint', function() {
    // Restaurar elementos
    document.querySelectorAll('#particles-canvas, #custom-progress, #slide-indicator').forEach(el => {
        el.style.display = '';
    });
    
    // Restaurar configuración normal
    Reveal.configure({ embedded: false });
});

// Función de utilidad para fullscreen mejorada
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            console.log('🖥️ Modo fullscreen activado');
            // Ocultar cursor en fullscreen
            document.body.style.cursor = 'none';
            setTimeout(() => {
                document.body.style.cursor = '';
            }, 3000);
        }).catch(err => {
            console.log('❌ Error al activar fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
        console.log('🖥️ Fullscreen desactivado');
    }
}

// Atajos de teclado mejorados
document.addEventListener('keydown', function(e) {
    // Marcar interacción del usuario
    document.body.classList.add('user-interacted');
    
    // F11 para fullscreen
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // Ctrl+P para imprimir
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        window.print();
    }
    
    // R para reload
    if (e.key === 'r' || e.key === 'R') {
        if (!e.ctrlKey) {
            location.reload();
        }
    }
    
    // B para black screen
    if (e.key === 'b' || e.key === 'B') {
        document.body.classList.toggle('blackout');
    }
});

// Agregar estilos dinámicos
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes shine {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    @keyframes fadeOut {
        to { opacity: 0; transform: scale(0.8); }
    }
    
    .blackout {
        background: black !important;
    }
    
    .blackout * {
        visibility: hidden !important;
    }
    
    .user-interacted .metric-box:hover {
        animation: pulse 1s ease-in-out;
    }
`;
document.head.appendChild(dynamicStyles);

// Inicialización final
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de presentación DHL completamente cargado');
    
    // Precargar recursos críticos
    const criticalResources = [
        'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
    ];
    
    criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}); 