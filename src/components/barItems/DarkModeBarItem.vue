<template>
  <li class="nav-item">
    <a id="darkmode" class="nav-link" href="#" @click="toggleDarkMode()">
      <i id="darkmode-icon" :class="['fas', 'fa-lg']" />
    </a>
  </li>
</template>

<script>
import { usePolifemoStore } from "@/stores/polifemo";

export default {
  data() {
    return {
      store: usePolifemoStore()
    };
  },
  computed: {
    darkMode: function () {
      return localStorage.getItem("bs.prefers-color-scheme") === "dark";
    }
  },

  mounted() {
    this.updateIcon(this.darkMode);
    this.loadDarkModePreference();
  },

  methods: {
    toggleDarkMode() {
      this.store.darkModeEnabled = !this.store.darkModeEnabled;
      localStorage.setItem(
        "bs.prefers-color-scheme",
        this.store.darkModeEnabled ? "dark" : "light"
      );
      this.updateIcon();
      this.applyDarkModePreference();
    },

    updateIcon(force) {
      if (this.store.darkModeEnabled || force) {
        document.getElementById("darkmode-icon").classList.remove("fa-moon");
        document.getElementById("darkmode-icon").classList.add("fa-sun");
      } else {
        document.getElementById("darkmode-icon").classList.remove("fa-sun");
        document.getElementById("darkmode-icon").classList.add("fa-moon");
      }
    },

    loadDarkModePreference() {
      // The dark mode preference might not be set, so we need to check it
      if (localStorage.getItem("bs.prefers-color-scheme") === null) {
        localStorage.setItem("bs.prefers-color-scheme", "light");
      }
      this.store.darkModeEnabled =
        localStorage.getItem("bs.prefers-color-scheme") === "dark";
      this.applyDarkModePreference();
    },

    applyDarkModePreference() {
      if (this.store.darkModeEnabled) {
        document.documentElement.setAttribute("data-bs-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-bs-theme");
      }
    }
  }
};
</script>
