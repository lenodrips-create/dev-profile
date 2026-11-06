const nav = document.querySelector('nav');
const btn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const links = document.querySelectorAll('.menu a[data-link]');
const toTop = document.querySelector('.to-top');

/* ---------- MENU ---------- */
function setMenu(open) {
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
}

btn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));

links.forEach(link => link.addEventListener('click', () => setMenu(false)));

// close with Escape or by clicking outside
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
});
document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) setMenu(false);
});

/* ---------- TYPING EFFECT ---------- */
const typed = document.getElementById('typed');
const roles = ['Software Developer', 'Web Developer',];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
    const word = roles[roleIndex];
    typed.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex < word.length) {
        charIndex++;
        setTimeout(type, 90);
    } else if (!deleting) {
        deleting = true;
        setTimeout(type, 1600);
    } else if (charIndex > 0) {
        charIndex--;
        setTimeout(type, 45);
    } else {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 300);
    }
}

typed.textContent = '';
type();

/* ---------- SCROLL REVEAL ---------- */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- ACTIVE MENU LINK ---------- */
const sections = document.querySelectorAll('header[id], section[id]');

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            links.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));

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
