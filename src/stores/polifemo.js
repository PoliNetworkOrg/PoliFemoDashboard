import { defineStore } from "pinia";

export const usePolifemoStore = defineStore({
  id: "polifemo",
  state: () => ({
    userid: "",
    loggedIn: false,
    darkModeEnabled: false,
    perms: [],
    authorizedauthors: []
  })
});
