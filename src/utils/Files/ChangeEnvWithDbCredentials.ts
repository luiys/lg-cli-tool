import fs from 'fs'
import { BdOptions } from '../../types/InitAnswers'

export function ChangeEnvWithDbCredentials(bdOptions: BdOptions) {

    try {

        let env = fs.readFileSync('.env', 'utf8')

        env = env.replace('DB_HOST=db_host', `DB_HOST=${bdOptions.host}`)
        env = env.replace('DB_USER=db_user', `DB_USER=${bdOptions.user}`)
        env = env.replace('DB_NAME=db_name', `DB_NAME=${bdOptions.name}`)
        env = env.replace('DB_HOST=db_host', `DB_HOST=${bdOptions.host}`)
        env = env.replace('DB_PASSWORD=db_password', `DB_PASSWORD=${bdOptions.password}`)
        env = env.replace('DB_PORT=3306', `DB_PORT=${bdOptions.port}`)

        fs.writeFileSync('.env', env)

        return { flagErro: false, result: 'Env file updated' }

    } catch (error: any) {

        return { flagErro: true, result: error.message }

    }

}
