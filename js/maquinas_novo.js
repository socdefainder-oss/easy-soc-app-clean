// ======================================================
// MAQUINAS - Layout Mobile (Cards)
// ======================================================

const API_BASE = "https://easy-soc-backend.onrender.com/api";
const TOKEN = localStorage.getItem("token");
const CLIENTE = localStorage.getItem("cliente");

if (!TOKEN || !CLIENTE) window.location.href = "index.html";

let maquinas = [];

// Carregar dados do backend
async function carregarMaquinas() {
  try {
    const res = await fetch(`${API_BASE}/resumo/${CLIENTE}`, {
      headers: {
        "Authorization": "Bearer " + TOKEN
      }
    });

    const data = await res.json();

    maquinas = data.detalhes.maquinas || [];

    console.log("📡 Máquinas carregadas:", maquinas);

    preencherLista(maquinas);

  } catch (err) {
    console.error("❌ Erro ao carregar máquinas:", err);
  }
}

// ======================================================
// Preencher LISTA (não é mais tabela!)
// ======================================================

function preencherLista(lista) {
  const container = document.getElementById("lista-maquinas");
  container.innerHTML = "";

  if (!lista.length) {
    container.innerHTML = `<p style="text-align:center;color:#777;margin-top:20px;">Nenhuma máquina encontrada.</p>`;
    return;
  }

  lista.forEach(m => {
    const status = (m.Status || "-").toLowerCase();

    const statusClass =
      status.includes("seguro") ? "status-ok" :
      status.includes("infect") ? "status-vuln" :
      status.includes("risco") ? "status-risk" :
      "status-vuln";

    const card = document.createElement("div");
    card.className = "card-maquina";

    card.innerHTML = `
      <div class="linha">
        <strong>Hostname:</strong>
        <span>${m.Hostname || "-"}</span>
      </div>

      <div class="linha">
        <strong>Sistema:</strong>
        <span>${m.OS || "-"}</span>
      </div>

      <div class="linha">
        <strong>Status:</strong>
        <span class="${statusClass}">${m.Status || "-"}</span>
      </div>

      <div class="linha">
        <strong>Vulnerabilidades:</strong>
        <span>${m.Vulnerabilidades || 0}</span>
      </div>

      <button onclick='abrirModal(${JSON.stringify(m)})'
        style="margin-top:10px;width:100%;padding:10px;border:none;border-radius:6px;background:#4c8bfd;color:white;font-size:15px;cursor:pointer">
        Ver detalhes
      </button>
    `;

    container.appendChild(card);
  });
}

// ======================================================
// Busca em tempo real
// ======================================================
document.getElementById("busca").addEventListener("input", e => {
  const texto = e.target.value.toLowerCase();

  const filtradas = maquinas.filter(m =>
    (m.Hostname || "").toLowerCase().includes(texto) ||
    (m.OS || "").toLowerCase().includes(texto) ||
    (m.Status || "").toLowerCase().includes(texto)
  );

  preencherLista(filtradas);
});

// ======================================================
// Filtro por status
// ======================================================
document.getElementById("filtro").addEventListener("change", e => {
  const filtro = e.target.value;

  if (filtro === "todas") {
    preencherLista(maquinas);
    return;
  }

  const filtradas = maquinas.filter(m =>
    (m.Status || "").toLowerCase().includes(filtro)
  );

  preencherLista(filtradas);
});

// ======================================================
// MODAL – Detalhes
// ======================================================
function abrirModal(m) {
  document.getElementById("modal-bg").style.display = "flex";

  document.getElementById("modal-conteudo").innerHTML = `
    <p><b>Hostname:</b> ${m.Hostname}</p>
    <p><b>Status:</b> ${m.Status}</p>
    <p><b>IP:</b> ${m.IP}</p>
    <p><b>Sistema Operacional:</b> ${m.OS}</p>
    <p><b>Última Atualização:</b> ${m["ÚltimaAtualização"]}</p>
    <p><b>Vulnerabilidades:</b> ${m.Vulnerabilidades}</p>
    <p><b>Riscos:</b> ${m.Riscos}</p>
    <p><b>Incidentes:</b> ${m.Incidentes}</p>
    <p><b>Política:</b> ${m.Política}</p>
    <p><b>Online:</b> ${m.Online}</p>
  `;
}

function fecharModal() {
  document.getElementById("modal-bg").style.display = "none";
}

// Inicializar
carregarMaquinas();
