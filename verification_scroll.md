# Verificação de scroll da aba Porção

Data: 2026-08-17

A aba **Porção** foi aberta diretamente no navegador automatizado após a correção de CSS. A avaliação retornou `documentScrollWidth = 1366` e `bodyScrollWidth = 1366` para `viewportWidth = 1366`, portanto não há overflow horizontal global na página. Os únicos elementos listados como maiores que o próprio `clientWidth` foram `SPAN`/`STRONG` com `clientWidth = 0`, associados a elementos colapsados de layout, não a um contêiner rolável da página.

A correção aplicada concentra a rolagem horizontal apenas nos filtros da Porção, com `overflow-y: hidden`, `touch-action: pan-x`, `scrollbar-width: none`, `min-width: 0` nos contêineres e remoção de overflow horizontal do restante da página.

Também foram capturadas screenshots completas da aba Porção em desktop e mobile (390×844). O layout permanece em uma coluna no mobile, os filtros mantêm rolagem horizontal isolada e a página não cria overflow horizontal global.

## Validação adicional do preview gerenciado

O preview local foi reaberto após habilitar `server.allowedHosts: true`. A Home renderizou com sidebar, topbar e conteúdo do treino. A aba **Porção** foi aberta em viewport desktop e rolada até o fim; a segunda tentativa de rolagem retornou que o documento já estava no limite inferior, sem indicar um segundo contêiner vertical capturando o gesto.

Na captura desktop, as quatro receitas permaneceram alinhadas em duas colunas, o aviso **Segurança primeiro** ficou no fluxo normal da página e não foi observado scroll horizontal aninhado, camada translúcida instável ou deslocamento visível durante a rolagem.

Ainda é necessário repetir a inspeção nas abas Hoje, Calendário e Meu perfil em viewport desktop e mobile e validar a entrada/refresh da publicação pública depois que o build do GitHub Pages sair do estado `building`.

## Validação mobile adicional

Foi capturada uma screenshot full-page em `390×844` da aba **Hoje**. A navegação compacta, os cartões de treino, as cargas em kg e os cartões laterais foram reorganizados em uma coluna sem corte horizontal visível. A aba Calendário foi validada em desktop como um documento curto, sem contêiner vertical adicional; Meu perfil também permaneceu contido em uma única tela desktop.

A evidência mobile específica da aba Porção registrada acima permanece válida: uma coluna no mobile, filtros com rolagem horizontal isolada e ausência de overflow horizontal global. A confirmação equivalente para Calendário e Perfil em mobile fica como limite de validação visual desta rodada.

## Auditoria Playwright mobile

A sessão automatizada abriu o preview local e foi redimensionada para `390×844`. A página carregou com o título **PanoFlow — Personal Trainer** e sem erro de navegação; as métricas de largura/altura e as abas serão coletadas na etapa seguinte.

### Métricas Playwright mobile (`390×844`)

A auditoria automatizada percorreu Hoje, Calendário, Porção e Meu perfil. Em todas as quatro telas, `documentScrollWidth = 390`, `bodyScrollWidth = 390`, `viewportWidth = 390` e `bodyOverflowX = hidden`. As alturas de conteúdo foram, respectivamente, `2745`, `1143`, `2592` e `1125` pixels, confirmando que o conteúdo vertical existe no fluxo normal sem criar largura excedente.

### Métricas Playwright desktop (`1280×720`)

A mesma auditoria percorreu Hoje, Calendário, Porção e Meu perfil. Em todas as telas, `documentScrollWidth = 1280`, `bodyScrollWidth = 1280`, `viewportWidth = 1280` e `bodyOverflowX = hidden`. As alturas de conteúdo foram `1592`, `746`, `1562` e `720` pixels, respectivamente. Isso confirma que sidebar, topbar e conteúdo principal não criam overflow horizontal em desktop.

## Validação do artefato em subdiretório

O `vite preview` padrão servido sob uma URL proxied em `/panoflow/` devolveu os assets como HTML porque o preview não emula a montagem de subdiretório; esse comportamento não representa o GitHub Pages e foi descartado como teste de publicação.

Para simular a entrega real, foi iniciado um servidor estático temporário que monta `dist/` em `/panoflow/` e envia os MIME types corretos. Nesse servidor, a URL `/panoflow/` carregou o título **PanoFlow — Personal Trainer** sem a falha de MIME observada no preview padrão. Ainda falta concluir o teste de refresh, fallback e Go Home nesse servidor e no domínio público.

## Fallback 404 e refresh no artefato estático

No servidor estático que simula o GitHub Pages, a entrada direta em `/panoflow/` carregou a Home com MIME correto e zero erros de console. A entrada direta em `/panoflow/not-a-route` foi atendida pelo `404.html`, redirecionou para `/panoflow/?redirect=%2Fpanoflow%2Fnot-a-route` e, após o carregamento do React, apresentou o heading **Hoje você treina**; a página não exibiu a tela NotFound.
