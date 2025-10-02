document.addEventListener('DOMContentLoaded', function() {
    // Efeito de parallax no scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        document.body.classList.toggle('scroll', scrollPosition > 50);
        
        const background = document.querySelector('.background');
        background.style.transform = `translateZ(-50px) scale(${1.1 - scrollPosition/5000})`;
    });

    // Efeito 3D nos cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const x = e.clientX - card.getBoundingClientRect().left;
            const y = e.clientY - card.getBoundingClientRect().top;
            const centerX = card.offsetWidth / 2;
            const centerY = card.offsetHeight / 2;
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            card.style.transform = `perspective(500px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(20px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(500px) rotateX(0) rotateY(0) translateZ(20px)';
        });
    });

    // Efeito 3D no formulário
    const formContainer = document.querySelector('.form-container');
    formContainer.addEventListener('mousemove', (e) => {
        const x = e.clientX - formContainer.getBoundingClientRect().left;
        const y = e.clientY - formContainer.getBoundingClientRect().top;
        const centerX = formContainer.offsetWidth / 2;
        const centerY = formContainer.offsetHeight / 2;
        const angleX = (y - centerY) / 40;
        const angleY = (centerX - x) / 40;
        formContainer.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
    });
    formContainer.addEventListener('mouseleave', () => {
        formContainer.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
    });
});

// -------------------------
// FIREBASE - CADASTRO DE USUÁRIO COM NOME E FOTO
// -------------------------
import { getAuth, createUserWithEmailAndPassword, updateProfile } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Captura do formulário de cadastro
const registrationForm = document.getElementById('registrationForm');

registrationForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('password').value.trim();

  const auth = getAuth();

  createUserWithEmailAndPassword(auth, email, senha)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Atualiza o displayName e a foto (padrão)
      await updateProfile(user, {
        displayName: nome,
        photoURL: "default-avatar.png" // foto padrão para email/senha
      });

      alert("✅ Usuário cadastrado com sucesso!");
      window.location.href = "login.html"; 
    })
    .catch((error) => {
      alert("❌ Erro no cadastro: " + error.message);
    });
});
