const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- 1. THE TIMER LOGIC ---
const birthDate = new Date(2008, 7, 2); // UPDATE THIS: (Year, Month[0-11], Day)

function updateTimer() {
    const now = new Date();
    const diff = now - birthDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById('clock').innerHTML = 
        `Day <span class="digit">${days}</span>, <span class="digit">${hours}</span> hrs, <span class="digit">${mins}</span> min, <span class="digit">${secs}</span> sec`;
}
setInterval(updateTimer, 1000);

// --- 2. THE TREE LOGIC ---
function drawBranch(x, y, len, angle, branchWidth) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "#724c31";
    ctx.lineWidth = branchWidth;
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if (len < 10) {
        // Draw Heart Leaves
        drawHeart(0, -len);
        ctx.restore();
        return;
    }

    // Recursively draw branches with a slight delay for "growth" effect
    setTimeout(() => {
        drawBranch(0, -len, len * 0.75, angle + 15, branchWidth * 0.7);
        drawBranch(0, -len, len * 0.75, angle - 15, branchWidth * 0.7);
    }, 50);

    ctx.restore();
}

function drawHeart(x, y) {
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 70%)`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - 3, x - 5, y - 3, x - 5, y);
    ctx.bezierCurveTo(x - 5, y + 3, x, y + 5, x, y + 7);
    ctx.bezierCurveTo(x, y + 5, x + 5, y + 3, x + 5, y);
    ctx.bezierCurveTo(x + 5, y - 3, x, y - 3, x, y);
    ctx.fill();
}

// Start drawing tree from bottom center
drawBranch(canvas.width / 2, canvas.height, 120, 0, 10);

// --- 3. FALLING HEARTS ---
const fallingHearts = [];
function createFallingHeart() {
    fallingHearts.push({
        x: Math.random() * canvas.width,
        y: -10,
        size: Math.random() * 10 + 5,
        speed: Math.random() * 2 + 1
    });
}

function animateFalling() {
    // We don't clear the whole screen to keep the tree visible
    // Instead, we just redraw the falling layer
    fallingHearts.forEach((h, i) => {
        h.y += h.speed;
        drawHeart(h.x, h.y);
        if (h.y > canvas.height) fallingHearts.splice(i, 1);
    });
    requestAnimationFrame(animateFalling);
}

setInterval(createFallingHeart, 300);
animateFalling();

