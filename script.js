const baseUrl = 'https://tabela-aposta.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  const tabelaBody = document.querySelector('#tabela-jogos tbody');
  const btnAtualizar = document.getElementById('atualizar');

  btnAtualizar.addEventListener('click', () => {
    carregarOdds();
  });

  async function carregarOdds() {
    tabelaBody.innerHTML = ''; // limpa a tabela

    try {
      const res = await axios.get(`${baseUrl}/api/odds/futebol`);
      const jogos = res.data;

      for (const jogo of jogos) {
        // Cada jogo tem um array de odds por casa de aposta
        for (const casaAposta of jogo.odds) {
          // Odds 1X2
          const oddCasa = parseFloat(casaAposta.home ?? 0);
          const oddEmpate = parseFloat(casaAposta.draw ?? 0);
          const oddFora = parseFloat(casaAposta.away ?? 0);

          // Odds Over/Under
          const oddOver = casaAposta.over ?? '-';
          const oddUnder = casaAposta.under ?? '-';

          // Buscar odds extras (half time/full time) via API, se disponível
          const extras = await buscarOddsExtras(jogo.home_team, jogo.away_team, jogo.commence_time);

          // Identifica a maior odd entre 1X2 para destaque
          const maiorOdd = Math.max(oddCasa, oddEmpate, oddFora);

          const tr = document.createElement('tr');

          tr.innerHTML = `
            <td>${jogo.home_team} x ${jogo.away_team}</td>
            <td>${casaAposta.casa}</td>
            <td class="${oddCasa === maiorOdd ? 'maior-odd' : ''}">${oddCasa || '-'}</td>
            <td class="${oddEmpate === maiorOdd ? 'maior-odd' : ''}">${oddEmpate || '-'}</td>
            <td class="${oddFora === maiorOdd ? 'maior-odd' : ''}">${oddFora || '-'}</td>
            <td>${oddOver}</td>
            <td>${oddUnder}</td>
            <td>${extras['Casa/Casa'] ?? '-'}</td>
            <td>${extras['Casa/Empate'] ?? '-'}</td>
            <td>${extras['Casa/Fora'] ?? '-'}</td>
            <td>${extras['Empate/Casa'] ?? '-'}</td>
          `;

          tabelaBody.appendChild(tr);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar odds:', error);
    }
  }

  async function buscarOddsExtras(timeCasa, timeFora, data) {
    try {
      const res = await axios.get(`${baseUrl}/api/odds-extras/htft`, {
        params: { timeCasa, timeFora, data }
      });
      return res.data;
    } catch (error) {
      console.error('Erro ao buscar odds extras:', error.response?.data ?? error.message);
      return {};
    }
  }

  // Carrega odds ao abrir a página
  carregarOdds();
});
