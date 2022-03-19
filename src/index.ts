#!/usr/bin/env node
import { Command } from 'commander';
import init from './init';

const cli = new Command();

cli
	.name('lg-cli-tool')
	.description('CLI para criar projetos node')
	.version('1.2.1', '-v, --version', 'Mostra a versão do CLI')


cli
	.command('init')
	.description('Inicializa um projeto node')
	.action(init)

cli.parse(process.argv)
cli.showHelpAfterError();
export default cli



