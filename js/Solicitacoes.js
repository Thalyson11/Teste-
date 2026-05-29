const API_URL = "http://localhost:3000/Manutencao/solicitacao/teste";

async function listarsolicitacoes() {

    const res = await fetch(API_URL);
    const solicitacoes = await res.json();

    const tabela = document.getElementById("tabelasolicitacoes");
    tabela.innerHTML = "";

    // função para tratar null/undefined/vazio
    const tratar = (valor) => {
        return (valor === null || valor === undefined || valor === "") ? "------" : valor;
    };

    solicitacoes.forEach(s => {

        tabela.innerHTML += `
        <tr>
            <td>${tratar(s.id_solicitacao)}</td>
            <td>${tratar(s.nome_solicitante)}</td>    
            <td>${tratar(s.tipo_manutencao)}</td>
            <td>${tratar(s.descricao)}</td> 
            <td>${tratar(s.prioridade)}</td> 
            <td>${tratar(s.status_solicitacao)}</td>
            <td>${tratar(s.nome_tecnico)}</td>
           <td>
                ${s.status_solicitacao === "concluida"
                ? `
            <button class="btn-olho"
                onclick="abrirModalSolucao(
                    '${tratar(s.solucao)}',
                    '${tratar(s.data_conclusao)}'
                )">
                👁
            </button>
          `
                :  `
                <button class="btn-olho-desabilitado">
                    👁
                </button>
              `
            }
            </td>
            <td>
                <button onclick="abrirEditar(
                    ${s.id_solicitacao},
                    ${s.id_solicitante},
                    '${tratar(s.tipo_manutencao)}',
                    '${tratar(s.descricao)}',
                    '${tratar(s.prioridade)}',
                    '${tratar(s.status_solicitacao)}'
                )">Editar</button>

                <button onclick="excluir(${s.id_solicitacao})">Excluir</button>
            </td>
        </tr>`;
    });
}
listarsolicitacoes()

async function adicionarsolicitacoes() {
    const id_solicitante = document.getElementById("solicitanteAdd").value;
    const tipo_manutencao = document.getElementById("tipoAdd").value;
    const descricao = document.getElementById("descricaoAdd").value;
    const prioridade = document.getElementById("prioridadeAdd").value;
    const status_solicitacao = document.getElementById("statusAdd").value;
    const id_tecnico = document.getElementById("tecnicoAdd").value || null; /* Se nao vim preenchido prencher com nulo*/



    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_solicitante, tipo_manutencao, descricao, prioridade, status_solicitacao, id_tecnico })
    });
    console.log(id_solicitante, tipo_manutencao, descricao, prioridade, status_solicitacao);
    fecharModal("modalAdicionar");
    alert("Adicionado com sucesso");
    listarsolicitacoes();


}
listarsolicitacoes();


async function excluir(id) {
    if (!confirm('Deseja realmente excluir?')) return
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
    alert("Excluido com sucesso");
    listarsolicitacoes();
};



async function buscarPorIDAluno(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "GET"
    }
    )
};
listarsolicitacoes();


function abrirModalAdicionar() {
    document.getElementById("modalAdicionar").style.display = "flex";
}

function fecharModal(id_solicitacao) {
    document.getElementById(id_solicitacao).style.display = "none";
}

function abrirEditar(id_solicitacao, id_solicitante, tipo_manutencao, descricao, prioridade, status_solicitacao) {
    document.getElementById("idEdit").value = id_solicitacao;
    document.getElementById("solicitanteAdd").value = id_solicitante;
    document.getElementById("tipoEdit").value = tipo_manutencao;
    document.getElementById("descricaoEdit").value = descricao;
    document.getElementById("prioridadeEdit").value = prioridade;
    document.getElementById("statusEdit").value = status_solicitacao;
    document.getElementById("modalEditar").style.display = "flex";
    carregarSolicitantes('solicitante', 'solicitanteEdit')
    carregarSolicitantes('gestor', 'solicitanteEdit')
    carregarSolicitantes('manutentor', 'tecnicoEdit')
}



