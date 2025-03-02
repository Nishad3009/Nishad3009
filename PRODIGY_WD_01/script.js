// script.js
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('#navbar ul li a');

// Change navbar style on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Highlight active section in the navbar
window.addEventListener('scroll', () => {
  let currentSection = '';

  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - sectionHeight / 3) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(currentSection)) {
      link.classList.add('active');
    }
  });
});

// Add hover effect to navbar links
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.style.color = '#007bff'; // Bright blue on hover
  });

  link.addEventListener('mouseleave', () => {
    if (!link.classList.contains('active')) {
      link.style.color = '#333'; // Revert to dark gray if not active
    }
  });
});