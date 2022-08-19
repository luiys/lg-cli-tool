#!/usr/bin/env node
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import fs from 'fs'
import gradient from 'gradient-string'
import inquirer from 'inquirer'
import shell from 'shelljs'
import { InitAnswers } from '@/types/InitAnswers'
import { createEnv } from '@/utils/Files/CreateEnv'
import { RemoveLines } from '@/utils/Files/RemoveLines'
import { sleep } from '@/utils/sleep'
import { Commands } from '@/utils/Terminal/Commands'
import questionsEn from './questionsEn'
import questionsPt from './questionsPt'
import { ChangeEnvWithDbCredentials } from '@/utils/Files/ChangeEnvWithDbCredentials'
import { repoUri } from './constantes'

async function init(options: any) {

    figlet('LG-CLI-TOOL', (err, data) => {

        console.log(gradient.pastel.multiline(data))

    })
    await sleep(100)

    const { projectName, flagBdConnection, bdOptions, flagSendEmail, flagGit } = await inquirer.prompt(options.ptBr ? questionsPt : questionsEn) as InitAnswers

    try {

        const clone = Commands.cloneRepo(repoUri, projectName)
        if (clone.flagErro) throw new Error(clone.result)

        const enterProject = Commands.navigateTo(projectName)
        if (enterProject.flagErro) throw new Error(enterProject.result)

        // shell.exec('cp -r /home/luisgustavo/Dev/Pessoal/nodejs-express-typeorm-boilerplate /home/luisgustavo/Dev/Pessoal/lg-cli-tool/sandbox')
        // if (shell.error()) throw new Error('Erro fakeclone')

        // const enterProject = Commands.navigateTo('/home/luisgustavo/Dev/Pessoal/lg-cli-tool/sandbox/nodejs-express-typeorm-boilerplate')
        // if (enterProject.flagErro) throw new Error(enterProject.result)

        const deleteGit = Commands.deleteDir('.git')
        if (deleteGit.flagErro) throw new Error(deleteGit.result)

        let packageJson = fs.readFileSync('./package.json', 'utf8')
        packageJson = packageJson.replace('node-express-boilerplate",', `${projectName}",\n\t"description": "Boilerplate gerado pelo pacote lg-cli-tool criado por @luiys no github",`)
        fs.writeFileSync('./package.json', packageJson)

        const copyEnv = createEnv()
        if (copyEnv.flagErro) throw new Error(copyEnv.result)

        if (flagBdConnection) {

            shell.exec(`npx prisma init --datasource-provider ${bdOptions.type}`)
            if (shell.error()) throw new Error('Erro ao iniciar provide prisma')

            const changeEnvWithDb = ChangeEnvWithDbCredentials(bdOptions)
            if (changeEnvWithDb.flagErro) throw new Error(changeEnvWithDb.result)

            shell.exec('npx prisma db pull')

            if (shell.error()) throw new Error('Erro ao gerar models')
            shell.exec('npx prisma generate')
            if (shell.error()) throw new Error('Erro ao gerar prisma instance')

        }

        if (!flagBdConnection) {

            const deleteAcessoModule = Commands.deleteDir('src/modules/Acesso')
            if (deleteAcessoModule.flagErro) throw new Error(deleteAcessoModule.result)

            let packageJson = fs.readFileSync('./package.json', 'utf8')
            packageJson = RemoveLines.removeLinesWithString(packageJson, ['typeorm', 'reflect-metadata', 'pg'])
            fs.writeFileSync('./package.json', packageJson)

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

        Commands.deleteDir(projectName)
        //eslint-disable-next-line
        console.log(error)
        process.exit(1)

    }

}

export default init
