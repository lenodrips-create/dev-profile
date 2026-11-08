/* Custom circular cursor — a small dot with a trailing ring.
   No trail, no colors. Disabled on touch devices and for reduced-motion. */
(function () {
    var fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;

    var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add('custom-cursor');

    window.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    var rx = mouse.x, ry = mouse.y;
    function frame() {
        rx += (mouse.x - rx) * 0.18;
        ry += (mouse.y - ry) * 0.18;
        dot.style.transform = 'translate(' + mouse.x + 'px,' + mouse.y + 'px)';
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // grow the ring over clickable things
    function hoverable(el) {
        return el && el.closest('a, button, .card, .menu-btn, input, textarea, [role="button"]');
    }
    document.addEventListener('mouseover', function (e) {
        if (hoverable(e.target)) ring.classList.add('cursor-ring--hover');
    });
    document.addEventListener('mouseout', function (e) {
        if (hoverable(e.target)) ring.classList.remove('cursor-ring--hover');
    });

    document.addEventListener('mouseleave', function () {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
        dot.style.opacity = '';
        ring.style.opacity = '';
    });
})();
