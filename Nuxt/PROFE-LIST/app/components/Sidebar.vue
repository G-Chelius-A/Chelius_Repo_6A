<script setup>
import { LayoutDashboard, Users, UserPlus, ClipboardCheck } from 'lucide-vue-next';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Grupos', path: '/groups', icon: Users },
  { name: 'Alumnos', path: '/students', icon: UserPlus },
  { name: 'Asistencia', path: '/attendance', icon: ClipboardCheck },
];
</script>

<template>
  <aside class="sidebar glass">
    <div class="logo-section">
      <div class="logo-icon">
        <ClipboardCheck class="text-black" :size="24" />
      </div>
      <h1 class="logo-text">ProfeList</h1>
    </div>

    <nav class="nav-menu">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path"
        class="nav-item"
      >
        <component 
          :is="item.icon" 
          :size="20" 
          class="nav-icon"
        />
        <span class="nav-label">{{ item.name }}</span>
      </NuxtLink>
    </nav>

    <div class="user-section">
      <div class="user-card">
        <div class="avatar"></div>
        <div class="user-info">
          <p class="user-name">Profesor</p>
          <p class="user-role">Administrador</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: calc(100vh - 32px);
  position: fixed;
  left: 16px;
  top: 16px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  z-index: 50;
  box-sizing: border-box;
  background: #fff;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--accent-yellow);
  border: 2px solid #000;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0px #000;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #000;
  margin: 0;
  font-family: 'Outfit', sans-serif;
}

.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 4px;
  text-decoration: none;
  color: var(--text-main);
  transition: all 0.2s ease;
  border: 2px solid transparent;
  font-weight: 600;
}

.nav-item:hover {
  background: var(--bg-dark);
  border-color: #000;
  transform: translate(-2px, -2px);
  box-shadow: 2px 2px 0px #000;
}

.router-link-active {
  background: var(--accent-blue) !important;
  color: #000 !important;
  border: 2px solid #000 !important;
  box-shadow: 2px 2px 0px #000 !important;
}

.nav-icon {
  transition: color 0.3s ease;
}

.nav-label {
  font-size: 0.95rem;
}

.user-section {
  margin-top: auto;
  padding-top: 24px;
  border-top: 2px dashed #000;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 4px;
  border: 2px solid #000;
  background: #fff;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 2px solid #000;
  background: var(--accent-pink);
}

.user-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #000;
  margin: 0;
}

.user-role {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin: 0;
  font-weight: 500;
}
</style>
