import { RawProps, useModal } from 'vue-final-modal';
import ModalConfirm from '@/components/modal/ModalConfirm.vue';

type Attrs = RawProps & InstanceType<typeof ModalConfirm>;

export default function useModalConfirm(title: string, subTitle?: string, options = {}) {
  let resolveCb: (value: boolean | PromiseLike<boolean>) => void;
  const instance = useModal({
    component: ModalConfirm,
    attrs: {
      title,
      subTitle,
      clickToClose: true,
      ...options,
      onClose() {
        instance.close();
        resolveCb(false);
      },
      onAction() {
        instance.close();
        resolveCb(true);
      },
    },
  });

  return {
    open(newAttrs?: Record<string, unknown>) {
      if (newAttrs) {
        instance.patchOptions({
          attrs: newAttrs as Attrs,
        });
      }
      instance.open();

      return new Promise<boolean>((resolve) => {
        resolveCb = resolve;
      });
    },
    close() {
      instance.close();
    },
  };
}
