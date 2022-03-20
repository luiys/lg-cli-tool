#!/usr/bin/env node
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import fs from 'fs';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import shell from 'shelljs';
import { InitAnswers } from '../types/InitAnswers';
import { RemoveLines } from '../utils/RemoveLinesService';
import { sleep } from '../utils/sleep';
import questionsEn from './questionsEn';
import questionsPt from './questionsPt';

async function init(options: any) {

	figlet(`LG-CLI-TOOL`, (err, data) => {
		console.log(gradient.pastel.multiline(data));
	});
	await sleep(100)

	const { projectName, flagBdConnection, bdOptions, flagSendEmail, flagGit } = await inquirer.prompt(options.ptBr ? questionsPt : questionsEn) as InitAnswers

	try {

		const repoUri = 'https://github.com/luiys/nodejs-express-typeorm-boilerplate.git'

		shell.exec('git clone ' + repoUri)
		if (!!shell.error()) throw new Error("Erro ao clonar repositório");

		shell.exec(`ren nodejs-express-typeorm-boilerplate "${projectName}"`)
		if (!!shell.error()) throw new Error("Erro ao renomear repositório");

		shell.cd(projectName)
		if (!!shell.error()) throw new Error("Erro ao entrar no diretório");

		let packageJson = fs.readFileSync('./package.json', 'utf8')
		packageJson = packageJson.replace(/node-express-boilerplate/g, projectName)
		fs.writeFileSync('./package.json', packageJson)

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

			if (!options.dontInstall) {
				bdOptions.type === 'postgres' ? shell.exec('yarn add pg') : shell.exec(`yarn remove pg && yarn add ${bdOptions.type}`)
				if (!!shell.error()) throw new Error("Erro ao instalar dependências do banco de dados");
			}

			const index = 'src/index.ts'
			let content = fs.readFileSync(index, 'utf8')

			content = content.replace('type: "postgres",', `type: "${bdOptions.type}",`)
			fs.writeFileSync(index, content, 'utf8')

			const typeOrmModelGeneratorCommand = `npx typeorm-model-generator -d "${bdOptions.name}" -u "${bdOptions.user}" -x "${bdOptions.password}" -h ${bdOptions.host} -p ${bdOptions.port} -e ${bdOptions.type}`
			shell.exec(typeOrmModelGeneratorCommand)
			if (!!shell.error()) throw new Error("Erro ao gerar entidades do banco de dados\n" + typeOrmModelGeneratorCommand);

			shell.cp('output/entities/*', 'src/entity')
			if (!!shell.error()) throw new Error("Erro ao copiar entidades do banco de dados");

			shell.exec('rimraf output')
			if (!!shell.error()) throw new Error("Erro ao remover entidades do banco de dados");

			let entitiesName = fs.readdirSync('src/entity')
			entitiesName = entitiesName.map(name => name.split('.')[0])
			entitiesName = entitiesName.filter(name => name !== 'index')
			const imports = entitiesName.map(name => `import { ${name} } from './${name}';`).join('\r\n') + '\r\n' + '\r\n'
			const yields = entitiesName.map(name => `\t\tyield ${name}`).join('\r\n')
			const tablesConst = `export const Tables = {\r\n\t*[Symbol.iterator]() {\r\n${yields}\r\n\t}\r\n}`
			fs.writeFileSync('src/entity/index.ts', imports + tablesConst, 'utf8')

		}

		if (!flagBdConnection) {
			const resultEnv = RemoveLines.removeLinesStartEnd('.env', 'DB_HOST=db_host', 'DB_PORT=3306')
			if (resultEnv.flagErro) throw new Error(resultEnv.result)

			const file = 'src/index.ts'
			const startConnectionLine = 'await createConnection({'
			const endConnectionLine = 'cache: { duration: 30000 },'
			const connectionExtraLines = ['import { createConnection } from "typeorm";', 'import { Tables } from "./entity";', 'import "reflect-metadata";']
			const resultIndex = RemoveLines.removeLinesStartEnd(file, startConnectionLine, endConnectionLine, connectionExtraLines, { linesAfterEnd: 3 })
			if (resultIndex.flagErro) throw new Error(resultIndex.result)

			shell.exec('npx rimraf src/entity')
			if (!!shell.error()) throw new Error("Erro ao remover diretório entity");

			shell.exec('npx rimraf src/modules/Acesso')
			if (!!shell.error()) throw new Error("Erro ao remover diretório Acesso");

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

			shell.exec('npx rimraf src/utils/EmailService.ts')
			if (!!shell.error()) throw new Error("Erro ao remover arquivo EmailService");

			shell.exec('npx rimraf src/types')
			if (!!shell.error()) throw new Error("Erro ao remover diretório Types");

			let packageJson = fs.readFileSync('./package.json', 'utf8')
			packageJson = RemoveLines.removeLinesWithString(packageJson, ['nodemailer', '@types/nodemailer'])
			fs.writeFileSync('./package.json', packageJson)
		}

		shell.exec('npx rimraf .git')
		if (!!shell.error()) throw new Error("Erro ao remover diretório .git");

		if (flagGit) {
			shell.exec('git init')
			if (!!shell.error()) throw new Error("Erro ao iniciar repositório");
		}

		if (!options.dontInstall) {
			shell.exec('yarn')
			if (!!shell.error()) shell.exec('npm install')
			if (!!shell.error()) throw new Error("Erro ao instalar dependências");
		}

		chalkAnimation.rainbow(`*** PROJETO ${projectName} CRIADO ***`);
		await sleep(100)

		// shell.exec(`code .`)

		process.exit(0)

	} catch (error: any) {
		console.log(error.message)
		if (!options.dontDeleteOnFail) shell.exec(`npx rimraf ${projectName}`)
		process.exit(1)
	}


}

export default init