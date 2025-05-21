import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// Стандартные breakpoints, соответствующие SCSS-переменным и Tailwind
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export type BreakpointKey = keyof typeof breakpoints

/**
 * Composable для отслеживания размеров экрана и адаптации интерфейса
 */
export function useAdaptiveInterface() {
  const windowWidth = ref(0)

  // Устанавливаем начальную ширину при монтировании
  onMounted(() => {
    windowWidth.value = window.innerWidth
    window.addEventListener('resize', updateWidth)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWidth)
  })

  // Обработчик изменения размера окна
  const updateWidth = () => {
    windowWidth.value = window.innerWidth
  }

  // Вычисляемые свойства для различных размеров экрана
  const isMobile = computed(() => windowWidth.value < breakpoints.md)
  const isTablet = computed(
    () => windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg,
  )
  const isDesktop = computed(() => windowWidth.value >= breakpoints.lg)

  // Дополнительные вычисляемые свойства для комбинированных состояний
  const isTabletOrMobile = computed(() => windowWidth.value < breakpoints.lg)
  const isTabletOrDesktop = computed(() => windowWidth.value >= breakpoints.md)

  // Текущий активный breakpoint
  const currentBreakpoint = computed((): BreakpointKey => {
    if (windowWidth.value < breakpoints.sm) return 'sm'
    if (windowWidth.value < breakpoints.md) return 'md'
    if (windowWidth.value < breakpoints.lg) return 'lg'
    if (windowWidth.value < breakpoints.xl) return 'xl'
    return '2xl'
  })

  // Проверка превышения breakpoint
  const isBreakpoint = (bp: BreakpointKey): boolean => {
    return windowWidth.value >= breakpoints[bp]
  }

  return {
    // Текущая ширина окна
    windowWidth,

    // Предопределенные проверки
    isMobile,
    isTablet,
    isDesktop,
    isTabletOrMobile,
    isTabletOrDesktop,

    // Текущий breakpoint
    currentBreakpoint,

    // Методы
    isBreakpoint,
  }
}
