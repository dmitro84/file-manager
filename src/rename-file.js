import { rename } from 'fs'

export function renameFile(pathToFile, newName) {
  rename(pathToFile, newName, (err) => {
    if (err) {
      console.log(err)
    }
  })
}
