// ======================================================
// INCIDENTES - MOBILE
// ======================================================

const API_BASE = "https://easy-soc-backend.onrender.com/api";

if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}

async function carregarIncidentes() {
  const loading = document.getElementById("loading");
  const listaHtml = document.getElementById("lista-incidentes");
  const titulo = document.getElementById("titulo-incidentes");

  try {
    loading.innerText = "Carregando incidentes...";
    listaHtml.innerHTML = "";

    const res = await fetch(`${API_BASE}/incidentes`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    const lista = data.incidentes || [];

    loading.style.display = "none";
    titulo.innerText = `Incidentes encontrados: ${lista.length}`;

    if (lista.length === 0) {
      listaHtml.innerHTML = `<p style="text-align:center;color:#555;">Nenhum incidente encontrado.</p>`;
      return;
    }

    lista.forEach(i => {
      const status = (i.Status || "").toLowerCase();

      let statusClass =
        status.includes("aberto") ? "status-aberto" :
        status.includes("andamento") ? "status-andamento" :
        "status-fechado";

      const card = document.createElement("div");
      card.className = "card-incidente";

      card.innerHTML = `
        <div class="linha"><strong>ID:</strong> <span>${i.ID}</span></div>
        <div class="linha"><strong>Máquina:</strong> <span>${i.Máquina}</span></div>
        <div class="linha"><strong>Tipo:</strong> <span>${i.Tipo}</span></div>
        <div class="linha"><strong>Status:</strong> <span class="${statusClass}">${i.Status}</span></div>
        <div class="linha"><strong>Data:</strong> <span>${i.Data}</span></div>

        <button class="btn-ver" onclick='abrirModal(${JSON.stringify(i)})'>
          Ver detalhes
        </button>
      `;

      listaHtml.appendChild(card);
    });

  } catch (err) {
    console.error("Erro ao carregar incidentes:", err);
    loading.innerText = "Erro ao carregar incidentes.";
  }
}

// MODAL
function abrirModal(i) {
  document.getElementById("modal-bg").style.display = "flex";

  document.getElementById("modal-conteudo").innerHTML = `
    <p><b>ID:</b> ${i.ID}</p>
    <p><b>Máquina:</b> ${i.Máquina}</p>
    <p><b>Tipo:</b> ${i.Tipo}</p>
    <p><b>Status:</b> ${i.Status}</p>
    <p><b>Data:</b> ${i.Data}</p>
    <p><b>Detalhes:</b> ${i.Detalhes}</p>
  `;
}

function fecharModal() {
  document.getElementById("modal-bg").style.display = "none";
}

carregarIncidentes();
