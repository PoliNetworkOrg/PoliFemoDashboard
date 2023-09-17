<script setup>
import {
  faMoon,
  faSun,
  faNewspaper,
  faTag
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faMoon, faSun, faNewspaper, faTag);

defineProps({
  dest: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  permission: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div v-if="hasPermission($props.permission)">
    <li class="nav-item ms-3 bar-section">
      <a class="nav-link" @click="$router.push($props.dest)">
        <table>
          <tr>
            <td class="text-center">
              <i :class="['fas', 'fa-lg', $props.icon]" />
            </td>
          </tr>
          <tr>
            <td>
              {{ title }}
            </td>
          </tr>
        </table>
      </a>
    </li>
  </div>
</template>

<script>
import { usePolifemoStore } from "@/stores/polifemo";

export default {
  methods: {
    hasPermission: function (permission) {
      const store = usePolifemoStore();
      var f = 0;
      var array = JSON.parse(JSON.stringify(store.perms));
      array.forEach((per) => {
        if (per.grant == permission) {
          f++;
        }
      });
      if (f > 0) return true;
    }
  }
};
</script>
