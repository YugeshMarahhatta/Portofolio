// Enhanced Intersection Observer with multiple animation types
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        // Add staggered animation for child elements
        const children = e.target.querySelectorAll('.chip, .card, .titem');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, index * 100);
        });
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Cursor-following spotlight effect with smooth interpolation
let currentX = 50, currentY = 50;
let targetX = 50, targetY = 50;

document.addEventListener('mousemove', (e) => {
  targetX = (e.clientX / window.innerWidth) * 100;
  targetY = (e.clientY / window.innerHeight) * 100;
});

// Smooth animation loop
function smoothSpotlight() {
  // Lerp (linear interpolation) for smooth movement
  currentX += (targetX - currentX) * 0.05;
  currentY += (targetY - currentY) * 0.05;
  
  document.documentElement.style.setProperty('--spotlight-x', currentX + '%');
  document.documentElement.style.setProperty('--spotlight-y', currentY + '%');
  
  requestAnimationFrame(smoothSpotlight);
}
smoothSpotlight();

// Scroll Progress Bar - only visible when scrolling
const createScrollProgress = () => {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
    
    // Show progress bar only when scrolled down
    if (window.scrollY > 100) {
      progressBar.classList.add('visible');
    } else {
      progressBar.classList.remove('visible');
    }
  });
};
createScrollProgress();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Parallax effect for hero section - preserve float animation
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      // Remove parallax effect to avoid interfering with float animation
      // Keep the float CSS animation instead
      ticking = false;
    });
    ticking = true;
  }
});

// Typing effect for hero text (optional enhancement)
const typeWriter = (element, text, speed = 50) => {
  let i = 0;
  element.textContent = '';
  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };
  type();
};

// Mouse cursor trail effect
const createCursorTrail = () => {
  let lastX = 0, lastY = 0;
  document.addEventListener('mousemove', (e) => {
    if (Math.abs(e.clientX - lastX) > 5 || Math.abs(e.clientY - lastY) > 5) {
      const trail = document.createElement('div');
      trail.style.position = 'fixed';
      trail.style.width = '6px';
      trail.style.height = '6px';
      trail.style.borderRadius = '50%';
      trail.style.background = 'var(--primary)';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      trail.style.pointerEvents = 'none';
      trail.style.opacity = '0.6';
      trail.style.zIndex = '9999';
      trail.style.transition = 'all 0.5s ease';
      document.body.appendChild(trail);
      
      setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(2)';
      }, 10);
      
      setTimeout(() => trail.remove(), 500);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });
};
// Uncomment to enable cursor trail: createCursorTrail();

// Contact Form Handler with animations
// Contact Form Handler with animations
document
  .getElementById("contactForm")
  ?.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    
    // Add loading animation to submit button
    const submitBtn = ev.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const form = document.getElementById("contactForm");
    let msgBox = document.getElementById("contactMsgBox");
    if (!msgBox) {
      msgBox = document.createElement("div");
      msgBox.id = "contactMsgBox";
      msgBox.style.position = "fixed";
      msgBox.style.top = "30px";
      msgBox.style.left = "50%";
      msgBox.style.transform = "translateX(-50%)";
      msgBox.style.background = "#222";
      msgBox.style.color = "#fff";
      msgBox.style.padding = "18px 32px";
      msgBox.style.borderRadius = "16px";
      msgBox.style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)";
      msgBox.style.fontSize = "18px";
      msgBox.style.zIndex = "9999";
      msgBox.style.textAlign = "center";
      document.body.appendChild(msgBox);
    }
    msgBox.style.display = "block";
    msgBox.textContent = "Sending message...";
    try {
      const response = await fetch(
        "https://email-server-ebon.vercel.app/api/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        }
      );
      if (response.ok) {
        msgBox.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        msgBox.textContent =
          "✅ Your message was sent successfully! Thank you for reaching out.";
        form.reset();
        // Play sound on success
        let snd = document.getElementById("contactSuccessSound");
        if (!snd) {
          snd = document.createElement("audio");
          snd.id = "contactSuccessSound";
          snd.src = "assets/sound/done.mp3";
          snd.preload = "auto";
          document.body.appendChild(snd);
        }
        snd.currentTime = 0;
        snd.play();
      } else {
        msgBox.style.background = "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
        msgBox.textContent =
          "❌ Failed to send message. Please try again later.";
        // Play error sound
        let errSnd = document.getElementById("contactErrorSound");
        if (!errSnd) {
          errSnd = document.createElement("audio");
          errSnd.id = "contactErrorSound";
          errSnd.src = "assets/sound/error.mp3";
          errSnd.preload = "auto";
          document.body.appendChild(errSnd);
        }
        errSnd.currentTime = 0;
        errSnd.play();
      }
    } catch (err) {
      msgBox.style.background = "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
      msgBox.textContent =
        "❌ Error sending message. Please check your connection.";
      // Play error sound
      let errSnd = document.getElementById("contactErrorSound");
      if (!errSnd) {
        errSnd = document.createElement("audio");
        errSnd.id = "contactErrorSound";
        errSnd.src = "assets/sound/error.mp3";
        errSnd.preload = "auto";
        document.body.appendChild(errSnd);
      }
      errSnd.currentTime = 0;
      errSnd.play();
    } finally {
      // Restore submit button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
    setTimeout(() => {
      msgBox.style.opacity = '0';
      msgBox.style.transform = 'translate(-50%, -100%)';
      setTimeout(() => {
        msgBox.style.display = "none";
        msgBox.style.opacity = '1';
        msgBox.style.transform = 'translateX(-50%)';
      }, 500);
    }, 4000);
  });

