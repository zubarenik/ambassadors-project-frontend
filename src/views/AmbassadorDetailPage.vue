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
            class="h-[399px] w-[355px] cursor-pointer rounded-xl bg-cover bg-center md:h-[620px] md:w-[700px]"
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
            class="h-[108px] w-[100px] cursor-pointer rounded-xl bg-cover bg-center md:h-[203px] md:w-[233px]"
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

    <div class="relative mt-10 grid grid-cols-1 gap-8 rounded-3xl bg-primary p-5 md:grid-cols-2">
      <p class="whitespace-pre-line text-center text-2xl font-medium text-white sm:text-left md:text-3xl lg:text-5xl">
        {{ 'Проголосовать \n за кандидата' }}
      </p>

      <AppIcon
        name="geo-2"
        class="absolute bottom-8 left-8 hidden text-[#7D68E4] md:block md:text-[200px] lg:text-[400px]"
      />

      <AppForm class="space-y-6" v-model="user" v-slot="{ valid }" :schema="schema">
        <TextField name="name" placeholder="Ваше имя">
          <template #label> {{ 'Имя' }}<AppRequired /> </template>
        </TextField>
        <TextField name="surname" placeholder="Ваша фамилия">
          <template #label> {{ 'Фамилия' }}<AppRequired /> </template>
        </TextField>
        <TextField name="age" placeholder="Ваш возраст" number :min="1" hide-controls>
          <template #label> {{ 'Сколько вам лет?' }}<AppRequired /> </template>
        </TextField>
        <TextField name="email" placeholder="Введите email">
          <template #label> {{ 'Email' }}<AppRequired /> </template>
        </TextField>
        <ArrayField name="question" :schema="schemaQuestion">
          <template #1>
            <HugeTextField name="answer" placeholder="Опишите здесь">
              <template #label> {{ 'Какие самые запоминающиеся места вы посетили?' }}<AppRequired /> </template>
            </HugeTextField>
          </template>
          <template #2>
            <SelectField name="answer" :options="options" placeholder="Выберете один из вариантов">
              <template #label> {{ 'Как часто путешествуете?' }}<AppRequired /> </template>
            </SelectField>
          </template>
        </ArrayField>
        <CheckboxField name="checkBoxMailing">{{ 'Я согласен на получение рассылки от РГО' }}</CheckboxField>
        <CheckboxField name="checkBoxData">
          {{ 'Я согласен на обработку персональных данных' }}<AppRequired />
        </CheckboxField>
        <AppButton class="w-full" reversed :disabled="!valid || fetching" @click="save">
          {{ valid ? 'Голосовать' : 'Заполните все поля' }}<AppRequired v-if="!valid" />
          <AppLoader v-if="fetching" rotating :size="20" class="absolute right-5" />
        </AppButton>
      </AppForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import useAmbassadorsStore, { IQuestion, IUser } from '@/store/ambassadors';
import { storeToRefs } from 'pinia';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import { string, object, AnySchema, array, boolean, number, mixed, lazy } from 'yup';
import { useAppToast } from '@/core/plugins/useAppToast';

const toast = useAppToast();

const ambassadorStore = useAmbassadorsStore();
const { getAmbassador } = storeToRefs(ambassadorStore);
const { fetchAmbassador, saveUser } = ambassadorStore;

const route = useRoute();
const ambassadorID = computed(() => Number(route.params.id));

const loading = ref(true);
const points = ref<Array<IQuestion & { hide: boolean; active?: boolean }>>([]);

const currentSlide = ref(0);
const slideTo = (slide: number) => {
  currentSlide.value = slide;
};

const user = ref<IUser>({
  question: [
    {
      question: 'Какие самые запоминающиеся места вы посетили?',
    },
    {
      question: 'Как часто путешествуете?',
    },
  ],
  checkBoxMailing: true,
} as IUser);

const options = [
  {
    id: 1,
    name: 'Раз в год',
  },
  {
    id: 2,
    name: 'Раз в полгода',
  },
  {
    id: 3,
    name: 'Раз в месяц',
  },
  {
    id: 4,
    name: 'Чаще',
  },
];

const fetching = ref(false);
const save = async () => {
  fetching.value = true;

  const data = {
    ...user.value,
    question: [
      user.value.question[0],
      { question: user.value.question[1].question, answer: user.value.question[1].answer.name },
    ],
  };

  await saveUser(data)
    .then(() => {
      toast.success('Ваш голос успешно сохранен!');
    })
    .catch(() => {
      toast.error('Проголосовать можно только один раз');
    });

  fetching.value = false;
};

onMounted(async () => {
  loading.value = true;

  user.value.ambassadorId = ambassadorID.value;

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

const schema: AnySchema = object().shape({
  name: string().nullable().required(),
  surname: string().nullable().required(),
  age: number().nullable().required(),
  email: string().nullable().email('Введите корректный email').required(),
  question: array().min(1).nullable().required(),
  checkBoxData: boolean().isTrue().required(),
});

const schemaQuestion: AnySchema = object().shape({
  question: string().nullable().required(),
  answer: lazy((value) => {
    switch (typeof value) {
      case 'object':
        return object().nullable().required();
      case 'string':
        return string().nullable().required();
      default:
        return mixed().nullable().required();
    }
  }),
});
</script>

<style lang="scss">
#thumbnails {
  .carousel__track {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }

  .carousel__viewport {
    overflow: visible !important;
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

  @screen md {
    .carousel__slide {
      display: flex;
      justify-content: start;
    }
  }
}
</style>
