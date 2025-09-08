// --- Captcha Modal Setup ---
// Create backdrop overlay
const backdrop = document.createElement('div');
backdrop.style.position = 'fixed';
backdrop.style.top = '0';
backdrop.style.left = '0';
backdrop.style.width = '100vw';
backdrop.style.height = '100vh';
backdrop.style.background = 'rgba(0,0,0,0.25)';
backdrop.style.zIndex = '1000';
document.body.appendChild(backdrop);

// Create modal window
const modal = document.createElement('div');
modal.style.position = 'fixed';
modal.style.top = '50%';
modal.style.left = '50%';
modal.style.transform = 'translate(-50%, -50%)';
modal.style.background = 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)';
modal.style.borderRadius = '18px';
modal.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
modal.style.padding = '32px 40px 32px 40px';
modal.style.zIndex = '1001';
modal.style.minWidth = '420px';
modal.style.maxWidth = '90vw';
modal.style.maxHeight = '90vh';
modal.style.display = 'flex';
modal.style.flexDirection = 'column';
modal.style.alignItems = 'center';
document.body.appendChild(modal);

// Canvas inside modal
const canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 320;
canvas.style.width = '600px';
canvas.style.height = '320px';
canvas.style.margin = '0 auto 0 auto';
canvas.style.borderRadius = '12px';
canvas.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
canvas.style.opacity = '0.98';
canvas.style.background = 'transparent';
canvas.style.pointerEvents = 'auto';
modal.appendChild(canvas);
const ctx = canvas.getContext('2d');

// --- Professional Background ---
document.body.style.margin = '0';
document.body.style.height = '100vh';
document.body.style.background = '#f8fafc';

// Instructions
const info = document.createElement('div');
info.style.position = 'static';
info.style.marginBottom = '0px';
info.style.background = 'rgba(255,255,255,0.95)';
info.style.padding = '18px 12px 18px 12px';
info.style.borderRadius = '16px';
info.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
info.style.fontFamily = 'Segoe UI, Arial, sans-serif';
info.style.fontSize = '18px';
info.style.color = '#222';
info.style.textAlign = 'center';
info.style.width = '100%';
info.innerHTML = "<b style='font-size:22px;color:#0077ff;'>Line Captcha</b><br><span style='font-size:16px;'>Draw along the grey path as closely as possible!<br>At the end, you'll be told if you seem human or AI.</span>";
modal.insertBefore(info, canvas);

// --- Result Box ---
const resultBox = document.createElement('div');
resultBox.style.marginTop = '16px';
resultBox.style.fontSize = '17px';
resultBox.style.fontWeight = '500';
resultBox.style.color = '#0077ff';
resultBox.style.background = 'rgba(240,247,255,0.95)';
resultBox.style.borderRadius = '10px';
resultBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
resultBox.style.padding = '12px 20px';
resultBox.style.display = 'none';
resultBox.style.transition = 'opacity 0.2s';
modal.appendChild(resultBox);

// --- Reset Button ---
const resetBtn = document.createElement('button');
resetBtn.textContent = 'Reset Line';
resetBtn.style.marginTop = '18px';
resetBtn.style.display = 'inline-block';
resetBtn.style.fontSize = '16px';
resetBtn.style.padding = '8px 24px';
resetBtn.style.cursor = 'pointer';
resetBtn.style.borderRadius = '8px';
resetBtn.style.border = 'none';
resetBtn.style.background = 'linear-gradient(90deg,#0077ff 0%,#00c6ff 100%)';
resetBtn.style.color = '#fff';
resetBtn.style.fontWeight = 'bold';
resetBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
resetBtn.style.transition = 'background 0.2s';
resetBtn.onmouseover = () => {
    resetBtn.style.background = 'linear-gradient(90deg,#005bb5 0%,#0099cc 100%)';
};
resetBtn.onmouseout = () => {
    resetBtn.style.background = 'linear-gradient(90deg,#0077ff 0%,#00c6ff 100%)';
};
modal.appendChild(resetBtn);

resetBtn.addEventListener('click', () => {
    pathPoints = generatePath();
    userPoints = [];
    drawPath();
    resultBox.style.display = 'none';
});

// --- Path Generation ---
function generatePath() {
    const points = [];
    const marginX = canvas.width * 0.1;
    const reservedBoxHeight = 120;
    const marginY = canvas.height * 0.15;
    const usableWidth = canvas.width - 2 * marginX;
    const topY = reservedBoxHeight;
    const usableHeight = canvas.height - topY - marginY;
    const step = usableWidth / 50;
    for (let x = marginX; x <= canvas.width - marginX; x += step) {
        const y = topY + usableHeight / 2 + usableHeight / 2 * Math.sin((x / usableWidth) * 2 * Math.PI + Math.random() * 0.5);
        points.push({ x, y });
    }
    return points;
}

let pathPoints = generatePath();

// --- Draw Path ---
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
    // Check if user finished near the end of the path
    const lastUser = userPoints[userPoints.length - 1];
    const lastPath = pathPoints[pathPoints.length - 1];
    const dx = lastUser.x - lastPath.x;
    const dy = lastUser.y - lastPath.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 40) { // Require user to finish within 40px of end
        resultBox.textContent = "Please complete the line all the way to the end!";
        resultBox.style.display = 'block';
        // Reset line on incomplete attempt
        pathPoints = generatePath();
        userPoints = [];
        setTimeout(() => {
            drawPath();
        }, 100);
        return;
    }
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
    let success = false;
    if (avgDist < 20 && jitter > 0.1) {
        result = 'You seem human!';
        success = true;
    } else if (avgDist < 20 && jitter <= 0.1) {
        result = 'You seem like an AI (too smooth)!';
    } else {
        result = 'Failed: Please try to follow the path more closely.';
        // Reset line on failure
        pathPoints = generatePath();
        userPoints = [];
        setTimeout(() => {
            drawPath();
        }, 100);
    }

    // Show result in resultBox
    setTimeout(() => {
        resultBox.textContent = result;
        resultBox.style.display = 'block';
        drawPath();
        if (success) {
            setTimeout(() => {
                resultBox.textContent = "Captcha complete! Redirecting...";
                resultBox.style.color = "#0077ff";
                setTimeout(() => {
                    window.location.href = "success.html";
                }, 1200);
            }, 1000);
        }
    }, 100);
}

// --- Initial Draw ---
drawPath();