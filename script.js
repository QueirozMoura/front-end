const baseUrl = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000'
  : 'https://tabela-aposta.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  const tabelaBody = document.querySelector('#tabela-jogos tbody');
  const btnAtualizar = document.getElementById('atualizar');

  btnAtualizar.addEventListener('click', carregarOdds);

  async function carregarOdds() {
    tabelaBody.innerHTML = ''; // limpa a tabela

    try {
      const res = await axios.get(`${baseUrl}/api/odds/futebol`);
      console.log('Resposta da API:', res);
      const jogos = res.data;

      if (!Array.isArray(jogos) || jogos.length === 0) {
        tabelaBody.innerHTML = `<tr><td colspan="7">Nenhum jogo encontrado.</td></tr>`;
        return;
      }

      for (const jogo of jogos) {
        if (!Array.isArray(jogo.odds) || jogo.odds.length === 0) {
          tabelaBody.innerHTML += `<tr><td colspan="7">Nenhuma casa de aposta disponível para o jogo ${jogo.home_team} x ${jogo.away_team}</td></tr>`;
          continue;
        }

        for (const casaAposta of jogo.odds) {
          const oddCasa = casaAposta.h2h && !isNaN(parseFloat(casaAposta.h2h.home)) ? parseFloat(casaAposta.h2h.home) : 0;
          const oddEmpate = casaAposta.h2h && !isNaN(parseFloat(casaAposta.h2h.draw)) ? parseFloat(casaAposta.h2h.draw) : 0;
          const oddFora = casaAposta.h2h && !isNaN(parseFloat(casaAposta.h2h.away)) ? parseFloat(casaAposta.h2h.away) : 0;

          const oddOver = typeof casaAposta.over === 'number' ? casaAposta.over : '-';
          const oddUnder = typeof casaAposta.under === 'number' ? casaAposta.under : '-';

          const maiorOdd = Math.max(oddCasa, oddEmpate, oddFora);

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${jogo.home_team} x ${jogo.away_team}</td>
            <td>${casaAposta.casa}</td>
            <td class="${oddCasa === maiorOdd && maiorOdd > 0 ? 'maior-odd' : ''}">${oddCasa > 0 ? oddCasa.toFixed(2) : '-'}</td>
            <td class="${oddEmpate === maiorOdd && maiorOdd > 0 ? 'maior-odd' : ''}">${oddEmpate > 0 ? oddEmpate.toFixed(2) : '-'}</td>
            <td class="${oddFora === maiorOdd && maiorOdd > 0 ? 'maior-odd' : ''}">${oddFora > 0 ? oddFora.toFixed(2) : '-'}</td>
            <td>${typeof oddOver === 'number' ? oddOver.toFixed(2) : oddOver}</td>
            <td>${typeof oddUnder === 'number' ? oddUnder.toFixed(2) : oddUnder}</td>
          `;
          tabelaBody.appendChild(tr);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar odds:', error);
      tabelaBody.innerHTML = `<tr><td colspan="7">Erro ao carregar dados. Veja o console para mais detalhes.</td></tr>`;
    }
  }

  carregarOdds();
});
