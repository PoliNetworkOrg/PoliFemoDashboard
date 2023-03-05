<script setup>
import { dom } from "@fortawesome/fontawesome-svg-core";
import { RouterView } from "vue-router";
import { storeToRefs } from "pinia";
import LoginBarItem from "@/components/barItems/LoginBarItem.vue";
import DarkModeBarItem from "@/components/barItems/DarkModeBarItem.vue";
import LogoutBarItem from "@/components/barItems/LogoutBarItem.vue";
import BarItem from "@/components/barItems/BarItem.vue";
import loggers from "@/plugins/ConsoleLoggers";
import { usePolifemoStore } from "@/stores/polifemo";

dom.watch();

const store = usePolifemoStore();
const { loggedIn } = storeToRefs(store);
</script>

<template>
  <header>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-dark-5@1.1.3/dist/css/bootstrap-nightshade.min.css"
    />
  </header>

  <nav
    id="navbar"
    class="navbar navbar-expand-md navbar-dark bg-dark sticky-top"
  >
    <RouterLink to="/" class="navbar-title">
      <a class="navbar-brand ms-3">PoliFemo Dashboard</a>
    </RouterLink>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div id="navbarSupportedContent" class="collapse navbar-collapse">
      <ul class="ms-2 navbar-nav">
        <LoginBarItem v-if="!loggedIn" />
        <BarItem
          dest="articoli"
          title="Articoli"
          icon="fa-newspaper"
          permission="authors"
        />
        <BarItem
          dest="permessi"
          title="Permessi"
          icon="fa-tag"
          permission="permissions"
        />
      </ul>

      <ul class="navbar-nav ms-auto me-2">
        <DarkModeBarItem />
        <LogoutBarItem v-if="loggedIn" />
      </ul>
    </div>
  </nav>

  <div class="router-view">
    <RouterView />
  </div>
  <!-- The toast stack is used to display messges from all the components -->
  <div aria-live="polite" aria-atomic="true" class="position-relative">
    <div
      id="toast-stack"
      class="toast-container bottom-0 end-0 p-3 position-fixed"
    >
      <div
        id="toastest"
        class="toast align-items-center border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">
            <p id="toast-text">sss</p>
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="fixed-bottom w-100 text-muted">
    <div class="text-center p-4" style="background-color: rgba(0, 0, 0, 0.05)">
      by
      <a class="text-reset fw-bold" href="https://polinetwork.org">
        PoliNetwork
      </a>
    </div>
  </div>
</template>

<script>
import { refreshAuthLogic, refreshPermissions } from "@/plugins/AuthUtils";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { showToast } from "@/plugins/ToastManager";
export default {
  mounted() {
    // The interceptor is used to refresh the token automatically.
    // If any authenticated request fails, the interceptor will try to refresh the token
    // and retry the request.
    createAuthRefreshInterceptor(axios, refreshAuthLogic);
    loggers.mainLogger.info(
      "App",
      "Version: " + import.meta.env.VITE_APP_VERSION
    );

    const store = usePolifemoStore();
    store.darkModeEnabled =
      localStorage.getItem("bs.prefers-color-scheme") === "dark";

    if (localStorage.getItem("polifemo_access_token") !== null) {
      loggers.mainLogger.info("Auth", "Credentials found");
      store.loggedIn = true;
      document.getElementById("navbar").classList.add("pt-0");
      document.getElementById("navbar").classList.add("pb-0");

      refreshPermissions().then(
        () => {
          // Emit the event to the children components
          this.emitter.emit("permissions-refreshed");
        },
        (error) => {
          showToast("Errore durante il recupero dei permessi", "error");
          this.$router.push("/");
        }
      );
    } else if (window.location.search.indexOf("code=") == -1) {
      loggers.mainLogger.info("Auth", "No token/code found");
      if (this.$route.path != "/" || window.location.pathname != "/") {
        this.$router.push("/");
      }
    }
  },

  methods: {
    hasPermission: function (permission) {
      const store = usePolifemoStore();
      return store.perms.includes(permission);
    },
  },
};
</script>

<style>
@import "@/assets/styles/main.css";
</style>
