import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import HomePage from '@/views/HomePage.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        requiresAuth: true,
        title: 'Home',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: {
        requiresAuth: false,
        title: 'Login',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: {
        requiresAuth: false,
        title: 'Register',
      },
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/UnauthorizedPage.vue'),
      meta: {
        requiresAuth: false,
        title: 'Unauthorized',
      },
    },
    {
      path: '/filters-test',
      name: 'filters-test',
      component: () => import('@/views/testPage/FilterTestPage.vue'),
      meta: {
        requiresAuth: false,
        title: 'Filters Test',
      },
    },
    {
      path: '/notifications-test',
      name: 'notifications-test',
      component: () => import('@/views/testPage/NotificationTestPage.vue'),
      meta: {
        requiresAuth: false,
        title: 'Notifications Test',
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = true // authStore.getIsAuthenticated
  const userRole = authStore.getUserRole
  const allowedRoles = Array.isArray(to.meta.roles) ? to.meta.roles : []

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next('/login')
    } else if (
      allowedRoles.length &&
      (!userRole || !allowedRoles.some((role) => role === userRole))
    ) {
      next('/unauthorized')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
