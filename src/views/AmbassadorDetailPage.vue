<template>
  <div v-if="loading" class="flex h-[calc(100vh-var(--header-h-lg)-60px)] w-full items-center justify-center">
    <AppLoader rotating />
  </div>
  <div v-else class="px-8 text-primary">
    <div>
      <p class="text-2xl font-bold uppercase md:text-4xl lg:text-7xl">{{ getAmbassador.fullName }}</p>
      <p class="mt-5">{{ getAmbassador.category.name }}</p>
      <p class="mt-5 line-clamp-3 w-full text-xl md:w-1/2 lg:w-1/3">{{ getAmbassador.generalQuestions[0].answer }}</p>
    </div>

    <div class="mt-10 grid grid-cols-1 gap-5 md:grid-cols-5">
      <Carousel
        id="gallery"
        :items-to-show="1"
        :wrap-around="true"
        v-model="currentSlide"
        class="order-1 md:order-2 md:col-span-4"
        :autoplay="3000"
      >
        <Slide v-for="slide in 3" :key="slide">
          <div
            class="h-[399px] w-[355px] cursor-pointer rounded-xl bg-cover bg-center md:h-[623px] md:w-[720px]"
            :style="{ 'background-image': `url(${getAmbassador.photos[slide - 1]}` }"
            @click="slideTo(slide - 1)"
          />
        </Slide>
      </Carousel>

      <Carousel
        id="thumbnails"
        :items-to-show="3"
        :wrap-around="false"
        v-model="currentSlide"
        class="order-2 md:order-1"
      >
        <Slide v-for="slide in 3" :key="slide">
          <div
            class="h-[108px] w-[112px] cursor-pointer rounded-xl bg-cover bg-center md:h-[201px] md:w-[233px]"
            :style="{ 'background-image': `url(${getAmbassador.photos[slide - 1]}` }"
            @click="slideTo(slide - 1)"
          />
        </Slide>
      </Carousel>
    </div>

    <div class="mt-5">
      <div
        v-for="(point, index) in points"
        :key="index"
        class="relative flex w-full cursor-pointer flex-col items-start justify-between gap-3 border-b-2 border-primary pb-3 pt-5 md:flex-row md:items-center"
        @click="() => point.hide && (point.active = !point.active)"
      >
        <b :class="{ 'w-5/6 md:w-full': !point.active, 'w-5/6 md:w-1/3': point.active }">{{ point.question }}</b>
        <p v-if="!point.hide || point.active" :class="{ 'md:w-1/3': point.hide }">{{ point.answer }}</p>
        <AppIcon v-if="point.active" name="x" class="absolute right-0 top-5 text-3xl md:static md:text-5xl" />
        <AppIcon
          v-else-if="point.hide && !point.active"
          name="plus"
          class="absolute right-0 top-5 text-3xl md:static md:text-5xl"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import useAmbassadorsStore, { IQuestion } from '@/store/ambassadors';
import { storeToRefs } from 'pinia';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

const ambassadorStore = useAmbassadorsStore();
const { getAmbassador } = storeToRefs(ambassadorStore);
const { fetchAmbassador } = ambassadorStore;

const route = useRoute();
const ambassadorID = computed(() => Number(route.params.id));

const loading = ref(true);
const points = ref<Array<IQuestion & { hide: boolean; active?: boolean }>>([]);

const currentSlide = ref(0);
const slideTo = (slide: number) => {
  currentSlide.value = slide;
};

onMounted(async () => {
  loading.value = true;

  await fetchAmbassador(ambassadorID.value);

  const base: Array<IQuestion & { hide: boolean; active?: boolean }> = [
    {
      question: 'Город',
      answer: getAmbassador.value.placeLive,
      hide: false,
    },
    {
      question: 'Возраст',
      answer: '' + getAmbassador.value.age,
      hide: false,
    },
  ];
  points.value = [
    ...base,
    ...getAmbassador.value.generalQuestions.map((question) => {
      return {
        ...question,
        hide: true,
        active: false,
      };
    }),
    ...getAmbassador.value.specialQuestions.map((question) => {
      return {
        ...question,
        hide: true,
        active: false,
      };
    }),
  ];

  loading.value = false;
});
</script>

<style lang="scss">
#thumbnails {
  .carousel__track {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }

  @screen md {
    .carousel__track {
      display: flex;
      flex-direction: column;
    }

    .carousel__slide {
      width: 100% !important;
    }
  }
}

#gallery {
  .carousel__track {
    height: 100%;
    width: 100%;
  }
}
</style>
