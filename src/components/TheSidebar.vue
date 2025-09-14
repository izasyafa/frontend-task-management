<template>
  <div class="flex">
    <!-- Toggle Button (Mobile Only) -->
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md"
    >
      <span v-if="!isOpen">☰</span>
      <span v-else>✕</span>
    </button>

    <!-- Sidebar -->
    <transition name="slide">
      <aside
        v-show="isOpen"
        class="fixed lg:static top-0 left-0 w-64 bg-slate-800 min-h-screen p-4 text-white z-40"
      >
        <h2 class="text-lg font-semibold mb-4">Projects</h2>

        <!-- List of Projects -->
        <ul class="space-y-2">
          <li
            v-for="project in projects"
            :key="project.id"
            class="flex items-center justify-between px-3 py-2 rounded hover:bg-slate-700 cursor-pointer transition-colors"
          >
            <span>{{ project.name }}</span>
            <span class="text-xs bg-blue-600 px-2 py-0.5 rounded-full"
              >{{ project.tasks }} tasks</span
            >
          </li>
        </ul>

        <!-- Add Project Button -->
        <button
          @click="addProject"
          class="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors"
        >
          + Add Project
        </button>
      </aside>
    </transition>

    <!-- Main Content (placeholder) -->
    <main class="flex-1 lg:ml-64 p-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const projects = ref([
  { id: 1, name: 'Website Redesign', tasks: 12 },
  { id: 2, name: 'Mobile App', tasks: 8 },
  { id: 3, name: 'Internal Tools', tasks: 5 },
])

const addProject = () => {
  const newId = projects.value.length + 1
  projects.value.push({ id: newId, name: `New Project ${newId}`, tasks: 0 })
}

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

onMounted(() => {
  if (window.innerWidth < 1024) {
    isOpen.value = false
  }
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
