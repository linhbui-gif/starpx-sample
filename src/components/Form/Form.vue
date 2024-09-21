<template>
  <form class="Form" @submit="handleFormSubmit">
    <slot />
  </form>
</template>

<script>
export default {
  name: "Form",
  methods: {
    handleFormSubmit(e) {
      e.preventDefault();
      this.$emit("submit");
    },
  },
};
</script>