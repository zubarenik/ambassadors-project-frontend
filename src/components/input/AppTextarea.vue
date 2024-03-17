<template>
  <InputWrapper
    v-bind="$attrs"
    :filled="Boolean(modelValue)"
    :disabled="disabled"
    :clearable="clearable"
    @clear="clear"
    class="app-textarea"
  >
    <template #field>
      <textarea
        ref="input"
        v-model="value"
        :disabled="disabled"
        :placeholder="placeholder"
        :style="{ maxHeight }"
        :rows="rows"
        class="app-input app-scroll-bar overflow-y-auto"
        data-test-id="app-textarea"
        @input="throttledOnInput"
      ></textarea>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </InputWrapper>
</template>

<script lang="ts" setup>
import InputWrapper from './InputWrapper.vue';
import { computed, ref, onMounted, nextTick } from 'vue';
import { useThrottleFn } from '@vueuse/core';

interface InputProps {
  modelValue?: string;
  disabled?: boolean;
  placeholder?: string;
  clearable?: boolean;
  maxHeight?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
  disabled: false,
  clearable: true,
  maxHeight: '224px',
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | undefined): void;
}>();

const rows = ref(2);
const input = ref<HTMLTextAreaElement>();
const value = computed<string | undefined>({
  get() {
    return props.modelValue;
  },
  set(newValue: string | undefined) {
    emit('update:modelValue', newValue);
  },
});
const clearable = computed<boolean>(() => props.clearable && (!!props.modelValue || props.modelValue == '0'));

onMounted(() => nextTick(onInput));

const throttledOnInput = useThrottleFn(onInput, 200, true);

const clear = () => {
  emit('update:modelValue', '');
  rows.value = 2;
};

function onInput() {
  const target = input.value as HTMLElement;

  if (target.offsetHeight >= parseInt(props.maxHeight)) {
    return;
  }

  const isScrollVisible = target.scrollHeight > target.clientHeight;

  if (isScrollVisible) {
    rows.value = isScrollVisible ? rows.value + 1 : rows.value;
    nextTick(onInput);
  }
}

defineExpose({
  focus() {
    input.value?.focus();
  },
});
</script>

<style lang="scss">
.app-textarea {
  .app-input.app-input {
    height: auto;
    resize: none;
  }

  .app-input-postfix.app-input-postfix {
    top: 16px;
    right: 16px;
    transform: translate(0);
  }
}
</style>
