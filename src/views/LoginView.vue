<script setup>
import {ref} from 'vue';
import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/stores/loginToken'
import axios from 'axios';
const store = useLoginStore();
const {token} = storeToRefs(store);
const {setToken} = store;

const loginToken = ref("");

const userName = ref("");
const loginMessage = ref(" ");
const registerMessage = ref(" ");

const axiosConfig = {
  headers:{
    "Content-Type": "application/json"
  }
};

function submitToken()
{
    if(loginToken.value !== "") 
    {
        loginMessage.value = " ";
        setToken(loginToken.value);
    }
    else
    {
        loginMessage.value = "Invalid Login!";
        console.log("Empty Login!");
    }
}

function register() {
    //TODO USE AXOIS TO REGISTER AND GET TOKEN
    if(userName.value !== "")
    {
        registerMessage.value = " "
        axios.post('https://api.spacetraders.io/v2/register', 
        {
            symbol: userName.value,
            faction: 'COSMIC'
        }, axiosConfig)
        .then(function (response) {
            console.log(response);
            loginToken.value = response.data.data.token;
            setToken(loginToken.value);
        })
        .catch(function (error) {
            console.log(error);
            registerMessage.value = error.response.data.error.message;
        });
    }
    else
    {
        registerMessage.value = "Enter Username!"
    }
}

</script>

<template>
  <main>
    <div v-if="!token" class="auth">
        <div class="authSection">
            <h1>Login</h1>
            <p class="errorMessage">{{ loginMessage }}</p>
            <div class="loginForm">
                <input v-model="loginToken" placeholder="access token">
                <button @click="submitToken">LOGIN</button>
            </div>
        </div>

        <div class="authSection">
            <h1>Register</h1>
            <p class="errorMessage">{{ registerMessage }}</p>
            <div class="loginForm">
                <input v-model="userName" placeholder="Username">
                <button @click="register">REGISTER</button>
            </div>
        </div>
        
        <!-- <p>{{ loginToken }}</p> -->
        <!-- <p>{{ token }}</p> -->
    </div>
    <div class="auth" v-else>
        <div class="authSection">
            <h1>Logged In</h1>
            <div>
                <p class="token"><strong>Token: </strong></p>
                    
                <p>{{ token }}</p>
            </div>

        </div>
    </div>
  </main>
</template>


<style scoped>

.auth {
    margin: auto;
    margin-top: 5rem;
    width: 60%;
    background-color: #e20343;
    text-align: center;
    border-radius: 25px;

    padding: 2rem;

    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
}

.authSection {
    padding: 5rem;
    max-width: 100%;
    word-break: break-all;
}

.loginForm > * {
    margin: 1rem 0.5rem;
    padding: 0.25rem 0.5rem;

    border-radius: 10px;
    border: solid #fee9b4;

    flex-grow: 1;
}

.loginForm button {
    background-color: #fc6d45;
    flex-shrink: 2;
    flex-grow: 0;
}

.loginForm button:hover {
    background-color: #fee9b4;
}
</style>