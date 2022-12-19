import { createReadStream, createWriteStream, existsSync } from 'fs'
import { pipeline } from 'stream'

export async function copyMyFile(source, dest) {
  if (existsSync(dest)) {
    console.log('File didn`t copy. File has exists yet.')
  }
  if (!existsSync(source)) {
    console.log('File doesn`t exist')
  }
  const input = createReadStream(source)
  const output = createWriteStream(dest)
  
  pipeline(input, output, (err) => {
    if (err) {
      console.log(err);
    }
  })
}
