document.addEventListener("DOMContentLoaded", async () => {
  const resultsContainer = document.getElementById("results");
  const query = localStorage.getItem("searchQuery") || "";

  if (!query) {
    resultsContainer.innerHTML = `<p class="text-center text-muted fs-5">Por favor, faça uma busca válida.</p>`;
    return;
  }

  let filmes = [];
  try {
    const res = await fetch("http://localhost:5500/api/filmes");
    filmes = await res.json();
  } catch (err) {
    resultsContainer.innerHTML = "<p class='text-muted'>Erro ao carregar filmes.</p>";
    return;
  }

  function filmeCombina(filme, termo) {
    termo = termo.toLowerCase();
    return (
      filme.nome.toLowerCase().includes(termo) ||
      filme.diretor.toLowerCase().includes(termo) ||
      (filme.roteirista && filme.roteirista.toLowerCase().includes(termo)) ||
      filme.genero.toLowerCase().includes(termo) ||
      filme.classificacao.toLowerCase().includes(termo) ||
      (filme.atores && filme.atores.some(ator => ator.toLowerCase().includes(termo))) ||
      (filme.sinopse && filme.sinopse.toLowerCase().includes(termo))
    );
  }

  const resultados = filmes.filter(filme => filmeCombina(filme, query));

  if (resultados.length === 0) {
    resultsContainer.innerHTML = `<p class="text-center text-muted fs-5">Nenhum filme encontrado para: <strong>${query}</strong></p>`;
  } else {
    resultados.forEach(filme => {
      const col = document.createElement("div");
      col.classList.add("col-md-6", "col-lg-4");

      const card = document.createElement("div");
      card.classList.add("card", "movie-card", "h-100");

      card.innerHTML = `
        <img src="${filme.imagem || 'https://via.placeholder.com/400x250?text=Sem+Imagem'}" 
          class="card-img-top" alt="${filme.nome}" style="object-fit: cover; height: 250px; border-radius: 10px 10px 0 0;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${filme.nome}</h5>
          <p class="card-text mb-1"><strong>Diretor:</strong> ${filme.diretor}</p>
          <p class="card-text mb-1"><strong>Gênero:</strong> ${filme.genero}</p>
          <p class="card-text mb-1"><strong>Classificação:</strong> ${filme.classificacao}</p>
          <p class="card-text mb-1"><strong>Nota:</strong> ${filme.nota}</p>
          <p class="card-text flex-grow-1">${filme.sinopse || 'Sem sinopse disponível.'}</p>
        </div>
      `;

      col.appendChild(card);
      resultsContainer.appendChild(col);
    });
  }
});
