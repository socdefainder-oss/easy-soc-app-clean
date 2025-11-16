// ======================================================
// RISCOS - MOBILE
// ======================================================

const API_BASE = "https://easy-soc-backend.onrender.com/api";

if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}

async function carregarRiscos() {
  const loading = document.getElementById("loading");
  const listaHtml = document.getElementById("lista-riscos");
  const titulo = document.getElementById("titulo-riscos");

  try {
    loading.innerText = "Carregando riscos...";
    listaHtml.innerHTML = "";

    const res = await fetch(`${API_BASE}/riscos`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    const lista = data.riscos || [];

    loading.style.display = "none";
    titulo.innerText = `Riscos encontrados: ${lista.length}`;

    if (lista.length === 0) {
      listaHtml.innerHTML = `<p style="color:#666;text-align:center;">Nenhum risco encontrado.</p>`;
      return;
    }

    lista.forEach(r => {
      const nivel = (r.Nível || "").toLowerCase();

      let nivelClass =
        nivel.includes("alto") ? "nivel-alto" :
        nivel.includes("médio") || nivel.includes("medio") ? "nivel-medio" :
        "nivel-baixo";

      const card = document.createElement("div");
      card.className = "card-risco";

      card.innerHTML = `
        <div class="linha"><strong>Risco:</strong> <span>${r.Risco}</span></div>
        <div class="linha"><strong>Máquina:</strong> <span>${r.Máquina}</span></div>
        <div class="linha"><strong>Nível:</strong> <span class="${nivelClass}">${r.Nível}</span></div>

        <button class="btn-ver" onclick='abrirModal(${JSON.stringify(r)})'>
          Ver detalhes
        </button>
      `;

      listaHtml.appendChild(card);
    });

  } catch (err) {
    console.error("Erro ao carregar riscos:", err);
    loading.innerText = "Erro ao carregar riscos.";
  }
}

// MODAL
function abrirModal(r) {
  document.getElementById("modal-bg").style.display = "flex";

  document.getElementById("modal-conteudo").innerHTML = `
    <p><b>Risco:</b> ${r.Risco}</p>
    <p><b>Máquina:</b> ${r.Máquina}</p>
    <p><b>Nível:</b> ${r.Nível}</p>
    <p><b>Descrição:</b> ${r.Descrição}</p>
    <p><b>Detalhes:</b> ${r.Detalhes}</p>
  `;
}

function fecharModal() {
  document.getElementById("modal-bg").style.display = "none";
}

carregarRiscos();
