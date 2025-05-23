// URL base da sua API backend
const BASE_URL = 'http://localhost:3000';

// Função para formatar a data em YYYY-MM-DD (API-Football espera esse formato)
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Função para buscar as odds principais (H2H e Totals)
async function fetchOdds() {
  try {
    const response = await fetch(`${BASE_URL}/api/odds/futebol`);
    const jogos = await response.json();

    const tabela = document.getElementById('tabela-odds');
    tabela.innerHTML = ''; // limpa tabela antes de preencher

    for (const jogo of jogos) {
      // Para cada casa de apostas, vamos criar uma linha na tabela
      for (const casa of jogo.odds) {
        // Buscar odds extras do mercado HT/FT para preencher colunas extras
        const dataFormatada = formatDate(jogo.data);

        // Busca odds extras via API
        const oddsExtras = await fetch(
          `${BASE_URL}/api/odds-extras/htft?timeCasa=${encodeURIComponent(jogo.timeCasa)}&timeFora=${encodeURIComponent(jogo.timeFora)}&data=${dataFormatada}`
        ).then(res => res.json()).catch(() => ({}));

        // Criar linha da tabela
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${jogo.timeCasa}</td>
          <td>${jogo.timeFora}</td>
          <td>${new Date(jogo.data).toLocaleString()}</td>
          <td>${casa.casa}</td>
          <td>${casa.h2h?.home ?? '-'}</td>
          <td>${casa.h2h?.draw ?? '-'}</td>
          <td>${casa.h2h?.away ?? '-'}</td>
          <td>${casa.over ?? '-'}</td>
          <td>${casa.under ?? '-'}</td>
          <td>${oddsExtras['Casa/Casa'] ?? '-'}</td>
          <td>${oddsExtras['Casa/Empate'] ?? '-'}</td>
          <td>${oddsExtras['Casa/Fora'] ?? '-'}</td>
          <td>${oddsExtras['Empate/Casa'] ?? '-'}</td>
        `;

        tabela.appendChild(tr);
      }
    }
  } catch (error) {
    console.error('Erro ao buscar odds:', error);
  }
}

// Botão para atualizar tabela
document.getElementById('btn-atualizar').addEventListener('click', () => {
  fetchOdds();
});

// Carrega dados ao abrir a página
fetchOdds();
