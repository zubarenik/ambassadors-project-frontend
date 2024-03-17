import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'virtual:svg-icons-register';
import registerComponents from '@/components/register';
import { setupI18n } from '@/core/services/I18n';
import { createPinia } from 'pinia';
import { createVfm } from 'vue-final-modal';
import Toast from 'vue-toastification';

import '@/assets/scss/index.scss';
import 'vue-final-modal/style.css';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(router);

const pinia = createPinia();
app.use(pinia);

registerComponents(app);

const vfm = createVfm();
app.use(vfm);

app.use(Toast, { shareAppContext: true, containerClassName: 'app-toast-container', transition: 'slide-left' });

setupI18n().then((i18n) => {
  app.use(i18n);

  app.mount('#app');
});
