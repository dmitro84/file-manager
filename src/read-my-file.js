import { createReadStream, existsSync } from 'fs'
import { __dirname } from './utils.js'

export const readMyFile = async (file) => {
  if (!existsSync(file)) {
    console.log('File doesn`t exist')
    return;
  }
  return createReadStream(file, 'utf-8')
}
