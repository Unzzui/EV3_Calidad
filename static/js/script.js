// Sistema de presentación premium para DHL Express con soporte completo para controles remotos
document.addEventListener('DOMContentLoaded', function() {
    // Register Chart.js plugins if available
    if (typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
    }
    
    // Initialize slide functionality
    initializeSlides();
    
    // Create charts when slides are visible (if needed)
    observeSlides();
    
    // Handle window resize to adjust charts
    window.addEventListener('resize', function() {
        adjustChartContainers();
    });
    
    // Initial adjustment
    adjustChartContainers();
    
    // Initialize remote control support
    initializeRemoteControl();
});

// Global slide control variables
let currentSlide = 1;
let totalSlides = 0;

// Adjust chart containers to fit in viewport without scrolling
function adjustChartContainers() {
    const slides = document.querySelectorAll('section');
    
    slides.forEach(slide => {
        const chartContainers = slide.querySelectorAll('.chart-container');
        
        chartContainers.forEach(container => {
            const slideHeight = slide.clientHeight;
            const slideContent = slide.querySelector('.slide-content');
            const slideHeader = slide.querySelector('.slide-header');
            const slideFooter = slide.querySelector('.slide-footer');
            
            if (slideContent && slideHeader && slideFooter) {
                const headerHeight = slideHeader.offsetHeight;
                const footerHeight = slideFooter.offsetHeight;
                const contentPadding = 40; // Padding del slide-content
                const availableHeight = slideHeight - headerHeight - footerHeight - contentPadding;
                
                // Para la slide de análisis, ajustar específicamente
                if (slide.classList.contains('analysis-slide')) {
                    const analysisGrid = slide.querySelector('.analysis-grid');
                    const impactSection = slide.querySelector('.impact-section');
                    
                    if (analysisGrid && impactSection) {
                        const gridHeight = analysisGrid.offsetHeight;
                        const impactHeight = impactSection.offsetHeight;
                        const gridGap = 30; // Gap entre grid y impact section
                        
                        const totalContentHeight = gridHeight + impactHeight + gridGap;
                        const chartHeight = Math.min(280, (availableHeight - totalContentHeight) / 2);
                        
                        container.style.height = `${chartHeight}px`;
                    } else {
                        container.style.height = '280px';
                    }
                } else {
                    // Para otras slides
                    if (availableHeight > 300) {
                        container.style.height = '280px';
                    } else {
                        container.style.height = '40vh';
                    }
                }
            }
        });
    });
}

// Centralized slide navigation function
function navigateToSlide(slideNumber) {
    const slides = document.querySelectorAll('section');
    
    if (slideNumber < 1 || slideNumber > totalSlides) {
        return false;
    }
    
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    const targetSlide = slides[slideNumber - 1];
    if (targetSlide) {
        targetSlide.classList.add('active');
        currentSlide = slideNumber;
        updateSlideCounter();
        
        // Initialize special diagrams when their slides become active
        if (slideNumber === 5) { // Gantt chart slide
            setTimeout(() => {
                if (typeof drawGantt === 'function') {
                    drawGantt();
                }
            }, 100);
        } else if (slideNumber === 8) { // Ishikawa diagram slide
            console.log('Ishikawa slide activated, attempting to initialize diagram...');
            setTimeout(() => {
                if (typeof initIshikawaDiagram === 'function') {
                    console.log('initIshikawaDiagram function found, calling it...');
                    initIshikawaDiagram();
                } else {
                    console.error('initIshikawaDiagram function not found');
                }
            }, 100);
        } else if (slideNumber === 3) { // Analysis slide
            console.log('Analysis slide activated, initializing charts...');
            setTimeout(() => {
                createFailuresDistributionChart();
                createDeliveryFailuresChart();
                adjustChartContainers();
            }, 200);
        }
        
        // Adjust chart container when slide changes
        setTimeout(() => {
            adjustChartContainers();
        }, 100);
        
        return true;
    }
    return false;
}

// Navigate to next slide
function nextSlide() {
    if (currentSlide < totalSlides) {
        navigateToSlide(currentSlide + 1);
        return true;
    }
    return false;
}

// Navigate to previous slide
function prevSlide() {
    if (currentSlide > 1) {
        navigateToSlide(currentSlide - 1);
        return true;
    }
    return false;
}

