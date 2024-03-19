<template>
  <div class="space-y-10 px-8 lg:space-y-48">
    <div
      class="h-[600px] w-full rounded-3xl bg-cover bg-fixed bg-center bg-no-repeat"
      :style="{ 'background-image': `url(${useImage('welcome-1.jpeg')})` }"
    >
      <div class="flex h-full w-full flex-col items-center justify-end rounded-3xl bg-[#00000099] p-4 text-center">
        <h1 class="text-6xl font-medium uppercase md:text-7xl lg:text-8xl xl:text-9xl">{{ 'Конкурс послов' }}</h1>
        <p class="w-full text-lg md:w-2/3">
          {{
            'Миссия РГО - сблизить людей и природу России. Присоединись к нашей команде. Стань послом-путешественником РГО'
          }}
        </p>
        <AppButton class="mt-10 w-full" :router-link="{ name: 'ambassadors' }">{{ 'Голосовать' }}</AppButton>
      </div>
    </div>

    <div>
      <div class="flex flex-col items-center justify-center rounded-3xl bg-primary p-5 md:p-10 lg:p-16">
        <h1 class="whitespace-pre-line text-center text-xl font-medium uppercase md:text-4xl lg:text-6xl xl:text-7xl">
          {{ 'Откройте новые горизонты: \n Цель Конкурса послов-путешественников РГО' }}
        </h1>
        <div class="mt-10 grid w-full grid-cols-1 gap-4 text-center md:w-2/3 md:grid-cols-2 md:text-start">
          <p>
            {{
              'Приглашаем вас в захватывающее приключение - Конкурс послов-путешественников РГО! Наша цель - поддержать вас в вашем стремлении к открытиям, к исследованиям самых таинственных и прекрасных уголков планеты.'
            }}
          </p>
          <p>
            {{
              'Наша цель - вдохновить и поддержать исследователей-любителей в их стремлении раскрыть тайны удивительных мест и культур. Этот конкурс предоставляет возможность поделиться вашими открытиями с миром.'
            }}
          </p>
        </div>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-3 text-primary sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(item, index) in infoCases"
          :key="index"
          class="flex flex-col justify-between rounded-3xl border-2 border-purple p-5 sm:last:col-span-2 lg:last:col-span-1"
          style="height: 208px"
        >
          <b class="uppercase">{{ item.name }}:</b>
          <p class="whitespace-pre-line">{{ item.text }}</p>
        </div>
      </div>
    </div>

    <div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(item, index) in categories"
          :key="index"
          class="flex flex-col justify-between rounded-3xl bg-primary p-5 sm:last:col-span-2 lg:last:col-span-1"
          style="height: 208px"
        >
          <b class="text-xl">{{ item.name }}</b>
          <p class="whitespace-pre-line">{{ item.text }}</p>
        </div>
      </div>

      <AppButton class="mt-5 w-full" reversed :router-link="{ name: 'ambassadors' }">{{ 'Выбор посла' }}</AppButton>
    </div>

    <div class="mt-5 grid grid-cols-1 gap-3 text-primary sm:grid-cols-2">
      <div
        v-for="(item, index) in steps"
        :key="index"
        class="relative flex flex-col justify-between rounded-3xl border-2 border-purple p-4"
        style="height: 287px"
      >
        <b class="text-6xl uppercase">{{ item.name }}</b>

        <div class="space-y-2">
          <b class="whitespace-pre-line text-xl">{{ item.text }}</b>
          <p class="static right-4 top-4 w-fit rounded-full border-2 border-primary px-4 py-2 text-primary lg:absolute">
            {{ item.date }}
          </p>
        </div>
      </div>
    </div>

    <div
      class="h-[500px] w-full rounded-3xl bg-cover bg-fixed bg-center bg-no-repeat"
      :style="{ 'background-image': `url(${useImage('welcome-2.jpeg')})` }"
    />

    <div class="flex flex-col items-center rounded-3xl bg-primary p-3 text-center text-white">
      <AppIcon name="geo" class="text-9xl" />
      <h1
        class="mt-8 whitespace-pre-line text-center text-3xl font-medium uppercase md:text-4xl lg:text-6xl xl:text-7xl"
      >
        {{ 'Исследуй, Обучайся, \n Развивайся' }}
      </h1>
      <p class="mt-3 w-full sm:w-2/3">
        {{ 'Будь в курсе последних новостей, узнавай об увлекательных приключениях! Подпишись сейчас!' }}
      </p>
      <AppButton class="mt-14 w-full" reversed :router-link="{ name: 'ambassadors' }">{{ 'Голосовать' }}</AppButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useImage } from '@/core/utils/image';

const infoCases = [
  {
    name: 'Формат',
    text: 'Конкурс – всероссийское \n голосование',
  },
  {
    name: 'Победители',
    text: 'По результатам голосования \n и по предложению от ареопага - 10 послов',
  },
  {
    name: 'Призовой фонд',
    text: 'Брендированная одежда. \n Участие в экспедиции РГО 2024',
  },
];

const categories = [
  {
    name: 'Путешественник-энтузиаст',
    text: 'Опыт научно-популярных \n и осознанных путешествий',
  },
  {
    name: 'Медиалидер',
    text: 'Вовлечение аудитории в \n осознанные путешествия',
  },
  {
    name: 'Популяризатор науки',
    text: 'Изучение вопросов развития научно-\nпопулярного и устойчивого туризма',
  },
];

const steps = [
  {
    name: '01',
    text: 'Этап сбора \n анкет кандидатов',
    date: 'Пройдет с 1 марта по 31 марта',
  },
  {
    name: '02',
    text: 'Этап \n голосования',
    date: 'Пройдет с 1 марта по 31 марта',
  },
  {
    name: '03',
    text: 'Этап подведения \n итогов',
    date: 'Пройдет с 1 марта по 31 марта',
  },
  {
    name: '04',
    text: 'Оглашение \n результатов',
    date: 'Пройдет с 1 марта по 31 марта',
  },
];
</script>
