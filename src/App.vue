<script setup>
import { ref } from 'vue'
import { Plus, Search, Filter } from 'lucide-vue-next'
import './style.css'

const tasks = ref([
  {
    id: 1,
    title: 'New Task',
    description: 'Working on new features',
    status: 'Working on it',
    priority: 'Low',
    type: 'Development',
    dueDate: '6 SP',
    actualTime: '0 SP',
    assignee: { name: 'User', avatar: '👤' },
  },
  {
    id: 2,
    title: 'New Task',
    description: 'Review and testing',
    status: 'Done',
    priority: 'Medium',
    type: 'Review',
    dueDate: '2 SP',
    actualTime: '1.5 SP',
    assignee: { name: 'User', avatar: '👤' },
  },
  {
    id: 3,
    title: 'Committed Feature',
    description: 'Ready to start implementation',
    status: 'Ready to start',
    priority: 'High',
    type: 'Feature',
    dueDate: '3 SP',
    actualTime: '1.5 SP',
    assignee: { name: 'User', avatar: '👤' },
  },
])

const selectedTasks = ref([])

const toggleTaskSelection = (taskId) => {
  if (selectedTasks.value.includes(taskId)) {
    selectedTasks.value = selectedTasks.value.filter((id) => id !== taskId)
  } else {
    selectedTasks.value.push(taskId)
  }
}

const addNewTask = () => {
  const newTask = {
    id: tasks.value.length + 1,
    title: 'New Task',
    description: 'Click to edit description',
    status: 'Ready to start',
    priority: 'Medium',
    type: 'Development',
    dueDate: '0 SP',
    actualTime: '0 SP',
    assignee: { name: 'User', avatar: '👤' },
  }
  tasks.value.push(newTask)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Working on it':
      return 'bg-orange-400'
    case 'Done':
      return 'bg-green-400'
    case 'Ready to start':
      return 'bg-purple-400'
    default:
      return 'bg-gray-400'
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-red-200 text-red-800'
    case 'Medium':
      return 'bg-blue-200 text-blue-800'
    case 'Low':
      return 'bg-yellow-200 text-yellow-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}

const getTypeColor = (type) => {
  switch (type) {
    case 'Development':
      return 'bg-pink-200 text-pink-800'
    case 'Review':
      return 'bg-indigo-200 text-indigo-800'
    case 'Feature':
      return 'bg-purple-200 text-purple-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <!-- Header -->
    <div class="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">PT</span>
          </div>
          <span class="text-lg font-semibold">Plan Table</span>
          <span class="hidden sm:block text-slate-400">Kanban</span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-3">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="addNewTask"
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-colors"
          >
            <Plus class="w-4 h-4" />
            <span>New task</span>
          </button>
          <button class="text-slate-400 hover:text-white p-2 rounded-lg transition-colors">
            <Search class="w-4 h-4" />
          </button>
          <button class="text-slate-400 hover:text-white p-2 rounded-lg transition-colors">
            <Filter class="w-4 h-4" />
          </button>
          <select
            class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option>Sort</option>
            <option>Priority</option>
            <option>Due Date</option>
            <option>Status</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Sidebar + Main -->
    <div class="flex flex-col lg:flex-row">
      <!-- Sidebar -->
      <div class="w-full lg:w-64 bg-slate-800 min-h-[200px] lg:min-h-screen p-4">
        <div class="space-y-2">
          <div class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-700">
            <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span class="text-sm font-medium">All Task</span>
          </div>
          <div class="ml-0 lg:ml-4 space-y-1">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                :checked="selectedTasks.includes(task.id)"
                @change="toggleTaskSelection(task.id)"
                class="w-4 h-4 rounded border-slate-600 bg-slate-700"
              />
              <span class="text-sm text-slate-300">{{ task.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main -->
      <div class="flex-1 p-4 sm:p-6">
        <!-- Desktop Table -->
        <div class="hidden md:block bg-slate-800 rounded-lg overflow-hidden">
          <!-- Table Header -->
          <div
            class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-3 bg-slate-700 text-xs sm:text-sm font-medium text-slate-300"
          >
            <div class="col-span-1"><input type="checkbox" class="w-4 h-4" /></div>
            <div class="col-span-3">Task</div>
            <div class="col-span-2">Description</div>
            <div class="col-span-1">Status</div>
            <div class="col-span-1">Priority</div>
            <div class="col-span-1">Type</div>
            <div class="col-span-1">Due</div>
            <div class="col-span-1">Est. SP</div>
            <div class="col-span-1">Actual SP</div>
          </div>

          <!-- Rows -->
          <div
            v-for="task in tasks"
            :key="task.id"
            class="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 border-b border-slate-700 hover:bg-slate-750"
          >
            <div class="col-span-1 flex items-center">
              <input
                type="checkbox"
                :checked="selectedTasks.includes(task.id)"
                @change="toggleTaskSelection(task.id)"
              />
            </div>
            <div class="col-span-3 flex items-center space-x-2">
              <div class="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                <span>{{ task.assignee.avatar }}</span>
              </div>
              <span class="font-medium">{{ task.title }}</span>
            </div>
            <div class="col-span-2 text-sm text-slate-300">{{ task.description }}</div>
            <div class="col-span-1">
              <span :class="getStatusColor(task.status)" class="px-2 py-1 text-xs rounded-full">{{
                task.status
              }}</span>
            </div>
            <div class="col-span-1">
              <span
                :class="getPriorityColor(task.priority)"
                class="px-2 py-1 text-xs rounded-full"
                >{{ task.priority }}</span
              >
            </div>
            <div class="col-span-1">
              <span :class="getTypeColor(task.type)" class="px-2 py-1 text-xs rounded-full">{{
                task.type
              }}</span>
            </div>
            <div class="col-span-1 text-sm">{{ task.dueDate }}</div>
            <div class="col-span-1 text-sm">{{ task.dueDate }}</div>
            <div class="col-span-1 text-sm">{{ task.actualTime }}</div>
          </div>
        </div>

        <!-- Mobile Card View -->
        <div class="space-y-4 md:hidden">
          <div v-for="task in tasks" :key="task.id" class="bg-slate-800 rounded-lg p-4 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <span>{{ task.assignee.avatar }}</span>
                </div>
                <span class="font-semibold">{{ task.title }}</span>
              </div>
              <input
                type="checkbox"
                :checked="selectedTasks.includes(task.id)"
                @change="toggleTaskSelection(task.id)"
              />
            </div>
            <p class="text-sm text-slate-300">{{ task.description }}</p>
            <div class="flex flex-wrap gap-2 text-xs">
              <span
                :class="getStatusColor(task.status)"
                class="px-2 py-1 rounded-full text-white"
                >{{ task.status }}</span
              >
              <span :class="getPriorityColor(task.priority)" class="px-2 py-1 rounded-full">{{
                task.priority
              }}</span>
              <span :class="getTypeColor(task.type)" class="px-2 py-1 rounded-full">{{
                task.type
              }}</span>
            </div>
            <div class="flex justify-between text-sm text-slate-400">
              <span>Due: {{ task.dueDate }}</span>
              <span>SP: {{ task.actualTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
