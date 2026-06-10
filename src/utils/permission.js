import { useUserStore } from '@/stores/user'

export function canEdit() {
  const userStore = useUserStore()
  return userStore.role === 'admin' || userStore.role === 'teacher'
}

export function canDelete() {
  const userStore = useUserStore()
  return userStore.role === 'admin' || userStore.role === 'teacher'
}

export function canAdd() {
  const userStore = useUserStore()
  return userStore.role === 'admin' || userStore.role === 'teacher'
}

export function isAdmin() {
  const userStore = useUserStore()
  return userStore.role === 'admin'
}

export function isTeacher() {
  const userStore = useUserStore()
  return userStore.role === 'teacher'
}

export function isStudent() {
  const userStore = useUserStore()
  return userStore.role === 'student'
}
