document.addEventListener("DOMContentLoaded", async function () {
  const highlightsContainer = document.getElementById("highlights");
  const mostWatchedContainer = document.getElementById("mostWatched");
  const topRatedContainer = document.getElementById("topRated");

  let filmes = [];
  try {
    const res = await fetch("http://localhost:5500/api/filmes");
    filmes = await res.json();
  } catch (err) {
    console.error(err);
    highlightsContainer.innerHTML = "<p class='text-muted'>Erro ao carregar filmes.</p>";
    mostWatchedContainer.innerHTML = "<p class='text-muted'>Erro ao carregar filmes.</p>";
    topRatedContainer.innerHTML = "<p class='text-muted'>Erro ao carregar filmes.</p>";
    return;
  }

  if (filmes.length === 0) {
    const emptyMessage = "<p class='text-muted'>Nenhum filme disponível.</p>";
    highlightsContainer.innerHTML = emptyMessage;
    mostWatchedContainer.innerHTML = emptyMessage;
    topRatedContainer.innerHTML = emptyMessage;
    return;
  }

  const destaques = filmes.slice(0, 10);
  renderFilmes(destaques, highlightsContainer);

  const maisVistos = shuffleArray([...filmes]).slice(0, Math.min(10, filmes.length));
  renderFilmes(maisVistos, mostWatchedContainer);

  const melhorAvaliados = filmes
    .filter(f => f.nota)
    .sort((a, b) => b.nota - a.nota)
    .slice(0, 10);
  renderFilmes(melhorAvaliados, topRatedContainer);

  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    localStorage.setItem("searchQuery", query);
    window.location.href = "search.html";
  });
});

function renderFilmes(lista, container) {
  container.innerHTML = "";
  lista.forEach(filme => {
    const card = document.createElement("div");
    card.className = "card mb-3";

    card.innerHTML = `
      <img src="${filme.imagem || "https://via.placeholder.com/400x200?text=Sem+Imagem"}" class="card-img-top" alt="${filme.nome}">
      <div class="card-body">
        <h5 class="card-title">${filme.nome}</h5>
        <p class="card-text"><strong>Diretor:</strong> ${filme.diretor}</p>
        <p class="card-text"><strong>Gênero:</strong> ${filme.genero}</p>
        <p class="card-text"><strong>Nota:</strong> ${filme.nota || "N/A"}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function toggleAside() {
  const aside = document.getElementById("aside");
  aside.classList.add("active");
}

function fecharAside() {
  const aside = document.getElementById("aside");
  aside.classList.remove("active");
}
