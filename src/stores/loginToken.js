// import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('logintoken', {
    state: () => ({ token:null }),
    actions: {
      setToken(newToken) { //Assigns the login token
        console.log(newToken);
        this.token = newToken;
      },
    },
  })