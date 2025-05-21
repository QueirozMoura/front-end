document.addEventListener('DOMContentLoaded', () => {
  const tabela = document.getElementById('tabela-jogos').getElementsByTagName('tbody')[0];
  const btnAtualizar = document.getElementById('atualizar');

  const casasPermitidas = ['Betano', 'KTO', 'Pinnacle', 'Bet365', 'Superbet'];

  async function buscarOdds() {
    try {
      const response = await fetch('https://tabela-aposta.onrender.com/api/odds/futebol');
      if (!response.ok) throw new Error('Erro ao buscar dados');

      const dados = await response.json();
      tabela.innerHTML = '';

      if (!dados || dados.length === 0) {
        tabela.innerHTML = `<tr><td colspan="16">Nenhum dado disponível</td></tr>`;
        return;
      }

      dados.forEach(jogo => {
        const nomeJogo = jogo.jogo;

        jogo.odds.forEach(casa => {
          if (!casasPermitidas.includes(casa.casa)) return;

          const tr = document.createElement('tr');

          // Nome do jogo
          const tdJogo = document.createElement('td');
          tdJogo.textContent = nomeJogo;

          // Odds 1X2 (h2h)
          const tdCasa = document.createElement('td');
          tdCasa.textContent = casa.h2h?.home ?? '-';

          const tdEmpate = document.createElement('td');
          tdEmpate.textContent = casa.h2h?.draw ?? '-';

          const tdFora = document.createElement('td');
          tdFora.textContent = casa.h2h?.away ?? '-';

          // Odds Mais/Menos 2.5 gols
          const tdMais25 = document.createElement('td');
          const tdMenos25 = document.createElement('td');

          // Over
          if (typeof casa.over?.price === 'number') {
            let valor = casa.over.price.toFixed(2);

            // TESTE: força a exibição de uma odd maior que 2.5 para você ver a cor
            if (casa.over.price < 2.5) {
              valor = '2.60'; // força o valor
              tdMais25.style.backgroundColor = 'lightgreen';
            } else {
              tdMais25.style.backgroundColor = 'lightgreen';
            }

            tdMais25.textContent = valor;
          } else {
            tdMais25.textContent = '-';
          }

          // Under
          if (typeof casa.under?.price === 'number') {
            const valor = casa.under.price.toFixed(2);
            tdMenos25.textContent = valor;
            tdMenos25.style.backgroundColor = casa.under.price >= 2.5 ? 'lightgreen' : 'lightcoral';
          } else {
            tdMenos25.textContent = '-';
          }

          // Colunas extras
          const colunasExtras = 9;
          const colunasFaltando = Array.from({ length: colunasExtras }, () => {
            const td = document.createElement('td');
            td.textContent = '-';
            return td;
          });

          tr.appendChild(tdJogo);
          tr.appendChild(tdCasa);
          tr.appendChild(tdEmpate);
          tr.appendChild(tdFora);
          tr.appendChild(tdMais25);
          tr.appendChild(tdMenos25);
          colunasFaltando.forEach(td => tr.appendChild(td));

          tabela.appendChild(tr);
        });
      });

    } catch (error) {
      console.error('Erro ao buscar odds:', error);
      tabela.innerHTML = `<tr><td colspan="16">Erro ao carregar os dados</td></tr>`;
    }
  }

  btnAtualizar.addEventListener('click', buscarOdds);
  buscarOdds();
});
