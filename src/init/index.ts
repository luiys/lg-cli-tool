#!/usr/bin/env node
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import fs from 'fs'
import gradient from 'gradient-string'
import inquirer from 'inquirer'
import shell from 'shelljs'
import { InitAnswers } from '../types/InitAnswers'
import { ChangeEnvWithDbCredentials } from '../utils/Files/ChangeEnvWithDbCredentials'
import { createEntitiesIndex } from '../utils/Files/CreateEntitiesIndex'
import { RemoveLines } from '../utils/Files/RemoveLines'
import { sleep } from '../utils/sleep'
import { Commands } from '../utils/Terminal/Commands'
import { repoUri } from './constantes'
import questionsEn from './questionsEn'
import questionsPt from './questionsPt'

async function init(options: any) {

    figlet('LG-CLI-TOOL', (err, data) => {

        // eslint-disable-next-line no-console
        console.log(gradient.pastel.multiline(data))

    })
    await sleep(100)

    const { projectName, flagBdConnection, bdOptions, flagSendEmail, flagGit } = await inquirer.prompt(options.ptBr ? questionsPt : questionsEn) as InitAnswers

    try {

        const clone = Commands.cloneRepo(repoUri, projectName)
        if (clone.flagErro) throw new Error(clone.result)

        const enterProject = Commands.navigateTo(projectName)
        if (enterProject.flagErro) throw new Error(enterProject.result)

        const deleteGit = Commands.deleteDir('.git')
        if (deleteGit.flagErro) throw new Error(deleteGit.result)

        let packageJson = fs.readFileSync('./package.json', 'utf8')
        packageJson = packageJson.replace(/node-express-boilerplate/g, projectName)
        fs.writeFileSync('./package.json', packageJson)

        let env = fs.readFileSync('README.md', 'utf8')
        env = env.split('-----BEGIN .ENV-----')[1]
        env = env.split('-----END .ENV-----')[0]
        fs.writeFileSync('.env', env)

        if (flagBdConnection) {

            const changeEnvWithDb = ChangeEnvWithDbCredentials(bdOptions)
            if (changeEnvWithDb.flagErro) throw new Error(changeEnvWithDb.result)

            if (!options.dontInstall) {

                bdOptions.type === 'postgres' ? shell.exec('yarn add pg') : shell.exec(`yarn remove pg && yarn add ${bdOptions.type}`)
                if (shell.error()) throw new Error('Erro ao instalar dependências do banco de dados')

            }

            const index = 'src/index.ts'
            let content = fs.readFileSync(index, 'utf8')
            content = content.replace('type: "postgres",', `type: "${bdOptions.type}",`)
            fs.writeFileSync(index, content, 'utf8')

            const typeOrmModelGeneratorCommand = `npx typeorm-model-generator -d "${bdOptions.name}" -u "${bdOptions.user}" -x "${bdOptions.password}" -h ${bdOptions.host} -p ${bdOptions.port} -e ${bdOptions.type}`
            shell.exec(typeOrmModelGeneratorCommand)
            if (shell.error()) throw new Error(`Erro ao gerar entidades do banco de dados\n${typeOrmModelGeneratorCommand}`)

            shell.cp('output/entities/*', 'src/entity')
            if (shell.error()) throw new Error('Erro ao copiar entidades do banco de dados')

            shell.exec('rimraf output')
            if (shell.error()) throw new Error('Erro ao remover entidades do banco de dados')

            const entitiesIndex = createEntitiesIndex()
            if (entitiesIndex.flagErro) throw new Error(entitiesIndex.result)

        }

        if (!flagBdConnection) {

            const resultEnv = RemoveLines.removeLinesStartEnd('.env', 'DB_HOST=db_host', 'DB_PORT=3306')
            if (resultEnv.flagErro) throw new Error(resultEnv.result)

            let file = fs.readFileSync('src/index.ts', 'utf8')
            file = RemoveLines.removeLinesWithString(file, ['AppDataSource'])
            file = file.replace('async', '')
            fs.writeFileSync('src/index.ts', file, 'utf8')

            const deleteEntityDir = Commands.deleteDir('src/entity')
            if (deleteEntityDir.flagErro) throw new Error(deleteEntityDir.result)

            const deleteAcessoModule = Commands.deleteDir('src/modules/Acesso')
            if (deleteAcessoModule.flagErro) throw new Error(deleteAcessoModule.result)

            const deleteConnectionFile = Commands.deleteDir('src/connection.ts')
            if (deleteConnectionFile.flagErro) throw new Error(deleteConnectionFile.result)

            let packageJson = fs.readFileSync('./package.json', 'utf8')
            packageJson = RemoveLines.removeLinesWithString(packageJson, ['typeorm', 'reflect-metadata', 'pg'])
            fs.writeFileSync('./package.json', packageJson)

            let routes = fs.readFileSync('src/routes.ts', 'utf8')
            routes = RemoveLines.removeLinesWithString(routes, ['import { UserRoute }'])
            routes = routes.replace(', ...UserRoute', '')
            fs.writeFileSync('src/routes.ts', routes)

        }

        if (!flagSendEmail) {

            const resultEnv = RemoveLines.removeLinesStartEnd('.env', 'EMAIL_USER=email_user', 'REFRESH_TOKEN=refresh_token')
            if (resultEnv.flagErro) throw new Error(resultEnv.result)

            const deleteEmaiUtil = Commands.deleteDir('src/utils/EmailService.ts')
            if (deleteEmaiUtil.flagErro) throw new Error(deleteEmaiUtil.result)

            const deleteEmailTypes = Commands.deleteDir('src/types')
            if (deleteEmailTypes.flagErro) throw new Error(deleteEmailTypes.result)

            let packageJson = fs.readFileSync('./package.json', 'utf8')
            packageJson = RemoveLines.removeLinesWithString(packageJson, ['nodemailer', '@types/nodemailer'])
            fs.writeFileSync('./package.json', packageJson)

        }

        if (flagGit) {

            const initGit = Commands.initializeGit()
            if (initGit.flagErro) throw new Error(initGit.result)

        }

        if (!options.dontInstall) {

            const installDeps = Commands.installDeps()
            if (installDeps.flagErro) throw new Error(installDeps.result)

        }

        const lintFix = Commands.lintFix()
        //eslint-disable-next-line
        if (lintFix.flagErro) console.log(lintFix.result)

        chalkAnimation.rainbow(`*** PROJETO ${projectName} CRIADO ***`)
        await sleep(100)

        shell.exec('code .')
        process.exit(0)

    } catch (error: any) {

        if (!options.dontDeleteOnFail) shell.exec(`npx rimraf ${projectName}`)
        //eslint-disable-next-line
        console.log(error)
        process.exit(1)

    }

}

export default init
