import { apiFetch } from './apiClient.js'

export function createFaculty({ name, email, password }) {
  return apiFetch('/api/admin/faculty', { method: 'POST', body: { name, email, password } })
}

export function listFaculty() {
  return apiFetch('/api/admin/faculty')
}

export function createStudent({ name, email, password, rollNumber }) {
  return apiFetch('/api/admin/students', {
    method: 'POST',
    body: { name, email, password, rollNumber },
  })
}

export function listStudents() {
  return apiFetch('/api/admin/students')
}

export function getStats() {
  return apiFetch('/api/admin/stats')
}
