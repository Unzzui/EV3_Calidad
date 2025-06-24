// Ishikawa Diagram Generator - Pure JavaScript Implementation
function initIshikawaDiagram() {
    const container = document.getElementById('ishikawaDiagram');
    if (!container) {
        console.error('Ishikawa container not found');
        return;
    }

    // Clear container
    container.innerHTML = '';

    // Create diagram wrapper
    const diagramWrapper = document.createElement('div');
    diagramWrapper.className = 'diagram-wrapper';
    diagramWrapper.style.cssText = `
        position: relative;
        width: 1200px;
        height: 700px;
        margin: 0 auto;
        background: #18191c;
        border-radius: 24px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.25);
        padding: 20px;
        font-family: 'Inter', sans-serif;
        border: none;
    `;

    const diagramData = {
        problem: "FALLAS EN ENTREGAS DE PAQUETERÍA",
        categories: {
            personas: {
                name: "Personas",
                color: "#1a5fb4",
                position: "top-left",
                subcauses: [
                    "Alta rotación de conductores",
                    "Capacitación insuficiente",
                    "Supervisión limitada"
                ]
            },
            equipos: {
                name: "Equipos",
                color: "#c01c28",
                position: "top-right",
                subcauses: [
                    "Flota envejecida",
                    "Scanners obsoletos"
                ]
            },
            materiales: {
                name: "Materiales",
                color: "#e5a50a",
                position: "bottom-left",
                subcauses: [
                    "Embalaje genérico",
                    "Etiquetas de baja calidad"
                ]
            },
            procedimientos: {
                name: "Procedimientos",
                color: "#813d9c",
                position: "bottom-right",
                subcauses: [
                    "Rutas desactualizadas",
                    "Comunicación deficiente"
                ]
            }
        }
    };
    
    const dimensions = {
        width: 1200,
        height: 700,
        centerX: 600,
        centerY: 350
    };

    // Create main spine (acortada 50px)
    const spine = document.createElement('div');
    spine.style.cssText = `
        position: absolute;
        top: ${dimensions.centerY - 8}px;
        left: 100px;
        width: 780px;
        height: 16px;
        background: #2d3748;
        border-radius: 8px;
        box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
        z-index: 1;
    `;
    diagramWrapper.appendChild(spine);

    // Create arrow head (ajustar posición para el nuevo largo)
    const arrow = document.createElement('div');
    arrow.style.cssText = `
        position: absolute;
        top: ${dimensions.centerY - 25}px;
        right: 300px;
        width: 0;
        height: 0;
        border-left: 40px solid #2d3748;
        border-top: 24px solid transparent;
        border-bottom: 24px solid transparent;
        filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.2));
        z-index: 2;
    `;
    diagramWrapper.appendChild(arrow);

    // Create problem circle (ajustar para el nuevo final de la línea)
    const problem = document.createElement('div');
    problem.style.cssText = `
        position: absolute;
        top: ${dimensions.centerY - 90}px;
        right: 170px;
        width: 180px;
        height: 180px;
        background: #18191c;
        color: #b91c1c;
        text-align: center;
        border-radius: 50%;
        font-weight: bold;
        border: 4px solid #c01c28;
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        line-height: 1.2;
    `;
    problem.textContent = diagramData.problem;
    diagramWrapper.appendChild(problem);

    // Create categories
    Object.entries(diagramData.categories).forEach(([key, category]) => {
        const positions = getCategoryPositions(category.position);
        
        // Create main category line
        const categoryLine = document.createElement('div');
        categoryLine.style.cssText = `
            position: absolute;
            top: ${dimensions.centerY - 2.5}px;
            left: ${positions.line.x}px;
            width: ${positions.line.width}px;
            height: 5px;
            background: ${category.color};
            transform-origin: left center;
            transform: rotate(${positions.line.angle}deg);
            border-radius: 3px;
            box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.15);
            z-index: 2;
        `;
        diagramWrapper.appendChild(categoryLine);

        // Create category label
        const categoryLabel = document.createElement('div');
        categoryLabel.style.cssText = `
            position: absolute;
            top: ${positions.label.y}px;
            left: ${positions.label.x}px;
            width: 120px;
            padding: 12px 10px;
            text-align: center;
            font-weight: bold;
            color: white;
            background: ${category.color};
            border-radius: 8px;
            box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            z-index: 5;
            font-size: 14px;
        `;
        categoryLabel.textContent = category.name;
        diagramWrapper.appendChild(categoryLabel);

        // Create subcauses
        category.subcauses.forEach((subcause, index) => {
            const subcausePos = getSubcausePosition(positions, index, category.subcauses.length, key);
            
            // Create subcause box
            const subcauseBox = document.createElement('div');
            subcauseBox.style.cssText = `
                position: absolute;
                top: ${subcausePos.y}px;
                left: ${subcausePos.x}px;
                width: 140px;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 13px;
                background: #18191c;
                color: ${category.color};
                text-align: center;
                border: 2px solid ${category.color};
                box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
                z-index: 3;
                line-height: 1.2;
            `;
            subcauseBox.textContent = subcause;
            diagramWrapper.appendChild(subcauseBox);

            // Create subcause line with correct transform
            const subcauseLine = document.createElement('div');
            subcauseLine.style.cssText = `
                position: absolute;
                top: ${subcausePos.lineY}px;
                left: ${subcausePos.lineX}px;
                width: ${subcausePos.lineWidth}px;
                height: 2px;
                background: ${category.color};
                z-index: 2;
                transform: rotate(${subcausePos.lineAngle}deg);
            `;
            diagramWrapper.appendChild(subcauseLine);
        });
    });

    function getCategoryPositions(position) {
        const basePositions = {
            'top-left': {
                line: { x: 230, width: 200, angle: -120 },
                label: { x: 110, y: 130 }
            },
            'top-right': {
                line: { x: 500, width: 200, angle: -120 },
                label: { x: 380, y: 130 }
            },
            'bottom-left': {
                line: { x: 230, width: 200, angle: 120 },
                label: { x: 50, y: 520 }
            },
            'bottom-right': {
                line: { x: 500, width: 200, angle: 120 },
                label: { x: 310, y: 535 }
            }
        };
        return basePositions[position];
    }

    function getSubcausePosition(categoryPos, index, total, key) {
        // Top-left category (PERSONAS)
        if (categoryPos.label.x === 110 && categoryPos.label.y === 130) {
            const positions = [
                { x: 250, y: 260, lineX: 195, lineY: 290, lineWidth: 65, lineAngle: -180 },
                { x: 200, y: 200, lineX: 155, lineY: 220, lineWidth: 65, lineAngle: -180 },
                { x: -10, y: 260, lineX: 85, lineY: 275, lineWidth: 100, lineAngle: 180 }
            ];
            return positions[index] || positions[0];
        }
        // Top-right category (EQUIPOS)
        if (categoryPos.label.x === 380 && categoryPos.label.y === 130) {
            const positions = [
                { x: 520, y: 270, lineX: 465, lineY: 290, lineWidth: 100, lineAngle: 180 },
                { x: 510, y: 200, lineX: 430, lineY: 230, lineWidth: 100, lineAngle: 180 }
            ];
            return positions[index] || positions[0];
        }
        // Bottom-left category (MATERIALES)
        if (categoryPos.label.x === 50 && categoryPos.label.y === 520) {
            const positions = [
                { x: 250, y: 400, lineX: 190, lineY: 420, lineWidth: 100, lineAngle: 180 },
                { x: 240, y: 460, lineX: 155, lineY: 485, lineWidth: 100, lineAngle: 180 }
            ];
            return positions[index] || positions[0];
        }
        // Bottom-right category (PROCEDIMIENTOS)
        if (categoryPos.label.x === 310 && categoryPos.label.y === 535) {
            const positions = [
                { x: 510, y: 420, lineX: 450, lineY: 440, lineWidth: 100, lineAngle: 180 },
                { x: 470, y: 480, lineX: 420, lineY: 495, lineWidth: 100, lineAngle: 180 }
            ];
            return positions[index] || positions[0];
        }
        // fallback
        return { x: 0, y: 0, lineX: 0, lineY: 0, lineWidth: 0, lineAngle: 0 };
    }

    container.appendChild(diagramWrapper);
    console.log('Ishikawa diagram created successfully');
}

// Export for use in main presentation
window.initIshikawaDiagram = initIshikawaDiagram;
  