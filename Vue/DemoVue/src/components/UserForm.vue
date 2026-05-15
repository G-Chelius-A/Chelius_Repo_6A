<template>
  <div class="user-form">
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Name:</label>
        <input id="name" v-model="name" type="text" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="email" required />
      </div>
      <button type="submit">Submit</button>
    </form>
    <div v-if="submitted" class="display">
      <p><strong>Name:</strong> {{ name }}</p>
      <p><strong>Email:</strong> {{ email }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const submitted = ref(false)

const submitForm = () => {
  submitted.value = true
}
</script>

<style scoped>
.user-form {
  max-width: 400px;
  margin: 2rem auto;
}

div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  color: black;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.display {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  color:black;
}
</style>