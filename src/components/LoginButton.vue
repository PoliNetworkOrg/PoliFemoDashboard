<template>
  <button
    id="loginbtn"
    class="btn btn-primary btn-lg btn-block rounded"
    @click="startLogin()"
  >
    <i class="fas fa-right-to-bracket" />
    &nbsp; Login con Polimi
  </button>
</template>

<script>
import axios from "axios";
import loggers from "@/plugins/ConsoleLoggers";
import { showToast } from "@/plugins/ToastManager";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { API_BASE_URL } from "@/plugins/AuthUtils";
library.add(faRightToBracket);

export default {
  mounted() {
    if (window.location.search.indexOf("code=") > -1) {
      document.getElementById("loginbtn").innerText = "Login in corso...";
      document.getElementById("loginbtn").disabled = true;
      var code = window.location.search.split("code=")[1].split("&")[0];
      var state = window.location.search.split("state=")[1].split("&")[0];
      axios
        .get(API_BASE_URL + "/auth/code?code=" + code + "&state=" + state)
        .then(function (response) {
          loggers.mainLogger.info("Auth", "Credentials added to storage");
          localStorage.setItem(
            "polifemo_access_token",
            response.data.access_token
          );
          localStorage.setItem(
            "polifemo_refresh_token",
            response.data.refresh_token
          );
          window.location.href = window.location.href.split("?")[0];
        })
        .catch(function (error) {
          document.getElementById("loginbtn").innerText =
            "Errore durante il login. Riprova.";
          document.getElementById("loginbtn").disabled = false;
          showToast("Si è verificato un errore durante il login", "error");
          loggers.mainLogger.error("Auth", "Login error: " + error);
        });
    }
  },
  methods: {
    startLogin() {
      window.open(
        "https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=92602f24-dd8e-448e-a378-b1c575310f9d&scope=openid offline_access&response_type=code&login_hint=nome.cognome@mail.polimi.it&state=10020&redirect_uri=https://dashboard.polinetwork.org",
        "_self"
      );
    },
  },
};
</script>