// Update slide counter
function updateSlideCounter() {
    const currentSlideNumber = document.getElementById('currentSlideNumber');
    const totalSlideNumber = document.getElementById('totalSlideNumber');
    
    if (currentSlideNumber) {
        currentSlideNumber.textContent = currentSlide;
    }
    
    if (totalSlideNumber) {
        totalSlideNumber.textContent = totalSlides;
    }
    
    // Update progress bars
    updateProgressBars();
    
    // Update slide indicators
    updateSlideIndicators();
    
    console.log(`Slide ${currentSlide} de ${totalSlides}`);
}

// Update progress bars
function updateProgressBars() {
    const bottomProgressFill = document.getElementById('bottomProgressFill');
    
    const progressPercentage = (currentSlide / totalSlides) * 100;
    
    if (bottomProgressFill) {
        bottomProgressFill.style.width = `${progressPercentage}%`;
    }
}

// Update slide indicators
function updateSlideIndicators() {
    const slideIndicators = document.getElementById('slideIndicators');
    
    if (!slideIndicators) return;
    
    // Clear existing indicators
    slideIndicators.innerHTML = '';
    
    // Create indicators for each slide
    for (let i = 1; i <= totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'slide-dot';
        if (i === currentSlide) {
            dot.classList.add('active');
        }
        
        // Add click event to navigate to specific slide
        dot.addEventListener('click', () => {
            navigateToSlide(i);
        });
        
        slideIndicators.appendChild(dot);
    }
}

// Slide navigation functionality
function initializeSlides() {
    const slides = document.querySelectorAll('section');
    totalSlides = slides.length;
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        handleKeyboardInput(e);
    });
    
    // Initialize progress system
    initializeProgressSystem();
    
    // Initialize counter and indicators
    updateSlideCounter();
}

// Initialize progress system
function initializeProgressSystem() {
    // Initialize slide indicators
    updateSlideIndicators();
    
    // Initialize progress bars
    updateProgressBars();
    
    // Add keyboard shortcut for fullscreen
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
    });
}

// Handle keyboard input (including remote control keys)
function handleKeyboardInput(e) {
    // Prevent default behavior for navigation keys
    const navigationKeys = [
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'PageUp', 'PageDown', 'Home', 'End',
        'Space', 'Enter', 'Escape'
    ];
    
    if (navigationKeys.includes(e.key)) {
        e.preventDefault();
    }
    
    // Flag to track if we handled the event
    let handled = false;
    
    // Handle modern key events first
    switch(e.key) {
        // Standard arrow keys
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
            prevSlide();
            handled = true;
            break;
            
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case 'Space':
        case 'Enter':
            nextSlide();
            handled = true;
            break;
            
        // Home/End keys
        case 'Home':
            navigateToSlide(1);
            handled = true;
            break;
            
        case 'End':
            navigateToSlide(totalSlides);
            handled = true;
            break;
            
        // Number keys for direct navigation
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            const slideNum = parseInt(e.key);
            if (slideNum <= totalSlides) {
                navigateToSlide(slideNum);
            }
            handled = true;
            break;
            
        // Remote control specific keys
        case 'MediaTrackNext':
        case 'MediaPlayPause':
            nextSlide();
            handled = true;
            break;
            
        case 'MediaTrackPrevious':
            prevSlide();
            handled = true;
            break;
            
        // TV Remote keys (some browsers support these)
        case 'ChannelUp':
            nextSlide();
            handled = true;
            break;
            
        case 'ChannelDown':
            prevSlide();
            handled = true;
            break;
            
        // Fullscreen toggle
        case 'F11':
            toggleFullscreen();
            handled = true;
            break;
    }
    
    // Only handle keyCode events if the modern key event wasn't handled
    // This is for older browsers or specific remote controls
    if (!handled) {
        switch(e.keyCode) {
            case 37: // Left arrow
            case 38: // Up arrow
            case 33: // Page Up
                prevSlide();
                break;
                
            case 39: // Right arrow
            case 40: // Down arrow
            case 34: // Page Down
            case 32: // Space
            case 13: // Enter
                nextSlide();
                break;
                
            case 36: // Home
                navigateToSlide(1);
                break;
                
            case 35: // End
                navigateToSlide(totalSlides);
                break;
                
            // Number keys (48-57 are 0-9)
            case 49: case 50: case 51: case 52: case 53:
            case 54: case 55: case 56: case 57:
                const slideNumber = e.keyCode - 48;
                if (slideNumber <= totalSlides) {
                    navigateToSlide(slideNumber);
                }
                break;
        }
    }
}

