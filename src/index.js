import * as readline from 'node:readline/promises'
import { getUsername } from './getUsername.js'
import { __dirname } from './utils.js'
import { homedir } from 'node:os'
import { screenFolder } from './screenFolder.js'
import { parse, isAbsolute } from 'path'
import { stat } from 'fs'
import { join } from 'node:path'

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
      let inputPath = line.slice(3)
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

  //   console.log(`You are currently in ${currentDir}`)
})

rl.on('SIGINT', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`)

  rl.close()
})
