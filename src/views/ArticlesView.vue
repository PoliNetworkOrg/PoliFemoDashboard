<style>
@import "cherry-markdown/dist/cherry-markdown.css";
</style>
<template>
  <header>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
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
              <div class="form-floating">
                <select
                  id="selectmittente"
                  class="form-select"
                  aria-label="Seleziona mittente"
                  v-model="requestbody.author_id"
                />
                <label for="selectmittente">
                  Autore
                </label>  
              </div>
              <br />
              <div
                class="btn-group"
                role="group"
                aria-label="Language toggle button group"
              >
                <input
                  type="radio"
                  v-model="selectedLanguage"
                  v-on:click="saveAndLoadArticleContent($event.target)"
                  class="btn-check rounded-pill"
                  value="ita"
                  name="btnradio"
                  id="btnradioita"
                  autocomplete="off"
                  checked
                />
                <label class="btn btn-outline-primary" for="btnradioita"
                  >ITA</label
                >

                <input
                  type="radio"
                  v-model="selectedLanguage"
                  v-on:click="saveAndLoadArticleContent($event.target)"
                  class="btn-check rounded-end"
                  value="eng"
                  name="btnradio"
                  id="btnradioeng"
                  autocomplete="off"
                />
                <label class="btn btn-outline-primary" for="btnradioeng"
                  >ENG</label
                >
              </div>
              <div class="form-floating mb-3 mt-4">
                <input
                  id="titoloArticolo"
                  type="text"
                  class="form-control"
                  placeholder="Titolo articolo"
                  required
                />
                <label for="titoloArticolo">Titolo</label>
                <div class="invalid-feedback">
                  Il titolo non può essere vuoto.
                </div>
              </div>
              <div class="form-floating mb-3 mt-4">
                <input
                  id="sottArticolo"
                  type="text"
                  class="form-control"
                  placeholder="Sottotitolo articolo"
                />
                <label for="sottArticolo" class="form-label">
                  Sottotitolo
                </label>
              </div>
              <p>
                <a href="https://www.markdownguide.org/cheat-sheet/"
                  >Guida al Markdown</a
                >
              </p>
              <div id="editor-wrapper" class="mb-3 mt-3">
                <div id="markdown-editor" class="cherry-editor-height" />
              </div>
              <div class="form-floating mb-3 mt-4">
                <input
                  id="copertinaArticolo"
                  type="text"
                  class="form-control"
                  placeholder="URL immagine di copertina"
                  v-model="requestbody.image"
                />
                <label for="copertinaArticolo" class="form-label">
                  URL immagine di copertina
                </label>
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
              <div class="form-floating mb-3 mt-4">
                <select
                  id="selectcategoria"
                  class="form-select"
                  aria-label="Seleziona categoria"
                  v-model="requestbody.tag"
                  required
                />
                <label for="selectcategoria" class="form-label">Categoria</label>
              </div>
              <br />
              <p class="mb-1">
                Su quali piattaforme vorresti pubblicare l'articolo?
              </p>
              <div id="extraplat" class="form-check">
                <input
                  id="plat-app"
                  class="form-check-input"
                  type="checkbox"
                  value="1"
                />
                <label class="form-check-label ms-2" for="plat-app">
                  PoliFemo
                </label>
                <br />
                <input
                  id="plat-tg"
                  class="form-check-input"
                  type="checkbox"
                  value="2"
                />
                <label class="form-check-label ms-2" for="plat-tg">
                  Telegram (<a
                    href="https://t.me/poliassociazioni"
                    target="_blank"
                    >PoliAssociazioni</a
                  >)
                </label>
                <div class="invalid-feedback">
                  Devi selezionare almeno una piattaforma.
                </div>
              </div>
              <br />
              <div>
                <div
                  id="datetimepickerdelay"
                  class="input-group"
                  data-td-target-input="nearest"
                  style="width: 200px"
                  data-td-target-toggle="nearest"
                >
                  <label class="mb-1" for="datetimepickerdelay"
                    >Pubblicazione programmata</label
                  >
                  <input
                    id="datetimepicker2Input"
                    type="text"
                    class="form-control"
                    data-td-target="#datetimepickerdelay"
                  />
                  <span
                    class="input-group-text"
                    data-td-target="#datetimepickerdelay"
                    data-td-toggle="datetimepicker"
                  >
                    <span class="fas fa-calendar" />
                  </span>
                </div>
              </div>
              <div class="mt-4">
                <button
                  id="submit"
                  type="submit"
                  class="btn btn-primary rounded"
                >
                  Invia
                </button>
              </div>
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
            <div class="form-floating">
              <select
                id="selectMittenteDel"
                class="form-select"
                aria-label="Seleziona mittente"
              />
              <label for="selectMittenteDel" class="form-label">
                Autore
              </label>
            </div>
            <div class="form-floating mt-4">
              <input
                id="titoloArticoloDel"
                type="text"
                class="form-control"
                placeholder="Titolo articolo"
                required
              />
              <label for="titoloArticoloDel" class="form-label">Titolo</label>
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
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { TempusDominus } from "@eonasdan/tempus-dominus";
import { usePolifemoStore } from "@/stores/polifemo";
import "@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css";
import L, { icon, Marker } from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet-src.js";
import loggers from "@/plugins/ConsoleLoggers";
import axios from "axios";
import Cherry from "cherry-markdown/dist/cherry-markdown.core";
import { API_BASE_URL, checkPagePermission } from "@/plugins/AuthUtils";
import { showToast } from "@/plugins/ToastManager";
import ArticleListItem from "@/components/ArticleListItem.vue";

