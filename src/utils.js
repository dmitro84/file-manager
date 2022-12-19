import { dirname } from 'path'
import { fileURLToPath } from 'url'

export const __dirname = dirname(fileURLToPath(import.meta.url))

export const byField = (field) => {
  return (a, b) => (a[field] > b[field] ? 1 : -1)
}
