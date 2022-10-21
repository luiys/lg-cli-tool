#!/usr/bin/env node
import { Command } from 'commander'
import { generate } from './generate'
import init from './init'
import { displayUpdate } from './utils/Terminal/displayUpdate'

//eslint-disable-next-line
const version = require('../package.json').version
const cli = new Command()

displayUpdate()

cli
    .name('lg-cli-tool')
    .description('CLI to create node projects with express and typeorm')
    .version(version, '-v, --version', 'show the current CLI version')

cli
    .command('init')
    .option('-ddof, --dont-delete-on-fail', 'dont delete the directory if fails')
    .option('-di, --dont-install', 'dont install dependencies')
    .option('-pt, --pt-br', 'questions in portuguese')
    .description('Create a node project')
    .action(init)

cli
    .command('generate')
    .argument('<schematic>', 'controller\nNOTE: if the argument is \'controller\' the start dir of this command will be src/modules, so you just have to write the controller folder (if the folder does not exists, the cli will create it)\nThe command also fits the controller name with \'Controller\'')
    .requiredOption('--dir <ControllerFolder/ControllerName>', 'the directory for the schematic')
    .description('generate template files')
    .action(generate)

cli.parse(process.argv)
cli.showHelpAfterError()
export default cli

