
<script setup>
import { usePolifemoStore } from "/src/stores/polifemo";
import { storeToRefs } from "pinia";
import LoginButton from "/src/components/LoginButton.vue";
const store = usePolifemoStore();
const { loggedIn } = storeToRefs(store);
</script>

<template>
  <div
    class="d-flex flex-column min-vh-80 justify-content-center align-items-center"
  >
    <LoginButton v-if="!loggedIn" />

    <div v-else>
      <h1 class="display-4">Benvenuto</h1>
      <p class="lead">
        Seleziona una delle categorie e scegli l'operazione da eseguire.
      </p>
    </div>
  </div>
</template>

<style>
@import "@/assets/styles/main.css";
</style>
