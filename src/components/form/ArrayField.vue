<template>
  <div>
    <div class="space-y-6" :class="parentClasses">
      <AppForm
        v-for="(field, index) in fields"
        :key="field.id"
        :class="childClasses"
        v-model="field.values"
        :schema="schema"
        @update:model-value="(values) => changeField(index, { values })"
        @validation="(valid) => changeField(index, { valid })"
      >
        <SortingControls
          v-if="controls"
          @delete="removeField(index)"
          @move-up="moveUp(index)"
          @move-down="moveDown(index)"
          :need-move="needMove"
          :need-delete="needDelete"
        >
          <template #label>
            <AppChips :class="(settings && field.type && settings[field.type]?.style) ?? 'bg-primary'">
              {{ field.type }}
            </AppChips>
          </template>
          <template #default>
            <slot :name="field.type" />
          </template>
        </SortingControls>
        <template v-else>
          <slot :name="field.type" />
        </template>
      </AppForm>
    </div>

    <div v-if="controls" class="flex justify-start space-x-4" :class="{ 'mt-9': fields.length }">
      <AppButton
        v-for="(_, type) in $slots"
        :key="type"
        class="subheadline-bold"
        :classes="settings && settings[type]?.style"
        small
        @click="addField(type as string)"
      >
        + {{ type }} block
      </AppButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useField } from 'vee-validate';
import SortingControls from './SortingControls.vue';
import AppForm from './AppForm.vue';
import AppChips from './AppChips.vue';
import { ref, toRef, watch } from 'vue';
import { AnySchema } from 'yup';
import { IData } from '@/core/types/base';

interface TypeSettings {
  style?: string;
}

interface ArrayProps {
  name: string;
  modelValue?: IData[];
  schema?: AnySchema;
  settings?: Record<string, TypeSettings>;
  standalone?: boolean;
  parentClasses?: string;
  childClasses?: string;
  partiallyValid?: boolean;
  controls?: boolean;
  needMove?: boolean;
  needDelete?: boolean;
}

const props = withDefaults(defineProps<ArrayProps>(), {
  controls: false,
  needMove: true,
  needDelete: true,
  standalone: false,
  partiallyValid: false,
});

defineEmits<{
  (event: 'update:modelValue', value: IData[] | undefined): void;
}>();

interface ArrayValues {
  id: number;
  type: string;
  values: Record<string, unknown>;
  valid: boolean;
}

const name = toRef(props, 'name');
const { value } = useField<IData[] | undefined>(name, undefined, {
  validateOnValueUpdate: false,
  standalone: props.standalone,
  syncVModel: true,
});

const updated = ref<boolean>(false);

const id = ref<number>(0);
const fields = ref<ArrayValues[]>([]);
const needType = ref<boolean>(true);

const initFields = (newValue?: IData[]) => {
  fields.value = [];

  if (newValue?.length) {
    fields.value = newValue.map((field, index) => {
      const values = { ...field };
      needType.value = !!values['type'];

      return {
        id: ++id.value,
        type: values['type'] ?? index + 1,
        valid: true,
        values,
      } as ArrayValues;
    });
  }
};

watch(
  () => value.value,
  (newValue) => {
    if (updated.value) {
      updated.value = false;
      return;
    }

    initFields(newValue);
  },
  { immediate: true }
);

const updateValue = () => {
  updated.value = true;

  const valid = fields.value.every((field) => field.valid);

  if (!valid && !props.partiallyValid) {
    value.value = [];
    return;
  }

  const result = fields.value
    .filter((field) => field.valid)
    .map((field) => {
      return {
        ...field.values,
      } as IData;
    });

  value.value = result;
};

const changeField = (index: number, values: Partial<ArrayValues>) => {
  fields.value[index] = {
    ...fields.value[index],
    ...values,
  };

  updateValue();
};

const addField = (type: string) => {
  fields.value.push({
    id: ++id.value,
    type,
    values: {
      type: needType.value ? type : undefined,
    },
    valid: false,
  });

  updateValue();
};

const removeField = (index: number) => {
  fields.value.splice(index, 1);

  updateValue();
};

const moveUp = (index: number) => {
  if (index === 0) {
    return;
  }

  [fields.value[index - 1], fields.value[index]] = [fields.value[index], fields.value[index - 1]];

  updateValue();
};

const moveDown = (index: number) => {
  if (index === fields.value.length - 1) {
    return;
  }

  [fields.value[index], fields.value[index + 1]] = [fields.value[index + 1], fields.value[index]];

  updateValue();
};
</script>
