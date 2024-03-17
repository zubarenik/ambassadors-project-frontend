import { useToast, PluginOptions } from 'vue-toastification';
import AppToast from '@/components/toast/AppToast.vue';

export enum AppToastModes {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

const toastBase = { component: AppToast };

const defaultOptions: PluginOptions = {
  timeout: false,
  toastClassName: '!p-0 !overflow-visible !bg-transparent !min-h-0',
  icon: false,
  closeButton: false,
};

export function useAppToast({ timeout = 4000 } = {}) {
  const toast = useToast();

  return {
    success(text: string) {
      const id = toast({ ...toastBase, props: { text, mode: AppToastModes.SUCCESS } }, defaultOptions);
      setTimeout(() => toast.dismiss(id), timeout);
    },
    error(text: string) {
      const id = toast({ ...toastBase, props: { text, mode: AppToastModes.ERROR } }, defaultOptions);
      setTimeout(() => toast.dismiss(id), timeout);
    },
    warning(text: string) {
      const id = toast({ ...toastBase, props: { text, mode: AppToastModes.WARNING } }, defaultOptions);
      setTimeout(() => toast.dismiss(id), timeout);
    },
  };
}
