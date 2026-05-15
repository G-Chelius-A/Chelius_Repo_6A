<script setup>
import { TrendingUp, Users, UserCheck, GraduationCap } from 'lucide-vue-next';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const { data: stats, refresh } = await useFetch('/api/stats');

const chartData = computed(() => ({
  labels: stats.value?.groupStats.map(g => g.name) || [],
  datasets: [
    {
      label: 'Asistencia %',
      backgroundColor: '#4f46e5',
      borderColor: '#000',
      borderWidth: 2,
      borderRadius: 4,
      data: stats.value?.groupStats.map(g => g.percentage) || []
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#000',
      titleFont: { family: 'Outfit', size: 14, weight: 'bold' },
      bodyFont: { family: 'Inter', size: 13 },
      padding: 12,
      cornerRadius: 4,
      displayColors: false,
      callbacks: {
        label: (context) => `Asistencia: ${context.raw}%`
      }
    }
  },
  scales: {
    y: { 
      beginAtZero: true, 
      max: 100,
      grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
      ticks: { color: '#000', font: { size: 11, weight: '600' } }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#000', font: { size: 11, weight: '600' } }
    }
  }
};
</script>

<template>
  <div class="dashboard">
    <header class="page-header">
      <div class="header-content">
        <h2 class="page-title">Dashboard</h2>
        <p class="page-subtitle">Panel de control de asistencia escolar.</p>
      </div>
      <button @click="refresh" class="btn-refresh">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="refresh-icon"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
        Actualizar
      </button>
    </header>

    <div class="stats-grid">
      <div class="stat-card glass fade-in" style="--delay: 0.1s">
        <div class="stat-icon-wrapper blue">
          <Users :size="28" />
        </div>
        <div class="stat-content">
          <p class="stat-label">Grupos Activos</p>
          <h3 class="stat-value">{{ stats?.totals.groups || 0 }}</h3>
        </div>
        <div class="stat-bg-icon"><Users :size="80" /></div>
      </div>

      <div class="stat-card glass fade-in" style="--delay: 0.2s">
        <div class="stat-icon-wrapper purple">
          <GraduationCap :size="28" />
        </div>
        <div class="stat-content">
          <p class="stat-label">Alumnos Registrados</p>
          <h3 class="stat-value">{{ stats?.totals.students || 0 }}</h3>
        </div>
        <div class="stat-bg-icon"><GraduationCap :size="80" /></div>
      </div>

      <div class="stat-card glass fade-in" style="--delay: 0.3s">
        <div class="stat-icon-wrapper indigo">
          <TrendingUp :size="28" />
        </div>
        <div class="stat-content">
          <p class="stat-label">Promedio de Asistencia</p>
          <h3 class="stat-value">{{ stats?.totals.avgPercentage || 0 }}%</h3>
        </div>
        <div class="stat-bg-icon"><TrendingUp :size="80" /></div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-container glass fade-in" style="--delay: 0.4s">
        <h3 class="chart-title">Desempeño por Grupo</h3>
        <div class="chart-wrapper">
          <Bar v-if="stats?.groupStats.length" :data="chartData" :options="chartOptions" />
          <div v-else class="no-data">
            <TrendingUp :size="48" class="text-slate-700" />
            <p>No hay datos disponibles aún.</p>
          </div>
        </div>
      </div>

      <div class="recent-groups glass fade-in" style="--delay: 0.5s">
        <h3 class="chart-title">Detalle de Grupos</h3>
        <div class="groups-list">
          <div v-for="group in stats?.groupStats" :key="group.id" class="group-stat-item">
            <div class="group-info">
              <span class="group-name">{{ group.name }}</span>
              <span class="group-students">{{ group.total_students }} alumnos</span>
            </div>
            <div class="group-progress-container">
              <div class="group-progress-bar">
                <div class="progress-fill" :style="{ width: group.percentage + '%', background: group.percentage > 80 ? '#10b981' : group.percentage > 50 ? '#f59e0b' : '#ef4444' }"></div>
              </div>
              <span class="group-percent" :style="{ color: group.percentage > 80 ? '#10b981' : group.percentage > 50 ? '#f59e0b' : '#ef4444' }">{{ group.percentage }}%</span>
            </div>
          </div>
          <div v-if="stats?.groupStats.length === 0" class="no-groups">
            Crea tu primer grupo para ver estadísticas.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  color: #000;
}

.page-subtitle {
  color: var(--text-muted);
  margin: 4px 0 0 0;
  font-size: 1.1rem;
}

.btn-refresh {
  background: #fff;
  border: 2px solid #000;
  color: #000;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  box-shadow: 2px 2px 0px #000;
}

.btn-refresh:hover {
  background: var(--accent-yellow);
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0px #000;
}

.btn-refresh:active .refresh-icon {
  transform: rotate(180deg);
}

.refresh-icon {
  transition: transform 0.5s ease;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.stat-card {
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  background: #fff;
}

.stat-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 8px 8px 0px #000;
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 4px;
  border: 2px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  box-shadow: 2px 2px 0px #000;
}

.stat-icon-wrapper.blue { background: var(--accent-blue); color: #000; }
.stat-icon-wrapper.purple { background: var(--accent-pink); color: #000; }
.stat-icon-wrapper.indigo { background: var(--accent-yellow); color: #000; }

.stat-content {
  z-index: 1;
}

.stat-label {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 4px 0 0 0;
  color: #000;
  letter-spacing: -0.02em;
}

.stat-bg-icon {
  position: absolute;
  right: -10px;
  bottom: -10px;
  opacity: 0.05;
  color: #000;
  transform: rotate(-10deg);
}

.charts-section {
  display: grid;
  grid-template-columns: 1.8fr 1.2fr;
  gap: 24px;
}

.chart-container {
  padding: 32px;
  min-height: 450px;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 32px 0;
  color: #000;
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-wrapper {
  flex: 1;
  position: relative;
}

.recent-groups {
  padding: 32px;
  max-height: 450px;
  overflow-y: auto;
  background: #fff;
}

.groups-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.group-stat-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px dashed #eee;
}

.group-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.group-name {
  font-weight: 800;
  color: #000;
  font-size: 1.1rem;
}

.group-students {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
}

.group-progress-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.group-progress-bar {
  flex: 1;
  height: 12px;
  background: var(--bg-dark);
  border: 2px solid #000;
  border-radius: 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-right: 2px solid #000;
}

.group-percent {
  width: 50px;
  text-align: right;
  font-size: 1rem;
  font-weight: 900;
  color: #000 !important;
}

.no-data, .no-groups {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  gap: 16px;
  text-align: center;
}

@media (max-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>