async function editarsolicitacoes() {
    const id = document.getElementById("idEdit").value;
    const id_solicitante = document.getElementById("solicitanteEdit").value;
    const tipo_manutencao = document.getElementById("tipoEdit").value;
    const descricao = document.getElementById("descricaoEdit").value;
    const prioridade = document.getElementById("prioridadeEdit").value;
    const status_solicitacao = document.getElementById("statusEdit").value

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ id, id_solicitante, tipo_manutencao, descricao, prioridade, status_solicitacao })
    });

    fecharModal("modalEditar");
    listarsolicitacoes();
}
listarsolicitacoes();


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
}
window.onload = carregarDadosUsuario;

async function carregarSolicitantes(tipo, selectId) {
    try {
        const response = await fetch(`http://localhost:3000/Manutencao/${tipo}`);
        const dados = await response.json();

        const select = document.getElementById(selectId);

        // cria controle interno no próprio select
        if (!select.dataset.iniciado) {
            select.innerHTML = `<option value="">Selecione</option>`;
            select.dataset.iniciado = "true";
        }

        dados.forEach(u => {
            // evita duplicar opções (caso chame mais de um tipo no mesmo select)
            const existe = [...select.options].some(opt => opt.value == u.id_usuario);

            if (!existe) {
                select.innerHTML += `
            <option value="${u.id_usuario}">
              ${u.nome}
            </option>
          `;
            }
        });

    } catch (error) {
        console.error("Erro ao carregar solicitantes:", error);
    }
}

/*Filtro*/

function toggleFiltro() {
    const menu = document.getElementById("menuFiltro");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function filtrar(status_solicitacao) {
    fetch(`http://localhost:3000/Manutencao/solicitacao/filtro/${status_solicitacao}`)
        .then(res => res.json())
        .then(data => {
            renderTabela(data);
        })
        .catch(err => console.error(err));
}



function renderTabela(data) {
    const tabela = document.getElementById("tabelasolicitacoes");
    tabela.innerHTML = "";

    const tratar = (valor) => {
        return (valor === null || valor === undefined || valor === "") ? "-" : valor;
    };

    data.forEach(item => {
        tabela.innerHTML += `
            <tr>
                <td>${tratar(item.id_solicitacao)}</td>
                <td>${tratar(item.nome_solicitante)}</td>
                <td>${tratar(item.tipo_manutencao)}</td>
                <td>${tratar(item.descricao)}</td>
                <td>${tratar(item.prioridade)}</td>
                <td>${tratar(item.status_solicitacao)}</td>
                <td>${tratar(item.nome_tecnico)}</td>
                <td>
                    ${item.status_solicitacao === "concluida"
                        ? `
                            <button class="btn-olho"
                                onclick="abrirModalSolucao(
                                    '${tratar(item.solucao)}',
                                    '${tratar(item.data_conclusao)}'
                                )">
                                👁
                            </button>
                          `
                        : `
                            <button class="btn-olho-desabilitado">
                                👁
                            </button>
                          `
                    }
                </td>
                <td>
                    <button onclick="abrirEditar(
                        ${item.id_solicitacao},
                        ${item.id_solicitante},
                        '${tratar(item.tipo_manutencao)}',
                        '${tratar(item.descricao)}',
                        '${tratar(item.prioridade)}',
                        '${tratar(item.status_solicitacao)}'
                    )">Editar</button>
                    <button onclick="excluir(${item.id_solicitacao})">Excluir</button>
                </td>
            </tr>
        `;
    });
}
document.addEventListener("click", function (evento) {

    const menuFiltro = document.getElementById("menuFiltro");
    const botaoFiltro = document.querySelector(".filtro-btn");

    if (!menuFiltro || !botaoFiltro) return;

    const clicouNoBotao = botaoFiltro.contains(evento.target);
    const clicouNoMenu = menuFiltro.contains(evento.target);

    if (!clicouNoBotao && !clicouNoMenu) {
        menuFiltro.style.display = "none";
    }

});

function validarFormularioAdd() {

    const form = document.getElementById("formSolicitacaoAdd");
    console.log(form)
    if (form.reportValidity()) {
        adicionarsolicitacoes();
    }
}


function validarFormularioEdit() {

    const form = document.getElementById("formSolicitacaoEdit");

    if (form.reportValidity()) {
        editarsolicitacoes();
    }

}

function abrirModalSolucao(solucao, data) {

    document.getElementById("textoSolucao").innerText = solucao;
    document.getElementById("dataSolucao").innerText = data;

    document.getElementById("modalSolucao").style.display = "flex";
}