// Hamburger menu for mobile with smooth animations
const hamburger = document.getElementById("hamburger");
const mainNav = document.getElementById("mainNav");
let menuOpen = false;
hamburger?.addEventListener("click", () => {
  menuOpen = !menuOpen;
  mainNav.classList.toggle("open", menuOpen);
  hamburger.classList.toggle("close", menuOpen);
  
  // Add ripple effect
  const ripple = document.createElement('span');
  ripple.style.position = 'absolute';
  ripple.style.width = '100%';
  ripple.style.height = '100%';
  ripple.style.background = 'rgba(255,111,97,0.3)';
  ripple.style.borderRadius = '10px';
  ripple.style.top = '0';
  ripple.style.left = '0';
  ripple.style.transform = 'scale(0)';
  ripple.style.animation = 'ripple 0.6s ease';
  hamburger.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = '@keyframes ripple{to{transform:scale(2);opacity:0}}';
document.head.appendChild(style);
// Close menu on nav link click (mobile) with smooth transition
mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 900) {
      menuOpen = false;
      mainNav.classList.remove("open");
      hamburger.classList.remove("close");
    }
  });
});

// Close menu if click outside with fade effect
document.addEventListener("click", function (e) {
  if (menuOpen && window.innerWidth <= 900) {
    if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
      menuOpen = false;
      mainNav.classList.remove("open");
      hamburger.classList.remove("close");
    }
  }
});

// Dark/Light mode toggle with smooth transition and localStorage persistence
const modeToggle = document.getElementById("modeToggle");
const modeIcon = document.getElementById("modeIcon");
const modeLabel = document.getElementById("modeLabel");

// Load theme preference from localStorage
function loadThemePreference() {
  const theme = localStorage.getItem("theme");
  if (theme === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
}

function saveThemePreference() {
  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}

function updateModeToggle() {
  if (document.body.classList.contains("light")) {
    modeIcon.textContent = "🌙";
    modeLabel.textContent = "Dark";
  } else {
    modeIcon.textContent = "🌞";
    modeLabel.textContent = "Light";
  }
}

// On toggle, update theme with animation
modeToggle?.addEventListener("click", () => {
  // Add transition class to body
  document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
  
  document.body.classList.toggle("light");
  updateModeToggle();
  saveThemePreference();
  
  // Create ripple effect from toggle button
  const rect = modeToggle.getBoundingClientRect();
  const ripple = document.createElement('div');
  ripple.style.position = 'fixed';
  ripple.style.left = rect.left + rect.width / 2 + 'px';
  ripple.style.top = rect.top + rect.height / 2 + 'px';
  ripple.style.width = '20px';
  ripple.style.height = '20px';
  ripple.style.borderRadius = '50%';
  ripple.style.background = document.body.classList.contains("light") ? '#fff' : '#000';
  ripple.style.transform = 'translate(-50%, -50%) scale(0)';
  ripple.style.transition = 'transform 0.8s ease';
  ripple.style.pointerEvents = 'none';
  ripple.style.zIndex = '10000';
  document.body.appendChild(ripple);
  
  setTimeout(() => {
    ripple.style.transform = 'translate(-50%, -50%) scale(150)';
  }, 10);
  
  setTimeout(() => ripple.remove(), 800);
});

// On page load, set theme from preference
loadThemePreference();
updateModeToggle();

// Add floating particles effect (optional, uncomment to enable)
const createParticles = () => {
  const particlesContainer = document.createElement('div');
  particlesContainer.style.position = 'fixed';
  particlesContainer.style.top = '0';
  particlesContainer.style.left = '0';
  particlesContainer.style.width = '100%';
  particlesContainer.style.height = '100%';
  particlesContainer.style.pointerEvents = 'none';
  particlesContainer.style.zIndex = '0';
  particlesContainer.style.overflow = 'hidden';
  document.body.appendChild(particlesContainer);
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 4 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = 'var(--primary)';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.opacity = Math.random() * 0.3 + 0.1;
    particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`;
    particle.style.animationDelay = Math.random() * 5 + 's';
    particlesContainer.appendChild(particle);
  }
};
// Uncomment to enable particles: createParticles();

// Performance optimization: lazy load images
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[src]');
  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    img.onload = () => {
      img.style.opacity = '1';
    };
  });
});

// Add smooth entrance animation on page load
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});
