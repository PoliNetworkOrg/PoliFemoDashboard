import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import VueModular from "@/plugins/VueModular.js";
import mitt from "mitt";

function bootApp() {
  const emitter = mitt();
  const app = createApp(App)
    .use(VueModular, {
      /**
       * list of your modules to install in vue app (required)
       */
      modules: [],

      /**
       * You can pass default config to vue app like router , ... (optional)
       */
      configs: {
        router,
      },
    })
    .use(createPinia())
  
    app.config.globalProperties.emitter = emitter;
    app.mount("#app");
}

bootApp();
