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
  computed: {
    darkMode: function () {
      return localStorage.getItem("bs.prefers-color-scheme") === "dark";
    },
  },

  mounted() {
    this.updateIcon(this.darkMode);
  },

  methods: {
    toggleDarkMode() {
      const store = usePolifemoStore();
      darkmode.toggleDarkMode();
      store.darkModeEnabled = !store.darkModeEnabled;
      this.updateIcon();
    },

    updateIcon(force) {
      const store = usePolifemoStore();
      if (store.darkModeEnabled || force) {
        document.getElementById("darkmode-icon").classList.remove("fa-moon");
        document.getElementById("darkmode-icon").classList.add("fa-sun");
      } else {
        document.getElementById("darkmode-icon").classList.remove("fa-sun");
        document.getElementById("darkmode-icon").classList.add("fa-moon");
      }
    },
  },
};
</script>
