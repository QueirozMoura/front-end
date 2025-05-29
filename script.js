const baseUrl = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000'
  : 'https://tabela-aposta.onrender.com';

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

      if (!jogos || jogos.length === 0) {
        tabelaBody.innerHTML = `<tr><td colspan="10">Nenhum jogo encontrado.</td></tr>`;
        return;
      }

      for (const jogo of jogos) {
        for (const casaAposta of jogo.odds) {
          const extras = await buscarOddsExtras(jogo.timeCasa, jogo.timeFora, jogo.data);

          const oddCasa = parseFloat(casaAposta.h2h?.home ?? 0);
          const oddEmpate = parseFloat(casaAposta.h2h?.draw ?? 0);
          const oddFora = parseFloat(casaAposta.h2h?.away ?? 0);

          const maiorOdd = Math.max(oddCasa, oddEmpate, oddFora);

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${jogo.timeCasa} x ${jogo.timeFora}</td>
            <td class="${oddCasa === maiorOdd ? 'maior-odd' : ''}">${casaAposta.casa || '-'}</td>
            <td class="${oddCasa === maiorOdd ? 'maior-odd' : ''}">${oddCasa || '-'}</td>
            <td class="${oddEmpate === maiorOdd ? 'maior-odd' : ''}">${oddEmpate || '-'}</td>
            <td class="${oddFora === maiorOdd ? 'maior-odd' : ''}">${oddFora || '-'}</td>
            <td>${casaAposta.over ?? '-'}</td>
            <td>${casaAposta.under ?? '-'}</td>
            <td>${extras?.['Casa/Casa'] ?? '-'}</td>
            <td>${extras?.['Casa/Empate'] ?? '-'}</td>
            <td>${extras?.['Casa/Fora'] ?? '-'}</td>
            <td>${extras?.['Empate/Casa'] ?? '-'}</td>
          `;

          tabelaBody.appendChild(tr);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar odds:', error);
      tabelaBody.innerHTML = `<tr><td colspan="10">Erro ao carregar dados.</td></tr>`;
    }
  }

  async function buscarOddsExtras(timeCasa, timeFora, data) {
    try {
      const res = await axios.get(`${baseUrl}/api/odds-extras/htft`, {
        params: { timeCasa, timeFora, data }
      });
      return res.data;
    } catch (error) {
      console.warn('Odds extras indisponíveis:', error.response?.data ?? error.message);
      return {};
    }
  }

  // Carrega automaticamente ao iniciar
  carregarOdds();
});
