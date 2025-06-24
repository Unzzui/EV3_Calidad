document.addEventListener('DOMContentLoaded', function() {
    // Register Chart.js plugins
    if (typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
    }
    
    // Initialize slide functionality
    initializeSlides();
    
    // Create charts when slides are visible
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
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach(slide => {
        const slideHeight = slide.clientHeight;
        const chartContainer = slide.querySelector('.chart-container');
        
        if (chartContainer) {
            const slideContent = slide.getBoundingClientRect();
            // Aumentado el padding inferior para evitar que los botones tapen el contenido
            const availableHeight = slideHeight - (slideContent.top + 150);
            
            // Ensure chart container doesn't cause overflow
            if (availableHeight > 200) { // Minimum height for charts
                chartContainer.style.height = `${availableHeight}px`;
            } else {
                chartContainer.style.height = '40vh';
            }
        }
    });
}

// Centralized slide navigation function
function navigateToSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    
    if (slideNumber < 1 || slideNumber > totalSlides) {
        return false; // Invalid slide number
    }
    
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    const targetSlide = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
    if (targetSlide) {
        targetSlide.classList.add('active');
        currentSlide = slideNumber;
        updateSlideCounter();
        
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
function previousSlide() {
    if (currentSlide > 1) {
        navigateToSlide(currentSlide - 1);
        return true;
    }
    return false;
}

// Update slide counter
function updateSlideCounter() {
    const slideCounter = document.getElementById('slideCounter');
    if (slideCounter) {
        slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
    }
}

// Slide navigation functionality
function initializeSlides() {
    const slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    
    // Navigation buttons
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    
    // Previous slide button
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            previousSlide();
        });
    }
    
    // Next slide button
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            nextSlide();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        handleKeyboardInput(e);
    });
    
    // Initialize counter
    updateSlideCounter();
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
            previousSlide();
            handled = true;
            break;
            
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case 'Space':
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
            previousSlide();
            handled = true;
            break;
            
        // TV Remote keys (some browsers support these)
        case 'ChannelUp':
            nextSlide();
            handled = true;
            break;
            
        case 'ChannelDown':
            previousSlide();
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
                previousSlide();
                break;
                
            case 39: // Right arrow
            case 40: // Down arrow
            case 34: // Page Down
            case 32: // Space
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
                previousSlide();
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
                previousSlide();
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
                previousSlide();
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

// Expose navigation functions globally for external control
window.presentationControl = {
    nextSlide: nextSlide,
    previousSlide: previousSlide,
    goToSlide: navigateToSlide,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides
};

// Observe slides for visibility and create charts when visible
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
                const slideNumber = slideElement.getAttribute('data-slide');
                
                // Create chart based on slide number
                switch(slideNumber) {
                    case '2':
                        if (!slideElement.hasAttribute('data-chart-created')) {
                            createCashGrowthChart();
                            slideElement.setAttribute('data-chart-created', 'true');
                        }
                        break;
                    case '3':
                        if (!slideElement.hasAttribute('data-chart-created')) {
                            createRevenueGrowthChart();
                            slideElement.setAttribute('data-chart-created', 'true');
                        }
                        break;
                    case '4':
                        if (!slideElement.hasAttribute('data-chart-created')) {
                            createCashFlowChart();
                            slideElement.setAttribute('data-chart-created', 'true');
                        }
                        break;
                    case '5':
                        if (!slideElement.hasAttribute('data-chart-created')) {
                            createPerformanceSummaryChart();
                            slideElement.setAttribute('data-chart-created', 'true');
                        }
                        break;
                }
                
                // Adjust chart container after chart creation
                setTimeout(() => {
                    adjustChartContainers();
                }, 200);
            }
        });
    }, options);
    
    // Observe all slides
    document.querySelectorAll('.slide').forEach(slide => {
        observer.observe(slide);
    });
}

// Chart creation functions
function createCashGrowthChart() {
    const ctx = document.getElementById('cashGrowthChart').getContext('2d');
    
    // Chart gradient
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(118, 185, 0, 0.8)');
    gradientFill.addColorStop(1, 'rgba(118, 185, 0, 0.2)');
    
    const cashGrowthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2023', '2024', '2025', '2026 (Projected)'],
            datasets: [{
                label: 'Cash and Cash Equivalents (Billions USD)',
                data: [6.2, 8.6, 15.2, 18.5],
                backgroundColor: [
                    'rgba(118, 185, 0, 0.7)',
                    'rgba(118, 185, 0, 0.8)',
                    'rgba(118, 185, 0, 0.9)',
                    'rgba(118, 185, 0, 0.5)'
                ],
                borderColor: [
                    'rgba(118, 185, 0, 1)',
                    'rgba(118, 185, 0, 1)',
                    'rgba(118, 185, 0, 1)',
                    'rgba(118, 185, 0, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                hoverBorderWidth: 3,
                hoverBorderColor: '#ffffff'
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
                        callback: function(value) {
                            return '$' + value + 'B';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Billions USD',
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
                            return `$${context.parsed.y}B`;
                        }
                    }
                },
                datalabels: {
                    color: '#ffffff',
                    anchor: 'end',
                    align: 'top',
                    offset: 0,
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: function(value) {
                        return '$' + value + 'B';
                    }
                }
            }
        }
    });
}

