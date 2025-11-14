// Scroll reveal
const revealElements = document.querySelectorAll('.scroll-reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
});
revealElements.forEach(el => observer.observe(el));

// Ripple click effect
document.addEventListener('click', e => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.getElementById('ripple-container').appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});

// Copy & bounce text
function copyAndBounce(e, text) {
    e.preventDefault();
    navigator.clipboard.writeText(text);

    const bubble = document.createElement('div');
    bubble.className = 'bounce-bubble bg-accent-neon text-gray-900';
    bubble.innerText = `Copied: ${text}`;
    bubble.style.left = `${e.clientX}px`;
    bubble.style.top = `${e.clientY}px`;

    document.getElementById('floating-notification-container').appendChild(bubble);

    setTimeout(() => bubble.style.opacity = 0, 400);
    setTimeout(() => bubble.remove(), 900);
}

// Code rain mode
let codeRainActive = false;
const overlay = document.getElementById('code-rain-overlay');

document.addEventListener('keydown', e => {
    if (e.key === '`') {
        codeRainActive = !codeRainActive;
        overlay.style.display = codeRainActive ? 'block' : 'none';
    }
    if (!codeRainActive) return;
    if (e.key === 'Escape') {
        codeRainActive = false;
        overlay.style.display = 'none';
        return;
    }

    const block = document.createElement('div');
    block.className = 'code-block';
    block.textContent = e.key;
    block.style.left = `${Math.random()*window.innerWidth}px`;
    block.style.top = `${Math.random()*window.innerHeight}px`;
    overlay.appendChild(block);

    setTimeout(() => block.style.opacity = 0, 600);
    setTimeout(() => block.remove(), 1200);
});
