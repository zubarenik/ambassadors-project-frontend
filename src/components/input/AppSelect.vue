<template>
  <AppPopover
    ref="popoverRef"
    :offset="popoverOffset"
    :event-on-toggle="!disabled"
    @show="onPopoverShow"
    @hide="showOptions = false"
    @before-show="refreshDropdownWidth"
  >
    <template #reference>
      <InputWrapper v-bind="$attrs" :disabled="disabled" :title="multiple ? '' : (selected as IDataSelect)?.name">
        <template #field>
          <div
            ref="input"
            data-test-id="app-select-ref"
            :class="[
              'app-input flex cursor-pointer items-center !px-4 !py-0',
              { '!border-primary': showOptions, 'hover:!border-pink-4': !showOptions },
            ]"
          >
            <template v-if="selectedOptionIds.size">
              <div
                v-if="multiple"
                class="app-scroll-bar flex cursor-default space-x-1 overflow-x-auto overflow-y-hidden"
              >
                <AppChips
                  v-for="option of selected as IDataSelect[]"
                  :key="option.id"
                  class="!text-dark-blue-4"
                  mode="action"
                  border="border-current"
                  ><span class="font-bold leading-3">{{ option.name }}</span>
                  <AppIcon name="x" class="ml-0.5 cursor-pointer text-text-md" @click.stop="handleOption(option)"
                /></AppChips>
              </div>

              <span v-else-if="!$slots.show" class="line-clamp-1">{{ (selected as IDataSelect).name }}</span>

              <div v-else class="line-clamp-1"><slot name="show" :data="selected" /></div>
            </template>

            <span v-else class="line-clamp-1 text-font-tertiary">{{ placeholder }}</span>

            <div class="ml-auto flex flex-shrink-0 pl-2 text-title-2md text-font-black">
              <AppLoader v-if="loading" :size="20" :width="2" rotating class="mr-2" />
              <AppIcon
                v-else-if="selectedOptionIds.size && (multiple || clearable)"
                name="x-circle"
                class="mr-2 text-dark-blue-4"
                data-test-id="app-select-clear-btn"
                @click.stop="clean"
              />

              <AppIcon v-if="showOptions" name="chevron-up" />
              <AppIcon v-else name="chevron-down" />
            </div>
          </div>
        </template>

        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </InputWrapper>
    </template>

    <template #content>
      <div
        class="subheadline z-10 rounded-sm border-2 border-background-tertiary bg-white text-font-secondary"
        :style="dropdownStyles"
      >
        <div v-if="autocomplete" class="search-input border-b-2 border-b-background-tertiary">
          <AppInput
            ref="searchRef"
            v-model.trim="search"
            :placeholder="`${t('search')}...`"
            small
            data-test-id="app-select-search"
            @keydown="onKeyDown"
            @update:model-value="setActive(INITIAL_INDEX)"
          >
            <template #postfix>
              <AppIcon v-if="search.length" class="mr-1" name="x" @click.stop="search = ''" />
              <AppIcon v-else name="search" class="mr-1 cursor-default text-font-tertiary" />
            </template>
          </AppInput>
        </div>
        <ul class="app-scroll-bar max-h-52 overflow-y-auto py-2" @mousedown.stop>
          <template v-if="filteredOptions.length">
            <li
              v-if="multiple && selectAll"
              key="all"
              :class="[
                'dropdown-item flex cursor-pointer px-3 py-2.5',
                { active: START_INDEX === activeIndex, 'selected font-bold text-font-black': isAllSelected },
              ]"
              data-test-id="app-select-all"
              @mouseenter="setActive(START_INDEX)"
              @click="handleSelectAll"
            >
              <span>{{ t('all') }} ({{ filteredOptions.length }})</span>
              <AppCheckbox :model-value="isAllSelected" class="ml-auto" />
            </li>

            <li
              v-for="(option, index) in filteredOptions"
              :key="option.id"
              :class="[
                'dropdown-item flex cursor-pointer px-3 py-2.5',
                {
                  active: index === activeIndex,
                  'selected font-bold text-font-black': selectedOptionIds.has(option.id),
                  disabled: disabledIds.has(option.id),
                },
              ]"
              data-test-id="app-select-item"
              @mouseenter="setActive(index)"
              @click="handleOption(option)"
            >
              <slot name="show" :data="option">
                <span>{{ option.name }}</span>
              </slot>

              <AppCheckbox
                v-if="multiple"
                :model-value="selectedOptionIds.has(option.id)"
                :disabled="disabledIds.has(option.id)"
                class="ml-auto"
              />
            </li>
          </template>

          <template v-else>
            <li class="dropdown-item px-3 py-2.5 text-center">{{ t('not_found') }}</li>
          </template>
        </ul>
      </div>
    </template>
  </AppPopover>
</template>

<script lang="ts" setup>
import type { IDataSelect } from '@/core/types/base';
import type { SelectOption, SelectProps } from './types';
import { ref, computed, watch, shallowRef, nextTick } from 'vue';
import InputWrapper from './InputWrapper.vue';
import { useI18n } from 'vue-i18n';
import AppPopover from '@/components/AppPopover.vue';
import AppInput from '@/components/input/AppInput.vue';

const { t } = useI18n();

