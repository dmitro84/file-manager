import { rename } from 'fs'

export async function renameFile(pathToFile, newName) {
  rename(pathToFile, newName, (err) => {
    if (err) {
      console.log(err)
    }
  })
}
