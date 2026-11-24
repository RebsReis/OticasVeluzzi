# Óticas Veluzzi — E-commerce

**Fase 1 — protótipo visual navegável.** Feito em Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP e Lucide, seguindo o Design System *Premium Optical Editorial*.

> ⚠️ Todos os produtos, preços, coleções e condições comerciais são **dados demonstrativos** (`lib/data.ts`).
> As imagens de produto são ilustrações SVG provisórias e serão substituídas pelas fotografias reais.

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run export     # versão estática em /out
```

## O que já funciona

| Área | Conteúdo |
|---|---|
| Home | Barra de condições, header fixo com busca inteligente, mega menu (desktop) e menu lateral (mobile), hero com campanhas, benefícios, categorias, vitrines em abas, banners editoriais, coleções, institucional, avaliações (somente reais, com estado vazio), CTA de WhatsApp, newsletter com consentimento LGPD e rodapé completo |
| Catálogo | `/categoria/[slug]` com 10 grupos de filtros, ordenação, contador, chips de filtros ativos, “carregar mais”, skeleton, estado vazio e painel de filtros no mobile |
| Produto | Galeria com 3 ângulos, zoom no hover e em tela cheia, cores, estoque, parcelas, Pix, frete por CEP, guia de medidas, ficha técnica, produtos relacionados, CTA fixo no mobile e dados estruturados (Product + Breadcrumb) |
| Lentes | `/produto/[slug]/lentes` com fluxo em 5 etapas: armação, tipo de lente, tratamentos, receita (upload, preenchimento, especialista ou envio posterior) e resumo, com o preço atualizado em tempo real |
| Carrinho | Sacola lateral e página completa, salvas no navegador: quantidades, personalização de lentes, cupom (demo: `BEMVINDO10`), frete, barra de frete grátis e recomendações |
| Checkout | Uma página em 3 etapas: identificação (valida CPF), entrega (CEP via ViaCEP com preenchimento manual de reserva) e pagamento (Pix, cartão parcelado ou boleto), mais a confirmação. **O pagamento é simulado.** |
| Outros | Favoritos, conta (login/cadastro/recuperação — interface), políticas, 404, `robots.txt`, `sitemap.xml`, barra de navegação inferior no mobile, `prefers-reduced-motion` |

## Estrutura

```
app/               rotas (App Router)
components/        componentes reutilizáveis
lib/data.ts        dados demonstrativos + helpers (vira chamada de API na Fase 2)
lib/store.ts       carrinho/favoritos (zustand + localStorage)
app/globals.css    Design Tokens (seção 08 do Design System)
public/brand/      logotipo original (versões clara e escura, fundo transparente)
```

## Próximas fases

- **Fase 2 — Back-end:** FastAPI + SQLAlchemy + PostgreSQL; catálogo, preços, estoque e cupons validados no servidor; autenticação; área do cliente; armazenamento seguro de receitas; gateway de pagamento em sandbox; frete; e-mails.
- **Fase 3 — Painel administrativo:** dashboard, produtos/SKUs, lentes e tratamentos, pedidos e status, marketing (banners, vitrines, cupons, SEO) e configurações gerais (que hoje estão em `storeSettings`).

Credenciais e chaves sempre em variáveis de ambiente (veja `.env.example`).
