const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.2 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
document
  .getElementById("contactForm")
  ?.addEventListener("submit", async function (ev) {
    ev.preventDefault();
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
    }
    setTimeout(() => {
      msgBox.style.display = "none";
    }, 4000);
  });

// Hamburger menu for mobile
const hamburger = document.getElementById("hamburger");
const mainNav = document.getElementById("mainNav");
let menuOpen = false;
hamburger?.addEventListener("click", () => {
  menuOpen = !menuOpen;
  mainNav.classList.toggle("open", menuOpen);
  hamburger.classList.toggle("close", menuOpen);
});
// Close menu on nav link click (mobile)
mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 900) {
      menuOpen = false;
      mainNav.classList.remove("open");
      hamburger.classList.remove("close");
    }
  });
});
// Close menu if click outside
document.addEventListener("click", function (e) {
  if (menuOpen && window.innerWidth <= 900) {
    if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
      menuOpen = false;
      mainNav.classList.remove("open");
      hamburger.classList.remove("close");
    }
  }
});
// Dark/Light mode toggle (icon and label responsive) with localStorage persistence
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

// On toggle, update theme and save preference
modeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  updateModeToggle();
  saveThemePreference();
});

// On page load, set theme from preference
loadThemePreference();
updateModeToggle();
