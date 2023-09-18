<template>
  <div class="mt-3 ms-3 me-3">
    <div class="form-floating">
      <select
        id="selectMittente"
        class="form-select"
        aria-label="Seleziona mittente"
        v-model="author_id"
        @change="getArticlesFromAuthor()"
      />
      <label for="selectMittente" class="form-label"> Autore </label>
    </div>
    <div class="form-floating mt-4">
      <input
        id="titoloArticolo"
        type="text"
        class="form-control"
        placeholder="Titolo articolo"
        v-model="title"
        @change="getArticlesFromAuthor()"
        required
      />
      <label for="titoloArticolo" class="form-label">Titolo</label>
    </div>
    <div v-if="isLoading" id="loading" class="mt-4 row">
      <div class="spinner-border text-primary mx-auto" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="mb-2">
      <ArticleListItem
        v-for="item in this.articles"
        :key="item.id"
        v-bind:content="item.content"
        v-bind:targettime="item.target_time"
        v-bind:location="item.latitude != null"
        v-bind:id="item.id || 0"
        buttons="preview,delete"
      ></ArticleListItem>
      <div v-if="articles.length != 0 && canLoadMore" class="mt-4 row">
        <div class="text-primary mx-auto col-auto" role="status">
          <a
            id="loadMore"
            href="#/"
            v-on:click="getArticlesFromAuthor(true)"
            v-if="!isLoading"
          >
            Carica altro
          </a>
          <span
            class="spinner-border spinner-border-sm"
            v-else
            role="status"
            aria-hidden="true"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleListItem from "./ArticleListItem.vue";
import { usePolifemoStore } from "@/stores/polifemo";
import { showToast } from "@/plugins/ToastManager";
import axios from "axios";
import loggers from "@/plugins/ConsoleLoggers";
import { API_BASE_URL } from "@/plugins/AuthUtils";

export default {
  components: {
    ArticleListItem
  },
  data() {
    return {
      author_id: null,
      title: "",
      canLoadMore: true,
      articles: [],
      deletedPageOffset: 0,
      isLoading: false,
      idau: 0,
      store: usePolifemoStore()
    };
  },
  mounted() {
    this.fillAuthorOptions();
    // If an article is deleted, remove it from the list
    this.emitter.on("article-deleted", (id) => {
      this.articles = this.articles.filter((article) => article.id != id);
    });

    // Wait for the permissions to load before adding the authors to the select
    this.emitter.on("permissions-refreshed", () => {
      this.fillAuthorOptions();
    });
  },
  methods: {
    getArticlesFromAuthor(more) {
      this.isLoading = true;
      // The empty author is selected
      if (this.author_id == 0) {
        return;
      }
      if (more) {
        this.deletedPageOffset++;
        this.isLoading = true;
      }

      var path =
        "/articles?author_id=" +
        this.author_id +
        "&limit=3&sort=date&platform=3&pageOffset=" +
        this.deletedPageOffset;
      if (this.title != "") {
        this.deletedPageOffset = 0;
        path += "&title=" + this.title;
      }
      axios
        .get(API_BASE_URL + path)
        .then(
          (response) => {
            if (more) {
              this.articles = this.articles.concat(response.data.articles);
            } else {
              this.articles = [];
              this.articles = response.data.articles;
            }
            if (response.data.articles.length < 3) {
              this.canLoadMore = false;
            } else {
              this.canLoadMore = true;
            }
          },
          (error) => {
            if (error.response.status == 404) {
              if (more) {
                this.canLoadMore = false;
                return;
              }
              this.articles = [];
              showToast("Nessun articolo trovato", "info");
              return;
            } else {
              loggers.mainLogger.error(
                "articoli",
                "Error while fetching articles"
              );
              loggers.mainLogger.error("articoli", error);
              showToast(
                "Errore nel caricamento degli articoli: " +
                  (error.response.data.error || error.response.data.title),
                "error"
              );
            }
          }
        )
        .finally(() => {
          this.isLoading = false;
        });
      return;
    },
    fillAuthorOptions() {
      var array = JSON.parse(JSON.stringify(this.store.perms));
      var authors = JSON.parse(JSON.stringify(this.store.authorizedauthors));
      $("#selectMittente").append('<option value=""></option>');
      array.forEach((perm) => {
        if (perm.grant == "authors") {
          $("#selectMittente").append(
            '<option value="' +
              perm["object_id"] +
              '">' +
              authors[this.idau] +
              "</option>"
          );
          this.idau++;
        }
      });
    }
  }
};
</script>
