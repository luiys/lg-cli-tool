import shell from 'shelljs'

export function verifyFileInDir(fileName:string) {

    const lsRootDir = shell.ls('-A')
    if (!lsRootDir.includes(fileName)) throw new Error(`Unable to find ${fileName} in this directory`)

}
