// Configuración básica de Reveal.js para DHL Express
Reveal.initialize({
    hash: true,
    controls: true,
    progress: true,
    center: true,
    touch: true,
    loop: false,
    rtl: false,
    navigationMode: 'default',
    fragments: true,
    embedded: false,
    help: true,
    pause: true,
    showNotes: false,
    
    // Transiciones simples
    transition: 'slide',
    transitionSpeed: 'default',
    backgroundTransition: 'fade',
    
    // Vista
    viewDistance: 3,
    mobileViewDistance: 2,
    display: 'block',
    hideInactiveCursor: true,
    hideCursorTime: 5000,
    
    // Teclado básico
    keyboard: {
        27: function() { toggleFullscreen(); },
        70: function() { toggleFullscreen(); },
        82: function() { location.reload(); }
    },
    
    plugins: []
});

// Función simple para toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Error al activar fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Event listeners básicos sin animaciones
Reveal.on('ready', function() {
    console.log('Presentación DHL lista');
});

Reveal.on('slidechanged', function(event) {
    console.log('Slide cambiado');
});

// Inicialización básica
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de presentación DHL cargado');
    
    // Precargar imágenes
    const images = ['static/img/dhl-logo.svg', 'static/img/duoc.png'];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Configurar navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
        if (e.key === 'Escape' && document.fullscreenElement) {
            document.exitFullscreen();
        }
    });
}); 