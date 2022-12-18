import { unlink } from 'fs/promises'
import { existsSync } from 'fs'

export const removeFile = async (file) => {
  try {
    if (!existsSync(file)) {
      console.log('File doesn`t exist')
    }
    await unlink(file)
  } catch (error) {
    console.log(error)
  }
}
