import * as readline from 'node:readline/promises'
import { getUsername } from './get-username.js'
import { __dirname } from './utils.js'
import { homedir } from 'node:os'
import { screenFolder } from './screen-folder.js'
import { parse, isAbsolute } from 'path'
import { stat, unlink } from 'fs'
import { join } from 'node:path'
import { createFile } from './create-file.js'
import { readMyFile } from './read-my-file.js'
import { removeFile } from './remove-file.js'
import { renameFile } from './rename-file.js'
import { copyMyFile } from './copy-file.js'
import { moveFile } from './move-file.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const username = getUsername(process.argv)
let currentDir = homedir()

if (!username) {
  console.log('Error. Enter correct command.')
  rl.close()
} else {
  console.log(`Welcome to the File Manager, ${username}!`)
  console.log(`You are currently in ${currentDir}`)
}

rl.on('line', (line) => {
  if (line.toString().trim() === '.exit') {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`)
    rl.close()
  }

  if (line.toString().trim() === 'ls') {
    screenFolder(currentDir).then(() =>
      console.log(`You are currently in ${currentDir}`)
    )
  }

  if (line.toString().trim() === 'up') {
    currentDir = parse(currentDir).dir
    console.log(`You are currently in ${currentDir}`)
  }

  if (line.toString().trim().indexOf('cd') === 0) {
    if (line[2] === ' ' && line[3]) {
      let inputPath = line.slice(3).trim()
      let futureDir = ''

      if (isAbsolute(inputPath)) {
        currentDir = inputPath
        futureDir = join(inputPath)
      } else {
        if (inputPath.indexOf(':') === 1) {
          futureDir = join(inputPath, '/')
        } else {
          futureDir = join(currentDir, inputPath)
        }
      }

      stat(futureDir, function (err, stats) {
        if (err) {
          console.log('Path doesn`t exist.')
        } else {
          if (stats.isFile()) {
            console.log('Path isn`t a folder')
          } else {
            currentDir = futureDir
            console.log(`You are currently in ${currentDir}`)
          }
        }
      })
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('add') === 0) {
    if (line[3] === ' ' && line[4]) {
      const fileName = line.slice(4).trim()
      createFile(join(currentDir, fileName))
      console.log(`You are currently in ${currentDir}`)
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('cat') === 0) {
    if (line[3] === ' ' && line[4]) {
      const fileName = line.slice(4).trim()
      const stream = readMyFile(join(currentDir, fileName))
      stream
        .then((readStream) => {
          let data = ''
          readStream.on('data', (chunk) => (data += chunk))
          readStream.on('end', () => {
            console.log(data)
            console.log(`You are currently in ${currentDir}`)
          })
          readStream.on('error', (error) => console.log('Error', error.message))
        })
        .catch((err) => {
          console.log(err)
          console.log(`You are currently in ${currentDir}`)
        })
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('rm') === 0) {
    if (line[2] === ' ' && line[3]) {
      const fileName = line.slice(3).trim()
      if (isAbsolute(fileName)) {
        removeFile(fileName)
      } else {
        removeFile(join(currentDir, fileName))
          .then(() => console.log(`You are currently in ${currentDir}`))
          .catch(() => {
            console.log()
            console.log(`You are currently in ${currentDir}`)
          })
      }
      console.log(`You are currently in ${currentDir}`)
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('rn') === 0) {
    if (line[2] === ' ' && line[3]) {
      const args = line.slice(3).trim().split(' ')
      const oldFileName = args[0]
      const newFileName = args[1]
      if (isAbsolute(oldFileName)) {
        renameFile(oldFileName, join(parse(oldFileName).dir, newFileName))
      } else {
        renameFile(join(currentDir, oldFileName), join(currentDir, newFileName))
      }

      console.log(`You are currently in ${currentDir}`)
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('cp') === 0) {
    if (line[2] === ' ' && line[3]) {
      const args = line.slice(3).trim().split(' ')
      const sourceFileName = args[0]
      const destFile = args[1]
      if (isAbsolute(sourceFileName)) {
        copyMyFile(sourceFileName, join(destFile, parse(sourceFileName).base))
      } else {
        copyMyFile(
          join(currentDir, sourceFileName),
          join(destFile, sourceFileName)
        )
      }

      console.log(`You are currently in ${currentDir}`)
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('mv') === 0) {
    if (line[2] === ' ' && line[3]) {
      const args = line.slice(3).trim().split(' ')
      const sourceFileName = args[0]
      const destFile = args[1]
      if (isAbsolute(sourceFileName)) {
        moveFile(sourceFileName, join(destFile, parse(sourceFileName).base))
      } else {
        moveFile(
          join(currentDir, sourceFileName),
          join(destFile, sourceFileName)
        )
      }
      console.log(`You are currently in ${currentDir}`)
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  //   console.log(`You are currently in ${currentDir}`)
})

rl.on('SIGINT', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`)

  rl.close()
})
