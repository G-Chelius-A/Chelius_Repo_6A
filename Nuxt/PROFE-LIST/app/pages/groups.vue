<script setup>
import { Plus, Trash2, Users } from 'lucide-vue-next';

const { data: groups, refresh } = await useFetch('/api/groups');

const newGroup = ref({ name: '', description: '' });
const editingGroup = ref(null);
const isAdding = ref(false);

const addGroup = async () => {
  if (!newGroup.value.name) return;
  
  await $fetch('/api/groups', {
    method: 'POST',
    body: newGroup.value
  });
  
  newGroup.value = { name: '', description: '' };
  isAdding.value = false;
  refresh();
};

const updateGroup = async () => {
  if (!editingGroup.value.name) return;
  
  await $fetch('/api/groups', {
    method: 'PUT',
    body: editingGroup.value
  });
  
  editingGroup.value = null;
  refresh();
};

const deleteGroup = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este grupo? Se eliminarán también sus alumnos y registros de asistencia.')) return;
  
  await $fetch(`/api/groups/${id}`, { method: 'DELETE' });
  refresh();
};

const openEdit = (group) => {
  editingGroup.value = { ...group };
};
</script>

<template>
  <div class="groups-page">
    <header class="page-header">
      <div>
        <h2 class="page-title">Gestión de Grupos</h2>
        <p class="page-subtitle">Crea y administra tus grupos escolares.</p>
      </div>
      <button @click="isAdding = true" class="btn-primary flex items-center gap-2">
        <Plus :size="20" /> Nuevo Grupo
      </button>
    </header>

    <!-- Modal Agregar -->
    <div v-if="isAdding" class="modal-overlay" @click.self="isAdding = false">
      <div class="modal-content glass animate-in">
        <h3 class="modal-title">Crear Nuevo Grupo</h3>
        <div class="form-group">
          <label>Nombre del Grupo</label>
          <input v-model="newGroup.name" type="text" placeholder="Ej. Matemáticas A" class="form-input" autofocus>
        </div>
        <div class="form-group">
          <label>Descripción (Opcional)</label>
          <textarea v-model="newGroup.description" placeholder="Breve descripción..." class="form-input" rows="3"></textarea>
        </div>
        <div class="modal-actions">
          <button @click="isAdding = false" class="btn-ghost">Cancelar</button>
          <button @click="addGroup" class="btn-primary">Guardar Grupo</button>
        </div>
      </div>
    </div>

    <!-- Modal Editar -->
    <div v-if="editingGroup" class="modal-overlay" @click.self="editingGroup = null">
      <div class="modal-content glass animate-in">
        <h3 class="modal-title">Editar Grupo</h3>
        <div class="form-group">
          <label>Nombre del Grupo</label>
          <input v-model="editingGroup.name" type="text" class="form-input" autofocus>
        </div>
        <div class="form-group">
          <label>Descripción (Opcional)</label>
          <textarea v-model="editingGroup.description" class="form-input" rows="3"></textarea>
        </div>
        <div class="modal-actions">
          <button @click="editingGroup = null" class="btn-ghost">Cancelar</button>
          <button @click="updateGroup" class="btn-primary">Actualizar</button>
        </div>
      </div>
    </div>

    <div class="groups-grid">
      <div v-for="group in groups" :key="group.id" class="group-card glass">
        <div class="group-card-header">
          <div class="group-icon">
            <Users :size="20" />
          </div>
          <div class="group-actions">
            <button @click="openEdit(group)" class="btn-icon-edit" title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </button>
            <button @click="deleteGroup(group.id)" class="btn-delete" title="Eliminar">
              <Trash2 :size="18" />
            </button>
          </div>
        </div>
        <h3 class="group-title">{{ group.name }}</h3>
        <p class="group-desc">{{ group.description || 'Sin descripción' }}</p>
        <div class="group-footer">
          <span class="group-date">Creado: {{ new Date(group.created_at).toLocaleDateString() }}</span>
          <NuxtLink :to="`/students?group_id=${group.id}`" class="link-manage">Ver Alumnos</NuxtLink>
        </div>
      </div>

      <div v-if="groups?.length === 0" class="empty-state glass">
        <Users :size="48" class="text-slate-500" />
        <p>Aún no has creado ningún grupo.</p>
        <button @click="isAdding = true" class="btn-ghost">Empezar ahora</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.groups-page {
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

.btn-ghost {
  background: #fff;
  color: #000;
  border: 2px solid #000;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 2px 2px 0px #000;
}

.btn-ghost:hover {
  background: var(--bg-dark);
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0px #000;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.group-card {
  background: #fff;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;
  border: 2px solid #000;
  border-radius: 4px;
  box-shadow: 4px 4px 0px #000;
}

.group-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 8px 8px 0px #000;
}

.group-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-actions {
  display: flex;
  gap: 8px;
}

.group-icon {
  width: 48px;
  height: 48px;
  background: var(--accent-blue);
  color: #000;
  border: 2px solid #000;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0px #000;
}

.btn-icon-edit {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: all 0.3s;
}

.btn-icon-edit:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--primary);
}

.btn-delete {
  background: transparent;
  border: none;
  color: rgba(239, 68, 68, 0.6);
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: all 0.3s;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.group-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #000;
  margin: 0;
}

.group-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.group-date {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.link-manage {
  color: #000;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  font-weight: 800;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;
}

.link-manage:hover {
  color: var(--primary);
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
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 800;
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

.empty-state {
  grid-column: 1 / -1;
  padding: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: var(--text-muted);
  text-align: center;
}
</style>
