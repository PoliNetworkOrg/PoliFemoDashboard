<script setup>
import {
  faCalendar,
  faLocationDot,
  faTrashCan,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";
import { API_BASE_URL } from "@/plugins/AuthUtils";
defineProps({
  id: {
    type: Number,
    required: true
  },
  targettime: {
    type: String,
    required: false
  },
  location: {
    type: Boolean,
    required: false
  },
  content: {
    type: Object,
    required: true
  }
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
          {{ content.it.title || content.en.title }}
        </h5>
        <div class="col text-truncate" v-if="content.it.subtitle">
          {{ content.it.subtitle }}
        </div>
        <div class="col text-truncate" v-else>Nessun sottotitolo</div>
      </div>
      <div class="col-4">
        <div class="float-end h-100">
          <button
            type="button"
            id="btn-preview"
            v-on:click="preview"
            class="btn no-border btn-info rounded-start h-100 btn-list-item-action"
          >
            <i class="fas fa-eye"></i>
          </button>
          <button
            type="button"
            v-on:click="remove"
            id="btn-delete"
            class="btn no-border btn-danger rounded-end h-100 btn-list-item-action"
          >
            <i class="fas fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
    <div :id="'preview-box-' + id" class="mt-2 border rounded d-none"></div>
  </div>
</template>

<script>
import Cherry from "cherry-markdown/dist/cherry-markdown.core";
export default {
  data() {
    return {
      cherryEditor: null,
      previewBox: null
    };
  },
  mounted() {
    this.previewBox = this.$el.querySelector("#preview-box-" + this.id);
  },
  methods: {
    preview() {
      if (this.cherryEditor && $(this.previewbox).hasClass("d-none")) {
        $(previewbox).removeClass("d-none");
      } else if (this.cherryEditor && !$(this.previewBox).hasClass("d-none")) {
        $(this.previewBox).addClass("d-none");
      } else {
        this.cherryEditor = new Cherry({
          id: "preview-box-" + this.id, // Need this trick to avoid a bug always creating the editor in the first element of the list
          value: this.content.it.content || this.content.en.content,
          locale: "en_US",
          editor: {
            defaultModel: "previewOnly"
          }
        });
        $(this.previewBox).removeClass("d-none");
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
          .delete(API_BASE_URL + "/articles/" + this.id, {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " + localStorage.getItem("polifemo_access_token")
            }
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
    }
  }
};
</script>
