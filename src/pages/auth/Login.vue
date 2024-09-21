<template>
  <div class="min-h-screen flex items-center">
    <div class="container mx-auto px-2">
      <div class="shadow rounded flex shrink-0 grow flex-col pb-10 bg-white px-5 py-7">
        <div class="w-full pb-24 md:mx-auto md:max-w-md md:pb-0">
          <Form @submit="login">
            <FormItem label="Email" required>
              <Input
                  v-model="formData.email"
                  placeholder="Enter your email"
                  type="email"
              />
            </FormItem>
            <FormItem label="Password" required>
              <Input
                  v-model="formData.password"
                  placeholder="Enter your password"
                  type="password"
              />
            </FormItem>
            <Button :loading="isLoading" type-button="submit" title="SignIn" class-name="mt-2" />
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import Input from "@/components/Input/Input.vue";
import Button from "@/components/Button/Button.vue";
import Form from "@/components/Form/Form.vue";
import FormItem from "@/components/FormItem/FormItem.vue";
import {reactive} from "vue";
import { useAuth} from "@/hooks";
const formData = reactive({
  email: '',
  password: ''
});
const { isLoading, login } = useAuth(formData);
</script>