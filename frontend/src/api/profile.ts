import { api, getData } from './client'
import type { Profile } from '../types/profile'

export function fetchProfile() {
  return getData<Profile>(api.get('/profile'))
}
