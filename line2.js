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
info.innerHTML = ""; // Remove title and instructions
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
resetBtn.textContent = 'Different drawing';
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
    // Pick a new prompt
    let newPrompt;
    do {
        newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    } while (newPrompt === promptBox.textContent.replace('Draw ', '').replace('!', ''));
    promptBox.textContent = `Draw ${newPrompt}!`;
    userPoints = [];
    drawPath();
    resultBox.style.display = 'none';
});

// --- Drawing Prompts ---
const prompts = [
    "a cat",
    "a tree",
    "a house",
    "a car",
    "a flower",
    "a sun",
    "a fish",
    "a cup",
    "a dog",
    "a boat",
    "a bird",
    "a chair",
    "a book",
    "a key",
    "a shoe",
    "a clock",
    "a banana",
    "mike",
    "a minion",
    "tralalero tralala",
    
    
];
const chosenPrompt = prompts[Math.floor(Math.random() * prompts.length)];

// Add prompt to modal
const promptBox = document.createElement('div');
promptBox.style.fontSize = '20px';
promptBox.style.fontWeight = 'bold';
promptBox.style.marginBottom = '18px';
promptBox.style.color = '#0077ff';
promptBox.textContent = `Draw ${chosenPrompt}!`;
modal.insertBefore(promptBox, info);

// --- Submit Button ---
const submitBtn = document.createElement('button');
submitBtn.textContent = 'Submit Drawing';
submitBtn.style.marginTop = '18px';
submitBtn.style.display = 'inline-block';
submitBtn.style.fontSize = '16px';
submitBtn.style.padding = '8px 24px';
submitBtn.style.cursor = 'pointer';
submitBtn.style.borderRadius = '8px';
submitBtn.style.border = 'none';
submitBtn.style.background = 'linear-gradient(90deg,#22c55e 0%,#16a34a 100%)';
submitBtn.style.color = '#fff';
submitBtn.style.fontWeight = 'bold';
submitBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
submitBtn.style.transition = 'background 0.2s';
submitBtn.onmouseover = () => {
    submitBtn.style.background = 'linear-gradient(90deg,#15803d 0%,#22c55e 100%)';
};
submitBtn.onmouseout = () => {
    submitBtn.style.background = 'linear-gradient(90deg,#22c55e 0%,#16a34a 100%)';
};
modal.appendChild(submitBtn);

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
    // Randomize start and end heights
    const startY = topY + Math.random() * usableHeight * 0.7;
    const endY = topY + Math.random() * usableHeight * 0.7;
    // Randomize number of waves and amplitude
    const waves = 1.5 + Math.random() * 2.5; // 1.5 to 4 waves
    const amplitude = usableHeight * (0.25 + Math.random() * 0.25); // 25% to 50% of height
    // Randomly decide to add a spiral/loop in the middle
    const addSpiral = Math.random() < 0.5; // 50% chance
    const spiralCenterT = 0.5 + (Math.random() - 0.5) * 0.2; // Center of spiral (t)
    const spiralRadius = Math.min(canvas.width, canvas.height) * (0.08 + Math.random() * 0.07);
    const spiralTurns = 1.5 + Math.random() * 1.5; // 1.5 to 3 turns
    for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        const x = marginX + t * usableWidth;
        // Linear interpolation for y between startY and endY
        const baseY = startY + (endY - startY) * t;
        let y = baseY + amplitude * Math.sin(t * Math.PI * 2 * waves + Math.random() * 0.5);
        let px = x;
        // Add spiral/loop in the middle
        if (addSpiral && t > spiralCenterT - 0.18 && t < spiralCenterT + 0.18) {
            // Map t to [0,1] for the spiral segment
            const spiralT = (t - (spiralCenterT - 0.18)) / 0.36;
            const angle = spiralT * Math.PI * 2 * spiralTurns;
            const r = spiralRadius * (0.5 + 0.5 * spiralT);
            // Center of spiral
            const cx = marginX + spiralCenterT * usableWidth;
            const cy = startY + (endY - startY) * spiralCenterT + amplitude * Math.sin(spiralCenterT * Math.PI * 2 * waves);
            px = cx + r * Math.cos(angle);
            y = cy + r * Math.sin(angle);
        }
        points.push({ x: px, y });
    }
    return points;
}

let pathPoints = generatePath();

// --- Draw Path ---
function drawPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // No pre-drawn line
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
});

submitBtn.addEventListener('click', () => {
    if (userPoints.length < 10) {
        resultBox.textContent = "Please draw something before submitting!";
        resultBox.style.display = 'block';
        return;
    }
    analyzeDrawing();
});

// --- Analysis ---
function analyzeDrawing() {
    // 1. Analyze jitter (human lines have more jitter)
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

    // 2. Analyze average speed (optional, for more realism)
    let totalDist = 0;
    let totalTime = 0;
    for (let i = 1; i < userPoints.length; i++) {
        const dx = userPoints[i].x - userPoints[i - 1].x;
        const dy = userPoints[i].y - userPoints[i - 1].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        totalDist += dist;
        totalTime += Math.abs(userPoints[i].t - userPoints[i - 1].t);
    }
    const avgSpeed = totalDist / (totalTime / 1000 + 1e-6); // px per second

    // 3. Decision (tune thresholds as needed)
    let result = '';
    let success = false;
    if (jitter > 0.1 && avgSpeed < 2000 && avgSpeed > 50) {
        result = 'You seem human!';
        success = true;
    } else if (jitter <= 0.1) {
        result = 'You seem like an AI (too smooth)!';
    } else if (avgSpeed >= 2000) {
        result = 'Too fast! Please draw at a more natural speed.';
    } else {
        result = 'Failed: Please try to draw more naturally.';
    }

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