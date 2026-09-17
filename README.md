# Euvi Gestão

Sistema mobile-first de controle de estoque por loja, com autenticação Supabase, perfis ADM/colaborador, seleção de loja, cálculo de pedido e suporte a Realtime.

## Estrutura
- `index.html` — login
- `admin.html` — painel ADM
- `selecionar-loja.html` — seleção de loja para colaboradores
- `funcionario.html` — entrada do app do colaborador
- `funcionario_1.html` — implementação existente do módulo de contagem
- `config.js` — cliente Supabase e helpers
- `manifest.json` — configuração PWA
- `supabase/` — SQL do banco e RLS

## Deploy
Este é um app estático. Pode ser importado diretamente na Vercel a partir deste repositório.

## Supabase
Execute os SQLs em `supabase/` na ordem numérica no SQL Editor do projeto antes do primeiro teste. A chave usada em `config.js` é a chave pública `anon`; o controle de acesso deve permanecer no RLS.

## Fluxo
Login → ADM: painel administrativo. Login → colaborador: seleção da loja → contagem diária.
