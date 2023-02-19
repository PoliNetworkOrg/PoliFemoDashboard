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
    <div
      class="justify-content-center d-flex flex-column align-items-center"
      v-if="!loggedIn"
    >
      <LoginButton loginDestination="polimi" loginText="Login con Polimi" />
      <br />
      <p>
        oppure
        <a href="#" class="nosub" v-on:click="externalLogin"
          >accedi con un account esterno</a
        >
      </p>
    </div>

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
@import "@/assets/styles/bootstrap-nightshade.min.css";
</style>

<script>
function externalLogin() {
  window.open(
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=a06b160b-8d5d-4be2-b452-ea3b768998ed&scope=openid%20offline_access&response_type=code&state=10020&prompt=select_account&redirect_uri=https://dashboard.polinetwork.org",
    "_self"
  );
}
</script>
