<template>
  <header>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </header>
  <div class="container mt-5">
    <div class="alert alert-info" role="alert">
      <span>
        <i class="fas fa-lg fa-circle-info"></i> Per la lista completa dei
        permessi e la loro descrizione, visita la
        <a href="https://google.com">documentazione</a>.
      </span>
    </div>
    <div
      class="alert alert-danger"
      role="alert"
      v-if="filled.userid == this.store.userid"
    >
      <h4 class="alert-heading">Attenzione!</h4>
      <span
        >Stai modificando i tuoi stessi permessi. Rimuovere quelli sbagliati
        potrebbe impedirti di accedere ad alcune pagine.
      </span>
    </div>
    <div class="row">
      <div class="col-5">
        <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">
            <i class="fas fa-lg fa-user"></i>
          </span>
          <input
            id="user-selected"
            type="text"
            class="form-control"
            placeholder="ID utente"
            v-model="filled.userid"
            required
          />
          <button
            class="btn btn-secondary rounded-end"
            type="button"
            v-on:click="getPermissionsOfUser"
          >
            Cerca
          </button>
        </div>
      </div>
      <div class="col-7">
        <div
          id="permissions-loading"
          class="spinner-border text-primary d-none"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
        <PermissionListItem
          v-for="perm in tempPermList"
          :key="perm.id"
          :objectid="perm.object_id"
          :grant="perm.grant"
          :userid="filled.userid"
        ></PermissionListItem>
        <div class="mt-3" v-if="tempPermList.length != 0"></div>
        <div class="input-group d-none" id="new-perm-form">
          <input
            id="added-perm"
            type="text"
            v-model="filled.grant"
            class="form-control"
            placeholder="Nuovo permesso"
          />
          <select
            id="added-objid"
            class="form-control"
            placeholder="id..."
            v-show="autofill.hasOwnProperty(filled.grant)"
          >
            <option v-for="item in autofill[filled.grant]">{{ item }}</option>
          </select>
          <button
            id="addpermbutton"
            class="btn btn-success btn-list-item-action rounded-end"
            type="button"
            v-on:click="addPermission"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  faCircleInfo,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import loggers from "@/plugins/ConsoleLoggers";
import axios from "axios";
import { API_BASE_URL, checkPagePermission } from "@/plugins/AuthUtils";
import { showToast } from "@/plugins/ToastManager";
import PermissionListItem from "@/components/PermissionListItem.vue";
import autofill from "@/stores/autofill";
import { usePolifemoStore } from "@/stores/polifemo";

library.add(faCircleInfo, faUser, faPlus);

export default {
  components: { PermissionListItem },
  data() {
    return {
      tempPermList: {},
      autofill: {},
      filled: {},
      store: usePolifemoStore()
    };
  },
  mounted() {
    this.autofill = autofill;

    // If the user lands on this page without a valid permission store, check for permissions once
    // the permissions-loaded event is received
    this.emitter.on("permissions-refreshed", () => {
      if (!checkPagePermission("permissions")) {
        this.$router.push("/");
        showToast(
          "Non hai i permessi per accedere alla pagina richiesta. Sei stato portato alla home.",
          "error"
        );
      }
    });

    // If a permission gets revoked, refresh the list
    this.emitter.on("permission-deleted", (removed) => {
      this.tempPermList = this.tempPermList.filter(
        (perm) =>
          perm.grant !== removed.grant && perm.object_id !== removed.object_id,
      );
    });
  },

  methods: {
    getPermissionsOfUser() {
      $("#permissions-loading").removeClass("d-none");
      axios
        .get(
          API_BASE_URL + "/accounts/" + this.filled.userid + "/permissions",
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("polifemo_access_token"),
            }
          }
        )
        .then((response) => {
          this.tempPermList = response.data.permissions;
        })
        .catch((error) => {
          loggers.mainLogger.error("permissions", error);
          this.tempPermList = [];
        })
        .finally(() => {
          $("#permissions-loading").addClass("d-none");
          $("#new-perm-form").removeClass("d-none");
        });
    },

    addPermission() {
      //place spinner inside button
      $("#addpermbutton").html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>',
      );
      const perm = $("#added-perm").val();
      var data = {
        grant: perm,
      };
      if (this.autofill.hasOwnProperty(perm)) {
        var index = 0;
        autofill[perm].forEach((element) => {
          if (element == $("#added-objid").val()) {
            data.object_id = index;
          } else {
            index++;
          }
        });
      }
      axios
        .post(
          API_BASE_URL + "/accounts/" + this.filled.userid + "/permissions",
          data,
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("polifemo_access_token"),
            },
          }
        )
        .then((response) => {
          this.tempPermList.push(data);
        })
        .catch((error) => {
          loggers.mainLogger.error("permissions", error);
          showToast(
            "Errore nell'aggiunta del permesso: " + error.response.data.error,
            "error"
          );
        })
        .finally(() => {
          $("#addpermbutton").html('<i class="fas fa-plus"></i>');
        });
    },
  },
};
</script>
