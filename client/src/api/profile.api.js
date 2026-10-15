import { apiFetch } from './apiClient.js'

export function getProfile() {
  return apiFetch('/api/profile/me')
}
