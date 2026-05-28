const content = document.getElementById("content");

async function buscar() {
    const idSolicitante = localStorage.getItem("id_usuario");
    console.log(idSolicitante)


    if (!idSolicitante) {
        content.innerHTML = `<div class="error">Usuário não logado</div>`;
        return;
    }

    content.innerHTML = "Carregando...";

    try {

        let url = `http://localhost:3000/Manutencao/solicitacao/usuario/${idSolicitante}`;

      

        const res = await fetch(url);

        if (!res.ok) throw new Error("Erro na API");

        const data = await res.json();
        const lista = Array.isArray(data) ? data : [data];

        if (!lista.length) {
            content.innerHTML = `<div class="loading">Nenhuma solicitação encontrada</div>`;
            return;
        }
        carregarStats(lista);
        
        content.className = "grid";

        content.innerHTML = lista.map(item => `
            <div class="card">

                <div class="title">
                    Solicitação #${item.id_solicitacao ?? "-"}
                </div>

                <div class="row">
                    <span>Solicitante</span>
                    <span class="value">${item.nome_solicitante ?? "-"}</span>
                </div>

                <div class="row">
                    <span>Tipo Manutenção</span>
                    <span class="value">${item.tipo_manutencao ?? "-"}</span>
                </div>

                <div class="row">
                    <span>Descrição</span>
                    <span class="value">${item.descricao ?? "-"}</span>
                </div>

                <div class="row">
                    <span>Prioridade</span>
                    <span class="value">
                        <span class="badge ${getPriorityClass(item.prioridade)}">
                            ${item.prioridade ?? "-"}
                        </span>
                    </span>
                </div>

                <div class="row">
                    <span>Status</span>
                    <span class="value">
                        <span class="badge ${item.status_solicitacao === "ABERTA" ? "open" : "done"}">
                            ${item.status_solicitacao ?? "-"}
                        </span>
                    </span>
                </div>

                <div class="row">
                    <span>Tecnico</span>
                    <span class="value">${item.nome_tecnico ?? "-"}</span>
                </div>

                <div class="row">
                    <span>Data Abertura</span>
                    <span class="value">${item.data_abertura ?? "-"}</span>
                </div>

                <div class="row">
                    <span>Solução</span>
                    <span class="value">${item.solucao ?? "-"}</span>
                </div>
                <div class="row">
                    <span>Data Solução</span>
                    <span class="value">${item.data_conclusao ?? "-"}</span>
                </div>

            </div>
        `).join("");

    } catch (err) {
        content.innerHTML = `<div class="error">${err.message}</div>`;
    }
}






function carregarStats(lista) {

    const stats = lista.reduce((acc, item) => {

        acc.total++;

        if (item.status_solicitacao === "EM ANDAMENTO") acc.andamento++;
        if (item.status_solicitacao === "CONCLUIDA") acc.concluidas++;

        if (item.prioridade === "ALTA") acc.alta++;

        return acc;

    }, {
        total: 0,
        andamento: 0,
        concluidas: 0,
        alta: 0
    });

    document.getElementById("totalSolicitacoes").innerText = stats.total;
    document.getElementById("totalAndamento").innerText = stats.andamento;
    document.getElementById("totalConcluidas").innerText = stats.concluidas;
    document.getElementById("totalAlta").innerText = stats.alta;
}



function getPriorityClass(p) {
    if (!p) return "";
    p = p.toLowerCase();

    if (p.includes("alta")) return "high";
    if (p.includes("media") || p.includes("média")) return "medium";
    return "";
}

function carregarDadosUsuario() {
  const tipo = localStorage.getItem("tipo_usuario");
  const nome = localStorage.getItem("nome_usuario");
  const id = localStorage.getItem("id_usuario");

  const rodape = document.getElementById("rodape-usuario");

  if (rodape) {
      rodape.innerHTML = `
          <div class="usuario-box">
              <span><strong>Usuário:</strong> ${nome || "N/A"}</span>
              <span><strong>Tipo:</strong> ${tipo || "N/A"}</span>
              <span><strong>ID:</strong> ${id || "N/A"}</span>
          </div>
      `;
  }
  
  buscar();
}
window.onload = carregarDadosUsuario;

const API_URL = "http://localhost:3000/Manutencao/solicitacao/teste";

// ABRIR MODAL
function abrirModalAdicionar() {
    document.getElementById("modalAdicionar").style.display = "flex";
}

// FECHAR MODAL
function fecharModal(id) {
    document.getElementById(id).style.display = "none";
}

// ADICIONAR SOLICITAÇÃO
    async function adicionarsolicitacoes() {
        const id_solicitante = document.getElementById("solicitanteAdd").value;
        const tipo_manutencao = document.getElementById("tipoAdd").value;
        const descricao = document.getElementById("descricaoAdd").value;
        const prioridade= document.getElementById("prioridadeAdd").value;
        const status_solicitacao= document.getElementById("statusAdd").value;
        const id_tecnico = null;    
        console.log(
            id_solicitante,
            tipo_manutencao,
            descricao,
            prioridade,
            status_solicitacao
          );
    
    
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_solicitante, tipo_manutencao, descricao, prioridade, status_solicitacao,id_tecnico, data_abertura: new Date().toISOString().split('T')[0] })
        });
            console.log(id_solicitante, tipo_manutencao, descricao, prioridade, status_solicitacao);
        fecharModal("modalAdicionar");
        alert("Adicionado com sucesso");
        buscar();

    }
    
    async function carregarSolicitantes(tipo, selectId) {
        try {
          const response = await fetch(`http://localhost:3000/Manutencao/${tipo}`);
          const dados = await response.json();
      
          const select = document.getElementById(selectId);
      
          select.innerHTML = `<option value="">Selecione</option>`;
      
          dados.forEach(u => {
            select.innerHTML += `
              <option value="${u.id_usuario}">
                ${u.nome}
              </option>
            `;
          });
      
        } catch (error) {
          console.error("Erro ao carregar solicitantes:", error);
        }
      }

      function validarFormulario() {

        const form = document.getElementById("formSolicitacao");
      
        if (form.reportValidity()) {
          adicionarsolicitacoes(),
          editarsolicitacoes();
        }
      
      }