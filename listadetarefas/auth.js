// auth.js
import { auth } from "./firebaseConfig.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";


// ================== CADASTRO (email/senha) ==================
const registrationForm = document.getElementById("registrationForm");
if (registrationForm) {
    registrationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("✅ Usuário cadastrado com sucesso!");
            window.location.href = "lista.html";
        } catch (error) {
            alert("❌ Erro no cadastro: " + error.message);
        }
    });
}


// ================== LOGIN (email/senha) ==================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = loginForm.querySelector("input[type='email']").value;
        const password = loginForm.querySelector("#password").value;
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("✅ Login realizado com sucesso!");
            window.location.href = "lista.html";
        } catch (error) {
            alert("❌ Erro no login: " + error.message);
        }
    });
}


// ================== GOOGLE (login/cadastro) ==================
const googleSignInBtn = document.getElementById("googleSignInBtn");  // botão login
const googleSignUpBtn = document.getElementById("googleSignUpBtn");  // botão cadastro

async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        alert("✅ Autenticação com Google realizada com sucesso!");
        window.location.href = "lista.html";
    } catch (err) {
        console.error("Erro no login/cadastro com Google:", err);
        alert("❌ Erro no login/cadastro com Google. Veja o console para mais detalhes.");
    }
}

if (googleSignInBtn) googleSignInBtn.addEventListener("click", loginWithGoogle);
if (googleSignUpBtn) googleSignUpBtn.addEventListener("click", loginWithGoogle);
