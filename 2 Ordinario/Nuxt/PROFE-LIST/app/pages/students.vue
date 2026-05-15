<script setup>
import { Plus, Trash2, Search, User } from 'lucide-vue-next';

const route = useRoute();
const selectedGroupId = ref(route.query.group_id || '');

const { data: groups } = await useFetch('/api/groups');
const { data: students, refresh: refreshStudents } = await useFetch('/api/students', {
  query: { group_id: selectedGroupId }
});

const isAdding = ref(false);
const editingStudent = ref(null);
const newStudent = ref({
  name: '',
  student_id_number: '',
  group_id: ''
});

const searchQuery = ref('');

const filteredStudents = computed(() => {
  if (!students.value) return [];
  if (!searchQuery.value) return students.value;
  const q = searchQuery.value.toLowerCase();
  return students.value.filter(s => 
    s.name.toLowerCase().includes(q) || 
    (s.student_id_number && s.student_id_number.toLowerCase().includes(q))
  );
});

// If we came from a group link, pre-select it
watch(() => selectedGroupId.value, () => {
  refreshStudents();
});

const addStudent = async () => {
  if (!newStudent.value.name || !newStudent.value.group_id) return;
  
  await $fetch('/api/students', {
    method: 'POST',
    body: newStudent.value
  });
  
  newStudent.value = { name: '', student_id_number: '', group_id: selectedGroupId.value };
  isAdding.value = false;
  refreshStudents();
};

const updateStudent = async () => {
  if (!editingStudent.value.name || !editingStudent.value.group_id) return;
  
  await $fetch('/api/students', {
    method: 'PUT',
    body: editingStudent.value
  });
  
  editingStudent.value = null;
  refreshStudents();
};

const deleteStudent = async (id) => {
  if (!confirm('¿Estás seguro de eliminar a este alumno? Se eliminarán también sus registros de asistencia.')) return;
  await $fetch(`/api/students/${id}`, { method: 'DELETE' });
  refreshStudents();
};

const openEdit = (student) => {
  editingStudent.value = { ...student };
};
</script>

<template>
  <div class="students-page">
    <header class="page-header">
      <div>
        <h2 class="page-title">Directorio de Alumnos</h2>
        <p class="page-subtitle">Gestiona la lista de estudiantes por grupo.</p>
      </div>
      <button @click="isAdding = true; newStudent.group_id = selectedGroupId" class="btn-primary">
        <Plus :size="20" /> Agregar Alumno
      </button>
    </header>

    <div class="filters-bar glass">
      <div class="filter-group">
        <label>Filtrar por Grupo</label>
        <select v-model="selectedGroupId" class="form-select">
          <option value="">Todos los Grupos</option>
          <option v-for="group in groups" :key="group.id" :value="group.id">{{ group.name }}</option>
        </select>
      </div>
      <div class="filter-group search-filter">
        <label>Buscar Alumno</label>
        <div class="search-group">
          <Search :size="18" class="search-icon" />
          <input v-model="searchQuery" type="text" placeholder="Nombre o matrícula..." class="search-input">
        </div>
      </div>
    </div>

    <!-- Modal Agregar -->
    <div v-if="isAdding" class="modal-overlay" @click.self="isAdding = false">
      <div class="modal-content glass animate-in">
        <h3 class="modal-title">Registrar Alumno</h3>
        <div class="form-group">
          <label>Nombre Completo</label>
          <input v-model="newStudent.name" type="text" placeholder="Ej. Juan Pérez" class="form-input" autofocus>
        </div>
        <div class="form-group">
          <label>Matrícula / ID (Opcional)</label>
          <input v-model="newStudent.student_id_number" type="text" placeholder="Ej. 2024001" class="form-input">
        </div>
        <div class="form-group">
          <label>Asignar a Grupo</label>
          <select v-model="newStudent.group_id" class="form-input">
            <option value="" disabled>Selecciona un grupo</option>
            <option v-for="group in groups" :key="group.id" :value="group.id">{{ group.name }}</option>
          </select>
        </div>
        <div class="modal-actions">
          <button @click="isAdding = false" class="btn-ghost">Cancelar</button>
          <button @click="addStudent" class="btn-primary">Registrar</button>
        </div>
      </div>
    </div>

    <!-- Modal Editar -->
    <div v-if="editingStudent" class="modal-overlay" @click.self="editingStudent = null">
      <div class="modal-content glass animate-in">
        <h3 class="modal-title">Editar Alumno</h3>
        <div class="form-group">
          <label>Nombre Completo</label>
          <input v-model="editingStudent.name" type="text" class="form-input" autofocus>
        </div>
        <div class="form-group">
          <label>Matrícula / ID (Opcional)</label>
          <input v-model="editingStudent.student_id_number" type="text" class="form-input">
        </div>
        <div class="form-group">
          <label>Asignar a Grupo</label>
          <select v-model="editingStudent.group_id" class="form-input">
            <option v-for="group in groups" :key="group.id" :value="group.id">{{ group.name }}</option>
          </select>
        </div>
        <div class="modal-actions">
          <button @click="editingStudent = null" class="btn-ghost">Cancelar</button>
          <button @click="updateStudent" class="btn-primary">Actualizar</button>
        </div>
      </div>
    </div>

    <div class="students-list glass">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>ID / Matrícula</th>
            <th>Grupo</th>
            <th class="text-center">Retardos</th>
            <th class="text-center">Faltas</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents" :key="student.id" class="table-row">
            <td>
              <div class="student-name-cell">
                <div class="avatar-sm">
                  <User :size="14" />
                </div>
                <span class="name-text">{{ student.name }}</span>
              </div>
            </td>
            <td><code class="id-badge">{{ student.student_id_number || 'N/A' }}</code></td>
            <td>
              <span class="group-tag">{{ groups?.find(g => g.id === student.group_id)?.name || 'Sin grupo' }}</span>
            </td>
            <td class="text-center">
              <span class="tardiness-count" :class="{ 'high-tardiness': student.total_tardiness > 2 }">
                {{ student.total_tardiness }}
              </span>
            </td>
            <td class="text-center">
              <span class="absence-count" :class="{ 'high-absences': student.total_absences > 3 }">
                {{ student.total_absences }}
              </span>
            </td>
            <td class="text-right">
              <div class="action-buttons">
                <button @click="openEdit(student)" class="btn-icon-edit" title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
                <button @click="deleteStudent(student.id)" class="btn-icon-delete" title="Eliminar">
                  <Trash2 :size="18" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredStudents.length === 0">
            <td colspan="6" class="empty-row">
              <div class="empty-content">
                <Search :size="48" class="text-slate-600" />
                <p>No se encontraron alumnos para este criterio.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.students-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.animate-in {
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
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
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0px #000;
}

