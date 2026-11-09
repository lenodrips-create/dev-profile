const nav = document.querySelector('nav');
const btn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const toTop = document.querySelector('.to-top');

/* ---------- MENU ---------- */
function setMenu(open) {
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
}

btn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
});
document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) setMenu(false);
});

/* ---------- SCROLL EFFECTS ---------- */
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    toTop.classList.toggle('show', window.scrollY > 500);
});

toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- FOOTER YEAR ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- LIGHTBOX ---------- */
const shots = document.querySelectorAll('.shot img');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<img alt="">';
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector('img');

shots.forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
    });
});

lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
});
