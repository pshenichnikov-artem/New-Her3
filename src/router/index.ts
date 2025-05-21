import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import HomePage from '@/views/HomePage.vue'
import { useAuthStore } from '@/stores/auth'
import NotFoundPage from '@/views/NotFoundPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        requiresAuth: false, // Изменено с true на false, чтобы главная страница была доступна всем
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
        requiresAuth: false, // Изменено для доступа к тестовым страницам
        title: 'Filters Test',
      },
    },
    {
      path: '/notifications-test',
      name: 'notifications-test',
      component: () => import('@/views/testPage/NotificationTestPage.vue'),
      meta: {
        requiresAuth: false, // Изменено для доступа к тестовым страницам
        title: 'Notifications Test',
      },
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('@/views/events/EventsPage.vue'),
      meta: {
        requiresAuth: false,
        title: 'Events',
      },
    },
    // Добавляем маршрут 404 для не найденных страниц
    {
      path: '/not-found',
      name: 'not-found',
      component: NotFoundPage,
      meta: {
        requiresAuth: false,
        title: 'Page Not Found',
      },
    },
    // Перенаправление всех остальных маршрутов на страницу 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/not-found',
    },
    // Добавляем маршрут для страницы покупки билетов
    {
      path: '/by-ticket/:eventId',
      name: 'purchase-tickets',
      component: () => import('@/views/tickets/PurchasePage.vue'),
      meta: {
        role: ['user'],
        requiresAuth: true,
        title: 'Purchase Tickets',
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated // Используем реальное значение вместо константы true
  const userRole = authStore.role
  const allowedRoles = Array.isArray(to.meta.roles) ? to.meta.roles : []

  // Проверяем, требуется ли авторизация для маршрута
  if (to.meta.requiresAuth) {
    // Если требуется авторизация, но пользователь не авторизован
    if (!isAuthenticated) {
      next('/login')
      return
    }

    // Если требуются определенные роли и они указаны
    if (allowedRoles.length > 0) {
      // Проверяем, имеет ли пользователь нужную роль
      if (!userRole || !allowedRoles.some((role) => role === userRole)) {
        next('/unauthorized')
        return
      }
    }
  }

  // Если маршрут не требует авторизации или все проверки пройдены
  next()
})

export default router
