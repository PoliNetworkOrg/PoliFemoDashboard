<script setup>
import {
  faUser,
  faNewspaper,
  faTag,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";
import { API_BASE_URL } from "@/plugins/AuthUtils";
import loggers from "@/plugins/ConsoleLoggers";
import autofill from "@/stores/autofill";
import { showToast } from "@/plugins/ToastManager";
defineProps({
  userid: {
    type: String,
    required: true
  },
  objectid: {
    type: Number,
    required: false
  },
  grant: {
    type: String,
    required: true
  }
});

library.add(faUser, faNewspaper, faTag, faXmark);
</script>

<template>
  <div class="border rounded">
    <div class="row">
      <div class="col-8">
        <h5 class="col ms-2 mt-1 text-truncate">
          <i class="fas fa-user"></i>
          <span v-if="!objectid">&nbsp; {{ grant }}</span>
          <span v-else>
            &nbsp; {{ grant }} &bull; {{ autofill[grant][objectid] }}
          </span>
        </h5>
      </div>
      <div class="col-4">
        <div class="btn-group float-end">
          <button
            type="button"
            id="btn-remove"
            @click="remove"
            class="btn btn-danger rounded-end btn-list-item-action"
          >
            <i class="fas fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    remove() {
      var btn = this.$el.querySelector("#btn-remove");
      if (btn.classList.contains("pending")) {
        btn.classList.add("disabled");
        btn.classList.add("btn-list-item-action");
        btn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

        var data = {
          grant: this.grant,
          object_id: this.objectid ?? null
        };

        axios
          .delete(API_BASE_URL + "/accounts/" + this.userid + "/permissions", {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " + localStorage.getItem("polifemo_access_token")
            },
            data: data
          })
          .then(() => {
            this.emitter.emit("permission-deleted", data);
          })
          .catch((error) => {
            loggers.mainLogger.error(
              "permessi",
              "Error while revoking permission:"
            );
            loggers.mainLogger.error("permessi", error);
            showToast(
              "Errore nella revoca del permesso: " + error.response.data.error,
              "error"
            );
          })
          .finally(() => {
            btn.classList.remove("disabled");
            btn.classList.remove("pending");
            btn.classList.add("btn-list-item-action");
            btn.innerHTML = '<i class="fas fa-xmark"></i>';
          });
      } else {
        btn.classList.add("pending");
        btn.classList.remove("btn-list-item-action");
        btn.innerHTML = "Sicuro?";
      }
    }
  }
};
</script>
