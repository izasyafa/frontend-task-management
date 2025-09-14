<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import Tag from 'primevue/tag'
import Card from 'primevue/card'
import { FilterMatchMode } from '@primevue/core/api'

const tasks = ref([])
const globalFilter = ref('')
const selectedDeveloper = ref(null)
const multiSortMeta = ref([])

const statusOptions = ref([
  { label: 'Ready to start', value: 'Ready to start' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Waiting for review', value: 'Waiting for review' },
  { label: 'Pending Deploy', value: 'Pending Deploy' },
  { label: 'Done', value: 'Done' },
  { label: 'Stuck', value: 'Stuck' },
])

const priorityOptions = ref([
  { label: 'Critical', value: 'Critical' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
  { label: 'Best Effort', value: 'Best Effort' },
])

const typeOptions = ref([
  { label: 'Feature Enhancements', value: 'Feature Enhancements' },
  { label: 'Other', value: 'Other' },
  { label: 'Bug', value: 'Bug' },
])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  developer: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.CONTAINS },
  priority: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const uniqueDevelopers = computed(() => {
  const devs = new Set()
  tasks.value.forEach((task) => {
    task.developer.forEach((dev) => devs.add(dev))
  })
  return Array.from(devs)
    .sort()
    .map((dev) => ({ label: dev, value: dev }))
})

const filteredTasks = computed(() => {
  let filtered = tasks.value
  if (selectedDeveloper.value) {
    filtered = filtered.filter((task) => task.developer?.includes(selectedDeveloper.value))
  }
  return filtered
})

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Ready to start':
      return 'info'
    case 'In Progress':
      return 'warning'
    case 'Waiting for review':
      return 'help'
    case 'Pending Deploy':
      return 'secondary'
    case 'Done':
      return 'success'
    case 'Stuck':
      return 'danger'
    default:
      return 'info'
  }
}

const getPrioritySeverity = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'danger'
    case 'High':
      return 'warning'
    case 'Medium':
      return 'info'
    case 'Low':
      return 'secondary'
    case 'Best Effort':
      return null
    default:
      return 'info'
  }
}

const getTypeSeverity = (type) => {
  switch (type) {
    case 'Feature Enhancements':
      return 'success'
    case 'Bug':
      return 'danger'
    case 'Other':
      return 'secondary'
    default:
      return 'info'
  }
}

const addNewTask = () => {
  const newTask = {
    id: Date.now(),
    title: 'New Task',
    developer: '',
    priority: 'Medium',
    status: 'Ready to start',
    type: 'Other',
    date: new Date(),
    estimatedSP: 0,
    actualSP: 0,
  }
  tasks.value.unshift(newTask)
}

const onCellEditComplete = (event) => {
  const { data, newValue, field } = event
  if (field === 'date') {
    data[field] = newValue
  } else if (field === 'estimatedSP' || field === 'actualSP') {
    if (newValue !== null && newValue >= 0) {
      data[field] = parseInt(newValue) || 0
    } else {
      event.preventDefault()
    }
  } else {
    if (newValue && newValue.toString().trim().length > 0) {
      data[field] = newValue
    } else {
      event.preventDefault()
    }
  }
}

onMounted(async () => {
  try {
    const res = await fetch('https://mocki.io/v1/4e602db4-efab-438f-a664-bec50fc16f7e')
    const json = await res.json()
    tasks.value = (json.data || []).map((item) => ({
      title: item.title,
      developer: item.developer ? item.developer.split(',').map((dev) => dev.trim()) : [],
      priority: item.priority,
      status: item.status,
      type: item.type,
      estimatedSP: item['Estimated SP'],
      actualSP: item['Actual SP'],
    }))
    console.log(tasks)
  } catch (err) {
    console.error('Gagal fetch data:', err)
  }
})
</script>

