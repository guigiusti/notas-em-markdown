# Notas em Markdown

Aplitativo Web para anotações em Markdown. Salvo localmente em seu próprio navegador, permitindo a criação de vários arquivos. Contém funções de editar o texto em Markdown, exibir em HTML e baixar o arquivo em md e em pdf.

### [DEMO](https://guigiusti.com/NotasEmMarkdown/)
## Tecnologias

- Feito em HTML, CSS e Javascript.
- Utiliza o banco de dados IndexedDB, do próprio navegador, para salvar localmente.
- [Marked](https://github.com/markedjs/marked) para converter e exibir o Markdown em HTML.
- [jsPDF](https://github.com/parallax/jsPDF) para converter o HTML exibido em PDF.
- E requisições do jsPDF como [html2canvas](https://github.com/niklasvh/html2canvas) e [DOMPurify](https://github.com/cure53/DOMPurify).
