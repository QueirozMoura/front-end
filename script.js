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
      const jogos = res.data;

      if (!jogos || jogos.length === 0) {
        tabelaBody.innerHTML = `<tr><td colspan="6">Nenhum jogo encontrado.</td></tr>`;
        return;
      }

      for (const jogo of jogos) {
        for (const casaAposta of jogo.odds) {
          // Odds principais H2H
          const oddCasa = parseFloat(casaAposta.h2h?.home ?? 0);
          const oddEmpate = parseFloat(casaAposta.h2h?.draw ?? 0);
          const oddFora = parseFloat(casaAposta.h2h?.away ?? 0);

          // Odds Over/Under 2.5 gols estão dentro de casaAposta.totals
          const oddOver = parseFloat(casaAposta.totals?.over ?? '-');
          const oddUnder = parseFloat(casaAposta.totals?.under ?? '-');

          // Determinar a maior odd entre Casa, Empate e Fora
          const maiorOdd = Math.max(oddCasa, oddEmpate, oddFora);

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${jogo.timeCasa} x ${jogo.timeFora}</td>
            <td class="${oddCasa === maiorOdd ? 'maior-odd' : ''}">${oddCasa > 0 ? oddCasa.toFixed(2) : '-'}</td>
            <td class="${oddEmpate === maiorOdd ? 'maior-odd' : ''}">${oddEmpate > 0 ? oddEmpate.toFixed(2) : '-'}</td>
            <td class="${oddFora === maiorOdd ? 'maior-odd' : ''}">${oddFora > 0 ? oddFora.toFixed(2) : '-'}</td>
            <td>${!isNaN(oddOver) ? oddOver.toFixed(2) : '-'}</td>
            <td>${!isNaN(oddUnder) ? oddUnder.toFixed(2) : '-'}</td>
          `;

          tabelaBody.appendChild(tr);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar odds:', error);
      tabelaBody.innerHTML = `<tr><td colspan="6">Erro ao carregar dados.</td></tr>`;
    }
  }

  // Carrega automaticamente ao iniciar
  carregarOdds();
});
