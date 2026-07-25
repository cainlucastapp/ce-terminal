// client/src/services/config.js

import { api } from './client'

export function getConfig() {
  return api.get('/config')
}
