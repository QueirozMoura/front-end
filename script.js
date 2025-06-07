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

      console.log('Jogos recebidos no frontend:', jogos);

      if (!jogos || jogos.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="10">Nenhum jogo encontrado.</td></tr>';
        return;
      }

      for (const jogo of jogos) {
        if (!jogo.odds || jogo.odds.length === 0) {
          // Caso não tenha odds pra nenhuma casa, exibe mensagem
          const trSemOdds = document.createElement('tr');
          trSemOdds.innerHTML = `<td colspan="10">Sem odds disponíveis para ${jogo.home_team} x ${jogo.away_team}</td>`;
          tabelaBody.appendChild(trSemOdds);
          continue;
        }

        for (const casaAposta of jogo.odds) {
          // Use os nomes corretos (home, draw, away) para pegar odds
          const oddCasa = parseFloat(casaAposta.home ?? 0);
          const oddEmpate = parseFloat(casaAposta.draw ?? 0);
          const oddFora = parseFloat(casaAposta.away ?? 0);

          // buscarOddsExtras pode ser omitido se não tiver endpoint /api/odds-extras/htft
          // Aqui, só para manter, mas você pode comentar se não usa:
          const extras = await buscarOddsExtras(jogo.home_team, jogo.away_team, jogo.commence_time);

          const maiorOdd = Math.max(oddCasa, oddEmpate, oddFora);

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${jogo.home_team} x ${jogo.away_team}</td>
            <td>${casaAposta.casa}</td>
            <td class="${oddCasa === maiorOdd ? 'maior-odd' : ''}">${oddCasa || '-'}</td>
            <td class="${oddEmpate === maiorOdd ? 'maior-odd' : ''}">${oddEmpate || '-'}</td>
            <td class="${oddFora === maiorOdd ? 'maior-odd' : ''}">${oddFora || '-'}</td>
            <td>${casaAposta.over ?? '-'}</td>
            <td>${casaAposta.under ?? '-'}</td>
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
      tabelaBody.innerHTML = '<tr><td colspan="10">Erro ao carregar os dados.</td></tr>';
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
