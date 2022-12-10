import { defineStore } from "pinia";

export const usePolifemoStore = defineStore({
  id: "polifemo",
  state: () => ({
    loggedIn: false,
    darkModeEnabled: false,
    perms: [],
    authorizedauthors: [],
  }),
});
