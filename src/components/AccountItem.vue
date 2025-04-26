<template>
  <td>
    <v-text-field v-model="inputLabel" label="Метки" type="input" maxlength="50" @keydown.enter.prevent="addLabel"
      @update:model-value="handleUpdate" @update:focused="handleFocus"></v-text-field>
  </td>
  <td>
    <v-select v-model="localType" label="Тип записи" :items="['Локальная', 'LDAP']" @update:model-value="handleUpdate">
    </v-select>
  </td>
  <td>
    <v-text-field v-model="localLogin" label="Логин" type="input" maxlength="100"
      @update:model-value="handleUpdate"></v-text-field>
  </td>
  <td>
    <v-text-field v-if="localType === 'Локальная'" v-model="localPassword" label="Пароль"
      :type="showPassword ? 'text' : 'password'" maxlength="100" @update:model-value="handleUpdate"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="togglePasswordVisibility">
    </v-text-field>
  </td>
  <v-btn @click="deleteAccount" class="center"><v-icon>mdi-trash-can</v-icon></v-btn>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import { reactive, ref, watch } from 'vue'

interface Account {
  id: number
  labels: { text: string }[]
  type: string
  login: string
  password: string | null
}

const props = defineProps<{
  account: Account
}>()

const store = useAccountsStore()
const inputLabel = ref('')
const localLabels = ref<{ text: string }[]>([...props.account.labels])
const localType = ref(props.account.type)
const localLogin = ref(props.account.login)
const localPassword = ref(props.account.password || '')
const showPassword = ref<boolean>(false)

const validation = reactive({
  label: true,
  type: true,
  login: true,
  password: true
})

const addLabel = () => {
  const input = inputLabel.value.trim()
  if (!input) {
    localLabels.value = []
    validation.label = true
    inputLabel.value = ''
    updateStore()
    return
  }

  const newLabel = { text: input.split(';')[0].trim() }
  localLabels.value.push(newLabel)
  inputLabel.value = ''
  validation.label = true

  updateStore()
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const validate = () => {
  validation.label = localLabels.value.length > 0
  validation.type = localType.value !== ''
  validation.login = localLogin.value.trim() !== ''
  validation.password = localType.value === 'Локальная' ? localPassword.value.trim() !== '' : true
  return Object.values(validation).every(v => v)
}

const handleFocus = (isFocus: boolean) => {
  if (isFocus) inputLabel.value = ''
}

const handleUpdate = () => {
  if (validate()) {
    updateStore()
  }
}

const updateStore = () => {
  const labelString = localLabels.value.map(label => label.text).join(';')
  inputLabel.value = labelString

  const updatedAccount: Account = {
    ...props.account,
    labels: [...localLabels.value],
    type: localType.value,
    login: localLogin.value,
    password: localType.value === 'Локальная' ? localPassword.value : null
  }
  store.updateAccount(updatedAccount)
}

const deleteAccount = () => {
  store.deleteAccount(props.account.id)
}

validate()

watch(
  () => props.account,
  (newAccount) => {
    localLabels.value = [...newAccount.labels]
    localType.value = newAccount.type
    localLogin.value = newAccount.login
    localPassword.value = newAccount.password || ''
    validate()
  }, { deep: true })
</script>
