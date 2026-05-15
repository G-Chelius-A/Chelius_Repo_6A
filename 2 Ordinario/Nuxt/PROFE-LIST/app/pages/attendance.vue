<script setup>
import { Check, X, Clock, Save, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const selectedGroupId = ref('');
const selectedDate = ref(new Date().toISOString().split('T')[0]);

const { data: groups } = await useFetch('/api/groups');
const { data: students, refresh: refreshStudents } = await useFetch('/api/students', {
  query: { group_id: selectedGroupId }
});

const attendanceRecords = ref({}); // { student_id: 'present' | 'absent' | 'late' }

// When group or date changes, try to fetch existing attendance
const fetchExistingAttendance = async () => {
  if (!selectedGroupId.value || !selectedDate.value) return;
  
  const { records } = await $fetch('/api/attendance', {
    query: { group_id: selectedGroupId.value, date: selectedDate.value }
  });
  
  const newRecords = {};
  // Initialize with 'present' for all current students
  students.value?.forEach(s => {
    newRecords[s.id] = 'present';
  });
  
  // Override with existing records if any
  records.forEach(r => {
    newRecords[r.student_id] = r.status;
  });
  
  attendanceRecords.value = newRecords;
};

watch([selectedGroupId, selectedDate, students], () => {
  fetchExistingAttendance();
}, { immediate: true });

const saveAttendance = async () => {
  if (!selectedGroupId.value) return;
  
  const recordsArray = Object.entries(attendanceRecords.value).map(([student_id, status]) => ({
    student_id: parseInt(student_id),
    status
  }));
  
  await $fetch('/api/attendance', {
    method: 'POST',
    body: {
      group_id: selectedGroupId.value,
      date: selectedDate.value,
      records: recordsArray
    }
  });
  
  alert('Asistencia guardada correctamente.');
  onSaveSuccess();
};

const setStatus = (studentId, status) => {
  attendanceRecords.value[studentId] = status;
};

const { data: pastSessions, refresh: refreshSessions } = await useAsyncData('past-sessions', async () => {
  if (!selectedGroupId.value) return [];
  return await $fetch('/api/attendance', {
    query: { group_id: selectedGroupId.value, list_sessions: true }
  });
}, { watch: [selectedGroupId] });

// Refresh sessions list after saving
const onSaveSuccess = () => {
  refreshSessions();
};
</script>

<template>
  <div class="attendance-page">
    <header class="page-header">
      <div class="header-content">
        <h2 class="page-title">Pase de Lista</h2>
        <p class="page-subtitle">Registro diario de asistencia por grupo.</p>
        <div v-if="selectedDate !== new Date().toISOString().split('T')[0]" class="past-date-warning fade-in">
          <Clock :size="16" /> Editando fecha pasada: {{ new Date(selectedDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) }}
        </div>
      </div>
      <button 
        @click="saveAttendance" 
        :disabled="!selectedGroupId || students?.length === 0" 
        class="btn-primary"
      >
        <Save :size="20" /> Guardar Cambios
      </button>
    </header>

    <div class="attendance-layout">
      <div class="main-column">
        <div class="controls-bar glass fade-in">
          <div class="control-group">
            <label>Grupo</label>
            <select v-model="selectedGroupId" class="form-select">
              <option value="" disabled>Selecciona un grupo</option>
              <option v-for="group in groups" :key="group.id" :value="group.id">{{ group.name }}</option>
            </select>
          </div>
          <div class="control-group">
            <label>Fecha de Registro</label>
            <div class="date-input-wrapper">
              <input v-model="selectedDate" type="date" class="form-input-date">
              <button @click="selectedDate = new Date().toISOString().split('T')[0]" class="btn-today" title="Volver a hoy">Hoy</button>
            </div>
          </div>
        </div>

        <div v-if="!selectedGroupId" class="empty-state-container glass fade-in">
          <div class="empty-content">
            <Users :size="64" class="text-slate-700" />
            <h3>Comienza el Pase de Lista</h3>
            <p>Selecciona un grupo del menú superior para ver la lista de alumnos.</p>
          </div>
        </div>

        <div v-else-if="students?.length === 0" class="empty-state-container glass fade-in">
          <div class="empty-content">
            <GraduationCap :size="64" class="text-slate-700" />
            <h3>Sin Alumnos</h3>
            <p>Este grupo no tiene alumnos registrados todavía.</p>
            <NuxtLink :to="`/students?group_id=${selectedGroupId}`" class="link-primary">Agregar alumnos ahora</NuxtLink>
          </div>
        </div>

        <div v-else class="attendance-list glass fade-in">
          <div class="list-header">
            <span class="col-name">Alumno</span>
            <span class="col-status">Estado de Asistencia</span>
          </div>
          <div v-for="student in students" :key="student.id" class="attendance-item">
            <div class="student-info">
              <div class="avatar-sm">
                {{ student.name.charAt(0) }}
              </div>
              <div class="student-details">
                <span class="student-name">{{ student.name }}</span>
                <span class="student-id">ID: {{ student.student_id_number || 'Sin matrícula' }}</span>
              </div>
            </div>
            
            <div class="status-selector">
              <button 
                @click="setStatus(student.id, 'present')" 
                class="status-btn present"
                :class="{ active: attendanceRecords[student.id] === 'present' }"
              >
                <Check :size="18" /> <span>Presente</span>
              </button>
              <button 
                @click="setStatus(student.id, 'absent')" 
                class="status-btn absent"
                :class="{ active: attendanceRecords[student.id] === 'absent' }"
              >
                <X :size="18" /> <span>Falta</span>
              </button>
              <button 
                @click="setStatus(student.id, 'late')" 
                class="status-btn late"
                :class="{ active: attendanceRecords[student.id] === 'late' }"
              >
                <Clock :size="18" /> <span>Retardo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside class="history-sidebar glass fade-in" v-if="selectedGroupId">
        <h3 class="history-title">Sesiones Pasadas</h3>
        <div class="sessions-list">
          <button 
            v-for="session in pastSessions" 
            :key="session.id" 
            @click="selectedDate = session.date"
            class="session-chip"
            :class="{ active: selectedDate === session.date }"
          >
            <div class="session-date-row">
              <Clock :size="14" />
              <span>{{ new Date(session.date + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) }}</span>
            </div>
            <div class="session-year">{{ new Date(session.date + 'T12:00:00').getFullYear() }}</div>
          </button>
          <div v-if="pastSessions?.length === 0" class="no-history">
            Sin historial aún.
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.attendance-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.attendance-layout {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 32px;
  align-items: start;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 1100px) {
  .attendance-layout {
    grid-template-columns: 1fr;
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
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

.btn-primary {
  background: var(--primary);
  color: white;
  border: 2px solid #000;
  padding: 12px 28px;
  border-radius: 4px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 2px 2px 0px #000;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0px #000;
}

.btn-primary:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  box-shadow: none;
}

.controls-bar {
  padding: 24px 32px;
  display: flex;
  gap: 40px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  box-shadow: 4px 4px 0px #000;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.form-select, .form-input-date {
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 12px 20px;
  color: #000;
  outline: none;
  font-family: inherit;
  font-weight: 700;
  transition: all 0.2s;
}

.date-input-wrapper {
  display: flex;
  gap: 8px;
}

.btn-today {
  background: var(--accent-yellow);
  border: 2px solid #000;
  border-radius: 4px;
  padding: 0 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.btn-today:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0px #000;
}

.past-date-warning {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-blue);
  color: #000;
  padding: 6px 12px;
  border: 2px solid #000;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 800;
  margin-top: 12px;
  box-shadow: 3px 3px 0px #000;
}

.form-select:focus, .form-input-date:focus {
  background: var(--bg-dark);
  box-shadow: 2px 2px 0px #000;
}

.attendance-list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  box-shadow: 6px 6px 0px #000;
}

