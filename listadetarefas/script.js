import { db, auth } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

/* ---------- Seletores ---------- */
const btnAdd = document.querySelector(".btn-add");
const taskModal = document.getElementById("taskModal");
const closeModal = document.querySelector(".close-modal");
const taskForm = document.getElementById("taskForm");
const colorOptions = document.querySelectorAll(".color-option");
const container = document.querySelector(".tasks-container");
const filters = document.querySelectorAll(".filter");

const cityInput = document.getElementById("cityInput");
const searchWeatherBtn = document.getElementById("searchWeather");
const temperatureEl = document.querySelector(".temperature");
const locationEl = document.querySelector(".location");
const conditionEl = document.querySelector(".condition");
const weatherIconEl = document.querySelector(".weather-icon i");

let selectedColor = "#4CAF50";
let editingId = null;
let currentUserUid = null;
let currentFilter = "all";

/* ---------- Helpers UI ---------- */
function openModal() {
  taskModal.style.display = "flex";
}
function closeModalFn() {
  taskModal.style.display = "none";
  taskForm.reset();
  editingId = null;
  selectedColor = "#4CAF50";
  colorOptions.forEach((el) => el.classList.remove("selected"));
  const defaultOpt = document.querySelector('.color-option[data-color="#4CAF50"]');
  if (defaultOpt) defaultOpt.classList.add("selected");
}
btnAdd?.addEventListener("click", openModal);
closeModal?.addEventListener("click", closeModalFn);
window.addEventListener("click", (e) => { if (e.target === taskModal) closeModalFn(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModalFn(); });
colorOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    colorOptions.forEach((o) => o.classList.remove("selected"));
    opt.classList.add("selected");
    selectedColor = opt.dataset.color;
  });
});
filters.forEach((f) => {
  f.addEventListener("click", () => {
    filters.forEach((x) => x.classList.remove("active"));
    f.classList.add("active");
    const text = f.textContent.trim().toLowerCase();
    if (text === "todas") currentFilter = "all";
    else if (text === "hoje") currentFilter = "today";
    else if (text === "importantes") currentFilter = "important";
    else if (text === "completas") currentFilter = "completed";
    if (currentUserUid) carregarTarefas(currentUserUid);
  });
});

/* ---------- Autenticação e inicialização ---------- */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // 1️⃣ Atualiza nome e foto do usuário
  const name = user.displayName || "Usuário";
  const photo = user.photoURL || "default-avatar.png";
  document.getElementById("userName").textContent = `Olá, ${name}`;
  document.getElementById("userPhoto").src = photo;

  // 2️⃣ Salva UID do usuário e carrega tarefas
  currentUserUid = user.uid;
  carregarTarefas(user.uid);

  // 3️⃣ Configura submit do form
  taskForm.addEventListener("submit", handleTaskFormSubmit);
});

/* ---------- Função de submit do form ---------- */
async function handleTaskFormSubmit(e) {
  e.preventDefault();
  const titulo = document.getElementById("taskTitle").value.trim();
  const descricao = document.getElementById("taskDescription").value.trim();
  const dueDate = document.getElementById("taskDueDate").value || null;
  const prioridade = document.getElementById("taskPriority").value || "low";
  if (!titulo) { alert("Preencha o título."); return; }
  try {
    if (editingId) {
      await updateDoc(doc(db, "tarefas", editingId), { titulo, descricao, dueDate, prioridade, color: selectedColor, updatedAt: new Date() });
      editingId = null;
      alert("Tarefa atualizada!");
    } else {
      await addDoc(collection(db, "tarefas"), { uid: currentUserUid, titulo, descricao, dueDate, prioridade, color: selectedColor, completed: false, createdAt: new Date() });
      alert("Tarefa adicionada!");
    }
    closeModalFn();
    carregarTarefas(currentUserUid);
  } catch (err) { console.error(err); alert("Erro ao salvar tarefa."); }
}

