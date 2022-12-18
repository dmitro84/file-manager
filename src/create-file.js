import { writeFile, existsSync } from 'fs'

export const createFile = (file) => {
  if (existsSync(file)) {
    console.log('File didn`t create. File has exists yet.')
  }
  writeFile(file, '', function (err) {
    if (err) {
      console.log(err)
    }
  })
}
