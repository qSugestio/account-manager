<template>
  <v-card class="mx-auto pa-2 ma-4">
    <v-card-title>
      <v-cart-text>Учётные записи</v-cart-text>
      <v-btn @click="addAccount" class="ma-2"><v-icon>mdi-plus</v-icon></v-btn>
    </v-card-title>
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th class="text-center">Метки</th>
            <th class="text-center">Тип записи</th>
            <th class="text-center">Логин</th>
            <th class="text-center">Пароль</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in accounts" :key="account.id" class="mb-2">
            <AccountItem :account="account" />
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import { computed } from 'vue'

const store = useAccountsStore()
const accounts = computed(() => store.accounts)
const addAccount = () => store.addAccount()
</script>