import { IAmbassadorApi } from './ambassadors';

export const ambassadorsExample: IAmbassadorApi[] = [
  {
    id: 1,
    fullName: 'Зубарев Никита',
    age: 21,
    sex: true,
    placeBorn: 'Москва',
    placeLive: 'Москва',
    social: '',
    typeTourist: 'организованный турист',
    category: 1,
    generalQuestions: [
      {
        question: 'Опишите в 3 фразах, что для вас означает понятие «устойчивый туризм»',
        answer: 'Текст текст текст текст',
      },
      {
        question: 'Что по вашему мнению может вовлечь туристов в научно-популярный туризм',
        answer: 'пример пример пример',
      },
      {
        question: 'Предложите идею своего научно-популярного тура с обоснованием его актуальности',
        answer: 'Раз два три',
      },
    ],
    specialQuestions: [
      {
        question: 'ваш общий стаж путешественника, в странах (какое количество стран вы посетили)',
        answer: 'Раз два три',
      },
      {
        question: ' в каких научно-популярных турах вы принимали участие (страна/регион/тематика)',
        answer: 'Раз два три',
      },
      {
        question:
          'поделитесь опытом своего самого интересного научного путешествия (опишите в нескольких предложениях ваше научное путешествие и почему он для вас стал самым интересным)',
        answer: 'Раз два три',
      },
    ],
    winner: false,
    photos: [
      'https://s3-alpha-sig.figma.com/img/6004/ecee/14f8d8967d2fce38771fd25d785afb01?Expires=1711929600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MQNYvOT57J9nRVaoZYeBtmD-ICmnN7oisFNUGZKpBk2IcUIwhQ9tMtK5cbnmSeMYwlb2WS7zmF8Wx-gdpUfB8MmH2nynLH7YWpHQnra3Wd85~qWFPQOLdkWnLw5tK1F2HDEZql7A~JJ1wLrvM2OJRaOP86qrG8rcLXtVjQHHVsG7ueaV4kie77zmTAkkjO6x9ikyW3cynYcmSgv3WlBDkVREVlTen5CiZHiaoY73I0ksqw~0s3k5H1igIuB-wCiZzZ5B35O0sFM-zh2wrSB09PIak5Kd1Z3bMFtgA6grpuSxqWhh-~Sz-xHSxrwZbS9fToYq1Ergy~ag47XV3lQGow__',
    ],
  },
  {
    id: 2,
    fullName: 'Никитин Никита',
    age: 21,
    sex: true,
    placeBorn: 'Москва',
    placeLive: 'Москва',
    social: '',
    typeTourist: 'организованный турист',
    category: 2,
    generalQuestions: [
      {
        question: 'Опишите в 3 фразах, что для вас означает понятие «устойчивый туризм»',
        answer:
          'Текст текст текст текст Текст текст текст текст Текст текст текст текст Текст текст текст текст Текст текст текст текст Текст текст текст текст Текст текст текст текст Текст текст текст текст Текст текст текст текст Текст текст текст текст',
      },
      {
        question: 'Что по вашему мнению может вовлечь туристов в научно-популярный туризм',
        answer: 'пример пример пример',
      },
      {
        question: 'Предложите идею своего научно-популярного тура с обоснованием его актуальности',
        answer: 'Раз два три',
      },
    ],
    specialQuestions: [
      {
        question: 'ваш общий стаж путешественника, в странах (какое количество стран вы посетили)',
        answer: 'Раз два три',
      },
      {
        question: ' в каких научно-популярных турах вы принимали участие (страна/регион/тематика)',
        answer: 'Раз два три',
      },
      {
        question:
          'поделитесь опытом своего самого интересного научного путешествия (опишите в нескольких предложениях ваше научное путешествие и почему он для вас стал самым интересным)',
        answer: 'Раз два три',
      },
    ],
    winner: false,
    photos: [
      'https://s3-alpha-sig.figma.com/img/4877/1ac4/c1f14a9b37fef09eb5745b5289793e7e?Expires=1711929600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=cL62USTYWbQTtq36CfdNnnABrAxjQeYcdqD9Rfx0llCI7RB7bLzzOBdU7XWpNVEAWWcRkP41RyNnzhtcWSVrz~D1Q-CNjQCE4Dvxso-2Xy70g~QKmHtn-e23ngHP6U4jP65f6ztCkTrRHXj10-YaTznxAnsGxty1YHtFxZ4JH9-Q4o~m5FR~4-fv-yAVWDpAUVtGQkxtgz0WNYx~zwTWw~yIzEgLg8B5D7Zeku0ceh~mttFmmQgo38qTasVTGWXRqb-el7xtsRuDBEzTFIELZk2eJXWb5sdPtP2K4SgiYGC6orsbXTJiKTPn-UZsvapzUyRf918J3I0EDL0UzyLq5A__',
    ],
  },
  {
    id: 3,
    fullName: 'Паша',
    age: 21,
    sex: true,
    placeBorn: 'Москва',
    placeLive: 'Москва',
    social: '',
    typeTourist: 'организованный турист',
    category: 3,
    generalQuestions: [
      {
        question: 'Опишите в 3 фразах, что для вас означает понятие «устойчивый туризм»',
        answer: 'Текст текст текст текст',
      },
      {
        question: 'Что по вашему мнению может вовлечь туристов в научно-популярный туризм',
        answer: 'пример пример пример',
      },
      {
        question: 'Предложите идею своего научно-популярного тура с обоснованием его актуальности',
        answer: 'Раз два три',
      },
    ],
    specialQuestions: [
      {
        question: 'ваш общий стаж путешественника, в странах (какое количество стран вы посетили)',
        answer: 'Раз два три',
      },
      {
        question: ' в каких научно-популярных турах вы принимали участие (страна/регион/тематика)',
        answer: 'Раз два три',
      },
      {
        question:
          'поделитесь опытом своего самого интересного научного путешествия (опишите в нескольких предложениях ваше научное путешествие и почему он для вас стал самым интересным)',
        answer: 'Раз два три',
      },
    ],
    winner: false,
    photos: [
      'https://s3-alpha-sig.figma.com/img/f124/53b8/d0e7ff231a66c3a3635db71a386d4762?Expires=1711929600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=nPrW7xEEdE0uANSWtcuBTiiP~5dFB3kfzSKlGFkl~6415TLlqtcIwONiCCN~eJUs~ToFloK2CUm5Sp81kyw6iwzZyoMBc5CcWnDrBvw1ouui4GJgkWOljeKfcQoh4EX4jfjXkterXlmQ9mIgP97ACEw5TJSg9oftvPoQPXXdk3RuMt~FxUyu9tFYGfXXCnR0~LrpJqwL~CG1F5WUMZTYW6eUpc5tMQh8RSFVmp6nBi26d~waZNY22SAyHLBbgE7N4gMW671x7WBkhz~6KRZIWgFN5DJgWA2jAfyoYexILRL3Ii1GMPSE1zyevz6O6ey0yWZtnwsnMROJ-q2sNHBUiw__',
    ],
  },
];
