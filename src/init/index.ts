#!/usr/bin/env node
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import fs from 'fs';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import shell from 'shelljs';
import { InitAnswers } from '../types/InitAnswers';
import questions from './questions';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

export default async function init() {

	try {

		figlet(`LG-CLI-TOOL`, (err, data) => {
			console.log(gradient.pastel.multiline(data));
		});
		await sleep(100)

		const repoUri = 'https://github.com/luiys/nodejs-express-typeorm-boilerplate.git'

		const { projectName, flagBdConnection, bdOptions, flagSendEmail, flagGit } = await inquirer.prompt(questions) as InitAnswers

		shell.exec('git clone ' + repoUri)
		if (!!shell.error()) throw new Error("Erro ao clonar repositório");

		shell.exec(`ren nodejs-express-typeorm-boilerplate "${projectName}"`)
		if (!!shell.error()) throw new Error("Erro ao renomear repositório");

		shell.cd(projectName)
		if (!!shell.error()) throw new Error("Erro ao entrar no diretório");

		shell.exec('yarn')
		if (!!shell.error()) shell.exec('npm install')
		if (!!shell.error()) throw new Error("Erro ao instalar dependências");

		let env = fs.readFileSync('readme.md', 'utf8')
		env = env.split('-----BEGIN .ENV-----')[1]
		env = env.split('-----END .ENV-----')[0]
		fs.writeFileSync('.env', env)

		if (flagBdConnection) {

			let env = fs.readFileSync('.env', 'utf8')
			env = env.replace('DB_HOST=db_host\r\n', `DB_HOST=${bdOptions.host}\r\n`)
			env = env.replace('DB_USER=db_user\r\n', `DB_USER=${bdOptions.user}\r\n`)
			env = env.replace('DB_NAME=db_name\r\n', `DB_NAME=${bdOptions.name}\r\n`)
			env = env.replace('DB_HOST=db_host\r\n', `DB_HOST=${bdOptions.host}\r\n`)
			env = env.replace('DB_PASSWORD=db_password\r\n', `DB_PASSWORD=${bdOptions.password}\r\n`)
			env = env.replace('DB_PORT=3306\r\n', `DB_PORT=${bdOptions.port}\r\n`)
			fs.writeFileSync('.env', env)

			bdOptions.type === 'postgres' ? shell.exec('yarn add pg') : shell.exec(`yarn remove pg && yarn add ${bdOptions.type}`)
			if (!!shell.error()) throw new Error("Erro ao instalar dependências do banco de dados");

			const index = 'src/index.ts'
			let content = fs.readFileSync(index, 'utf8')

			content = content.replace('type: "postgres",', `type: "${bdOptions.type}",`)
			fs.writeFileSync(index, content, 'utf8')

			shell.exec(`typeorm-model-generator -d "${bdOptions.name}" -u "${bdOptions.user}" -x "${bdOptions.password}" -h ${bdOptions.host} -p ${bdOptions.port} -e ${bdOptions.type}`)
			console.log(`typeorm-model-generator -d "${bdOptions.name}" -u "${bdOptions.user}" -x "${bdOptions.password}" -h ${bdOptions.host} -p ${bdOptions.port} -e ${bdOptions.type}`)
			if (!!shell.error()) throw new Error("Erro ao gerar entidades do banco de dados");

			shell.cp('output/entities/*', 'src/entity')
			if (!!shell.error()) throw new Error("Erro ao copiar entidades do banco de dados");

			shell.exec('rimraf output')
			if (!!shell.error()) throw new Error("Erro ao remover entidades do banco de dados");


		}

		if (!flagBdConnection) {

			const removeLines = (data: string, lines = []) => data.split('\n').filter((val, idx) => lines.indexOf(idx as never) === -1).join('\n');

			const index = 'src/index.ts'
			const content = fs.readFileSync(index, 'utf8').split('\r\n')
			const flatedContent = content.map((line) => line.trim())

			const import1 = flatedContent.indexOf('import { createConnection } from "typeorm";') ?? content.indexOf('import { createConnection } from "typeorm"')
			const import2 = flatedContent.indexOf('import { Tables } from "./entity";') ?? content.indexOf('import { Tables } from "./entity"')
			const startConnection = flatedContent.indexOf('await createConnection({')
			const endConnection = flatedContent.indexOf('cache: { duration: 30000 },') + 3 ?? content.indexOf('cache: { duration: 30000 }') + 3

			const allConnectionLines = [...Array(endConnection - startConnection).keys()].map(val => startConnection + val)
			const linesExceptConnection = removeLines(content.join('\r\n'), [import1, import2, ...allConnectionLines] as never[])

			shell.exec('npx rimraf src/entity')
			if (!!shell.error()) throw new Error("Erro ao remover diretório entity");

			shell.exec('npx rimraf src/modules/Acesso')
			if (!!shell.error()) throw new Error("Erro ao remover diretório Acesso");

			fs.writeFileSync(index, linesExceptConnection, 'utf8');

		}

		if (!flagSendEmail) {

			shell.exec('npx rimraf src/utils/EmailService.ts')
			if (!!shell.error()) throw new Error("Erro ao remover arquivo EmailService");

			shell.exec('npx rimraf src/types')
			if (!!shell.error()) throw new Error("Erro ao remover diretório Types");

		}

		shell.exec('npx rimraf .git')
		if (!!shell.error()) throw new Error("Erro ao remover diretório .git");

		if (flagGit) {
			shell.exec('git init')
			if (!!shell.error()) throw new Error("Erro ao iniciar repositório");
		}

		chalkAnimation.rainbow(`*** PROJETO ${projectName} CRIADO ***`);
		await sleep(100)

		jumpLines()

		shell.exec(`code .`)

		process.exit(0)

	} catch (error: any) {
		console.log(error.message)
		process.exit(0)
	}


}

const jumpLines = (lines: number = 1) => {
	for (let i = 0; i < lines; i++) {
		console.log('')
	}
}