function createRevenueGrowthChart() {
    const ctx = document.getElementById('revenueGrowthChart').getContext('2d');
    
    // Chart gradient
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(118, 185, 0, 0.5)');
    gradientFill.addColorStop(1, 'rgba(118, 185, 0, 0.05)');
    
    const revenueGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2023', '2024', '2025', '2026 (Projected)'],
            datasets: [{
                label: 'Total Revenue (Billions USD)',
                data: [111.5, 130.0, 148.5, 167.2],
                backgroundColor: gradientFill,
                borderColor: 'rgba(118, 185, 0, 1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgba(118, 185, 0, 1)',
                pointBorderColor: '#fff',
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.4,
                fill: true
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
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return '$' + value + 'B';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Billions USD',
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
                            return `$${context.parsed.y}B`;
                        }
                    }
                },
                datalabels: {
                    color: '#ffffff',
                    backgroundColor: 'rgba(118, 185, 0, 0.8)',
                    borderRadius: 4,
                    padding: 6,
                    anchor: 'end',
                    align: 'top',
                    offset: 0,
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: function(value) {
                        return '$' + value + 'B';
                    }
                }
            }
        }
    });
}

function createCashFlowChart() {
    const ctx = document.getElementById('cashFlowChart').getContext('2d');
    
    const cashFlowChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2023', '2024', '2025', '2026 (Projected)'],
            datasets: [
                {
                    label: 'Operating Cash Flow',
                    data: [58.0, 68.2, 80.5, 93.1],
                    backgroundColor: 'rgba(118, 185, 0, 0.8)',
                    borderColor: 'rgba(118, 185, 0, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff'
                },
                {
                    label: 'Free Cash Flow',
                    data: [52.3, 60.9, 72.1, 82.7],
                    backgroundColor: 'rgba(0, 112, 192, 0.8)',
                    borderColor: 'rgba(0, 112, 192, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff'
                }
            ]
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
                        callback: function(value) {
                            return '$' + value + 'B';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Billions USD',
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
                    position: 'top',
                    align: 'center',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 12
                        },
                        boxWidth: 12,
                        padding: 15
                    }
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
                    callbacks: {
                        label: function(context) {
                            return `$${context.parsed.y}B`;
                        }
                    }
                },
                datalabels: {
                    color: '#ffffff',
                    anchor: 'end',
                    align: 'top',
                    offset: 0,
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: function(value) {
                        return '$' + value + 'B';
                    }
                }
            }
        }
    });
}

function createPerformanceSummaryChart() {
    const ctx = document.getElementById('performanceSummaryChart').getContext('2d');
    
    const performanceSummaryChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Revenue Growth',
                'Profit Margin',
                'Cash Flow',
                'R&D Investment',
                'Market Share',
                'Debt Ratio'
            ],
            datasets: [{
                label: '2024',
                data: [85, 88, 80, 75, 82, 90],
                backgroundColor: 'rgba(118, 185, 0, 0.3)',
                borderColor: 'rgba(118, 185, 0, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(118, 185, 0, 1)',
                pointBorderColor: '#fff',
                pointHoverRadius: 8,
                pointRadius: 6
            }, {
                label: '2025',
                data: [92, 94, 88, 85, 90, 88],
                backgroundColor: 'rgba(0, 112, 192, 0.3)',
                borderColor: 'rgba(0, 112, 192, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(0, 112, 192, 1)',
                pointBorderColor: '#fff',
                pointHoverRadius: 8,
                pointRadius: 6
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
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        backdropColor: 'transparent',
                        showLabelBackdrop: false,
                        font: {
                            size: 10
                        },
                        stepSize: 20
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'center',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: 13
                        },
                        boxWidth: 15,
                        padding: 15
                    }
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
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}/100`;
                        }
                    }
                },
                datalabels: {
                    display: false
                }
            }
        }
    });
} 