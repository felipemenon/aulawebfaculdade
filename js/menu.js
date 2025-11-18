// js/menu.js
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.hamburger');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = document.querySelector('.nav__menu');
      nav.classList.toggle('open');
    });
  });
});
