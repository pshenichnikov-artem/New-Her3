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
    // Профиль пользователя с вложенными маршрутами
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/profile/ProfilePage.vue'),
      meta: {
        requiresAuth: true,
        title: 'Profile',
      },
      redirect: '/profile/info',
      children: [
        {
          path: 'info',
          name: 'profile-info',
          component: () => import('@/views/profile/ProfileInfo.vue'),
          meta: {
            requiresAuth: true,
            title: 'Profile - User Info',
          },
        },
        {
          path: 'tickets',
          name: 'profile-tickets',
          component: () => import('@/views/profile/ProfileTickets.vue'),
          meta: {
            requiresAuth: true,
            title: 'Profile - Tickets',
          },
        },
        {
          path: 'calendar',
          name: 'profile-calendar',
          component: () => import('@/views/profile/ProfileCalendar.vue'),
          meta: {
            requiresAuth: true,
            title: 'Profile - Calendar',
          },
        },
      ],
    },
    // Добавляем маршрут для панели управления с вложенными маршрутами
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/Dashboard.vue'),
      meta: {
        // roles: ['admin'], // Доступ только для администраторов
        //requiresAuth: true,
        title: 'Dashboard',
      },
      redirect: '/dashboard/events',
      children: [
        {
          path: 'events',
          name: 'dashboard-events',
          component: () => import('@/views/dashboard/DashboardEvents.vue'),
          meta: {
            roles: ['admin'],
            requiresAuth: true,
            title: 'Dashboard - Events',
          },
          children: [
            {
              path: 'create',
              name: 'dashboard-events-create',
              component: () => import('@/views/dashboard/editor/EventEditor.vue'),
              meta: {
                roles: ['admin'],
                requiresAuth: true,
                title: 'Dashboard - Create Event',
              },
            },
            {
              path: 'edit/:id',
              name: 'dashboard-events-edit',
              component: () => import('@/views/dashboard/editor/EventEditor.vue'),
              meta: {
                roles: ['admin'],
                requiresAuth: true,
                title: 'Dashboard - Edit Event',
              },
            },
          ],
        },
        {
          path: 'users',
          component: () => import('@/views/dashboard/DashboardUsers.vue'),
          name: 'dashboard-users',
          meta: {
            roles: ['admin'],
            requiresAuth: true,
            title: 'Dashboard - Users',
          },
          children: [
            {
              path: 'create',
              name: 'dashboard-users-create',
              component: () => import('@/views/dashboard/editor/UserEditor.vue'),
              meta: {
                roles: ['admin'],
                requiresAuth: true,
                title: 'Dashboard - Create User',
              },
            },
            {
              path: 'edit/:id',
              name: 'dashboard-users-edit',
              component: () => import('@/views/dashboard/editor/UserEditor.vue'),
              meta: {
                roles: ['admin'],
                requiresAuth: true,
                title: 'Dashboard - Edit User',
              },
            },
          ],
        },
        {
          path: 'tickets',
          name: 'dashboard-tickets',
          component: () => import('@/views/dashboard/DashboardTickets.vue'),
          meta: {
            roles: ['admin'],
            requiresAuth: true,
            title: 'Dashboard - Tickets',
          },
          children: [
            {
              path: 'create',
              name: 'dashboard-tickets-create',
              component: () => import('@/views/dashboard/editor/TicketsEditor.vue'),
              meta: {
                roles: ['admin'],
                requiresAuth: true,
                title: 'Dashboard - Create Ticket',
              },
            },
            {
              path: 'edit/:id',
              name: 'dashboard-tickets-edit',
              component: () => import('@/views/dashboard/editor/TicketsEditor.vue'),
              meta: {
                roles: ['admin'],
                requiresAuth: true,
                title: 'Dashboard - Edit Ticket',
              },
            },
          ],
        },
        {
          path: 'attendees',
          name: 'dashboard-attendees',
          component: () => import('@/views/dashboard/DashboardAttendees.vue'),
          meta: {
            roles: ['admin'],
            requiresAuth: true,
            title: 'Dashboard - Attendees',
          },
          children: [
            {
              path: 'create',
              name: 'dashboard-attendees-create',
              component: () => import('@/views/dashboard/editor/AttendeeEditor.vue'),
              meta: {
                roles: ['admin'],
                requiresAuth: true,
                title: 'Dashboard - Create Attendee',
              },
            },
            {
              path: 'edit/:id',
              name: 'dashboard-attendees-edit',
              component: () => import('@/views/dashboard/editor/AttendeeEditor.vue'),
              meta: {
                roles: ['admin'],
                requiresAuth: true,
                title: 'Dashboard - Edit Attendee',
              },
            },
          ],
        },
        {
          path: 'pages',
          name: 'dashboard-pages',
          component: () => import('@/views/dashboard/DashboardPages.vue'),
          meta: {
            roles: ['admin'],
            requiresAuth: true,
            title: 'Dashboard - Pages',
          },
        },
      ],
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
