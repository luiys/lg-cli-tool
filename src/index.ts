#!/usr/bin/env node
import { Command } from 'commander'
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

cli.parse(process.argv)
cli.showHelpAfterError()
export default cli

