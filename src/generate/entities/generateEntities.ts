import { verifyFileInDir } from '../../utils/Files/VerifyFileInDir'
import fs from 'fs'
import shell from 'shelljs'
import { BdOptions } from '../../types/InitAnswers'
import { Commands } from '../../utils/Terminal/Commands'

export function generateEntities() {

    verifyFileInDir('package.json')
    verifyFileInDir('.env')

    const env = fs.readFileSync('.env', { encoding: 'utf-8' })
    const parsedEnv = parseEnv(env)

    shell.cd('src')
    verifyFileInDir('connection.ts')

    const connectionFile = fs.readFileSync('connection.ts', { encoding: 'utf-8' })
    const bdType = connectionFile.split('\n').find(data => data.includes('type:'))?.match(/('.*')/g)
    if (!bdType) throw new Error('Unable to read type of bd in src/connection.ts')

    checkEnvIntegrity(parsedEnv)

    const bdOptions: BdOptions = {
        name: parsedEnv.DB_NAME,
        user: parsedEnv.DB_USER,
        password: parsedEnv.DB_PASSWORD,
        host: parsedEnv.DB_HOST,
        port: parsedEnv.DB_PORT,
        type: bdType[0].replaceAll('\'', '')
    }

    shell.cd('..')

    const reusltGenerateEntities = Commands.generateEntities(bdOptions)
    if (reusltGenerateEntities.flagErro) throw new Error(`Error generating entities: ${reusltGenerateEntities.result}`)

    shell.cp('output/entities/*', 'src/entity')
    if (shell.error()) throw new Error('Erro ao copiar entidades do banco de dados')

    const removeOutput = Commands.deleteDir('output')
    if (removeOutput.flagErro) throw new Error(removeOutput.result)

}

function checkEnvIntegrity(envParsed: any): asserts envParsed is EnvParsed {

    const keys = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_PORT', 'DB_NAME']

    keys.forEach(key => {

        if (!(key in envParsed)) throw new Error(`Invalid .env, ${key} key is missing`)

    })

}

function parseEnv(env: string) {

    const envParsed = {} as any
    env.replace(/(\w+)=(.+)/g, (_$0, $1, $2) => {

        return envParsed[$1] = $2

    })

    return envParsed

}

interface EnvParsed {
    DB_HOST: string
    DB_USER: string
    DB_PASSWORD: string
    DB_PORT: string
    DB_NAME: string
}
