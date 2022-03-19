#!/usr/bin/env node
import { createInterface } from 'readline';
import shell from 'shelljs';
import fs from 'fs'
import util from 'util';

const readline = createInterface({
	input: process.stdin,
	output: process.stdout
})
const question = util.promisify(readline.question).bind(readline) as unknown as (arg1: string) => Promise<string>;

export default async function init() {

	try {

		const repoUri = 'https://github.com/luiys/nodejs-express-typeorm-boilerplate.git'
		const options = ['y', 'n'];
		const bdOptions = { flagBdType: 'postgres', flagBdName: 'db_name', flagBdUser: 'db_user', flagBdPassword: 'db_password', flagBdHost: 'db_host', flagBdPort: 'db_port' };

		const projectName = await question('Nome do Projeto (new-node-project): ') ?? 'new-node-project'

		const flagBdConnection = await question('Criar conexão com banco de dados? (y/n): ') ?? 'y'
		if (!options.includes(flagBdConnection)) throw new Error('BD Opção inválida')

		if (flagBdConnection === 'y') {
			bdOptions.flagBdType = await question('Tipo de banco de dados (mysql/postgres/mssql): ') ?? 'postgres'
			if (!['mysql', 'postgres', 'mssql'].includes(bdOptions.flagBdType.trim())) throw new Error('BD_TYPE Opção inválida')

			bdOptions.flagBdName = await question('Nome do bd: ') ?? 'db_name'
			bdOptions.flagBdUser = await question('User do bd: ') ?? 'db_user'
			bdOptions.flagBdHost = await question('Host do bd: ') ?? 'db_host'
			bdOptions.flagBdPassword = await question('Senha do bd: ') ?? 'db_password'
			bdOptions.flagBdPort = await question('Porta do bd: ') ?? 'db_port'
		}

		const flagSendEmail = await question('O projeto vai enviar emails? (y/n): ') ?? 'y'
		if (!options.includes(flagBdConnection)) throw new Error('EMAIL Opção inválida')

		shell.exec('git clone ' + repoUri)
		if (!!shell.error()) throw new Error("Erro ao clonar repositório");

		shell.exec(`ren nodejs-express-typeorm-boilerplate ${projectName}`)
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

		if (flagBdConnection === 'y') {

			let env = fs.readFileSync('.env', 'utf8')
			env = env.replace('DB_HOST=db_host\r\n', `DB_HOST=${bdOptions.flagBdHost}\r\n`)
			env = env.replace('DB_USER=db_user\r\n', `DB_USER=${bdOptions.flagBdUser}\r\n`)
			env = env.replace('DB_NAME=db_name\r\n', `DB_NAME=${bdOptions.flagBdName}\r\n`)
			env = env.replace('DB_HOST=db_host\r\n', `DB_HOST=${bdOptions.flagBdHost}\r\n`)
			env = env.replace('DB_PASSWORD=db_password\r\n', `DB_PASSWORD=${bdOptions.flagBdPassword}\r\n`)
			env = env.replace('DB_PORT=3306\r\n', `DB_PORT=${bdOptions.flagBdPort}\r\n`)
			fs.writeFileSync('.env', env)

			bdOptions.flagBdType === 'postgres' ? shell.exec('yarn add pg') : shell.exec(`yarn remove pg && yarn add ${bdOptions.flagBdType}`)
			if (!!shell.error()) throw new Error("Erro ao instalar dependências do banco de dados");

			const index = 'src/index.ts'
			let content = fs.readFileSync(index, 'utf8')

			content = content.replace('type: "postgres",', `type: "${bdOptions.flagBdType}",`)
			fs.writeFileSync(index, content, 'utf8')

		}

		if (flagBdConnection === 'n') {

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

		if (flagSendEmail === 'n') {

			shell.exec('npx rimraf src/utils/EmailService.ts')
			if (!!shell.error()) throw new Error("Erro ao remover arquivo EmailService");

			shell.exec('npx rimraf src/types')
			if (!!shell.error()) throw new Error("Erro ao remover diretório Types");

		}

		shell.exec('npx rimraf .git')
		if (!!shell.error()) throw new Error("Erro ao remover diretório .git");

		readline.close()


	} catch (error: any) {
		console.log(error.message)
		readline.close()
	}


}