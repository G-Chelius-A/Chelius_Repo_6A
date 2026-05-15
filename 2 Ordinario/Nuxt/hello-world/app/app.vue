<template>
  <div class="container">
    <NuxtRouteAnnouncer />
    <div class="content">
      <h1 class="title">¡Hola Mundo!</h1>
      <p class="subtitle">Bienvenido a tu aplicación Nuxt</p>
      <div class="info">
        <p>Esta es una pantalla de bienvenida personalizada.</p>
        <p>Tu proyecto Nuxt está configurado y listo para usar.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.content {
  text-align: center;
  color: white;
  padding: 2rem;
  max-width: 600px;
}

.title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.info {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.info p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
  line-height: 1.6;
}
</style>
