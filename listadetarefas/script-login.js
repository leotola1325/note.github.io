// Inicializar partículas
particlesJS('particles-js', {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: "#4d4d4d" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#333", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2 }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" }
        }
    }
});



// Efeito 3D no formulário
const form = document.querySelector('.form-container');
form.addEventListener('mousemove', (e) => {
    const x = e.clientX - form.getBoundingClientRect().left;
    const y = e.clientY - form.getBoundingClientRect().top;
    const centerX = form.offsetWidth / 2;
    const centerY = form.offsetHeight / 2;
    form.style.transform = `perspective(1000px) rotateX(${(y - centerY) / 30}deg) rotateY(${(centerX - x) / 30}deg) translateY(-10px)`;
});

form.addEventListener('mouseleave', () => {
    form.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
});

// Controle do ícone de mostrar/ocultar senha
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');

// Mostrar senha enquanto pressionado
togglePassword.addEventListener('mousedown', function() {
    passwordInput.type = 'text';
    this.classList.replace('fa-eye', 'fa-eye-slash');
    this.style.transform = 'translateY(-50%) scale(1.2)';
});

// Ocultar senha ao soltar
togglePassword.addEventListener('mouseup', function() {
    passwordInput.type = 'password';
    this.classList.replace('fa-eye-slash', 'fa-eye');
    this.style.transform = 'translateY(-50%) scale(1)';
});

// Ocultar senha se arrastar para fora
togglePassword.addEventListener('mouseleave', function() {
    if(passwordInput.type === 'text') {
        passwordInput.type = 'password';
        this.classList.replace('fa-eye-slash', 'fa-eye');
        this.style.transform = 'translateY(-50%) scale(1)';
    }

});

// Animação de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Login realizado!';
        setTimeout(() => {
            // Redirecionar para dashboard ou página principal
            window.location.href = "dashboard.html";
        }, 1000);
    }, 1500);
});

// Efeito parallax no scroll
window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    document.querySelector('.background').style.transform = `translateZ(-50px) scale(${1.1 - scroll/5000})`;
});


// --- Firebase importado do config ---
import { auth } from "./firebaseConfig.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// --- Recuperar senha ---
document.addEventListener("DOMContentLoaded", () => {
  const forgotLink = document.getElementById("forgotPassword");

  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      const email = prompt("Digite seu e-mail para recuperar a senha:");

      if (email) {
        sendPasswordResetEmail(auth, email)
          .then(() => {
            alert("✅ Um link de redefinição de senha foi enviado para " + email);
          })
          .catch((error) => {
            alert("⚠️ Erro: " + error.message);
          });
      }
    });
  }
});
