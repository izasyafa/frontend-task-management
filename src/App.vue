<script setup>
import TheHeader from './components/TheHeader.vue'
import TheSidebar from './components/TheSidebar.vue'
import './style.css'
</script>

<template>
  <div class="h-screen w-screen bg-slate-900 text-white flex flex-col">
    <!-- Header -->
    <TheHeader />

    <!-- Sidebar + Main -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <TheSidebar />

      <!-- Main Content -->
      <div class="flex-1 p-6 overflow-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>
