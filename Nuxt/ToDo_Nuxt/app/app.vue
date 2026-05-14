<template>
  <div class="app-layout">
    <NuxtRouteAnnouncer />
    <main class="content">
      <NuxtPage />
    </main>
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --bg-color: #050505;
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --accent-primary: #6366f1;
  --accent-secondary: #a855f7;
  --accent-danger: #ef4444;
  --accent-success: #22c55e;
  --accent-warning: #f59e0b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-color);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
}

.app-layout {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.content {
  position: relative;
  z-index: 10;
  min-height: 100vh;
}

.background-blobs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.5;
}

.blob {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
}

.blob-1 {
  width: 40vw;
  height: 40vw;
  top: -10vw;
  left: -10vw;
  animation: move-1 20s infinite alternate;
}

.blob-2 {
  width: 30vw;
  height: 30vw;
  bottom: -5vw;
  right: -5vw;
  background: linear-gradient(135deg, var(--accent-secondary), var(--accent-primary));
  animation: move-2 25s infinite alternate;
}

.blob-3 {
  width: 20vw;
  height: 20vw;
  top: 40%;
  left: 60%;
  opacity: 0.3;
  animation: move-3 15s infinite alternate;
}

@keyframes move-1 {
  from { transform: translate(0, 0); }
  to { transform: translate(10vw, 15vh); }
}

@keyframes move-2 {
  from { transform: translate(0, 0); }
  to { transform: translate(-15vw, -10vh); }
}

@keyframes move-3 {
  from { transform: translate(0, 0); }
  to { transform: translate(5vw, -20vh); }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
