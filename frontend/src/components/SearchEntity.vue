<!-- TODO: pedi ao chat para fazer o layout usando o Quasar, q-table e q-btn, manter assim   -->
<template>
  <div class="search">
    <div class="filters">
      <!-- Slot for filter fields -->
      <slot name="filters"></slot>

      <!-- Button to initiate the search and clear filters -->
      <q-btn @click="searchEntity" label="Search"></q-btn>
      <q-btn @click="clearEntityFilters" label="Clear filters"></q-btn>
    </div>

    <!-- Table to display the search results -->
    <q-table
      :rows="searchResults"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:body-cell-action="{ row }">
        <!-- Slot for result column -->
        <slot name="resultColumn" :item="row"></slot>
      </template>
      <template v-slot:no-data>
        No results found
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, ref} from "vue";

const props = defineProps({
  searchEntityService: Object,
  initialQuery: Object,
  columns: Array,
});

const emits = defineEmits(["select"]);

const page = ref(1);
const searchQuery = ref("");
const searchResults = ref([]);

const searchEntity = async () => {
  try {
    if (props.searchEntityService) {
      searchResults.value = await props.searchEntityService.search({
        searchQuery: searchQuery.value,
        page: page.value,
        itemsPerPage: 10 // Limiting the items per page to 10
      });
    }
  } catch (error) {
    console.error("Error searching:", error);
  }
};

const clearEntityFilters = async () => {
  searchQuery.value = "";
  try {
    if (props.searchEntityService) {
      const allItems = await props.searchEntityService.getAll();
      searchResults.value = allItems || [];
    }
  } catch (error) {
    console.error("Error getting all items:", error);
  }
};

const selectItem = (item: any) => {
  emits("select", item);
};

</script>

<style scoped>
.search {
  max-width: 800px;
  margin: 0 auto;
}

.filters {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
