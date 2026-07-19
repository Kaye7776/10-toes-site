# PROCESSO TT-24-07-26 — Arquivo de Investigação (identidade fictícia)

Aplicação web progressiva (**PWA**) que reproduz, de forma autêntica, um **dossiê
digital oficial de um **Arquivo de Investigação fictício**. Faz parte da campanha
de lançamento do artista **KAYE** e da música **TEN TOES**.

As pessoas chegam ao site ao ler um QR Code num cartaz de "Pessoa Desaparecida" e
encontram o que parece ser um processo real de investigação. Só mais tarde — quando o
estado do processo muda para `LOCALIZADO` — o site se revela como um lançamento musical.

Construído **sem frameworks**: apenas HTML, CSS e JavaScript puro.
Estética sóbria e institucional (papel, azul-marinho + dourado da PJ), com movimento discreto.

---

## Ficheiros

| Ficheiro | Função |
|----------|--------|
| `index.html` | Marcação semântica do dossiê |
| `style.css` | Estilo institucional, layout responsivo, animações sóbrias |
| `script.js` | Autenticação, motor de estado, relógio, reveal, PWA |
| `manifest.json` | Metadados PWA (instalável) |
| `service-worker.js` | Cache offline-first |
| `assets/photo.jpg` | Fotografia de referência (prova) |
| `assets/emblem.png` | Emblema institucional |
| `assets/icon.png` | Ícone da aplicação |

> Neste ambiente os ficheiros estão em `frontend/public/` e são servidos na raiz (`/`).
> Para publicar noutro alojamento, copie o conteúdo de `frontend/public/`.

---

## Alterar após o lançamento (um único objeto)

Tudo é controlado pelo objeto `CASE` no topo de `script.js`:

```js
const CASE = {
  estado: "DESAPARECIDO",     // mudar para "LOCALIZADO" após o lançamento
  artista: "KAYE",
  musica: "TEN TOES",
  cidade: "Rio Tinto, Porto",
  data: "24 de julho de 2026",
  processo: "TT-24-07-26",
  whatsapp: "351900000000",   // nº internacional, só dígitos, sem "+"
  spotify: "",                // colar link após o lançamento
  appleMusic: "",
  youtube: ""
};
```

### `estado: "DESAPARECIDO"` (antes do lançamento)
- Carimbo vermelho **DESAPARECIDO** + etiqueta de situação
- Botão **PARTICIPAR NA INVESTIGAÇÃO** → abre o WhatsApp com mensagem pré-preenchida
- Apresenta-se como processo em investigação

### `estado: "LOCALIZADO"` (após o lançamento)
- Carimbo verde **LOCALIZADO**, **PROCESSO ENCERRADO**
- Revela **TEN TOES** + botões de streaming (Spotify / Apple Music / YouTube)
- **O QR Code nunca muda** — apenas este objeto.

---

## Experiência
1. **Autenticação** sóbria (emblema PJ, validação de credenciais, barra de progresso) → fade.
2. **Dossiê** em folha de papel: cabeçalho oficial (Arquivo Central Confidencial · Arquivo de Investigação),
   faixa **CONFIDENCIAL · USO OFICIAL · DIFUSÃO RESTRITA**, referência do processo, carimbo,
   fotografia de referência, identificação do indivíduo, cronologia (animada ao scroll),
   pedido de colaboração pública, rodapé com atualização em tempo real.

## Atalhos de desenvolvimento
- Tecla **`F`** — pré-visualizar o estado `LOCALIZADO` / lançamento.
- `/?nointro=1` — abrir o dossiê sem o ecrã de autenticação.
- Respeita `prefers-reduced-motion`.

## Instalar como aplicação
No telemóvel: menu do navegador → **Adicionar ao ecrã principal**.
Abre em ecrã inteiro (standalone) e funciona offline após a primeira visita.
