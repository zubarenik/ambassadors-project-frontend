<template>
  <div v-on-click-outside="hide">
    <div ref="referenceEl" class="h-full w-full" @click="toggle" @mouseenter="hover" @mouseleave="hover">
      <slot name="reference" :isPopupVisible="isPopupVisible" />
    </div>

    <div ref="popupEl" class="z-10" @click="onContentClick">
      <Transition name="scale">
        <div v-show="isPopupVisible" data-test-id="app-popover-popup">
          <slot name="content" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { createPopper } from '@popperjs/core';
import type { Placement, State, Modifier, Instance, Obj } from '@popperjs/core/lib';
import { vOnClickOutside } from '@vueuse/components';

interface IProps {
  position?: string;
  offset?: number[];
  hideOnSelect?: boolean;
  eventOnToggle?: boolean;
  eventOnHover?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  position: 'bottom',
  offset: () => [0, 0],
  hideOnSelect: false,
  eventOnToggle: true,
  eventOnHover: false,
});

const emit = defineEmits<{
  (event: 'before-show'): void;
  (event: 'show'): void;
  (event: 'before-hide'): void;
  (event: 'hide'): void;
}>();

defineExpose({
  recompute(): Promise<Partial<State>> {
    return popper?.update();
  },
  isVisible(): boolean {
    return isPopupVisible.value;
  },
  hide,
  show,
  toggle,
});

const isPopupVisible = ref(false);
const referenceEl = ref();
const popupEl = ref();

let popper: Instance;

const defaultModifiers: Array<Partial<Modifier<string, Obj>>> = [
  {
    name: 'offset',
    options: {
      offset: props.offset,
    },
  },
  {
    name: 'preventOverflow',
    options: {
      altBoundary: true,
    },
  },
];

function toggle() {
  if (props.eventOnToggle) {
    isPopupVisible.value ? hide() : show();
  }
}

function hover() {
  if (props.eventOnHover) {
    isPopupVisible.value ? hide() : show();
  }
}

async function show() {
  if (isPopupVisible.value) {
    return;
  }

  emit('before-show');

  isPopupVisible.value = true;

  if (!popper) {
    popper = createPopper(referenceEl.value, popupEl.value, {
      placement: props.position as Placement,
      strategy: 'fixed',
      modifiers: defaultModifiers,
    });
  } else {
    await popper.setOptions({
      modifiers: [{ name: 'eventListeners', phase: 'write', enabled: true } as Partial<Modifier<string, Obj>>].concat(
        defaultModifiers
      ),
    });
  }

  emit('show');
}

async function hide() {
  if (!isPopupVisible.value) {
    return;
  }

  emit('before-hide');

  isPopupVisible.value = false;

  await nextTick();

  await popper.setOptions({
    modifiers: [{ name: 'eventListeners', phase: 'write', enabled: false } as Partial<Modifier<string, Obj>>].concat(
      defaultModifiers
    ),
  });

  emit('hide');
}

function onContentClick() {
  if (props.hideOnSelect) {
    hide();
  }
}
</script>
