<script setup>
import {
  faCalendar,
  faLocationDot,
  faTrashCan,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";
import { API_BASE_URL } from "@/plugins/AuthUtils";
defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
  },
  targettime: {
    type: String,
    required: false,
  },
  location: {
    type: Boolean,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
});

library.add(faCalendar, faLocationDot, faTrashCan, faEye);
</script>

<template>
  <div class="mt-5 rounded">
    <div class="row">
      <div class="col-8">
        <h5 class="col text-truncate">
          <i class="fas fa-calendar" v-if="targettime != null"></i>
          <span v-if="targettime != null && location">&nbsp;</span>
          <i class="fas fa-location-dot" v-if="location"></i>
          {{ title }}
        </h5>
        <div class="col text-truncate" v-if="subtitle != null">
          {{ subtitle }}
        </div>
        <div class="col text-truncate" v-else>Nessun sottotitolo</div>
      </div>
      <div class="col-4">
        <div class="float-end h-100">
          <button
            type="button"
            id="btn-preview"
            v-on:click="preview"
            class="btn btn-info rounded-start h-100 btn-list-item-action"
          >
            <i class="fas fa-eye"></i>
          </button>
          <button
            type="button"
            v-on:click="remove"
            id="btn-delete"
            class="btn btn-danger rounded-end h-100 btn-list-item-action"
          >
            <i class="fas fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
    <div id="preview-box" class="mt-2 border rounded d-none"></div>
  </div>
</template>

<script>
export default {
  methods: {
    preview() {
      var pb = this.$el.querySelector("#preview-box");
      if (pb.classList.contains("d-none")) {
        var t = JSON.parse(this.content);
        t.forEach((elem) => {
          var temp = document.createElement("p");
          temp.classList.add("ms-2");
          temp.classList.add("me-2");
          temp.classList.add("mt-2");
          temp.innerHTML = elem;
          pb.appendChild(temp);
        });
        $(pb).removeClass("d-none");
      } else {
        $(pb).addClass("d-none");
        pb.innerHTML = "";
      }
    },

    remove() {
      var btn = this.$el.querySelector("#btn-delete");
      if (btn.classList.contains("pending")) {
        btn.classList.add("disabled");
        btn.classList.add("btn-list-item-action");
        btn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

        axios
          .delete(API_BASE_URL + "/v1/articles/" + this.id, {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " + localStorage.getItem("polifemo_access_token"),
            },
          })
          .then(() => {
            this.emitter.emit("article-deleted", this.id);
          })
          .catch((error) => {
            loggers.mainLogger.error(
              "articoli",
              "Error while deleting article"
            );
            loggers.mainLogger.error("articoli", error);
            showToast(
              "Errore nell'eliminazione dell'articolo: " +
                error.response.data.error,
              "error"
            );
          });
      } else {
        btn.classList.add("pending");
        btn.classList.remove("btn-list-item-action");
        btn.innerHTML = "Sicuro?";
      }
    },
  },
};
</script>
