import { useModal as useModalLib, RawProps } from 'vue-final-modal';
import type { Component } from 'vue';
import ModalWrapper from '@/components/modal/ModalWrapper.vue';

type Attrs = RawProps & InstanceType<typeof ModalWrapper>;

export default function useModal({ content, attrs = {} }: { content: Component; attrs?: Record<string, unknown> }) {
  const instance = useModalLib({
    component: ModalWrapper,
    attrs: {
      onClose() {
        return instance.close();
      },
      ...(attrs as Attrs),
    },
    slots: {
      default: {
        component: content,
        attrs: {},
      },
    },
  });

  return {
    open(slotAttrs?: Record<string, unknown>, mainAttrs?: Record<string, unknown>) {
      if (slotAttrs) {
        instance.patchOptions({
          slots: {
            default: {
              component: content,
              attrs: slotAttrs as Attrs,
            },
          },
          attrs: {
            ...mainAttrs,
          },
        });
      }
      instance.open();
    },
    close() {
      return instance.close();
    },
  };
}
