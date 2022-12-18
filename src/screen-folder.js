import { readdir} from 'node:fs/promises'
import { __dirname, byField } from './utils.js'

class ListFile {
  constructor(Name, Type) {
    this.Name = Name
    this.Type = Type
  }
}

const file = new ListFile('.git', 'file')

export async function screenFolder(dir) {
  const listFile = []
  const listDirectory = []
  try {
    const files = await readdir(dir, { withFileTypes: true })
    for (const file of files) {
      if (file.isFile()) {
        try {
          listFile.push(new ListFile(file.name, 'file'))
        } catch (error) {
          console.log(error)
        }
      } else {
        listDirectory.push(new ListFile(file.name, 'directory'))
      }
    }

    console.table(
      [
        ...listDirectory.sort(byField('Name')),
        ...listFile.sort(byField('Name')),
      ],
      ['Name', 'Type']
    )
  } catch (err) {
    console.error(err)
  }
}
