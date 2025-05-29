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
        tabelaBody.innerHTML = `<tr><td colspan="6">Nenhum jogo encontrado.</td></tr>`;
        return;
      }

      for (const jogo of jogos) {
        // A API traz várias casas de apostas, vamos iterar sobre cada uma:
        for (const casaAposta of jogo.odds) {
          const oddCasa = parseFloat(casaAposta.h2h?.home ?? 0);
          const oddEmpate = parseFloat(casaAposta.h2h?.draw ?? 0);
          const oddFora = parseFloat(casaAposta.h2h?.away ?? 0);

          // Odds over/under 2.5 gols (pode estar em outro mercado, mas aqui supondo o formato simples)
          const oddMais25 = parseFloat(casaAposta.over ?? 0);
          const oddMenos25 = parseFloat(casaAposta.under ?? 0);

          const maiorOdd = Math.max(oddCasa, oddEmpate, oddFora);

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${jogo.timeCasa} x ${jogo.timeFora}</td>
            <td class="${oddCasa === maiorOdd ? 'maior-odd' : ''}">${oddCasa || '-'}</td>
            <td class="${oddEmpate === maiorOdd ? 'maior-odd' : ''}">${oddEmpate || '-'}</td>
            <td class="${oddFora === maiorOdd ? 'maior-odd' : ''}">${oddFora || '-'}</td>
            <td>${oddMais25 || '-'}</td>
            <td>${oddMenos25 || '-'}</td>
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
