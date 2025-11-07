document.addEventListener("DOMContentLoaded", async () => {
  const filmeId = localStorage.getItem("selectedFilmId");
  if (!filmeId) {
    document.getElementById("filmeDetalhes").innerHTML = "<p>Filme não encontrado.</p>";
    return;
  }

  const user = JSON.parse(localStorage.getItem("isLoggedIn"));

  let filme;
  
  try {
    const res = await fetch(`http://localhost:5500/api/filmes/${filmeId}`);
    filme = await res.json();
    console.log(filme);
  } catch {
    document.getElementById("filmeDetalhes").innerHTML = "<p>Erro ao carregar filme.</p>";
    return;
  }

  document.getElementById("filmeDetalhes").innerHTML = `
    <div class="card">
      <img src="${filme.imagem || "https://via.placeholder.com/400x250"}" class="card-img-top">
      <div class="card-body">
        <h2>${filme.nome}</h2>
        <p><strong>Diretor:</strong> ${filme.diretor}</p>
        <p><strong>Gênero:</strong> ${filme.genero}</p>
        <p><strong>Classificação:</strong> ${filme.classificacao}</p>
        <p><strong>Nota média:</strong> ${filme.nota?.toFixed(1) || "N/A"}</p>
        <p>${filme.sinopse || "Sem sinopse."}</p>
      </div>
    </div>
  `;

  renderOpinioes(filme.opinioes);

  document.getElementById("formOpiniao").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Você precisa estar logado para opinar.");
      return;
    }

    const novaOpiniao = {
      usuario: user.username,
      comentario: document.getElementById("comentario").value.trim(),
      nota: Number(document.getElementById("nota").value)
    };

    if (!novaOpiniao.comentario || isNaN(novaOpiniao.nota)) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const res = await fetch(`http://localhost:5500/api/filmes/${filmeId}/opiniao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaOpiniao)
    });

    if (!res.ok) return alert("Erro ao salvar opinião.");
    alert("Opinião salva com sucesso!");
    location.reload();
  });
});

function renderOpinioes(opinioes) {
  const container = document.getElementById("listaOpinioes");
  if (!opinioes || opinioes.length === 0) {
    container.innerHTML = "<p>Seja o primeiro a opinar!</p>";
    return;
  }

  container.innerHTML = opinioes.map(o => `
    <div class="border rounded p-3 mb-2">
      <strong>${o.usuario}</strong> — Nota: ${o.nota}<br>
      <p>${o.comentario}</p>
    </div>
  `).join("");
}
