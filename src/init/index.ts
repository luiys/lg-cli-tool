#!/usr/bin/env node
import figlet from 'figlet'
import gradient from 'gradient-string'
import inquirer from 'inquirer'
import { InitAnswers } from '@/types/InitAnswers'
import { sleep } from '@/utils/sleep'
import questionsEn from './questionsEn'
import questionsPt from './questionsPt'
import { generatePrismaProject } from './generators/generatePrisma'

async function init(options: any) {

    figlet('LG-CLI-TOOL', (err, data) => {

        console.log(gradient.pastel.multiline(data))

    })
    await sleep(100)

    const respostas = await inquirer.prompt(options.ptBr ? questionsPt : questionsEn) as InitAnswers

    if (respostas.orm === 'prisma') generatePrismaProject(options, respostas)

}

export default init