<template>
  <div class="min-h-screen surface-ground p-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold text-primary mb-6">Task Management</h1>

      <!-- Controls Section -->
      <Card class="mb-6">
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Add New Task -->
            <Button
              @click="addNewTask"
              label="New Task"
              icon="pi pi-plus"
              class="p-button-success"
            />

            <!-- Global Search -->
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters.global.value"
                placeholder="Search tasks..."
                class="w-full"
              />
            </span>

            <!-- Developer Filter -->
            <Dropdown
              v-model="selectedDeveloper"
              :options="uniqueDevelopers"
              option-label="label"
              option-value="value"
              placeholder="Filter by Developer"
              class="w-full"
              :show-clear="true"
            />

            <!-- Clear Filters -->
            <Button
              @click="((selectedDeveloper = null), (globalFilter = ''))"
              label="Clear Filters"
              icon="pi pi-filter-slash"
              class="p-button-secondary"
            />
          </div>
        </template>
      </Card>

      <!-- Data Table -->
      <Card>
        <template #content>
          <DataTable
            :value="filteredTasks"
            v-model:filters="filters"
            :globalFilterFields="['title', 'developer', 'status', 'priority', 'type']"
            editMode="cell"
            sortMode="multiple"
            v-model:multiSortMeta="multiSortMeta"
            removableSort
            :paginator="false"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 25, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            @cell-edit-complete="onCellEditComplete"
            class="p-datatable-lg"
          >
            <!-- Title Column -->
            <Column field="title" header="Task" sortable style="min-width: 200px">
              <template #body="{ data }">
                <span class="font-semibold">{{ data.title }}</span>
              </template>
              <template #editor="{ data, field }">
                <InputText v-model="data[field]" autofocus fluid />
              </template>
            </Column>

            <!-- Developer Column -->
            <Column field="developer" header="Developer" sortable style="min-width: 180px">
              <template #body="{ data }">
                <div class="flex flex-wrap gap-1">
                  <Tag
                    v-for="dev in data.developer"
                    :key="dev"
                    :value="dev"
                    severity="info"
                    class="text-xs"
                  />
                </div>
              </template>
              <template #editor="{ data, field }">
                <MultiSelect
                  v-model="data[field]"
                  :options="uniqueDevelopers"
                  option-label="label"
                  option-value="value"
                  filter
                  placeholder="Select Developers"
                  class="w-full"
                />
              </template>
            </Column>

            <!-- Priority Column -->
            <Column field="priority" header="Priority" sortable style="min-width: 120px">
              <template #body="{ data }">
                <Tag :value="data.priority" :severity="getPrioritySeverity(data.priority)" />
              </template>
              <template #editor="{ data, field }">
                <Dropdown
                  v-model="data[field]"
                  :options="priorityOptions"
                  option-label="label"
                  option-value="value"
                  fluid
                />
              </template>
            </Column>

            <!-- Status Column -->
            <Column field="status" header="Status" sortable style="min-width: 160px">
              <template #body="{ data }">
                <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
              </template>
              <template #editor="{ data, field }">
                <Dropdown
                  v-model="data[field]"
                  :options="statusOptions"
                  option-label="label"
                  option-value="value"
                  fluid
                />
              </template>
            </Column>

            <!-- Type Column -->
            <Column field="type" header="Type" sortable style="min-width: 150px">
              <template #body="{ data }">
                <Tag :value="data.type" :severity="getTypeSeverity(data.type)" />
              </template>
              <template #editor="{ data, field }">
                <Dropdown
                  v-model="data[field]"
                  :options="typeOptions"
                  option-label="label"
                  option-value="value"
                  fluid
                />
              </template>
            </Column>

            <!-- Estimated SP Column -->
            <Column field="estimatedSP" header="Estimated SP" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span class="font-mono">{{ data.estimatedSP || '-' }}</span>
              </template>
              <template #editor="{ data, field }">
                <InputNumber v-model="data[field]" :min="0" fluid />
              </template>
            </Column>

            <!-- Actual SP Column -->
            <Column field="actualSP" header="Actual SP" sortable style="min-width: 120px">
              <template #body="{ data }">
                <span class="font-mono">{{ data.actualSP || '-' }}</span>
              </template>
              <template #editor="{ data, field }">
                <InputNumber v-model="data[field]" :min="0" fluid />
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for dark theme compatibility */
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
