import { defineConfig } from "wxt";

// https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  // Manifest por navegador: o mesmo código gera o pacote do Chrome (MV3) e o do Firefox (MV2).
  manifest: ({ browser }) => ({
    name: "UnderTone",
    description: "Controle volume e pause de várias abas do YouTube em um só lugar.",
    // Necessário pra ler URL/título das abas e injetar o content script.
    host_permissions: ["*://*.youtube.com/*"],
    // Volume master e "Pausar tudo" persistem entre aberturas do popup.
    permissions: ["storage"],
    icons: {
      16: "icon/icon-16.png",
      32: "icon/icon-32.png",
      48: "icon/icon-48.png",
      96: "icon/icon-96.png",
      128: "icon/icon-128.png",
    },
    action: {
      default_icon: {
        16: "icon/icon-16.png",
        32: "icon/icon-32.png",
        48: "icon/icon-48.png",
        96: "icon/icon-96.png",
        128: "icon/icon-128.png",
      },
    },
    // Só o Firefox reconhece esta chave; no Chrome ela gera aviso de chave desconhecida.
    ...(browser === "firefox" && {
      browser_specific_settings: {
        gecko: {
          // UUID precisa estar entre chaves (ou usar formato de e-mail).
          id: "{78b59428-97ef-4eea-85fe-dff529569372}",
          // A extensão não coleta nem transmite dados do usuário.
          data_collection_permissions: { required: ["none"] },
        },
      },
    }),
  }),
});