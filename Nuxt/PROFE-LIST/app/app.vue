<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&family=Gochi+Hand&display=swap');

:root {
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --bg-dark: #f8f7f2;
  --bg-card: #ffffff;
  --text-main: #1a1a1a;
  --text-muted: #64748b;
  --border: #1a1a1a;
  --paper-shadow: 4px 4px 0px #1a1a1a;
  --accent-yellow: #fef08a;
  --accent-blue: #bfdbfe;
  --accent-pink: #fbcfe8;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-dark);
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  background-image: 
    linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 20px 20px;
}

h1, h2, h3, h4 {
  font-family: 'Outfit', sans-serif;
  color: #000;
}

.handwritten {
  font-family: 'Gochi Hand', cursive;
}

.glass {
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: 4px;
  box-shadow: var(--paper-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
}

.glass:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #1a1a1a;
}

::selection {
  background: var(--accent-yellow);
  color: #000;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--bg-dark);
  border-left: 1px solid var(--border);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border: 3px solid var(--bg-dark);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}
</style>
