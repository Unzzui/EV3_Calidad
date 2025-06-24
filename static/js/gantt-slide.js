// Configuración del proyecto con colores corporativos DHL (dark premium)
const projectData = {
    title: "",
    duration: 24, // semanas
    milestones: [
        {
            id: 1,
            name: "HITO 1: FUNDACIÓN",
            color: "#D40511", // DHL Red
            activities: [
                { name: "A1.1 Formación del equipo y kick-off", start: 1, end: 1 },
                { name: "A1.2 Análisis detallado de las 25 fallas", start: 1, end: 2 },
                { name: "A1.3 Implementación de medidas de contención", start: 2, end: 3 },
                { name: "A1.4 Establecimiento del War Room", start: 3, end: 4 }
            ],
            responsible: "Gerente de Operaciones",
            resources: "$125,000",
            deliverable: "Reducción inicial del 20% en fallas"
        },
        {
            id: 2,
            name: "HITO 2: DIGITALIZACIÓN",
            color: "#FFCC00", // DHL Yellow
            activities: [
                { name: "A2.1 Selección e implementación de software", start: 5, end: 6 },
                { name: "A2.2 Desarrollo de app móvil", start: 5, end: 8 },
                { name: "A2.3 Piloto tecnológico", start: 9, end: 10 },
                { name: "A2.4 Rollout completo", start: 11, end: 12 }
            ],
            responsible: "Director de Tecnología",
            resources: "$195,000",
            deliverable: "Sistema tecnológico 100% operativo"
        },
        {
            id: 3,
            name: "HITO 3: CAPITAL HUMANO",
            color: "#FF8C00", // Orange
            activities: [
                { name: "A3.1 Diseño del programa de certificación", start: 13, end: 14 },
                { name: "A3.2 Ejecución de capacitaciones", start: 15, end: 18 },
                { name: "A3.3 Implementación sistema de incentivos", start: 17, end: 18 },
                { name: "A3.4 Evaluación y certificación", start: 19, end: 20 }
            ],
            responsible: "VP de Recursos Humanos",
            resources: "$185,000",
            deliverable: "100% conductores certificados"
        },
        {
            id: 4,
            name: "HITO 4: EXCELENCIA SOSTENIBLE",
            color: "#FFD700", // Gold
            activities: [
                { name: "A4.1 Auditoría integral de procesos", start: 21, end: 21 },
                { name: "A4.2 Estandarización de mejores prácticas", start: 22, end: 22 },
                { name: "A4.3 Preparación para ISO 9001", start: 23, end: 23 },
                { name: "A4.4 Celebración y reconocimientos", start: 24, end: 24 }
            ],
            responsible: "Director de Calidad",
            resources: "$150,000",
            deliverable: "Sistema de mejora continua establecido"
        }
    ]
};

// Configuración del canvas dark premium
const canvas = document.getElementById('ganttCanvas');
const ctx = canvas.getContext('2d');

const config = {
    width: canvas.width,
    height: canvas.height,
    margin: { top: 40, left: 220, right: 30, bottom: 80 },
    rowHeight: 28,
    weekWidth: 28,
    headerHeight: 32,
    colors: {
        background: '#181818',
        grid: '#333',
        text: '#f5f5f5',
        accent: '#FFCC00',
        shadow: 'rgba(0,0,0,0.5)'
    }
};

// --- Cálculo dinámico de tamaño ---
function getGanttDimensions() {
    const weekWidth = 45;
    const rowHeight = 30;
    const margin = { top: 40, left: 300, right: 30, bottom: 80 };
    let totalRows = 0;
    projectData.milestones.forEach(milestone => {
        totalRows += 1; // hito
        totalRows += milestone.activities.length;
        totalRows += 1; // espacio entre hitos
    });
    const width = margin.left + (projectData.duration * weekWidth) + margin.right;
    const height = margin.top + (totalRows * rowHeight) + margin.bottom;
    return { width, height, weekWidth, rowHeight, margin };
}

function resizeGanttCanvas() {
    const dims = getGanttDimensions();
    canvas.width = dims.width;
    canvas.height = dims.height;
    config.width = dims.width;
    config.height = dims.height;
    config.weekWidth = dims.weekWidth;
    config.rowHeight = dims.rowHeight;
    config.margin = dims.margin;
}

