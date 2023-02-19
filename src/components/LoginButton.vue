<script setup>
defineProps({
  loginDestination: {
    type: String,
    required: true,
  },
  loginText: {
    type: String,
    required: true,
  },
  buttonType: {
    type: String,
    required: false,
    default: "primary",
  },
});
</script>

<template>
  <button
    id="loginbtn"
    ref="button"
    class="btn btn-lg btn-block rounded"
    @click="startLogin()"
  >
    <i class="fas fa-right-to-bracket" />
    &nbsp; {{ loginText }}
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
    var btn = this.$refs.button;
    btn.classList.add("btn-" + this.buttonType);
    if (window.location.search.indexOf("code=") > -1) {
      btn.innerText = "Login in corso...";
      btn.disabled = true;
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
          btn.innerText = "Errore durante il login. Riprova.";
          btn.disabled = false;
          showToast("Si è verificato un errore durante il login", "error");
          loggers.mainLogger.error("Auth", "Login error: " + error);
        });
    }
  },
  methods: {
    startLogin() {
      switch (this.loginDestination) {
        case "polimi":
          window.open(
            "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=a06b160b-8d5d-4be2-b452-ea3b768998ed&scope=openid%20offline_access&response_type=code&state=10020&login_hint=nome@mail.polimi.it&redirect_uri=https://dashboard.polinetwork.org",
            "_self"
          );
          break;
        case "common":
          window.open(
            "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=a06b160b-8d5d-4be2-b452-ea3b768998ed&scope=openid%20offline_access&response_type=code&state=10020&prompt=select_account&redirect_uri=https://dashboard.polinetwork.org",
            "_self"
          );
          break;
        default:
          loggers.mainLogger.error(
            "Auth",
            "Login destination not recognized: " + loginDestination
          );
          break;
      }
    },
  },
};
</script>
