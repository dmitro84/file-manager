import * as readline from 'node:readline/promises'
import { getUsername } from './getUsername.js'
import { __dirname } from './utils.js'
import { homedir } from 'node:os'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
const username = getUsername(process.argv)

if (!username) {
  console.log('Enter correct command.')
  rl.close()
} else {
  console.log(`Welcome to the File Manager, ${username}!`)
  console.log(`You are currently in ${homedir()}`)
}

rl.on('line', (line) => {
  if (line.toString().trim() === '.exit') {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`)
    rl.close()
  }

  console.log(`You are currently in ${__dirname}`)
})

rl.on('SIGINT', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`)

  rl.close()
})