// --- FIN cálculo dinámico ---

function drawGantt() {
    resizeGanttCanvas();
    ctx.clearRect(0, 0, config.width, config.height);
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, config.width, config.height);
    ctx.save();
    ctx.shadowColor = config.colors.shadow;
    ctx.shadowBlur = 12;
    ctx.fillRect(8, 8, config.width-16, config.height-16);
    ctx.restore();
    ctx.fillStyle = projectData.milestones[0].color;
    ctx.font = 'bold 22px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.fillText(projectData.title, config.width / 2, 30);
    drawWeekHeaders();
    drawGrid();
    drawActivities();
    drawMilestoneLegend();
}

function drawWeekHeaders() {
    ctx.fillStyle = config.colors.accent;
    ctx.font = 'bold 12px Inter, Arial';
    ctx.textAlign = 'center';
    for (let week = 1; week <= projectData.duration; week++) {
        const x = config.margin.left + (week - 1) * config.weekWidth;
        ctx.fillText(`S${week}`, x + config.weekWidth / 2, config.margin.top - 8);
    }
}

function drawGrid() {
    ctx.strokeStyle = config.colors.grid;
    ctx.lineWidth = 1;
    for (let week = 0; week <= projectData.duration; week++) {
        const x = config.margin.left + week * config.weekWidth;
        ctx.beginPath();
        ctx.moveTo(x, config.margin.top);
        ctx.lineTo(x, config.height - config.margin.bottom);
        ctx.stroke();
    }
    let y = config.margin.top;
    projectData.milestones.forEach(milestone => {
        milestone.activities.forEach((activity, index) => {
            y += config.rowHeight;
            if (index < milestone.activities.length - 1) {
                ctx.beginPath();
                ctx.moveTo(config.margin.left, y);
                ctx.lineTo(config.width - config.margin.right, y);
                ctx.stroke();
            }
        });
        y += config.rowHeight; // Espacio entre hitos
    });
}

function drawActivities() {
    let y = config.margin.top;
    projectData.milestones.forEach(milestone => {
        ctx.fillStyle = milestone.color;
        ctx.font = 'bold 14px Inter, Arial';
        ctx.textAlign = 'left';
        ctx.fillText(milestone.name, 20, y + 16);
        y += config.rowHeight;
        milestone.activities.forEach(activity => {
            ctx.fillStyle = config.colors.text;
            ctx.font = '11px Inter, Arial';
            ctx.textAlign = 'left';
            ctx.fillText(activity.name, 40, y + 16);
            const startX = config.margin.left + (activity.start - 1) * config.weekWidth;
            const width = (activity.end - activity.start + 1) * config.weekWidth;
            ctx.globalAlpha = 0.18;
            ctx.fillStyle = milestone.color;
            ctx.fillRect(startX, y + 5, width, config.rowHeight - 10);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = milestone.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(startX, y + 5, width, config.rowHeight - 10);
            ctx.fillStyle = config.colors.accent;
            ctx.font = 'bold 9px Inter, Arial';
            ctx.textAlign = 'center';
            const textX = startX + width / 2;
            const textY = y + config.rowHeight / 2 + 2;
            ctx.fillText(`${activity.start}-${activity.end}`, textX, textY);
            y += config.rowHeight;
        });
        y += config.rowHeight; // Espacio entre hitos
    });
}

function drawMilestoneLegend() {
    const legendY = config.height - 60;
    const legendX = config.margin.left;
    ctx.fillStyle = config.colors.text;
    ctx.font = 'bold 12px Inter, Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Leyenda de Hitos:', legendX, legendY);
    projectData.milestones.forEach((milestone, index) => {
        const x = legendX + index * 170;
        const y = legendY + 14;
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = milestone.color;
        ctx.fillRect(x, y, 14, 14);
        ctx.globalAlpha = 1;
        ctx.fillStyle = config.colors.text;
        ctx.font = '11px Inter, Arial';
        ctx.fillText(milestone.name, x + 20, y + 11);
    });
}

// Inicializar el diagrama cuando se carga la slide
window.addEventListener('load', drawGantt);
window.addEventListener('resize', () => setTimeout(drawGantt, 100)); 