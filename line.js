// --- Captcha Setup ---
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Generate a random path (sine wave) scaled to canvas size
function generatePath() {
    const points = [];
    const marginX = canvas.width * 0.1;
    const marginY = canvas.height * 0.2;
    const usableWidth = canvas.width - 2 * marginX;
    const usableHeight = canvas.height - 2 * marginY;
    const step = usableWidth / 50;
    for (let x = marginX; x <= canvas.width - marginX; x += step) {
        const y = canvas.height / 2 + usableHeight / 2 * Math.sin((x / usableWidth) * 2 * Math.PI + Math.random() * 0.5);
        points.push({ x, y });
    }
    return points;
}

let pathPoints = generatePath();

// Draw the path
function drawPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
    for (const pt of pathPoints) {
        ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
}

// --- User Drawing ---
let drawing = false;
let userPoints = [];

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    // Scale mouse coordinates to canvas coordinates
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
}

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    userPoints = [];
    ctx.strokeStyle = '#0077ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const { x, y } = getMousePos(e);
    ctx.moveTo(x, y);
    userPoints.push({ x, y, t: Date.now() });
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const { x, y } = getMousePos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    userPoints.push({ x, y, t: Date.now() });
});

canvas.addEventListener('mouseup', () => {
    if (!drawing) return;
    drawing = false;
    analyzeDrawing();
});

// --- Analysis ---
function analyzeDrawing() {
    // 1. Check how close user line is to the path
    let totalDist = 0;
    let count = 0;
    for (let i = 0; i < userPoints.length; i += Math.floor(userPoints.length / pathPoints.length) || 1) {
        const up = userPoints[i];
        // Find nearest path point
        let minDist = Infinity;
        for (const pp of pathPoints) {
            const dx = up.x - pp.x;
            const dy = up.y - pp.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) minDist = dist;
        }
        totalDist += minDist;
        count++;
    }
    const avgDist = totalDist / count;

    // 2. Analyze jitter (human lines have more jitter)
    let jitter = 0;
    for (let i = 2; i < userPoints.length; i++) {
        const dx1 = userPoints[i].x - userPoints[i - 1].x;
        const dy1 = userPoints[i].y - userPoints[i - 1].y;
        const dx2 = userPoints[i - 1].x - userPoints[i - 2].x;
        const dy2 = userPoints[i - 1].y - userPoints[i - 2].y;
        const angle1 = Math.atan2(dy1, dx1);
        const angle2 = Math.atan2(dy2, dx2);
        jitter += Math.abs(angle1 - angle2);
    }
    jitter = jitter / (userPoints.length - 2);

    // 3. Decision
    let result = '';
    if (avgDist < 20 && jitter > 0.1) {
        result = 'You seem human!';
    } else if (avgDist < 20 && jitter <= 0.1) {
        result = 'You seem like an AI (too smooth)!';
    } else {
        result = 'Failed: Please try to follow the path more closely.';
    }

    // Show result
    setTimeout(() => {
        alert(result);
        drawPath();
    }, 100);
}

// --- Initial Draw ---
drawPath();

// Redraw and regenerate path on resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    pathPoints = generatePath();
    drawPath();
});

// Instructions
const info = document.createElement('div');
info.style.position = 'fixed';
info.style.top = '10px';
info.style.left = '10px';
info.style.background = 'rgba(255,255,255,0.8)';
info.style.padding = '10px';
info.style.zIndex = 10;
info.innerHTML = "<b>Draw along the grey path as closely as possible!</b><br>At the end, you'll be told if you seem human or AI.";
document.body.insertBefore(info, canvas);