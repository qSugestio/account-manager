import { defineStore } from "pinia";

interface Account {
  id: number;
  labels: { text: string }[];
  type: string;
  login: string;
  password: string | null;
}

export const useAccountsStore = defineStore("accounts", {
  state: () => ({
    accounts: JSON.parse(localStorage.getItem("accounts") || "[]") as Account[],
  }),
  actions: {
    addAccount() {
      const newAccount: Account = {
        id: Date.now(),
        labels: [],
        type: "",
        login: "",
        password: null,
      };
      this.accounts.push(newAccount);
      this.saveToLocalStorage();
    },
    deleteAccount(id: number) {
      this.accounts = this.accounts.filter((acc) => acc.id !== id);
      this.saveToLocalStorage();
    },
    updateAccount(updatedAccount: Account) {
      const index = this.accounts.findIndex(
        (acc) => acc.id === updatedAccount.id
      );
      if (index !== -1) {
        this.accounts[index] = updatedAccount;
        this.saveToLocalStorage();
      }
    },
    saveToLocalStorage() {
      localStorage.setItem("accounts", JSON.stringify(this.accounts));
    },
  },
});
