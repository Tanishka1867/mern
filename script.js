// Portfolio Interactivity, Themes, and Animations
document.addEventListener('DOMContentLoaded', function () {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Update Footer Year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Theme Toggling (Light / Dark Mode)
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  
  // Retrieve saved theme or default to system preference
  var savedTheme = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  // Apply theme on load
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast('Theme switched to ' + newTheme + ' mode', 'info');
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeIcon && typeof lucide !== 'undefined') {
      if (theme === 'dark') {
        themeIcon.setAttribute('data-lucide', 'sun');
      } else {
        themeIcon.setAttribute('data-lucide', 'moon');
      }
      lucide.createIcons(); // Re-render icon
    }
  }

  // 4. Mobile Navigation Menu Toggle
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  var menuIcon = document.getElementById('menuIcon');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      mainNav.classList.toggle('active');
      
      // Update menu icon
      if (menuIcon && typeof lucide !== 'undefined') {
        var isMenuOpen = mainNav.classList.contains('active');
        menuIcon.setAttribute('data-lucide', isMenuOpen ? 'x' : 'menu');
        lucide.createIcons();
      }
    });

    // Close menu when a link is clicked
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('active');
        if (menuIcon && typeof lucide !== 'undefined') {
          menuIcon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        if (menuIcon && typeof lucide !== 'undefined') {
          menuIcon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      }
    });
  }

  // 5. Scroll Reveal Animations (Intersection Observer)
  var revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(function (element) {
      element.classList.add('active');
    });
  }

  // 6. Navigation Link Highlighting on Scroll
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.main-nav a');

  window.addEventListener('scroll', highlightNavLinks);

  function highlightNavLinks() {
    var scrollPosition = window.scrollY + 120; // offset header height

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // 7. Smooth Scroll for Nav and Hash Links
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

  // 8. Toast Notification System
  var toastContainer = document.getElementById('toastContainer');

  function showToast(message, type) {
    if (!toastContainer) return;

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');
    
    // Choose appropriate Lucide icon name
    var iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';

    toast.innerHTML = `
      <div class="toast-icon"><i data-lucide="${iconName}"></i></div>
      <div class="toast-content">${message}</div>
    `;

    toastContainer.appendChild(toast);
    
    // Initialize icon
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({
        attrs: {
          class: 'lucide-icon'
        },
        nameAttr: 'data-lucide'
      });
    }

    // Trigger reveal transition
    setTimeout(function () {
      toast.classList.add('show');
    }, 10);

    // Auto-remove toast
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        toast.remove();
      }, 400);
    }, 3500);
  }

  // 9. Form Handling & Validation
  var contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      var isFormValid = true;
      var nameInput = document.getElementById('name');
      var emailInput = document.getElementById('email');
      var messageInput = document.getElementById('message');

      // Helper function to set errors
      function setFieldError(input, isValid, errorMsg) {
        var group = input.parentElement;
        if (!isValid) {
          group.classList.add('error');
          isFormValid = false;
        } else {
          group.classList.remove('error');
        }
      }

      // Name Validation
      var nameVal = (nameInput.value || '').trim();
      setFieldError(nameInput, nameVal.length > 0);

      // Email Validation
      var emailVal = (emailInput.value || '').trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setFieldError(emailInput, emailRegex.test(emailVal));

      // Message Validation
      var messageVal = (messageInput.value || '').trim();
      setFieldError(messageInput, messageVal.length > 0);

      if (!isFormValid) {
        showToast('Please correct validation errors.', 'error');
        return;
      }

      // Trigger mailto client
      var subject = encodeURIComponent('Portfolio Message from ' + nameVal);
      var mailBody = encodeURIComponent(
        'Name: ' + nameVal + '\n' +
        'Email: ' + emailVal + '\n' +
        'Message:\n' + messageVal
      );

      // Open email client
      window.location.href = 'mailto:tanishkapatil.dev@gmail.com?subject=' + subject + '&body=' + mailBody;

      // Toast feedback
      showToast('Opening your email client...', 'success');
      
      // Reset form
      setTimeout(function () {
        contactForm.reset();
        // Remove error classes if user click/focus left them behind
        document.querySelectorAll('.form-group').forEach(function (group) {
          group.classList.remove('error');
        });
      }, 500);
    });

    // Real-time input validation to remove error classes once user types valid info
    var inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        var group = this.parentElement;
        if (group.classList.contains('error')) {
          var val = this.value.trim();
          if (this.type === 'email') {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(val)) {
              group.classList.remove('error');
            }
          } else {
            if (val.length > 0) {
              group.classList.remove('error');
            }
          }
        }
      });
    });
  }
});
