import { nextTick, Ref } from 'vue';
import { createI18n, I18nOptions, I18n } from 'vue-i18n';
import buildYup from '@/core/plugins/yup';
import Api from './Api';

export const SUPPORT_LOCALES = ['en', 'ru'];

export type I18nInstance = I18n & { global: { t: (val: string) => string; locale: Ref<string> } };

export let i18n: I18nInstance;

export async function setupI18n() {
  const browserLanguage = navigator.language.split('-')[0];
  const locale = SUPPORT_LOCALES.includes(browserLanguage) ? browserLanguage : 'en';

  const options: I18nOptions = {
    legacy: false,
    locale: locale,
    fallbackLocale: 'en',
    globalInjection: true,
  };
  i18n = createI18n(options) as I18nInstance;

  setI18nLanguage(i18n, locale);
  await loadLocaleMessages(i18n, locale);

  return i18n;
}

export function setI18nLanguage(i18n: I18nInstance, locale: string) {
  i18n.global.locale.value = locale;
  Api.getInstance.setLanguage(locale);
}

export async function loadLocaleMessages(i18n: I18nInstance, locale: string) {
  const messages = await import(`../../assets/locale/${locale}.json`);

  i18n.global.setLocaleMessage(locale, messages.default);
  buildYup(i18n);

  return nextTick();
}
