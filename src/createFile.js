import { open } from 'fs'

export const createFile = (file) => {
  open(file, 'w', function (err, f) {
    console.log(err)
  })
}
