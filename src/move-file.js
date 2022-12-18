import { existsSync, createReadStream, createWriteStream, unlink } from 'fs'
import { pipeline } from 'stream'

export async function moveFile(source, dest) {
  if (existsSync(dest)) {
    console.log('File didn`t copy. File has exists yet.')
  }
  if (!existsSync(source)) {
    console.log('File doesn`t exist')
  }
  const input = createReadStream(source)
  const output = createWriteStream(dest)

 await pipeline(input, output, (err) => {
    if (err) {
      console.log(err)
    }
  })
  unlink(source, (err) => {
    if (err) {
      return console.log(err)
    }
  })
}