.list-header {
  display: flex;
  justify-content: space-between;
  padding: 16px 32px;
  background: var(--bg-dark);
  border-bottom: 2px solid #000;
  font-size: 0.85rem;
  font-weight: 800;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.attendance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid var(--border);
  transition: background 0.3s;
}

.attendance-item:hover {
  background: rgba(255, 255, 255, 0.01);
}

.attendance-item:last-child {
  border-bottom: none;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-sm {
  width: 44px;
  height: 44px;
  background: var(--accent-blue);
  color: #000;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
  border: 2px solid #000;
  box-shadow: 2px 2px 0px #000;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-name {
  font-weight: 800;
  color: #000;
  font-size: 1.1rem;
}

.student-id {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
}

.status-selector {
  display: flex;
  gap: 12px;
}

.status-btn {
  background: #fff;
  border: 2px solid #000;
  color: #000;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.status-btn.present.active {
  background: #10b981;
  color: white;
  box-shadow: 4px 4px 0px #000;
  transform: translate(-2px, -2px);
}

.status-btn.absent.active {
  background: #ef4444;
  color: white;
  box-shadow: 4px 4px 0px #000;
  transform: translate(-2px, -2px);
}

.status-btn.late.active {
  background: #f59e0b;
  color: white;
  box-shadow: 4px 4px 0px #000;
  transform: translate(-2px, -2px);
}

.empty-state-container {
  padding: 100px 32px;
  text-align: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.empty-content h3 {
  font-size: 1.5rem;
  font-weight: 900;
  color: #000;
  margin: 0;
}

.empty-content p {
  color: var(--text-muted);
  max-width: 400px;
  margin: 0;
}

.link-primary {
  color: var(--primary);
  text-decoration: none;
  font-weight: 700;
  margin-top: 10px;
  display: inline-block;
  font-size: 1rem;
}

.link-primary:hover {
  text-decoration: underline;
}

.history-sidebar {
  padding: 24px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  position: sticky;
  top: 32px;
}

.history-title {
  font-size: 0.9rem;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0 0 16px 0;
  border-bottom: 2px solid #000;
  padding-bottom: 8px;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.session-chip {
  background: #fff;
  border: 2px solid #000;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.session-date-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 0.9rem;
}

.session-year {
  font-size: 0.7rem;
  opacity: 0.6;
  font-weight: 700;
}

.session-chip:hover {
  background: var(--bg-dark);
}

.session-chip.active {
  background: var(--accent-yellow);
  box-shadow: 4px 4px 0px #000;
  transform: translate(-2px, -2px);
}

.no-history {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-style: italic;
}

@media (max-width: 768px) {
  .controls-bar {
    flex-direction: column;
    gap: 20px;
  }
  
  .attendance-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .status-selector {
    width: 100%;
    justify-content: space-between;
  }
  
  .status-btn {
    flex: 1;
    justify-content: center;
    padding: 10px 8px;
  }
  
  .status-btn span {
    display: none;
  }
}
</style>
