# Verificação de scroll da aba Porção

Data: 2026-08-17

A aba **Porção** foi aberta diretamente no navegador automatizado após a correção de CSS. A avaliação retornou `documentScrollWidth = 1366` e `bodyScrollWidth = 1366` para `viewportWidth = 1366`, portanto não há overflow horizontal global na página. Os únicos elementos listados como maiores que o próprio `clientWidth` foram `SPAN`/`STRONG` com `clientWidth = 0`, associados a elementos colapsados de layout, não a um contêiner rolável da página.

A correção aplicada concentra a rolagem horizontal apenas nos filtros da Porção, com `overflow-y: hidden`, `touch-action: pan-x`, `scrollbar-width: none`, `min-width: 0` nos contêineres e remoção de overflow horizontal do restante da página.

Também foram capturadas screenshots completas da aba Porção em desktop e mobile (390×844). O layout permanece em uma coluna no mobile, os filtros mantêm rolagem horizontal isolada e a página não cria overflow horizontal global.