// Initialize remote control support
function initializeRemoteControl() {
    // Gamepad API support for game controllers and some remote controls
    let gamepadIndex = -1;
    
    window.addEventListener('gamepadconnected', function(e) {
        console.log('Gamepad/Remote connected:', e.gamepad.id);
        gamepadIndex = e.gamepad.index;
        startGamepadPolling();
    });
    
    window.addEventListener('gamepaddisconnected', function(e) {
        console.log('Gamepad/Remote disconnected');
        gamepadIndex = -1;
    });
    
    // Gamepad polling function
    let lastButtonStates = {};
    
    function startGamepadPolling() {
        function pollGamepad() {
            if (gamepadIndex === -1) return;
            
            const gamepad = navigator.getGamepads()[gamepadIndex];
            if (!gamepad) return;
            
            // Check D-pad and buttons
            const buttons = gamepad.buttons;
            
            // D-pad left (button 14) or left stick left
            if ((buttons[14] && buttons[14].pressed && !lastButtonStates[14]) || 
                (gamepad.axes[0] < -0.5 && !lastButtonStates['axisLeft'])) {
                prevSlide();
                lastButtonStates[14] = true;
                lastButtonStates['axisLeft'] = true;
            } else if ((!buttons[14] || !buttons[14].pressed) && gamepad.axes[0] > -0.5) {
                lastButtonStates[14] = false;
                lastButtonStates['axisLeft'] = false;
            }
            
            // D-pad right (button 15) or left stick right
            if ((buttons[15] && buttons[15].pressed && !lastButtonStates[15]) || 
                (gamepad.axes[0] > 0.5 && !lastButtonStates['axisRight'])) {
                nextSlide();
                lastButtonStates[15] = true;
                lastButtonStates['axisRight'] = true;
            } else if ((!buttons[15] || !buttons[15].pressed) && gamepad.axes[0] < 0.5) {
                lastButtonStates[15] = false;
                lastButtonStates['axisRight'] = false;
            }
            
            // A button (button 0) for next
            if (buttons[0] && buttons[0].pressed && !lastButtonStates[0]) {
                nextSlide();
                lastButtonStates[0] = true;
            } else if (!buttons[0] || !buttons[0].pressed) {
                lastButtonStates[0] = false;
            }
            
            // B button (button 1) for previous
            if (buttons[1] && buttons[1].pressed && !lastButtonStates[1]) {
                prevSlide();
                lastButtonStates[1] = true;
            } else if (!buttons[1] || !buttons[1].pressed) {
                lastButtonStates[1] = false;
            }
            
            requestAnimationFrame(pollGamepad);
        }
        
        pollGamepad();
    }
    
    // Touch/swipe support for touch-enabled remote controls
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Minimum swipe distance
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - previous slide
                prevSlide();
            } else {
                // Swipe left - next slide
                nextSlide();
            }
        }
        
        touchStartX = 0;
        touchStartY = 0;
    }, { passive: true });
    
    // Focus management for better remote control support
    document.addEventListener('focus', function() {
        // Ensure the document can receive key events
        if (document.activeElement === document.body) {
            document.body.focus();
        }
    });
    
    // Make sure the document can receive focus
    document.body.setAttribute('tabindex', '-1');
    document.body.focus();
}

// Function for toggle fullscreen
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

// Function to go to a specific slide (useful for debugging)
function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        navigateToSlide(slideNumber);
    }
}

// Event listener for clicks in the presentation (click navigation)
document.addEventListener('click', function(e) {
    // Only navigate if the click is not on a control
    if (!e.target.closest('.navigation-controls') && 
        !e.target.closest('button') && 
        !e.target.closest('a')) {
        
        const rect = document.documentElement.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const centerX = rect.width / 2;
        
        // Click in the right half = next slide
        if (clickX > centerX) {
            nextSlide();
        } else {
            // Click in the left half = previous slide
            prevSlide();
        }
    }
});

