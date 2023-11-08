<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>

<header>
    <div class="wrapper">
      <nav>
        <!-- <RouterLink to="/">HOME</RouterLink> -->
        <RouterLink to="/agent">AGENT</RouterLink>
        <RouterLink to="/ships">SHIPS</RouterLink>
        <RouterLink to="/contracts">CONTRACTS</RouterLink>
        <!-- <RouterLink to="/waypoints">WAYPOINTS</RouterLink> -->
        <RouterLink to="/systems">SYSTEMS</RouterLink>
        <RouterLink class="login" to="/Login"><img src="./assets/user.svg"/></RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Young+Serif&display=swap');

header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  font-family: 'Young Serif', serif;
  display: flex;
  flex-direction: row;

  width: 100%;
  font-size: 24px;
  text-align: left;
  margin-top: 2rem;

  background-color: #e20343;

  border-radius: 15px;
}


.login {
  margin-left: auto;
  margin-right: 1rem;
  padding: 0 1rem;
}

.login img {
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  display: inline-flex;
  justify-content: center;
  width: 100%;
}


nav a:visited {
  color:inherit;
}

nav a:hover {
  background-color: #fc6d45;
  
  border-radius: inherit;
}

nav a:link {
  color:inherit;
}

nav a.router-link-exact-active {
  color: #fee9b4;
  
}

nav a.router-link-exact-active img {
  color: #fee9b4;
  filter: invert(100%)
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  padding: 0.25rem 1rem;
}



</style>
