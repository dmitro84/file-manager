import { createHash } from 'crypto'
import { createReadStream } from 'fs'

export const calculateHash = async (file) => {
  let data = ''

  const hashSum = createHash('sha256')

  const readStream = createReadStream(file, 'utf-8')

  readStream.on('data', (chunk) => (data += chunk.toString()))
  readStream.on('end', () => console.log(hashSum.update(data).digest('hex')))
  readStream.on('error', (error) => console.log('Error', error.message))
}
