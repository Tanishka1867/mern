// Portfolio interactions
document.addEventListener('DOMContentLoaded', function () {
  // Update year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  var navUl = mainNav ? mainNav.querySelector('ul') : null;

  if (navToggle && navUl) {
    navToggle.addEventListener('click', function () {
      navUl.classList.toggle('active');
    });

    // Close menu when a link is clicked
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navUl.classList.remove('active');
      });
    });
  }

  // Smooth scrolling for hash links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Contact form handling
  var contactForm = document.getElementById('contactForm');
  var formResult = document.getElementById('formResult');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(contactForm);
      var name = (formData.get('name') || '').trim();
      var email = (formData.get('email') || '').trim();
      var message = (formData.get('message') || '').trim();

      // Validation
      if (!name || !email || !message) {
        if (formResult) {
          formResult.textContent = '❌ Please fill in all fields.';
          formResult.style.color = '#ef4444';
        }
        return;
      }

      // Email validation
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (formResult) {
          formResult.textContent = '❌ Please enter a valid email address.';
          formResult.style.color = '#ef4444';
        }
        return;
      }

      // Open mailto with pre-filled message
      var subject = encodeURIComponent('Portfolio Message from ' + name);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Message:\n' + message
      );

      window.location.href = 'mailto:your.email@example.com?subject=' + subject + '&body=' + body;

      // Show confirmation message
      if (formResult) {
        formResult.textContent = '✅ Opening your email client...';
        formResult.style.color = '#10b981';
      }

      // Reset form after a short delay
      setTimeout(function () {
        contactForm.reset();
        if (formResult) {
          formResult.textContent = '';
        }
      }, 1000);
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    if (navUl && !mainNav.contains(e.target) && !navToggle.contains(e.target)) {
      navUl.classList.remove('active');
    }
  });
});
