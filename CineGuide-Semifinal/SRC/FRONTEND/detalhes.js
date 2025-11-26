document.addEventListener("DOMContentLoaded", async () => {
  const filmeId = localStorage.getItem("selectedFilmId");
  if (!filmeId) {
    document.getElementById("filmeDetalhes").innerHTML = "<p>Filme não encontrado.</p>";
    return;
  }

  const userString = localStorage.getItem("isLoggedIn");
  const user = userString ? JSON.parse(userString) : null;

  let filme;
  
  try {
    const res = await fetch(`http://localhost:5500/api/filmes/${filmeId}`);
    filme = await res.json();
  } catch {
    document.getElementById("filmeDetalhes").innerHTML = "<p>Erro ao carregar filme.</p>";
    return;
  }

  renderFilme(filme);
  renderOpinioes(filme.opinioes);

  document.getElementById("formOpiniao").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!user || !user.username) {
      alert("Você precisa estar logado para opinar.");
      return;
    }

    const notaInput = document.getElementById("nota");
    const comentarioInput = document.getElementById("comentario");

    const novaOpiniao = {
      usuario: user.username,
      comentario: comentarioInput.value.trim(),
      nota: Number(notaInput.value)
    };

    if (!novaOpiniao.comentario || isNaN(novaOpiniao.nota) || novaOpiniao.nota < 0 || novaOpiniao.nota > 10) {
      alert("Preencha todos os campos corretamente. Nota entre 0 e 10.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5500/api/filmes/${filmeId}/opiniao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaOpiniao)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro desconhecido ao salvar opinião.");
      }

      const data = await res.json();
      filme.opinioes = data.opinioes;
      filme.nota = data.novaMedia;

      renderFilme(filme);
      renderOpinioes(filme.opinioes);

      notaInput.value = '';
      comentarioInput.value = '';
      alert("Opinião salva com sucesso!");

    } catch (error) {
      console.error("Erro ao enviar opinião:", error.message);
      alert(`Erro ao salvar opinião: ${error.message}`);
    }
  });
});

function renderFilme(filme) {
  document.getElementById("filmeDetalhes").innerHTML = `
    <div class="card">
      <img src="${filme.imagem || "https://via.placeholder.com/400x250"}" class="card-img-top">
      <div class="card-body">
        <h2>${filme.nome}</h2>
        <p><strong>Diretor:</strong> ${filme.diretor}</p>
        <p><strong>Gênero:</strong> ${filme.genero}</p>
        <p><strong>Classificação:</strong> ${filme.classificacao}</p>
        <p><strong>Nota média:</strong> ${filme.nota || "N/A"}</p>
        <p>${filme.sinopse || "Sem sinopse."}</p>
      </div>
    </div>
  `;
}

function renderOpinioes(opinioes) {
  const container = document.getElementById("listaOpinioes");
  if (!opinioes || opinioes.length === 0) {
    container.innerHTML = "<p>Seja o primeiro a opinar!</p>";
    return;
  }

  container.innerHTML = opinioes.map(o => `
    <div class="border rounded p-3 mb-2">
      <strong>${o.usuario}</strong> — Nota: ${o.nota?.toFixed(1) || "S/N"}<br>
      <p>${o.comentario}</p>
    </div>
  `).join("");
}
