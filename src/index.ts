#!/usr/bin/env node
import { Command } from 'commander';
import init from './init';

const cli = new Command();

cli
	.name('lg-cli-tool')
	.description('CLI to create node projects with express and typeorm')
	.version('1.3.0', '-v, --version', 'show the current CLI version')


cli
	.command('init')
	.option('-ddof, --dont-delete-on-fail', 'dont delete the directory if fails')
	.option('-di, --dont-install', 'dont install dependencies')
	.option('-pt, --pt-br', 'questions in portuguese')
	.description('Create a node project')
	.action(init)

cli.parse(process.argv)
cli.showHelpAfterError();
export default cli



