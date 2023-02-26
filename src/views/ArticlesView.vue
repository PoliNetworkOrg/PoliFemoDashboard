<template>
  <header>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-bs5.css"
    />
  </header>
  <div class="container mt-5">
    <div id="accordionAggiungi" class="accordion mb-4">
      <div class="accordion-item">
        <h2 id="headingOne" class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            Aggiungi un articolo
          </button>
        </h2>
        <div
          id="collapseOne"
          class="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionAggiungi"
        >
          <div class="accordion-body">
            <form id="articolo" class="needs-validation" novalidate>
              <div>
                <label for="mittente" class="form-label">
                  Mittente articolo
                </label>
                <select
                  id="selectmittente"
                  class="form-select"
                  aria-label="Seleziona mittente"
                />
              </div>
              <div class="mb-3 mt-4">
                <label for="titoloArticolo" class="form-label">Titolo</label>
                <input
                  id="titoloArticolo"
                  type="text"
                  class="form-control"
                  required
                />
                <div class="invalid-feedback">
                  L'oggetto non può essere vuoto.
                </div>
              </div>
              <div class="mb-3 mt-4">
                <label for="oggettoArticolo" class="form-label">
                  Sottotitolo
                </label>
                <input
                  id="sottotitoloArticolo"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-3 mt-3">
                <textarea
                  id="editor"
                  class="form-control"
                  name="editordata"
                  required
                />
                <div class="invalid-feedback">
                  Il corpo dell'articolo non può essere vuoto.
                </div>
              </div>
              <div class="mb-3 mt-4">
                <label for="copertinaArticolo" class="form-label">
                  URL immagine di copertina
                </label>
                <input
                  id="copertinaArticolo"
                  type="text"
                  class="form-control"
                />
                <div class="invalid-feedback">Deve essere un URL valido.</div>
              </div>
              <div class="mb-3 mt-4">
                <div class="form-check">
                  <input
                    id="checkExtra"
                    class="form-check-input"
                    type="checkbox"
                    value=""
                  />
                  <label class="form-check-label" for="checkExtra">
                    Allega posizione e orario
                  </label>
                </div>
              </div>
              <div id="extra-div" class="d-none">
                <br />
                <p>Clicca un punto della mappa per impostarlo come luogo</p>
                <div id="extramappa" class="mb-3" style="height: 400px" />
                <div
                  id="extraorario"
                  class="input-group mb-3"
                  data-td-target-input="nearest"
                  style="width: 200px"
                  data-td-target-toggle="nearest"
                >
                  <label for="extraorario">Imposta l'orario dell'evento</label>
                  <input
                    id="datetimepicker1Input"
                    type="text"
                    class="form-control"
                    data-td-target="#extraorario"
                  />
                  <span
                    class="input-group-text"
                    data-td-target="#extraorario"
                    data-td-toggle="datetimepicker"
                  >
                    <span class="fas fa-calendar" />
                  </span>
                </div>
              </div>
              <div class="mb-3 mt-4">
                <label for="mittente" class="form-label">Categoria</label>
                <select
                  id="selectcategoria"
                  class="form-select"
                  aria-label="Seleziona categoria"
                  required
                />
              </div>
              <button id="submit" type="submit" class="btn btn-primary rounded">
                Invia
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <h2 id="headingTwo" class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            Rimuovi un articolo
          </button>
        </h2>
        <div
          id="collapseTwo"
          class="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionAggiungi"
        >
          <div class="accordion-body">
            <div>
              <label for="mittente" class="form-label">
                Mittente articolo
              </label>
              <select
                id="selectMittenteDel"
                class="form-select"
                aria-label="Seleziona mittente"
              />
            </div>
            <div class="mt-4">
              <label for="titoloArticolo" class="form-label">Titolo</label>
              <input
                id="titoloArticoloDel"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div id="loading" class="mt-4 row d-none">
              <div class="spinner-border text-primary mx-auto" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div class="mb-2">
              <ArticleListItem
                v-for="item in this.articles"
                :key="item.id"
                v-bind:title="item.title"
                v-bind:subtitle="item.subtitle"
                v-bind:content="item.content"
                v-bind:targettime="item.target_time"
                v-bind:location="item.latitude != null"
                v-bind:id="item.id || 0"
              ></ArticleListItem>
              <div v-if="articles.length != 0 && canLoadMore" class="mt-4 row">
                <div class="text-primary mx-auto col-auto" role="status">
                  <a
                    id="loadMore"
                    href="#/"
                    v-on:click="getArticlesFromAuthor(true)"
                    >Carica altro</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container spacer"></div>
    </div>
  </div>
