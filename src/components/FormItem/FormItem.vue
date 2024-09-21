<template>
  <div class="mb-2" :class="validateStatus">
    <div v-if="label" class="FormItem-label mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </div>
    <slot v-else name="label" />
    <div class="FormItem-wrapper">
      <slot />
    </div>
    <div v-if="helpText" class="text-red-700">{{ helpText }}</div>
  </div>
</template>

<script>

import { EFormItemValidateStatus } from "./FormItem.enums";

export default {
  name: "FormItem",
  props: {
    validateStatus: {
      type: String,
      validator: (val) =>
          [
            EFormItemValidateStatus.success,
            EFormItemValidateStatus.warning,
            EFormItemValidateStatus.error,
            "",
          ].includes(val),
    },
    helpText: {
      type: String,
    },
    label: {
      type: String,
    },
    required: {
      type: Boolean,
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      EFormItemValidateStatus,
    };
  },
};
</script>

