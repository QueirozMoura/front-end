document.addEventListener('DOMContentLoaded', () => {
  const tabela = document.getElementById('tabela-jogos').getElementsByTagName('tbody')[0];
  const btnAtualizar = document.getElementById('atualizar');

  const casasPermitidas = ['Betano', 'KTO', 'Pinnacle', 'Bet365', 'Superbet'];

  async function buscarOdds() {
    try {
      const apiUrl =
        window.location.hostname === 'localhost'
          ? 'http://localhost:3000/api/odds/futebol'
          : 'https://tabela-aposta.onrender.com/api/odds/futebol';

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Erro ao buscar dados');

      const dados = await response.json();
      tabela.innerHTML = '';

      if (!dados || dados.length === 0) {
        tabela.innerHTML = `<tr><td colspan="16">Nenhum dado disponível</td></tr>`;
        return;
      }

      dados.forEach(jogo => {
        const nomeJogo = `${jogo.timeCasa} x ${jogo.timeFora}`;
        const campeonato = jogo.liga || '-';
        const data = jogo.data || '-';

        if (!jogo.odds || jogo.odds.length === 0) {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td colspan="16">${nomeJogo} - Sem odds disponíveis</td>`;
          tabela.appendChild(tr);
          return;
        }

        // Descobre qual casa tem maior odd em over/under
        let maiorOver = 0;
        let maiorUnder = 0;

        jogo.odds.forEach(casa => {
          if (!casasPermitidas.includes(casa.casa)) return;
          if (casa.over?.price > maiorOver) maiorOver = casa.over.price;
          if (casa.under?.price > maiorUnder) maiorUnder = casa.under.price;
        });

        jogo.odds.forEach(casa => {
          if (!casasPermitidas.includes(casa.casa)) return;

          const tr = document.createElement('tr');

          // Colunas iniciais
          tr.innerHTML += `<td>${nomeJogo}</td>`;
          tr.innerHTML += `<td>${campeonato}</td>`;
          tr.innerHTML += `<td>${data}</td>`;
          tr.innerHTML += `<td>${casa.casa}</td>`;

          // Odds Over 2.5
          const tdOver = document.createElement('td');
          if (casa.over && typeof casa.over.price === 'number') {
            tdOver.textContent = casa.over.price.toFixed(2);
            if (casa.over.price === maiorOver) {
              tdOver.style.backgroundColor = 'lightgreen';
            }
          } else {
            tdOver.textContent = '-';
          }

          // Odds Under 2.5
          const tdUnder = document.createElement('td');
          if (casa.under && typeof casa.under.price === 'number') {
            tdUnder.textContent = casa.under.price.toFixed(2);
            if (casa.under.price === maiorUnder) {
              tdUnder.style.backgroundColor = 'lightblue';
            }
          } else {
            tdUnder.textContent = '-';
          }

          tr.appendChild(tdOver);
          tr.appendChild(tdUnder);

          // Colunas extras para completar 16
          const colunasExtras = Array.from({ length: 10 }, () => {
            const td = document.createElement('td');
            td.textContent = '-';
            return td;
          });

          colunasExtras.forEach(td => tr.appendChild(td));
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
