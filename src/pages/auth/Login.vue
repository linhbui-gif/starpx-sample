<template>
  <div class="min-h-screen flex items-center">
    <div class="container mx-auto px-2">
      <div class="shadow rounded flex shrink-0 grow flex-col pb-10 bg-gray-900 px-5 py-7 min-h-[500px] items-center justify-center">
        <div class="w-full pb-24 md:mx-auto md:max-w-md md:pb-0">
          <Form @submit="onSubmit">
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
            <Button :loading="fetching" type-button="submit" title="SignIn" class-name="mt-2" />
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
const uiStore = useUiStore()
const router = useRouter()
const route = useRoute()
const { login, fetching } = useAuth()
const onSubmit = async () => {
  login({
    form: formData,
    onLoginSuccess: () => {
      router.push('/')
      uiStore.addToast({ type: 'success', message: 'Login Success' })
    },
    onLoginError: (e) => {
      console.log ('err', e)
    },
    onAuthenticateFailure: (e, cognitoUser) => {
      if (e.code === 'UserNotConfirmedException') {
        cognitoUser.resendConfirmationCode((err, result) => {})
        router.replace(`/auth/confirm?email=${formData.email}`)
        uiStore.addToast({
          type: 'info',
          message: 'User Not Verified',
        })
        return
      }
    },
  })
}
</script>