<template>
  <div class="px-8">
    <h1 class="text-2xl font-semibold uppercase text-primary md:text-4xl lg:text-7xl">
      {{ 'Выбери своего посла' }}
    </h1>

    <div>
      <p class="mt-5 flex items-center gap-5 text-3xl font-semibold text-primary">
        {{ 'Категории' }} <AppLoader v-if="loading" rotating />
      </p>

      <div class="mt-7 flex flex-wrap items-center gap-3">
        <AppButton
          v-for="category in ambassadorCategories"
          :key="category.id"
          @click="handleCategory(category)"
          :reversed="category.id !== filters.category?.id"
        >
          {{ category.name }}
        </AppButton>
      </div>
    </div>

    <div class="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2">
      <div
        v-for="item in getAmbassadorList"
        :key="item.id"
        class="flex h-[776px] flex-col rounded-3xl border-2 border-primary p-5 text-primary"
      >
        <div
          class="relative h-[436px] w-full rounded-[10px] bg-cover bg-center bg-no-repeat"
          :style="{ 'background-image': `url(${item.photos[0]})` }"
        >
          <div class="absolute left-5 top-5 rounded-full border-2 border-white px-3 py-2 text-white">
            {{ item.category.name.trim().split(/[\s-]+/)[0] }}
          </div>
        </div>

        <div class="mt-5">
          <p class="text-xl font-semibold">{{ item.fullName }}</p>
          <p>{{ item.typeTourist }}</p>
          <p class="mt-5 line-clamp-4">{{ item.generalQuestions[0].answer }}</p>
        </div>

        <div class="flex flex-grow items-end">
          <AppButton class="w-full" :router-link="{ name: 'ambassador-detail', params: { id: item.id } }">
            {{ 'Голосовать' }}
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onActivated, watch } from 'vue';
import { storeToRefs } from 'pinia';
import useAmbassadorsStore, {
  ambassadorCategories,
  IAmbassadorFilters,
  IAmbassadorFiltersApi,
  IAmbassadorCategory,
} from '@/store/ambassadors';
import isEqual from 'lodash.isequal';

const ambassadorStore = useAmbassadorsStore();
const { getAmbassadorList } = storeToRefs(ambassadorStore);
const { getNormalizedFilters, fetchAmbassadors } = ambassadorStore;

const loading = ref<boolean>(false);
const filters = ref<IAmbassadorFilters>({} as IAmbassadorFilters);
let apiParamsPrevState: IAmbassadorFiltersApi;

const handleCategory = (category: IAmbassadorCategory) => {
  filters.value.category = filters.value.category?.id === category.id ? null : category;
};

watch(
  () => filters.value,
  () => {
    if (!loading.value) handleFetch();
  },
  { deep: true }
);

async function handleFetch(reload = false) {
  const params: IAmbassadorFiltersApi = {
    ...getNormalizedFilters(filters.value),
  };

  if (isEqual(apiParamsPrevState, params) && !reload) {
    return;
  } else {
    apiParamsPrevState = params;
  }

  setLoading(true);

  await fetchAmbassadors(params);

  setLoading(false);
}

function setLoading(value: boolean) {
  loading.value = value;
}

onActivated(async () => {
  await handleFetch(true);
});
</script>
