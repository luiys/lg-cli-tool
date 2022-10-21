#!/usr/bin/env node
import fs from 'fs'
import shell from 'shelljs'
import { capitalize } from '../utils/string/capitalize'
import templateController from './controller/template'

export function generate(schematic: 'controller', options: { dir: string }) {

    if (schematic === 'controller') {

        let template = templateController

        const lsRootDir = shell.ls()
        if (!lsRootDir.includes('package.json')) throw new Error('Unable to find package.json in this directory')

        const MODULES_DIR = 'src/modules'
        shell.cd(MODULES_DIR)
        if (shell.error()) throw new Error('Unable to find modules dir')

        const lsModulesDir = shell.ls()
        const controllerFolderName = options.dir.split('/')[0]
        if (!lsModulesDir.includes(controllerFolderName)) shell.mkdir(controllerFolderName)

        let controllerName = options.dir.split('/')[1].trim()
        controllerName = controllerName.replaceAll(/.ts/igm, '')
        controllerName = controllerName.replaceAll(/controller/igm, '')
        controllerName = controllerName.replaceAll(' ', '')
        controllerName = `${controllerName}Controller.ts`
        controllerName = capitalize(controllerName)

        template = template.replaceAll('NOMECONTROLLER', controllerName.replace('.ts', ''))

        fs.writeFileSync(`${controllerFolderName}/${controllerName}`, template, 'utf8')

        shell.cd('..')

        const importLine = `import { ${controllerName.replace('.ts', '')} } from './${controllerFolderName}/${controllerName.replace('.ts', '')}'`

        let indexControllersFileData = fs.readFileSync('modules/index.ts', { encoding: 'utf-8' })
        if (indexControllersFileData.toLowerCase().includes(controllerName.replace('.ts', '').toLowerCase())) return

        indexControllersFileData = `${importLine}\n${indexControllersFileData}`
        indexControllersFileData = indexControllersFileData.replace(/,\s*]|[^a-z]\s*]/igm, `,\n\t${controllerName.replace('.ts', '')},\n]`)

        fs.writeFileSync('modules/index.ts', indexControllersFileData, 'utf-8')

    }

    if (schematic !== 'controller') throw new Error('Unknown shematic type')

}

