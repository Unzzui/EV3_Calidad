// Sistema de presentación premium para DHL Express
let currentSlide = 0;
const slides = document.querySelectorAll('section');
const totalSlides = slides.length;

// Función para mostrar una slide específica
function showSlide(index) {
    // Ocultar todas las slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Mostrar la slide actual
    if (slides[index]) {
        slides[index].classList.add('active');
        currentSlide = index;
        updateSlideCounter();
        
        // Initialize special diagrams when their slides become active
        if (index === 4) { // Gantt chart slide
            setTimeout(() => {
                if (typeof drawGantt === 'function') {
                    drawGantt();
                }
            }, 100);
        } else if (index === 7) { // Ishikawa diagram slide
            console.log('Ishikawa slide activated, attempting to initialize diagram...');
            setTimeout(() => {
                if (typeof initIshikawaDiagram === 'function') {
                    console.log('initIshikawaDiagram function found, calling it...');
                    initIshikawaDiagram();
                } else {
                    console.error('initIshikawaDiagram function not found');
                }
            }, 100);
        }
    }
}

// Función para ir a la siguiente slide
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}

// Función para ir a la slide anterior
function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

// Función para actualizar el contador de slides (solo en consola para debugging)
function updateSlideCounter() {
    console.log(`Slide ${currentSlide + 1} de ${totalSlides}`);
}

// Función para toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            console.log('Modo fullscreen activado');
        }).catch(err => {
            console.log('Error al activar fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
        console.log('Fullscreen desactivado');
    }
}

// Event listeners para navegación con teclado
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevSlide();
            break;
        case 'F11':
            e.preventDefault();
            toggleFullscreen();
            break;
        case 'Escape':
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
        case 'Home':
            e.preventDefault();
            showSlide(0);
            break;
        case 'End':
            e.preventDefault();
            showSlide(totalSlides - 1);
            break;
    }
});

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de presentación DHL premium cargado');
    
    // Mostrar la primera slide
    showSlide(0);
    
    // Precargar imágenes
    const images = ['static/img/dhl-logo.svg', 'static/img/duoc.svg'];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    console.log(`Presentación premium lista con ${totalSlides} slides`);
    console.log('Controles: Flechas ← →, Espacio, Home, End, F11 (fullscreen)');
}); 