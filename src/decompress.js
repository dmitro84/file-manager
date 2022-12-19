import { createReadStream, createWriteStream, existsSync } from 'fs'
import { createBrotliDecompress } from 'zlib'
import { pipeline } from 'stream'
import { __dirname } from './utils.js'

export const decompress = async (source, dest) => {
  if (existsSync(dest)) {
    console.log('File didn`t decompress. File has exists yet.')
  }
  if (!existsSync(source)) {
    console.log('File doesn`t exist')
  }
  const input = createReadStream(source)
  const output = createWriteStream(dest)
  const unzip = createBrotliDecompress()

  pipeline(input, unzip, output, (error) => {
    if (error) {
      console.log(error)
    }
  })
}