/* ---------- Carregar tarefas ---------- */
async function carregarTarefas(uid) {
  container.innerHTML = "<p>Carregando tarefas...</p>";
  try {
    const snap = await getDocs(query(collection(db, "tarefas"), where("uid", "==", uid)));
    const tarefas = [];
    snap.forEach((ds) => { tarefas.push({ id: ds.id, ...ds.data() }); });

    const hojeStr = new Date().toISOString().slice(0, 10);
    let tarefasFiltradas = tarefas;
    if (currentFilter === "today") tarefasFiltradas = tarefas.filter((t) => t.dueDate === hojeStr);
    else if (currentFilter === "important") tarefasFiltradas = tarefas.filter((t) => t.prioridade === "high");
    else if (currentFilter === "completed") tarefasFiltradas = tarefas.filter((t) => t.completed === true);

    renderTarefas(tarefasFiltradas);
  } catch (err) { console.error(err); container.innerHTML = "<p>Erro ao carregar tarefas.</p>"; }
}

function renderTarefas(lista) {
  container.innerHTML = "";
  if (!lista.length) { container.innerHTML = "<p>Nenhuma tarefa encontrada.</p>"; return; }
  lista.forEach((tarefa) => {
    const div = document.createElement("div");
    div.classList.add("task-card");
    if (tarefa.completed) div.classList.add("completed");
    div.style.borderLeft = `6px solid ${tarefa.color || "#4CAF50"}`;
    div.innerHTML = `
      <div class="task-header">
        <h3>${escapeHtml(tarefa.titulo)}</h3>
        <div class="task-actions">
          <i class="fas fa-edit" title="Editar" data-id="${tarefa.id}"></i>
          <i class="fas fa-trash-alt" title="Excluir" data-id="${tarefa.id}"></i>
          <i class="fas fa-check" title="Marcar como concluída" data-id="${tarefa.id}"></i>
        </div>
      </div>
      <div class="task-body">
        <p>${escapeHtml(tarefa.descricao || "")}</p>
        <div class="task-meta">
          <span class="due-date"><i class="far fa-calendar-alt"></i> ${tarefa.dueDate || "Sem data"}</span>
          <span class="priority ${tarefa.prioridade || "low"}">
            <i class="fas fa-exclamation-circle"></i> ${tarefa.prioridade || "low"}
          </span>
        </div>
      </div>`;
    container.appendChild(div);

    const editBtn = div.querySelector(".fa-edit");
    const delBtn = div.querySelector(".fa-trash-alt");
    const doneBtn = div.querySelector(".fa-check");
    const id = tarefa.id;

    editBtn?.addEventListener("click", () => {
      editingId = id;
      openModal();
      document.getElementById("taskTitle").value = tarefa.titulo || "";
      document.getElementById("taskDescription").value = tarefa.descricao || "";
      document.getElementById("taskDueDate").value = tarefa.dueDate || "";
      document.getElementById("taskPriority").value = tarefa.prioridade || "low";
      colorOptions.forEach((o) => o.classList.remove("selected"));
      const opt = document.querySelector(`.color-option[data-color="${tarefa.color || "#4CAF50"}"]`);
      if (opt) opt.classList.add("selected");
      selectedColor = tarefa.color || "#4CAF50";
    });
    delBtn?.addEventListener("click", async () => { if (!confirm("Deseja realmente excluir esta tarefa?")) return; await deleteDoc(doc(db, "tarefas", id)); carregarTarefas(currentUserUid); });
    doneBtn?.addEventListener("click", async () => { await updateDoc(doc(db, "tarefas", id), { completed: !tarefa.completed }); carregarTarefas(currentUserUid); });
  });
}

/* ---------- Logout ---------- */
document.getElementById("logoutBtn")?.addEventListener("click", async (e) => { e.preventDefault(); await signOut(auth); window.location.href = "login.html"; });

/* ---------- Escape HTML ---------- */
function escapeHtml(unsafe) {
  return (unsafe || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

/* ---------- API de Clima (OpenWeatherMap) ---------- */
async function getWeatherData(city) {
  const API_KEY = '7da8284e5228882f9818a903b5becabb';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=pt_br`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod === 200) {
      updateWeatherUI(data);
      localStorage.setItem('lastWeatherCity', city);
    } else {
      alert('Cidade não encontrada. Tente novamente.');
    }
  } catch (err) {
    console.error('Erro ao buscar dados do clima:', err);
    alert('Erro ao buscar dados do clima.');
  }
}

function updateWeatherUI(data) {
  const temp = Math.round(data.main.temp);
  const cond = data.weather[0].description;
  const city = `${data.name}, ${data.sys.country}`;

  temperatureEl.textContent = `${temp}°C`;
 
 }