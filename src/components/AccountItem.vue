<template>
  <td>
    <v-text-field v-model="inputLabel" label="Метки" type="input" maxlength="50" @keydown.enter.prevent="addLabel"
      @blur="updateLabels"></v-text-field>
  </td>
  <td>
    <v-select v-model="localType" label="Тип записи" :items="['Локальная', 'LDAP']" @update:model-value="updateStore">
    </v-select>
  </td>
  <td>
    <v-text-field v-model="localLogin" label="Логин" type="input" maxlength="100"
      @update:model-value="updateStore"></v-text-field>
  </td>
  <td>
    <v-text-field v-if="localType === 'Локальная'" v-model="localPassword" label="Пароль"
      :type="showPassword ? 'text' : 'password'" maxlength="100" @update:model-value="updateStore"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="togglePasswordVisibility">
    </v-text-field>
  </td>
  <v-btn @click="deleteAccount" class="center"><v-icon>mdi-trash-can</v-icon></v-btn>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import { onMounted, reactive, ref, watch } from 'vue'

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
const inputLabel = ref(props.account.labels.map(label => label.text).join('; '))
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

onMounted(() => {
  inputLabel.value = localLabels.value.map(label => label.text).join('; ')
})

// Обновление меток на основе ввода
const updateLabels = () => {
  const input = inputLabel.value.trim()
  // Разбиваем строку на массив меток и обновляем состояние
  const newLabels = input ? input.split(';').map(text => ({ text: text.trim() })).filter(l => l.text) : []
  localLabels.value = newLabels
}


const addLabel = () => {
  const input = inputLabel.value.trim()
  console.log(localLabels.value)
  if (!input) {
    localLabels.value = [] // Очистить метки, если ввод пуст
  } else {
    const newLabels = input.split(';').map(text => ({ text: text.trim() })).filter(l => l.text && l.text.length <= 50)
    console.log(newLabels)
    console.log(inputLabel.value)
    localLabels.value = newLabels
  }
  inputLabel.value = '' // Очистить поле ввода
  updateStore() // Обновить данные в сторе
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

const updateStore = () => {
  if (!validate()) return

  const updatedAccount: Account = {
    ...props.account,
    labels: [...localLabels.value],
    type: localType.value,
    login: localLogin.value,
    password: localType.value === 'Локальная' ? localPassword.value : null
  }
  store.updateAccount(updatedAccount)
  inputLabel.value = localLabels.value.map(label => label.text).join(';')
}

const deleteAccount = () => {
  store.deleteAccount(props.account.id)
}

validate()

watch(
  () => props.account,
  (newAccount) => {
    localLabels.value = [...newAccount.labels]
    inputLabel.value = newAccount.labels.map(label => label.text).join('; ')
    localType.value = newAccount.type
    localLogin.value = newAccount.login
    localPassword.value = newAccount.password || ''
    validate()
  }, { deep: true })
</script>