.filters-bar {
  padding: 20px 24px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 32px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  box-shadow: 4px 4px 0px #000;
}

.filter-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.filter-group label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #000;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-select {
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 10px 16px;
  color: #000;
  outline: none;
  transition: all 0.2s;
  font-weight: 700;
  min-width: 200px;
}

.form-select:focus {
  background: var(--bg-dark);
  box-shadow: 2px 2px 0px #000;
}

.search-group {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #000;
  z-index: 1;
}

.search-input {
  width: 100%;
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 10px 16px 10px 42px;
  color: #000;
  outline: none;
  transition: all 0.2s;
  font-weight: 700;
}

.search-input:focus {
  background: var(--bg-dark);
  box-shadow: 2px 2px 0px #000;
}

.students-list {
  overflow: hidden;
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  box-shadow: 6px 6px 0px #000;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 20px 24px;
  background: var(--bg-dark);
  color: #000;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 800;
  border-bottom: 2px solid #000;
}

.data-table td {
  padding: 18px 24px;
  border-bottom: 1px solid #eee;
  color: #000;
  font-size: 0.95rem;
}

.table-row {
  transition: all 0.2s;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.student-name-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.name-text {
  font-weight: 600;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  background: var(--accent-blue);
  color: #000;
  border: 2px solid #000;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.id-badge {
  background: var(--accent-yellow);
  padding: 4px 10px;
  border-radius: 0;
  font-family: 'Outfit', sans-serif;
  color: #000;
  font-size: 0.85rem;
  border: 2px solid #000;
  font-weight: 700;
}

.group-tag {
  background: var(--accent-pink);
  padding: 4px 12px;
  border-radius: 0;
  font-size: 0.85rem;
  color: #000;
  border: 2px solid #000;
  font-weight: 700;
}

.absence-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 2px solid #000;
  background: #fff;
  font-weight: 800;
  font-size: 0.85rem;
  box-shadow: 2px 2px 0px #000;
}

.high-absences {
  background: var(--accent-pink) !important;
}

.tardiness-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 2px solid #000;
  background: #fff;
  font-weight: 800;
  font-size: 0.85rem;
  box-shadow: 2px 2px 0px #000;
}

.high-tardiness {
  background: var(--accent-yellow) !important;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-icon-edit, .btn-icon-delete {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: all 0.3s;
}

.btn-icon-edit { color: var(--text-muted); }
.btn-icon-edit:hover { background: rgba(255, 255, 255, 0.05); color: var(--primary); }

.btn-icon-delete { color: rgba(239, 68, 68, 0.6); }
.btn-icon-delete:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.empty-row {
  text-align: center !important;
  padding: 100px !important;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-muted);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  background: #fff;
  border: 3px solid #000;
  border-radius: 4px;
  box-shadow: 12px 12px 0px #000;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: #000;
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
}

.form-input {
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 14px;
  color: #000;
  font-family: inherit;
  outline: none;
  transition: all 0.2s;
  font-weight: 600;
}

.form-input:focus {
  background: var(--bg-dark);
  box-shadow: 4px 4px 0px #000;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 10px;
}

.btn-ghost {
  background: #fff;
  color: #000;
  border: 2px solid #000;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000;
  transition: all 0.2s;
}

.btn-ghost:hover {
  background: var(--bg-dark);
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0px #000;
}
</style>
