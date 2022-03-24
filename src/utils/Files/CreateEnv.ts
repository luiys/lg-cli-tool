import fs from 'fs'
import { Commands } from '../Terminal/Commands'

export function createEnv() {

    try {

        const env = fs.readFileSync('.env.example', 'utf8')
        fs.writeFileSync('.env', env)
        Commands.deleteDir('.env.example')

        return { flagErro: false, result: 'Env criado com sucesso' }

    } catch (error: any) {

        return { flagErro: true, result: error.message }

    }

}
