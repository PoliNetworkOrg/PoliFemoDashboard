import axios from "axios";
import loggers from "@/plugins/ConsoleLoggers";
import { showToast } from "@/plugins/ToastManager";
import { usePolifemoStore } from "@/stores/polifemo";

export const API_BASE_URL = "https://api.polinetwork.org/staging/v1";

export const refreshAuthLogic = async (failedRequest) => {
  loggers.mainLogger.info("Auth", "Invalid token, refreshing...");
  const tokenRefreshResponse = await axios.get(API_BASE_URL + "/auth/refresh", {
    headers: {
      Token: localStorage.getItem("polifemo_refresh_token"),
    },
  });
  if (tokenRefreshResponse.status == 200) {
    loggers.mainLogger.info("Auth", "Token refreshed successfully");
    localStorage.setItem(
      "polifemo_access_token",
      tokenRefreshResponse.data.access_token
    );
    failedRequest.response.config.headers["Authorization"] =
      "Bearer " + tokenRefreshResponse.data.access_token;
    return Promise.resolve();
  } else {
    showToast(
      "Si è verificato un errore di autenticazione: " +
        JSON.stringify(tokenRefreshResponse.data.error),
      "error"
    );
  }
};

export const refreshPermissions = async (skipRequest) =>
  new Promise((resolve, reject) => {
    if (skipRequest) {
      resolve();
      return;
    }
    const store = usePolifemoStore();
    axios
      .get(API_BASE_URL + "/accounts/me", {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("polifemo_access_token"),
        },
      })
      .then((response) => {
        store.userid = response.data.id;
        store.perms = response.data.permissions;
        store.authorizedauthors = response.data.authorized_authors;
        if (store.perms == "") {
          showToast(
            "Non hai il permesso di visualizzare questa pagina",
            "error"
          );
        } else {
          loggers.mainLogger.info("Auth", "Permissions loaded");
        }
        resolve();
      })
      .catch((error) => {
        loggers.mainLogger.error(
          "Auth",
          "Error while loading permissions: " + error
        );
        reject(error);
      });
  });

export const checkPagePermission = function (permission) {
  var found = false;
  const store = usePolifemoStore();
  var array = JSON.parse(JSON.stringify(store.perms));
  array.forEach((per) => {
    if (per.grant == permission) {
      found = true;
      return true;
    }
  });
  return found;
};
