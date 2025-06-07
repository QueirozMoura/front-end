const baseUrl = 'https://tabela-aposta.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  const tabelaBody = document.querySelector('#tabela-jogos tbody');
  const btnAtualizar = document.getElementById('atualizar');

  btnAtualizar.addEventListener('click', () => {
    carregarOdds();
  });

  async function carregarOdds() {
    tabelaBody.innerHTML = '';

    try {
      const res = await axios.get(`${baseUrl}/api/odds/futebol`);
      const jogos = res.data;

      console.log('Jogos recebidos:', jogos);

      if (!jogos.length) {
        tabelaBody.innerHTML = '<tr><td colspan="7">Nenhum jogo encontrado.</td></tr>';
        return;
      }

      for (const jogo of jogos) {
        for (const casaAposta of jogo.odds) {
          const maiorOdd = Math.max(
            casaAposta.home ?? 0,
            casaAposta.draw ?? 0,
            casaAposta.away ?? 0
          );

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${jogo.home_team} x ${jogo.away_team}</td>
            <td>${casaAposta.casa}</td>
            <td class="${casaAposta.home === maiorOdd ? 'maior-odd' : ''}">${casaAposta.home ?? '-'}</td>
            <td class="${casaAposta.draw === maiorOdd ? 'maior-odd' : ''}">${casaAposta.draw ?? '-'}</td>
            <td class="${casaAposta.away === maiorOdd ? 'maior-odd' : ''}">${casaAposta.away ?? '-'}</td>
            <td>${casaAposta.over ?? '-'}</td>
            <td>${casaAposta.under ?? '-'}</td>
          `;
          tabelaBody.appendChild(tr);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar odds:', error);
      tabelaBody.innerHTML = '<tr><td colspan="7">Erro ao carregar dados.</td></tr>';
    }
  }

  carregarOdds();
});
