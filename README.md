# UnderTone

Uma mesa de som para as abas do navegador. O UnderTone é uma extensão para Firefox e Chrome que lista os vídeos do YouTube abertos e permite controlar cada aba pelo popup: pausar, retomar, silenciar e ajustar o volume. Também há um volume master que vale para todas as abas.

## Funcionalidades

- **Um canal por aba:** cada aba de vídeo do YouTube (`/watch` e `/shorts`) aparece como um canal numerado, com miniatura, título e domínio.
- **Volume por canal:** um fader de 0 a 100% e um botão de mudo independente em cada aba.
- **Master:** um volume geral e um mudo geral. O volume que chega ao vídeo é `(canal / 100) × (master / 100)`, e o mudo não apaga o valor do volume.
- **Pausar tudo / Retomar:** pausa todas as abas que estão tocando. Depois, "Retomar" dá play somente nas abas que esse comando pausou.
- **Indicador de atividade:** mostra quais abas estão tocando no momento.
- **Tema claro e escuro:** segue a preferência do sistema.

O volume master e o registro do "Pausar tudo" ficam em `storage.local` e continuam valendo depois que o popup é fechado.

## Requisitos

- Node.js 20 ou mais recente
- Firefox ou um navegador baseado em Chromium

## Como rodar

O código da extensão fica em [`tabmixer/`](tabmixer/).

```bash
cd tabmixer
npm install
```

Desenvolvimento com recarga automática (o comando abre um navegador com a extensão já carregada):

```bash
npm run dev           # Chrome
npm run dev:firefox   # Firefox
```

Build de produção:

```bash
npm run build           # gera .output/chrome-mv3/
npm run build:firefox   # gera .output/firefox-mv2/
npm run zip:firefox     # gera o .zip para publicar
```

Para carregar o build manualmente:

- **Firefox:** abra `about:debugging#/runtime/this-firefox`, clique em "Carregar extensão temporária" e escolha `tabmixer/.output/firefox-mv2/manifest.json`.
- **Chrome:** abra `chrome://extensions`, ative o "Modo do desenvolvedor", clique em "Carregar sem compactação" e escolha a pasta `tabmixer/.output/chrome-mv3/`.

Verificação de tipos:

```bash
npm run compile
```

## Como funciona

A cada segundo, o popup consulta as abas do YouTube e pergunta o estado de cada uma ao content script dela. Os comandos (volume, mudo, play/pause) vão para a aba como mensagens.

O content script ([`youtube.content.ts`](tabmixer/entrypoints/youtube.content.ts)) guarda o volume e o mudo do canal e aplica o volume efetivo ao `<video>`. Quando o master muda em `storage.local`, ele recalcula esse volume. Como o YouTube troca de vídeo sem recarregar a página, o content script também reaplica o volume a cada vídeo novo.

Se uma aba já estava aberta antes de a extensão ser instalada, ela ainda não tem o content script e por isso não aparece no popup. Basta recarregar a aba.

## Estrutura

```
docs/
  UnderTone-Design-System.pdf     especificação visual do popup
tabmixer/
  wxt.config.ts                manifest e permissões
  utils/mixer.ts               tipos e mensagens entre o popup e o content script
  entrypoints/
    youtube.content.ts         controla o <video> em cada aba
    popup/
      App.tsx                  estado e integração com o navegador
      components/              Popup, MasterStrip, TrackStrip, Fader, Readout,
                               TransportButton, ActivityMeter, Icon
      styles/                  fonts.css, tokens.css, components.css
```

## Design system

O visual do popup segue o [UnderTone Design System](docs/UnderTone-Design-System.pdf), que define cores (12 tokens em dois temas), tipografia (IBM Plex Sans e Mono), medidas, estados e componentes. `tokens.css` e `components.css` são cópias literais dos apêndices A e B do documento. Ao mudar o visual, atualize o documento primeiro.

As fontes são empacotadas na extensão via `@fontsource`, então o popup não faz requisições de rede para carregá-las.

## Stack

[WXT](https://wxt.dev), React 19, TypeScript e CSS com custom properties.

## Limitações atuais

- Só abas de vídeo do YouTube são listadas. Para incluir outros sites, seria preciso pedir permissão para todos os sites (`<all_urls>`) e generalizar o content script.
- O volume de cada canal fica guardado só enquanto a aba está aberta; o volume master é o único salvo em `storage.local`.
