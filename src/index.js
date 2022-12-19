import * as readline from 'node:readline/promises'
import { getUsername } from './get-username.js'
import { __dirname } from './utils.js'
import { homedir, EOL, cpus, userInfo, arch } from 'node:os'
import { screenFolder } from './screen-folder.js'
import { parse, isAbsolute } from 'path'
import { stat } from 'fs'
import { join } from 'node:path'
import { createFile } from './create-file.js'
import { readMyFile } from './read-my-file.js'
import { removeFile } from './remove-file.js'
import { renameFile } from './rename-file.js'
import { copyMyFile } from './copy-file.js'
import { moveFile } from './move-file.js'
import { calculateHash } from './calc-hash.js'
import { compress } from './compress.js'
import { decompress } from './decompress.js'

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
  let isCommand = false

  if (line.toString().trim() === '.exit') {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`)
    rl.close()
    return
  }

  if (line.toString().trim() === 'ls') {
    isCommand = true
    screenFolder(currentDir).then(() =>
      console.log(`You are currently in ${currentDir}`)
    )
  }

  if (line.toString().trim() === 'up') {
    isCommand = true
    currentDir = parse(currentDir).dir
    console.log(`You are currently in ${currentDir}`)
  }

  if (line.toString().trim().indexOf('cd') === 0) {
    isCommand = true
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
          console.log(`You are currently in ${currentDir}`)
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
    isCommand = true
    if (line[3] === ' ' && line[4]) {
      const fileName = line.slice(4).trim()
      createFile(join(currentDir, fileName))
      console.log(`You are currently in ${currentDir}`)
    } else {
      console.log('Error. Enter correct command.')
      console.log(`You are currently in ${currentDir}`)
    }
  }

  if (line.toString().trim().indexOf('cat') === 0) {
    isCommand = true
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
        .catch(() => {
          console.log(`You are currently in ${currentDir}`)
        })
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('rm') === 0) {
    isCommand = true
    if (line[2] === ' ' && line[3]) {
      const fileName = line.slice(3).trim()
      if (isAbsolute(fileName)) {
        removeFile(fileName)
      } else {
        removeFile(join(currentDir, fileName))
          .then(() => console.log(`You are currently in ${currentDir}`))
          .catch(() => {
            console.log(`You are currently in ${currentDir}`)
          })
      }
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('rn') === 0) {
    isCommand = true
    if (line[2] === ' ' && line[3]) {
      const args = line.slice(3).trim().split(' ')
      const oldFileName = args[0]
      if (!args[1]) {
        console.log('Error. Please enter correct command')
        return
      }
      const newFileName = args[1]
      if (isAbsolute(oldFileName)) {
        renameFile(oldFileName, join(parse(oldFileName).dir, newFileName))
          .then(() => console.log(`You are currently in ${currentDir}`))
          .catch((err) => console.log(err))
      } else {
        renameFile(join(currentDir, oldFileName), join(currentDir, newFileName))
          .then(() => console.log(`You are currently in ${currentDir}`))
          .catch((err) => console.log(err))
      }
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('cp') === 0) {
    isCommand = true
    if (line[2] === ' ' && line[3]) {
      const args = line.slice(3).trim().split(' ')
      const sourceFileName = args[0]
      if (!args[1]) {
        console.log('Error. Please enter correct command')
        return
      }
      const destFile = args[1]
      if (isAbsolute(sourceFileName)) {
        copyMyFile(sourceFileName, join(destFile, parse(sourceFileName).base))
          .then(() => console.log(`You are currently in ${currentDir}`))
          .catch((err) => {
            console.log(err)
            console.log(`You are currently in ${currentDir}`)
          })
      } else {
        copyMyFile(
          join(currentDir, sourceFileName),
          join(destFile, sourceFileName)
        )
          .then(() => console.log(`You are currently in ${currentDir}`))
          .catch((err) => {
            console.log(err)
            console.log(`You are currently in ${currentDir}`)
          })
      }
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('mv') === 0) {
    isCommand = true
    if (line[2] === ' ' && line[3]) {
      const args = line.slice(3).trim().split(' ')
      const sourceFileName = args[0]
      if (!args[1]) {
        console.log('Error. Please enter correct command')
        return
      }
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

  if (line.toString().trim().indexOf('os') === 0) {
    isCommand = true
    if (line[2] === ' ' && line[3]) {
      const args = line.slice(3).trim()

      switch (args) {
        case '--EOL':
          console.log(`EOL for your os: `, EOL.split())
          break
        case '--cpus':
          {
            cpus().map((item) =>
              console.log({ model: item.model, frequency: item.speed })
            )
          }
          break
        case '--homedir':
          console.log(homedir().toString())
          break
        case '--username':
          console.log('system user name: ', userInfo().username)
          break
        case '--architecture':
          console.log('Your architecture: ', arch())
          break
        default:
          console.log('Error. Enter correct command.')
      }

      console.log(`You are currently in ${currentDir}`)
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('hash') === 0) {
    isCommand = true
    if (line[4] === ' ' && line[5]) {
      const fileName = line.slice(5).trim()
      if (isAbsolute(fileName)) {
        calculateHash(fileName).then(() => {
          console.log(`You are currently in ${currentDir}`)
        })
      } else {
        calculateHash(join(currentDir, fileName)).then(() => {
          console.log(`You are currently in ${currentDir}`)
        })
      }
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('compress') === 0) {
    isCommand = true
    if (line[8] === ' ' && line[9]) {
      const args = line.slice(9).trim().split(' ')
      const sourceFilePath = args[0]
      if (!args[1]) {
        console.log('Error. Please enter correct command')
        return
      }
      let destFilePath = args[1]
      if (destFilePath === '.') {
        destFilePath = currentDir
      }
      if (isAbsolute(sourceFilePath)) {
        const fileName = parse(join(sourceFilePath)).base + '.bz'
        compress(join(sourceFilePath), join(destFilePath, fileName))
        console.log(`You are currently in ${currentDir}`)
      } else {
        const fileName = parse(join(currentDir, sourceFilePath)).base + '.bz'
        compress(join(currentDir, sourceFilePath), join(destFilePath, fileName))
        console.log(`You are currently in ${currentDir}`)
      }
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (line.toString().trim().indexOf('decompress') === 0) {
    isCommand = true
    if (line[10] === ' ' && line[11]) {
      const args = line.slice(11).trim().split(' ')
      const sourceFilePath = args[0]
      if (!args[1]) {
        console.log('Error. Please enter correct command')
        return
      }
      let destFilePath = args[1]
      if (destFilePath === '.') {
        destFilePath = currentDir
      }
      if (isAbsolute(sourceFilePath)) {
        const fileName =
          parse(join(sourceFilePath)).dir + parse(sourceFilePath).name
        decompress(join(sourceFilePath), join(destFilePath, fileName))
        console.log(`You are currently in ${currentDir}`)
      } else {
        const fileName = join(
          parse(join(currentDir, sourceFilePath)).dir,
          parse(sourceFilePath).name
        )
        decompress(join(currentDir, sourceFilePath), fileName)
        console.log(`You are currently in ${currentDir}`)
      }
    } else {
      console.log('Error. Enter correct command.')
    }
  }

  if (!isCommand) {
    console.log('Command hasn`t found. Please enter correct command.')
  }
})

rl.on('SIGINT', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`)

  rl.close()
})
