const questionsPt = [
	{
		name: 'projectName',
		type: 'input',
		message: 'Nome do Projeto: ',
		default() {
			return 'new-node-project';
		},
	},
	{
		name: 'flagGit',
		type: 'confirm',
		message: 'Iniciar projeto no GIT: ',
		default() {
			return 'y';
		},
	},
	{
		name: 'flagBdConnection',
		type: 'confirm',
		message: 'Criar conexão com banco de dados? ',
		default() {
			return 'y';
		},
	},
	{
		name: 'bdOptions.type',
		type: 'list',
		message: 'Qual o tipo de banco de dados?',
		choices: [{ name: 'Postgres', value: 'postgres' }, { name: 'MySql', value: 'mysql' }, { name: 'SQL Server', value: 'mssql' }],
		default() {
			return 'postgres';
		},
		when(answers: { flagBdConnection: any; }) {
			return answers.flagBdConnection;
		}
	},
	{
		name: 'bdOptions.name',
		type: 'input',
		message: 'Nome do bd: ',
		default() {
			return 'db_name';
		},
		when(answers: { flagBdConnection: any; }) {
			return answers.flagBdConnection;
		}
	},
	{
		name: 'bdOptions.user',
		type: 'input',
		message: 'User do bd: ',
		default() {
			return 'db_user';
		},
		when(answers: { flagBdConnection: any; }) {
			return answers.flagBdConnection;
		}
	},
	{
		name: 'bdOptions.password',
		type: 'password',
		message: 'Senha: ',
		default() {
			return 'db_password';
		},
		when(answers: { flagBdConnection: any; }) {
			return answers.flagBdConnection;
		}
	},
	{
		name: 'bdOptions.host',
		type: 'input',
		message: 'Host: ',
		default() {
			return 'db_host';
		},
		when(answers: { flagBdConnection: any; }) {
			return answers.flagBdConnection;
		}
	},
	{
		name: 'bdOptions.port',
		type: 'input',
		message: 'Porta: ',
		default() {
			return 'db_port';
		},
		when(answers: { flagBdConnection: any; }) {
			return answers.flagBdConnection;
		}
	},
	{
		name: 'flagSendEmail',
		type: 'confirm',
		message: 'O projeto vai enviar emails? ',
		default() {
			return 'y';
		},
	},
]

export default questionsPt