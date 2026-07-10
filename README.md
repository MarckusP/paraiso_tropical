# Balneário Paraíso Tropical

Site institucional em página única (one-page) do Balneário Paraíso Tropical, em Açailândia-MA. Apresenta o local, as hospedagens, a capela para eventos e um formulário de reserva que finaliza a conversa direto no WhatsApp.

Site: apenas HTML/CSS/JS estático, sem build, sem dependências e sem back-end.

## Estrutura do projeto

```
index.html        página única com todas as seções
css/style.css      todo o estilo do site
js/main.js         toda a interatividade (sem frameworks)
assets/img/        fotos, organizadas por hospedagem/área
assets/video/      vídeos de fundo/apresentação (hero, drone, capela etc.)
```

## Seções da página (`index.html`)

- **Abertura** — animação inicial (águia) antes de revelar a página.
- **Header** — menu fixo que muda de estilo ao rolar a página.
- **Hero** — vídeos de fundo (desktop) / rodízio de vídeo único (mobile).
- **Sobre** (`#sobre`) — apresentação do balneário e diferenciais.
- **Instalações** (`#instalacoes`) — mosaico de fotos/vídeo das instalações.
- **Hospedagens** (`#hospedagens`) — lista com todas as opções de hospedagem (camping, cabana, chalé casal, chalé master), cada uma com fotos à esquerda e descrição/preço/capacidade à direita; os cards vão surgindo conforme a página é rolada.
- **Capela** (`#capela`) — espaço para eventos religiosos, com vídeo em loop como plano de fundo da seção e galeria de fotos.
- **Reservas** (`#reservas`) — formulário que monta uma mensagem e abre o WhatsApp com o pedido preenchido.
- **Footer** — links e informações finais.

## Funcionalidades em `main.js`

- Animação de abertura (pula automaticamente se `prefers-reduced-motion` ou `?noanim` na URL).
- Reveal de elementos ao rolar a página (classe `.rv` + `IntersectionObserver`).
- Galerias de fotos reutilizáveis (`[data-gal]`): setas, dots, contador e lightbox ao clicar na foto.
- Envio do formulário de reserva formatando a mensagem e abrindo o WhatsApp (`wa.me`) em nova aba.
- Ano atual automático no rodapé.

## Como rodar localmente

Não há build nem dependências — basta servir os arquivos estáticos. Por exemplo:

```bash
python -m http.server 8080
# depois abrir http://localhost:8080/index.html
```

Ou usar a extensão "Live Server" do VS Code / qualquer outro servidor estático.

## Contato usado no site

WhatsApp: `(99) 98400-4665` (link `https://wa.me/5599984004665` usado nos CTAs e no formulário de reservas).