library.add(
  faChevronRight,
  faChevronLeft,
  faCalendar,
  faClock,
  faTrash,
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
      articlecontent: { ita: {}, eng: {} },
      cherryInstance: null,
      selectedLanguage: 'ita',
      requestbody: {}
    };
  },
  mounted() {
    const store = usePolifemoStore();
    let mappa,
      marker = null,
      idau = 0;

    // Initialize the markdown editor
    this.cherryInstance = this.startEditor();

    if (store.darkModeEnabled) {
      this.cherryInstance.setTheme("dark");
    }

    // First accordion (add articles)
    $("#accordionAggiungi").on("show.bs.collapse", function () {
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

    // Initialize the datepicker for the delay
    window.datetimepickerdelay = new TempusDominus(
      document.getElementById("datetimepickerdelay"),
      {
        display: {
          theme: store.darkModeEnabled ? "dark" : "light", // Display the correct theme based on the stored preference
          buttons: {
            clear: true
          }
        },
      }
    );

    // Second accordion (remove articles)
    $("#collapseTwo").on("show.bs.collapse", () => {
      idau = 0;
      this.articles = [];
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
      $("#selectMittenteDel").change(() => {
        this.getArticlesFromAuthor();
      });

      // Refresh the list of articles based on the changed title
      $("#titoloArticoloDel").change(() => {
        this.getArticlesFromAuthor();
      });
    });

    // Fetch categories and fill the select
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

    $("#datetimepickerdelay").on("change.td", () => (this.isDelayed = true));

    // INSERTION FORM: On submission, check for field requirements and perform additional check on the image url field
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

            // Generate the number from the selected platforms
            var selectedplats = 0;
            var allchecks = [];
            $("#extraplat input").each(function () {
              allchecks.push(this);
              if (this.checked) {
                selectedplats += parseInt(this.value);
              }
            });

            // Additional checks
            var validPlat = true;
            var validImageUrl = true;
            var validBody = true;

            // Check if at least one platform is selected
            if (selectedplats == 0) {
              allchecks.forEach((element) => {
                $(element).addClass("is-invalid");
              });
              validPlat = false;
            } else {
              allchecks.forEach((element) => {
                $(element).removeClass("is-invalid");
              });
              validPlat = true;
            }

            // Check if the body is not empty
            validBody = this.cherryInstance.getMarkdown() != "";

            // Check if the image url is valid
            var datetime;
            if (
              this.requestbody.image != "" &&
              !this.requestbody.image
                .match(/^(http|https):\/\/[^ "]+$/)
            ) {
              $("#copertinaArticolo").addClass("is-invalid");
              validImageUrl = false;
            } else {
              $("#copertinaArticolo").removeClass("is-invalid");
              validImageUrl = true;
            }

            if (!validPlat || !validImageUrl || !validBody) {
              return;
            }

            // Build and send the request
            $("#submit").attr("disabled", true);
            $("#submit").html("Invio...");

            this.articlecontent[this.selectedLanguage].title = $("#titoloArticolo").val();
            this.articlecontent[this.selectedLanguage].subtitle = $("#sottotitoloArticolo").val() || null;
            this.articlecontent[this.selectedLanguage].content = this.cherryInstance.getMarkdown();

            this.requestbody.content = [
                {
                  title: this.articlecontent.ita.title,
                  subtitle: this.articlecontent.ita.subtitle,
                  content: this.articlecontent.ita.content,
                },
                {
                  title: this.articlecontent.eng.title,
                  subtitle: this.articlecontent.eng.subtitle,
                  content: this.articlecontent.eng.content,
                }
            ],
              //author_id: parseInt($("#selectmittente").val()),
              //tag: $("#selectcategoria").val(),
            this.requestbody.platforms = selectedplats;           

            if (this.articlecontent.eng.title == null) {
              this.requestbody.content.pop();
            }

            datetime = window.extraorario.dates;

            if (datetime != null) {
              this.requestbody.target_time = datetime.picked[0];
            }

            if (marker != null) {
              this.requestbody.latitude = marker.getLatLng().lat;
              this.requestbody.longitude = marker.getLatLng().lng;
            }

            if (this.requestbody.image == "") {
              this.requestbody.image = null;
            }

            var delayedrelease = window.datetimepickerdelay.dates;
            if (delayedrelease.picked.length > 0) {
              this.requestbody.hidden_until = delayedrelease.picked[0];
            }
            
            axios
              .post(API_BASE_URL + "/articles", this.requestbody, {
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
        showToast(
          "Non hai i permessi per accedere alla pagina richiesta. Sei stato portato alla home.",
          "error"
        );
      }
    });

    // If an article is deleted, remove it from the list
    this.emitter.on("article-deleted", (id) => {
      this.articles = this.articles.filter((article) => article.id != id);
    });

    // Initialize extra libraries (leaflet, tempusdominus).
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
        "&limit=3&sort=date&platform=3&pageOffset=" +
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
    saveAndLoadArticleContent(el) {
      // If the button clicked is the english one, save the italian content and load the english one
      if (el.id == "btnradioita") {
        this.articlecontent.eng.title = $("#titoloArticolo").val();
        this.articlecontent.eng.subtitle = $("#sottArticolo").val();
        this.articlecontent.eng.content = this.cherryInstance.getMarkdown();

        $("#titoloArticolo").val(this.articlecontent.ita.title);
        $("#sottArticolo").val(this.articlecontent.ita.subtitle);
        this.cherryInstance = this.startEditor(this.articlecontent.ita.content || "");

      } else {
        this.articlecontent.ita.title = $("#titoloArticolo").val();
        this.articlecontent.ita.subtitle = $("#sottArticolo").val();
        this.articlecontent.ita.content = this.cherryInstance.getMarkdown();

        $("#titoloArticolo").val(this.articlecontent.eng.title);
        $("#sottArticolo").val(this.articlecontent.eng.subtitle);
        this.cherryInstance = this.startEditor(this.articlecontent.eng.content || "");
        ///this.startEditor(this.cherryInstance, this.articlecontent.eng.content || "# hello");
      }
    },
    startEditor(value) {
      loggers.mainLogger.info("articoli", "Starting editor");
      // Due to a bug (which is marked as fixed on GitHub...) we need to destroy the instance and recreate it
      var editor = $("#editor-wrapper").children()[0];
      $(editor).remove();
      //$("#editor-wrapper").empty();
      $("#editor-wrapper").append(
        "<div id='markdown-editor' class='cherry-editor-height'></div>",
      );

      return new Cherry({
        id: "markdown-editor",
        value: value || "",
        toolbars: {
          showToolbar: true,
          toolbar: [
            "bold",
            "italic",
            "strikethrough",
            "underline",
            "sub",
            "sup",
            "quote",
            "|",
            "size",
            "|",
            "checklist",
            "list",
            "link",
            "table",
          ],
          bubble: [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "sub",
            "sup",
            "quote",
          ],
          float: []
        },
        locale: 'en_US'
      });
    }
  },
};
</script>
