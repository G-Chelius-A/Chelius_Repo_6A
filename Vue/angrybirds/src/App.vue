<script setup>
import AngryBirdsGame from './components/AngryBirdsGame.vue'
</script>

<template>
  <main>
    <AngryBirdsGame />
  </main>
</template>

<style>
@import './assets/main.css';

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #1a1a1a;
  font-family: 'Inter', sans-serif;
}

main {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
