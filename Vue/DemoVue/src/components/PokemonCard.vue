<template>
  <div class="pokemon-container">
    <div v-if="pokemon" class="pokemon-card">
      <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image" />
      <h2>{{ pokemon.name }}</h2>
      <p><strong>Type:</strong> {{ pokemon.type }}</p>
      <p><strong>Height:</strong> {{ pokemon.height }} m</p>
      <p><strong>Weight:</strong> {{ pokemon.weight }} kg</p>
      <div class="stats">
        <p><strong>HP:</strong> {{ pokemon.stats.hp }}</p>
        <p><strong>Attack:</strong> {{ pokemon.stats.attack }}</p>
        <p><strong>Defense:</strong> {{ pokemon.stats.defense }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const pokemon = ref({
  name: 'Pikachu',
  type: 'Electric',
  height: 0.4,
  weight: 6.0,
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  stats: {
    hp: 35,
    attack: 55,
    defense: 40
  }
})
</script>

<style scoped>
.pokemon-container {
  display: flex;
  justify-content: center;
  margin: 2rem;
}

.pokemon-card {
  border: 2px solid #ffcc00;
  border-radius: 10px;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, #ffeb3b 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  text-align: center;
}

.pokemon-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  margin-bottom: 1rem;
}

h2 {
  color: #333;
  margin: 1rem 0;
  font-size: 1.5rem;
}

p {
  margin: 0.5rem 0;
  color: #555;
}

.stats {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
}

.stats p {
  margin: 0.5rem 0;
}
</style>