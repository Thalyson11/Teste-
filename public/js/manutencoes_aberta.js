const content = document.getElementById("content");

async function buscar(status_solicitacao = "aberta") {

    content.innerHTML = "Carregando...";

    try {
        // monta URL usando o status
        let url = `http://localhost:3000/Manutencao/solicitacao/testee/${status_solicitacao}`;

        const res = await fetch(url);

        if (!res.ok) throw new Error("Erro na API");

        const data = await res.json();
        const lista = Array.isArray(data) ? data : [data];

        if (!lista.length) {
            content.innerHTML = `<div class="loading">Nenhuma solicitação encontrada</div>`;
            return;
        }

        content.className = "grid";

        content.innerHTML = lista.map(item => `
            <div class="card">

                <div class="title">
                    Solicitação de Manutenção #${item.id_solicitacao ?? "-"}
                </div>

                <div class="row">
                    <span>Solicitante</span>
                    <span class="value">${item.nome_solicitante ?? "-"}</span>
                </div>

                <div class="row">
                    <span>Técnico Responsável</span>
                    <span class="value">${item.nome_tecnico ?? "-"}</span>
                </div>

                <div class="row">
                    <span>Tipo Manutenção</span>
                    <span class="value">${item.tipo_manutencao ?? "-"}</span>
                </div>

                <div class="row">
                    <span>Descrição</span>
                    <span class="value descricao">
                    ${item.descricao ?? "-"}
                    </span> 
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

                 <div class="actions">
                    <button onclick="atribuir(${item.id_solicitacao})" class="btn-atribuir">
                        👷 Atribuir a mim
                    </button>
                 </div>

            </div>

        `).join("");

    } catch (err) {
        content.innerHTML = `<div class="error">${err.message}</div>`;
    }
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


/*ATRIBUIR PARA*/ 
async function atribuir(id_solicitacao) {
    try {
        const id = JSON.parse(localStorage.getItem("id_usuario"));

        if (!id) {
            alert("Usuário não encontrado");
            return;
        }

        const res = await fetch(`http://localhost:3000/Manutencao/solicitacao/atribuir/tecnico/${id_solicitacao}`, {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_tecnico: id,
                status_solicitacao: "em andamento"
            })
        });

        if (!res.ok) throw new Error("Erro ao atribuir");

        alert("Solicitação atribuída!");

        minhas_manutencoes();

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}


/* ✅  ✅ Marcar como concluido  ✅  ✅ */
async function marcar_concluido(id_solicitacao) {
    try {
        const id = JSON.parse(localStorage.getItem("id_usuario"));

        if (!id) {
            alert("Usuário não encontrado");
            return;
        }

        const res = await fetch(`http://localhost:3000/Manutencao/solicitacao/atribuir/tecnico/${id_solicitacao}`, {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_tecnico: id,
                status_solicitacao: "concluida"
            })
        });

        if (!res.ok) throw new Error("Erro ao marcar como conclu´pido");

        alert("Marcado como concluído!");

        minhas_manutencoes(); 

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

/*❌❌ Marcar como Cancelada ❌❌*/
async function marcar_cancelada(id_solicitacao) {
    try {
        const id = JSON.parse(localStorage.getItem("id_usuario"));

        if (!id) {
            alert("Usuário não encontrado");
            return;
        }

        const res = await fetch(`http://localhost:3000/Manutencao/solicitacao/atribuir/tecnico/${id_solicitacao}`, {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_tecnico: id,
                status_solicitacao: "cancelada"
            })
        });

        if (!res.ok) throw new Error("Erro ao marcar como Cancelada");

        alert("Marcado como Cancelada!");
        minhas_manutencoes(); 

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}



/*Minhas Manutenções*/
async function minhas_manutencoes() {
    const id_tecnico = localStorage.getItem("id_usuario");
    console.log(id_tecnico)


    if (!id_tecnico) {
        content.innerHTML = `<div class="error">Usuário não logado</div>`;
        return;
    }

    content.innerHTML = "Carregando...";

    try {
        // monta URL dinamicamente
        let url = `http://localhost:3000/Manutencao/solicitacao/tecnico/${id_tecnico}`;

        // se quiser filtrar por solicitação específica
      

        const res = await fetch(url);

        if (!res.ok) throw new Error("Erro na API");

        const data = await res.json();
        const lista = Array.isArray(data) ? data : [data];

        if (!lista.length) {
            content.innerHTML = `<div class="loading">Nenhuma solicitação encontrada</div>`;
            return;
        }

        content.className = "grid";

        content.innerHTML = lista.map(item => `
            <div class="my_card ${
                item.status_solicitacao === "cancelada"
                ? "card-cancelada"
                : item.status_solicitacao === "concluida"
                ? "card-concluida": "" }">

                <div class="title">
                    Minhas Manutenções #${item.id_solicitacao ?? "-"}
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

                <div class="row">
                    <span>Técnico</span>
                    <span class="value">${item.nome_tecnico      ?? "-"}</span>
                </div>

                ${(item.status_solicitacao === "aberta" || item.status_solicitacao === "em andamento") ? `
                    <button onclick="abrirModalChamado(${item.id_solicitacao})" class="btn-atribuir">
                        ✅ Marcar como concluído
                    </button>
                
                    <button onclick="marcar_cancelada(${item.id_solicitacao})" class="btn-atribuir">
                        ❌ Marcar como cancelada
                    </button>
                ` : `
                    <button class="btn-atribuir" disabled style="opacity:0.5; cursor:not-allowed;">
                        🔒 Finalizada
                    </button>
                `}

            </div>
        `).join("");

    } catch (err) {
        content.innerHTML = `<div class="error">${err.message}</div>`;
    }
}

/* =========================
   MODAL CHAMADO
========================= */

function abrirModalChamado(id_solicitacao) {

    solicitacaoAtual = id_solicitacao;

    document.getElementById("modalEncerrar").style.display = "flex";

    document.getElementById("solucao").value = "";

    document.getElementById("contadorCaracteres").innerText = "0";
}

function fecharModalChamado() {
    document.getElementById("modalEncerrar").style.display = "none";
}

/* CONTADOR */
document.addEventListener("input", function(e) {

    if (e.target.id === "solucao") {

        document.getElementById("contadorCaracteres").innerText =
            e.target.value.length;
    }
});


/* FINALIZAR CHAMADO */
async function encerrarChamado() {

    try {

        const id_tecnico = JSON.parse(localStorage.getItem("id_usuario"));

        const solucao = document
            .getElementById("solucao")
            .value
            .trim();

        if (solucao.length < 10) {
            alert("Descreva melhor a solução.");
            return;
        }

        const res = await fetch(
            `http://localhost:3000/Manutencao/solicitacao/concluir/${solicitacaoAtual}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    id_tecnico: id_tecnico,
                    status_solicitacao: "concluida",
                    solucao: solucao
                })
            }
        );

        if (!res.ok) {
            throw new Error("Erro ao encerrar chamado");
        }

        alert("Chamado concluído!");

        fecharModalChamado();

        minhas_manutencoes();

    } catch (err) {

        console.error(err);

        alert(err.message);
    }
}