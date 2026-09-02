# Liberação Caixa — Casa Newton (Gran Park Toscana)

Painel de acompanhamento financeiro da obra: liberação CAIXA (PCI/PLS),
contas a pagar quinzenais, curva S do empreiteiro x do banco, saldo de
recurso próprio e extratos de composição de cada número.

Aplicação de arquivo único: todo o HTML, CSS, JavaScript e os dados estão
dentro de `index.html`. Não há build, dependências nem servidor.

## Publicar no GitHub Pages

1. Crie um repositório novo (pode ser público) na sua conta.
2. Envie o arquivo `index.html` (e este README, se quiser) para a raiz do
   repositório — dá para arrastar pela própria interface do GitHub em
   **Add file → Upload files**.
3. No repositório, abra **Settings → Pages**.
4. Em **Source**, escolha **Deploy from a branch**; em **Branch**, escolha
   `main` e a pasta `/ (root)`. Salve.
5. Em um ou dois minutos o endereço fica no ar:
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

Esse endereço é público: qualquer pessoa com o link abre, sem login.

## Modo somente leitura

Nesta versão publicada o painel abre em **somente leitura**: navegação,
filtros, seleções, gráficos e extratos funcionam normalmente, mas não é
possível inserir ou editar lançamentos. O salvamento automático depende do
ambiente do Claude e não existe fora dele.

Os dados exibidos são os que estavam embutidos no arquivo no momento da
exportação. Para atualizar o site, exporte uma cópia nova pelo painel
(**Parâmetros → Salvar cópia local**), renomeie o arquivo para `index.html`
e substitua o do repositório.

## Instalar no celular

Abrindo o endereço direto no navegador do celular, o painel pode ir para a
tela inicial como aplicativo: no iPhone, Compartilhar → "Adicionar à Tela de
Início"; no Android, menu ⋮ → "Instalar app". O ícone é gerado pelo próprio
app.
