import { createReadStream, createWriteStream, existsSync } from 'fs'
import { createBrotliCompress } from 'zlib'
import { pipeline } from 'stream'
import { __dirname } from './utils.js'

export const compress = async (source, dest) => {
  if (existsSync(dest)) {
    console.log('File didn`t compress. File has exists yet.')
  }
  if (!existsSync(source)) {
    console.log('File doesn`t exist')
  }
  const input = createReadStream(source, 'utf-8')
  const output = createWriteStream(dest)
  const gzip = createBrotliCompress()

  pipeline(input, gzip, output, (error) => {
    if (error) {
      console.log(error)
    }
  })
}