</template>

<script>
import {
  faChevronRight,
  faChevronLeft,
  faCalendar,
  faClock,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { TempusDominus } from "@eonasdan/tempus-dominus";
import { usePolifemoStore } from "@/stores/polifemo";
import "@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css";
import L, { icon, Marker } from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import "/public/js/summernote-bs5.min.js";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet-src.js";
import loggers from "@/plugins/ConsoleLoggers";
import axios from "axios";
import { API_BASE_URL, checkPagePermission } from "@/plugins/AuthUtils";
import { showToast } from "@/plugins/ToastManager";
import ArticleListItem from "@/components/ArticleListItem.vue";

library.add(
  faChevronRight,
  faChevronLeft,
  faCalendar,
  faClock,
  faArrowUp,
  faArrowDown
);

Marker.prototype.options.icon = icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export default {
  components: { ArticleListItem },
  data() {
    return {
      articles: [],
      canLoadMore: true,
      deletedPageOffset: 0,
    };
  },
  mounted() {
    var env = this;
    const store = usePolifemoStore();
    let mappa,
      marker = null,
      idau = 0;

    // First accordion (add articles)
    // Initialize summernote and remove the image insertion button that we don't use
    $("#accordionAggiungi").on("show.bs.collapse", function () {
      $("#editor").summernote({
        placeholder: "Scrivi qui...",
        tabsize: 2,
        height: 100,
      });
      $("div.note-group-select-from-files").remove();

      // Fill the authors select
      var array = JSON.parse(JSON.stringify(store.perms));
      var authors = JSON.parse(JSON.stringify(store.authorizedauthors));

      idau = 0;
      $("#selectmittente").empty();
      array.forEach((perm) => {
        if (perm.grant == "authors") {
          $("#selectmittente").append(
            '<option value="' +
              perm["object_id"] +
              '">' +
              authors[idau] +
              "</option>"
          );
          idau++;
        }
      });
    });

    // Second accordion (remove articles)
    $("#collapseTwo").on("show.bs.collapse", function () {
      idau = 0;
      $("#selectMittenteDel").empty();
      // Fill the authors select
      var array = JSON.parse(JSON.stringify(store.perms));
      var authors = JSON.parse(JSON.stringify(store.authorizedauthors));

      $("#selectMittenteDel").append('<option value=""></option>');
      array.forEach((perm) => {
        if (perm.grant == "authors") {
          $("#selectMittenteDel").append(
            '<option value="' +
              perm["object_id"] +
              '">' +
              authors[idau] +
              "</option>"
          );
          idau++;
        }
      });

      // Refresh the list of articles of the selected author
      $("#selectMittenteDel").change(function () {
        env.getArticlesFromAuthor();
      });

      // Refresh the list of articles based on the changed title
      $("#titoloArticoloDel").change(function () {
        env.getArticlesFromAuthor();
      });
    });

    //Fetch categories and fill the select
    axios
      .get(API_BASE_URL + "/tags")
      .then((response) => {
        response.data.tags.forEach((cat) => {
          var catname =
            cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase();
          $("#selectcategoria").append(
            '<option value="' + cat.name + '">' + catname + "</option>"
          );
        });
      })
      .catch((error) => {
        showToast("Errore nel caricamento delle categorie", "error");
        loggers.mainLogger.error("articoli", error);
      });

    //INSERTION FORM: On submission, check for field requirements and perform additional check on the image url field
    const forms = document.querySelectorAll("#articolo");
    Array.from(forms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          form.classList.add("was-validated");
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          } else {
            event.preventDefault();
            event.stopPropagation();

            var thumbnail = "",
              datetime;
            if (
              $("#copertinaArticolo").val() != "" &&
              !$("#copertinaArticolo")
                .val()
                .match(/^(http|https):\/\/[^ "]+$/)
            ) {
              $("#copertinaArticolo").addClass("is-invalid");
              return;
            } else {
              $("#copertinaArticolo").removeClass("is-invalid");
              thumbnail = $("#copertinaArticolo").val();
            }

            // Build and send the request
            $("#submit").attr("disabled", true);
            $("#submit").html("Invio...");
            var body = $("#editor").summernote("code");
            var data = {
              content: body,
              title: $("#titoloArticolo").val(),
              author_id: parseInt($("#selectmittente").val()),
              tag_id: $("#selectcategoria").val(),
            };

            datetime = window.extraorario.dates;
            var subtitle = $("#sottotitoloArticolo").val();

            if (datetime != null) {
              data["target_time"] = datetime.picked[0];
            }

            if (subtitle != "") {
              data["subtitle"] = subtitle;
            }

            if (marker != null) {
              data["latitude"] = marker.getLatLng().lat;
              data["longitude"] = marker.getLatLng().lng;
            }

            if (thumbnail != "") {
              data["image"] = thumbnail;
            }

            axios
              .post(API_BASE_URL + "/articles", data, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "Bearer " + localStorage.getItem("polifemo_access_token"),
                },
              })
              // If the request is successful, show a success toast, close and reset the form
              .then(function (response) {
                showToast("Articolo creato con successo", "success");
                var myCollapse = document.getElementById("collapseOne");
                new bootstrap.Collapse(myCollapse, {
                  toggle: true,
                });
                form.classList.remove("was-validated");
                loggers.mainLogger.info(
                  "articoli",
                  "Article created successfully"
                );
                form.reset();
                $("#extradiv").hide();
              })
              // If the request fails, show an error toast
              .catch(function (error) {
                loggers.mainLogger.error(
                  "articoli",
                  "Error while creating article"
                );
                loggers.mainLogger.error("articoli", error);
                showToast(
                  "Errore nella creazione dell'articolo: " +
                    error.response.data.error,
                  "error"
                );
              })
              // When the request is completed, re-enable the submit button
              .finally(function () {
                $("#submit").attr("disabled", false);
                $("#submit").html("Invia");
              });
          }
        },
        false
      );
    });

    // If the user lands on this page without a valid permission store, check for permissions once
    // the permissions-loaded event is received
    this.emitter.on("permissions-refreshed", () => {
      if (!checkPagePermission("authors")) {
        this.$router.push("/");
        showToast("Non hai i permessi per accedere alla pagina richiesta. Sei stato portato alla home.", "error");
      }
    });

    // If an article is deleted, remove it from the list
    this.emitter.on("article-deleted", (id) => {
      this.articles = this.articles.filter((article) => article.id != id);
    });

    // Initialize extra libraries (leaflet, tempusdominus, summernote).
    // Only needed if the article needs "extra" fields (location and/or date)
    document
      .getElementById("checkExtra")
      .addEventListener("change", function () {
        if (this.checked) {
          document.getElementById("extra-div").classList.remove("d-none");

          document.getElementById("extramappa").style.height = "400px";
          mappa = L.map("extramappa").setView([45.47812, 9.22818], 18);
          L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
            maxZoom: 20,
          }).addTo(mappa);

          mappa.on("click", function (e) {
            if (marker != null) {
              mappa.removeLayer(marker);
            }
            marker = new L.marker(e.latlng).addTo(mappa);
          });

          window.extraorario = new TempusDominus(
            document.getElementById("extraorario"),
            {
              display: {
                theme: store.darkModeEnabled ? "dark" : "light", // Display the correct theme based on the stored preference
              },
            }
          );

          // When editing the time, reduce the width of the widget
          $("#extraorario").on("update.td", function (e) {
            if (e.viewMode === "clock") {
              $(".tempus-dominus-widget").css("width", "150px");
            } else {
              $(".tempus-dominus-widget").css("width", "19rem");
            }
          });

        } else {
          document.getElementById("extra-div").classList.add("d-none");
        }
      });
  },

  methods: {
    getArticlesFromAuthor(more) {
      var id = $("#selectMittenteDel").val();
      var titolo = $("#titoloArticoloDel").val();
      // The empty author is selected
      if (id == 0) {
        return;
      }
      if (more) {
        this.deletedPageOffset++;
        $("#loadMore").html(
          "<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>"
        );
      }

      $("#loading").removeClass("d-none");
      var path =
        "/articles?author_id=" +
        id +
        "&limit=3&sort=date&pageOffset=" +
        this.deletedPageOffset;
      if (titolo != "") {
        this.deletedPageOffset = 0;
        path += "&title=" + titolo;
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
          $("#loading").addClass("d-none");
          $("#loadMore").html("Carica altri");
        });
      return;
    },
  },
};
</script>
