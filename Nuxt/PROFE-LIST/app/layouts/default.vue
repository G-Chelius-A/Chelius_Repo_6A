<template>
  <div class="app-container">
    <Sidebar />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-dark);
}

.main-content {
  margin-left: 292px; /* 260px sidebar + 16px left margin + 16px gap */
  padding: 32px;
  flex: 1;
  max-width: 1400px;
  margin-right: auto;
}
</style>
