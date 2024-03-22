<template>
  <div class="px-8">
    <h1 class="text-2xl font-semibold uppercase text-primary md:text-4xl lg:text-7xl">
      {{ 'Результаты конкурса' }}
    </h1>

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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import useAmbassadorsStore from '@/store/ambassadors';

const ambassadorStore = useAmbassadorsStore();
const { getAmbassadorList } = storeToRefs(ambassadorStore);
const { fetchAmbassadorsWinners } = ambassadorStore;

const loading = ref<boolean>(false);

function setLoading(value: boolean) {
  loading.value = value;
}

onMounted(async () => {
  setLoading(true);
  await fetchAmbassadorsWinners();
  setLoading(false);
});
</script>
