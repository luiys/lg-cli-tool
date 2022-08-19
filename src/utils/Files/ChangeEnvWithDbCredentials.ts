import fs from 'fs'
import { BdOptions } from '../../types/InitAnswers'

export function ChangeEnvWithDbCredentials(bdOptions: BdOptions) {

    try {

        let env = fs.readFileSync('.env', 'utf8')

        if (bdOptions.type === 'postgresql') env = env.replace('5432', bdOptions.port)
        else if (bdOptions.type === 'mysql') env = env.replace('3306', bdOptions.port)
        else {

            env = env.replace('1433', bdOptions.port)
            env = env.replace('user=SA', `user=${bdOptions.user}`)

        }

        env = env.replace('localhost', bdOptions.host)
        env = env.replace('johndoe', bdOptions.user)
        env = env.replace('mydb', bdOptions.name)
        env = env.replace('randompassword', bdOptions.password)
        fs.writeFileSync('.env', env)

        return { flagErro: false, result: 'Env file updated' }

    } catch (error: any) {

        return { flagErro: true, result: error.message }

    }

}
