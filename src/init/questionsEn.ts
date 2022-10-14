const questionsEn = [
    {
        name: 'projectName',
        type: 'input',
        message: 'Project name: ',
        default() {

            return 'new-node-project'

        },
    },
    {
        name: 'flagGit',
        type: 'confirm',
        message: 'Initialize git: ',
        default() {

            return 'y'

        },
    },
    {
        name: 'flagBdConnection',
        type: 'confirm',
        message: 'Create database connection? ',
        default() {

            return 'y'

        },
    },
    {
        name: 'orm',
        type: 'list',
        message: 'Choose the ORM',
        choices: [{ name: 'TypeORM (Recommended)', value: 'typeorm' }, { name: 'Prisma', value: 'prisma' }],
        default() {

            return 'typeorm'

        },
        when(answers: { flagBdConnection: any; }) {

            return answers.flagBdConnection

        }
    },
    {
        name: 'bdOptions.type',
        type: 'list',
        message: 'Type of database',
        choices: [{ name: 'Postgres', value: 'postgresql' }, { name: 'MySql', value: 'mysql' }, { name: 'SQL Server', value: 'sqlserver' }],
        default() {

            return 'postgresql'

        },
        when(answers: { flagBdConnection: any; }) {

            return answers.flagBdConnection

        }
    },
    {
        name: 'bdOptions.name',
        type: 'input',
        message: 'Database name: ',
        default() {

            return 'db_name'

        },
        when(answers: { flagBdConnection: any; }) {

            return answers.flagBdConnection

        }
    },
    {
        name: 'bdOptions.user',
        type: 'input',
        message: 'Database user: ',
        default() {

            return 'db_user'

        },
        when(answers: { flagBdConnection: any; }) {

            return answers.flagBdConnection

        }
    },
    {
        name: 'bdOptions.password',
        type: 'password',
        message: 'Password: ',
        default() {

            return 'db_password'

        },
        when(answers: { flagBdConnection: any; }) {

            return answers.flagBdConnection

        }
    },
    {
        name: 'bdOptions.host',
        type: 'input',
        message: 'Host: ',
        default() {

            return 'db_host'

        },
        when(answers: { flagBdConnection: any; }) {

            return answers.flagBdConnection

        }
    },
    {
        name: 'bdOptions.port',
        type: 'input',
        message: 'Port: ',
        default() {

            return 'db_port'

        },
        when(answers: { flagBdConnection: any; }) {

            return answers.flagBdConnection

        }
    },
    {
        name: 'flagSendEmail',
        type: 'confirm',
        message: 'Will the project send emails? ',
        default() {

            return 'y'

        },
    },
]

export default questionsEn
