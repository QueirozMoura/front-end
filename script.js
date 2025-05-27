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
        for (const casaAposta of jogo.odds) {
          const oddCasa = parseFloat(casaAposta.h2h?.home ?? 0);
          const oddEmpate = parseFloat(casaAposta.h2h?.draw ?? 0);
          const oddFora = parseFloat(casaAposta.h2h?.away ?? 0);

          // Determina a maior odd
          const maiorOdd = Math.max(oddCasa, oddEmpate, oddFora);

          const tr = document.createElement('tr');

          tr.innerHTML = `
            <td>${jogo.timeCasa} x ${jogo.timeFora}</td>
            <td class="${oddCasa === maiorOdd ? 'maior-odd' : ''}">${oddCasa || '-'}</td>
            <td class="${oddEmpate === maiorOdd ? 'maior-odd' : ''}">${oddEmpate || '-'}</td>
            <td class="${oddFora === maiorOdd ? 'maior-odd' : ''}">${oddFora || '-'}</td>
            <td>${casaAposta.over ?? '-'}</td>
            <td>${casaAposta.under ?? '-'}</td>
            <td>-</td> <!-- sem odds extras -->
            <td>-</td>
            <td>-</td>
            <td>-</td>
          `;

          tabelaBody.appendChild(tr);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar odds:', error);
    }
  }

  // Carrega odds ao abrir a página
  carregarOdds();
});