const props = withDefaults(defineProps<SelectProps>(), {
  multiple: false,
  autocomplete: false,
  options: () => [],
  placeholder: '',
  exclude: () => new Set<number>(),
  modelValue: null,
  clearable: false,
  selectAll: true,
  disabledOptions: () => [],
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: SelectOption): void;
  (event: 'selected', value: SelectOption): void;
}>();

const popoverOffset = [0, 5];
const INITIAL_INDEX = props.multiple && props.selectAll ? -2 : -1;
const START_INDEX = INITIAL_INDEX + 1;
const search = ref<string>('');
const activeIndex = ref<number>(INITIAL_INDEX);
const selectedOptionIds = ref<Set<number>>(new Set());
const showOptions = ref<boolean>(false);
const dropdownStyles = shallowRef<Record<string, string>>({});
const input = ref<HTMLInputElement | null>(null);
const popoverRef = ref<InstanceType<typeof AppPopover>>();
const searchRef = ref<InstanceType<typeof AppInput>>();
const disabledIds = ref<Set<number>>(new Set());

const filteredOptions = computed<IDataSelect[]>(() => {
  const searchKey = search.value.toLowerCase().replace(/\s+/g, '');

  return props.options.filter((option: IDataSelect) => {
    let isMatched = true;
    let isNotExcluded = true;

    if (props.autocomplete && searchKey) {
      isMatched = option.name.toLowerCase().replace(/\s+/g, '').includes(searchKey);
    }

    if (props.exclude.size) {
      isNotExcluded = !props.exclude.has(option.id);
    }
    return isMatched && isNotExcluded;
  });
});
const selected = computed<SelectOption>(() => {
  const selectedOptions = props.options.filter((option) => selectedOptionIds.value.has(option.id));
  return props.multiple ? selectedOptions : selectedOptions[0] ?? null;
});
const isAllSelected = computed<boolean>(() =>
  filteredOptions.value.every((option) => selectedOptionIds.value.has(option.id) || disabledIds.value.has(option.id))
);

const hidePopover = () => {
  popoverRef.value?.hide();
};

const onPopoverShow = () => {
  activeIndex.value = INITIAL_INDEX;
  showOptions.value = true;
  nextTick(() => searchRef.value?.focus());
};

const refreshDropdownWidth = () => {
  if (!input.value) {
    return;
  }

  const { width } = input.value.getBoundingClientRect();
  dropdownStyles.value = { width: `${width}px` };
};

const setActive = (index: number) => {
  activeIndex.value = index;
};

const onKeyDown = (event: KeyboardEvent) => {
  if (!showOptions.value) {
    return;
  }
  let option;

  switch (event.code) {
    case 'ArrowUp':
      if (activeIndex.value > START_INDEX) {
        activeIndex.value--;
      }
      break;
    case 'ArrowDown':
      if (activeIndex.value < filteredOptions.value.length - 1) {
        activeIndex.value++;
      }
      break;
    case 'Enter':
      if (search.value === '' && activeIndex.value === INITIAL_INDEX) {
        clean();
        hidePopover();
        break;
      }
      if (props.multiple && props.selectAll && activeIndex.value === START_INDEX) {
        handleSelectAll();
        break;
      }

      option = filteredOptions.value[activeIndex.value === INITIAL_INDEX ? START_INDEX : activeIndex.value];

      if (!option) return;
      if (disabledIds.value.has(option.id)) return;

      handleOption(option);
      break;
    case 'Escape':
      hidePopover();
      break;
    default:
      return;
  }
};

const setSelected = (newValue: number[] | null) => {
  selectedOptionIds.value = new Set(newValue);
};

const updateSelected = (id: number) => {
  selectedOptionIds.value.has(id) ? selectedOptionIds.value.delete(id) : selectedOptionIds.value.add(id);
};

const handleOption = (option: IDataSelect) => {
  if (disabledIds.value.has(option.id)) return;

  if (props.multiple) {
    updateSelected(option.id);
  } else {
    setSelected([option.id]);
    showOptions.value && hidePopover();
  }

  emitValues();
};

const emitValues = () => {
  emit('update:modelValue', selected.value);
  emit('selected', selected.value);
};

const clean = () => {
  setSelected(null);
  emitValues();
};

const handleSelectAll = () => {
  const value = isAllSelected.value
    ? null
    : filteredOptions.value.reduce<number[]>((acc, option) => {
        if (disabledIds.value.has(option.id)) return acc;

        acc.push(option.id);
        return acc;
      }, []);

  setSelected(value);
  emitValues();
};

watch(
  () => props.modelValue,
  (newValue) => {
    const value = Array.isArray(newValue) ? newValue.map((item) => item.id) : newValue ? [newValue.id] : null;
    setSelected(value);
  },
  { immediate: true }
);

watch(
  () => props.disabledOptions,
  (newValue) => {
    disabledIds.value = new Set(newValue.map((o) => o.id));

    if (disabledIds.value.size) {
      const filtered: number[] = [];

      selectedOptionIds.value.forEach((id) => {
        if (disabledIds.value.has(id)) return;
        filtered.push(id);
      });
      setSelected(filtered);
      emitValues();
    }
  },
  { immediate: true, flush: 'post' }
);
</script>

<style lang="scss" scoped>
.search-input ::v-deep(.app-input) {
  border-color: transparent !important;
  background-color: transparent;
}

.dropdown-item {
  &:hover,
  &:focus,
  &.active,
  &.selected {
    background-color: #6F67CF;
  }

  &.active {
    color: var(--primary-pink);
  }
}
</style>
