/* Fluid-style custom cursor
   A colorful, smoky trail that flows from the mouse (inspired by WebGL fluid
   sims) plus a small custom cursor dot. Pure canvas 2D, no dependencies.
   Disabled on touch devices and when the user prefers reduced motion. */
(function () {
    var fine = window.matchMedia('(pointer: fine)').matches;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    // ----- fluid trail canvas -----
    var canvas = document.createElement('canvas');
    canvas.className = 'fluid-cursor';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h;

    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var particles = [];
    // muted, dark palette: deep green, deep blue, olive, taupe/beige
    var palette = [
        '47, 74, 60',
        '42, 59, 87',
        '61, 82, 51',
        '120, 103, 79'
    ];
    var mouse = { x: w / 2, y: h / 2, px: w / 2, py: h / 2, active: false };

    function spawn(x, y, vx, vy) {
        var speed = Math.min(Math.hypot(vx, vy), 40);
        var count = 1 + Math.floor(speed / 6);
        for (var i = 0; i < count; i++) {
            particles.push({
                x: x,
                y: y,
                vx: vx * 0.12 + (Math.random() - 0.5) * 1.3,
                vy: vy * 0.12 + (Math.random() - 0.5) * 1.3,
                life: 1,
                decay: 0.022 + Math.random() * 0.025,
                radius: 9 + Math.random() * 14 + speed * 0.4,
                color: palette[(Math.random() * palette.length) | 0]
            });
        }
        if (particles.length > 400) particles.splice(0, particles.length - 400);
    }

    window.addEventListener('mousemove', function (e) {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
        spawn(mouse.x, mouse.y, mouse.x - mouse.px, mouse.y - mouse.py);
    });

    function frame() {
        // fade existing trail toward transparent (smoky dissipation)
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.14)';
        ctx.fillRect(0, 0, w, h);

        // soft neutral smoke that reads on the light background
        ctx.globalCompositeOperation = 'source-over';
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.94;
            p.vy *= 0.94;
            p.life -= p.decay;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            var r = p.radius * (0.5 + p.life * 0.5);
            var alpha = p.life * 0.26;
            var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
            g.addColorStop(0, 'rgba(' + p.color + ',' + alpha + ')');
            g.addColorStop(0.5, 'rgba(' + p.color + ',' + alpha + ')');
            g.addColorStop(1, 'rgba(' + p.color + ',0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // ----- custom cursor dot -----
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add('custom-cursor');

    var rx = mouse.x, ry = mouse.y;
    function cursorFrame() {
        rx += (mouse.x - rx) * 0.18;
        ry += (mouse.y - ry) * 0.18;
        dot.style.transform = 'translate(' + mouse.x + 'px,' + mouse.y + 'px)';
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
        requestAnimationFrame(cursorFrame);
    }
    requestAnimationFrame(cursorFrame);

    // grow the ring over clickable things
    function hoverable(el) {
        return el && (el.closest('a, button, .card, .menu-btn, input, textarea, [role="button"]'));
    }
    document.addEventListener('mouseover', function (e) {
        if (hoverable(e.target)) ring.classList.add('cursor-ring--hover');
    });
    document.addEventListener('mouseout', function (e) {
        if (hoverable(e.target)) ring.classList.remove('cursor-ring--hover');
    });

    // hide custom cursor when the pointer leaves the window
    document.addEventListener('mouseleave', function () {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
        dot.style.opacity = '';
        ring.style.opacity = '';
    });
})();
