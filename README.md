# PanoFlow Static

PanoFlow é um acompanhamento local de treinos com visual All Black, calendário Iniciante/Avançado, checklist, XP, streak, vídeos embutidos e aba Porção.

## Modo GitHub Pages

Este repositório é **100% estático**. Não possui servidor, banco, OAuth, tRPC, APIs próprias ou variáveis secretas. O progresso de perfil, XP, streak, histórico e preferências é salvo no `localStorage` do navegador. O botão de reset remove os dados locais e reinicia o ciclo.

O workflow em `.github/workflows/deploy-pages.yml` compila `dist/` e publica automaticamente no GitHub Pages a cada push na branch `main`. O Vite calcula a base do projeto a partir de `GITHUB_REPOSITORY`; localmente, a base é `/`.

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

Para validar o artefato de produção:

```bash
pnpm check
pnpm test -- --run
pnpm build
pnpm preview
```

## Escopo e limites

A aplicação organiza uma rotina educativa e não substitui avaliação médica, nutricional ou orientação presencial. Equipamentos podem variar por unidade da Panobianco, cargas são iniciais e ajustáveis, e vídeos são referências públicas incorporadas. Resultados físicos dependem de treino, alimentação, sono, recuperação, saúde e consistência individuais.
