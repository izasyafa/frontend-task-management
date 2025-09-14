import { createRouter, createWebHistory } from 'vue-router'
import TaskManagement from '@/views/TaskManagement.vue'

const routes = [
  {
    path: '/',
    name: 'Task Management',
    component: TaskManagement,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
