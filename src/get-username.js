export const getUsername = (arg) => {
  const argvList = arg.slice(2)
  const username = argvList[0]
  if (username) {
    return username.slice(username.indexOf('=') + 1)
  }
  return false;
}

getUsername(process.argv)