<template>
  <li class="nav-item">
    <a class="nav-link ms-2" href="#" @click="logout()">Logout</a>
  </li>
</template>

<script>
import { usePolifemoStore } from "@/stores/polifemo";
export default {
  methods: {
    logout() {
      usePolifemoStore.loggedIn = false;
      usePolifemoStore.permissions = [];
      localStorage.removeItem("polifemo_access_token");
      localStorage.removeItem("polifemo_refresh_token");
      window.location.href = window.location.href.split("/")[0];
    }
  }
};
</script>
