function exportTableToExcel() {
  const table = document.getElementById("tabela-jogos");
  if (!table) {
    alert('Tabela não encontrada para exportação!');
    return;
  }

  const html = table.outerHTML;

  // Cria um blob com o conteúdo da tabela e o tipo para Excel
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });

  // Cria URL para o blob
  const url = URL.createObjectURL(blob);

  // Cria link temporário para download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tabela_odds.xls';

  document.body.appendChild(a);
  a.click();

  // Remove o link temporário e revoga a URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