// Expose navigation functions globally for external control
window.presentationControl = {
    nextSlide: nextSlide,
    prevSlide: prevSlide,
    goToSlide: goToSlide,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides
};

// Observe slides for visibility and create charts when visible (if needed)
function observeSlides() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const slideElement = entry.target;
                const slideNumber = parseInt(slideElement.getAttribute('data-slide') || '0');
                
                // Create chart based on slide number if needed
                if (slideNumber > 0 && !slideElement.hasAttribute('data-chart-created')) {
                    slideElement.setAttribute('data-chart-created', 'true');
                    
                    // Create specific charts based on slide content
                    if (slideElement.classList.contains('analysis-slide')) {
                        console.log('Creating analysis charts for slide', slideNumber);
                        setTimeout(() => {
                            createFailuresDistributionChart();
                            createDeliveryFailuresChart();
                        }, 300);
                    }
                    
                    // Adjust chart container after chart creation
                    setTimeout(() => {
                        adjustChartContainers();
                    }, 500);
                }
            }
        });
    }, options);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(slide => {
        observer.observe(slide);
    });
    
    // Initialize charts for the first slide if it's the analysis slide
    const firstSlide = document.querySelector('section.active');
    if (firstSlide && firstSlide.classList.contains('analysis-slide')) {
        setTimeout(() => {
            createFailuresDistributionChart();
            createDeliveryFailuresChart();
        }, 500);
    }
}

// Create failures distribution chart
function createFailuresDistributionChart() {
    const ctx = document.getElementById('failuresDistributionChart');
    if (!ctx) return;
    
    const failuresDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Entrega (25 fallas)', 'Otras etapas (101 fallas)'],
            datasets: [{
                data: [25, 101],
                backgroundColor: [
                    '#FFCC00',
                    '#E0E0E0'
                ],
                borderColor: [
                    '#F4C842',
                    '#CCCCCC'
                ],
                borderWidth: 2,
                hoverBorderWidth: 3,
                hoverBorderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 16
                    },
                    bodyFont: {
                        size: 14
                    },
                    padding: 15,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} fallas (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: '#000000',
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: function(value, context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${value}\n(${percentage}%)`;
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Create delivery failures chart
function createDeliveryFailuresChart() {
    const ctx = document.getElementById('deliveryFailuresChart');
    if (!ctx) return;
    
    const deliveryFailuresChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Retrasos', 'Errores', 'Robos'],
            datasets: [{
                label: 'Cantidad de Fallas',
                data: [14, 9, 2],
                backgroundColor: [
                    '#FF6B6B',
                    '#4ECDC4',
                    '#45B7D1'
                ],
                borderColor: [
                    '#FF5252',
                    '#26A69A',
                    '#1976D2'
                ],
                borderWidth: 2,
                borderRadius: 8,
                hoverBorderWidth: 3,
                hoverBorderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 12
                        },
                        stepSize: 2
                    },
                    title: {
                        display: true,
                        text: 'Cantidad de Fallas',
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 14,
                            weight: 'normal'
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 16
                    },
                    bodyFont: {
                        size: 14
                    },
                    padding: 15,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                            return `${context.parsed.y} fallas (${percentage}% del total)`;
                        }
                    }
                },
                datalabels: {
                    color: '#FFFFFF',
                    anchor: 'end',
                    align: 'top',
                    offset: 0,
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: function(value) {
                        return value;
                    }
                }
            }
        }
    });
}

// Make functions global for console use
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.showSlide = navigateToSlide;
window.goToSlide = goToSlide;
window.toggleFullscreen = toggleFullscreen;

console.log('Sistema de presentación DHL premium con controles remotos cargado');
console.log('Controles disponibles:');
console.log('- Teclado: Flechas ← →, PageUp/PageDown, Espacio, Enter, Home, End, F11 (fullscreen), números 1-9');
console.log('- Mouse: Click izquierdo/derecho para navegar, controles visuales');
console.log('- Controles remotos: PageUp/PageDown, flechas, números, gamepad');
console.log('- Función: goToSlide(número) para ir a slide específica'); 