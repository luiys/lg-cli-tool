export interface BdOptions {
    type: 'mysql' | 'postgresql' | 'sqlserver';
    name: string;
    user: string;
    password: string;
    host: string;
    port: string;
}

export type Orm = 'typeorm' | 'prisma'

export interface InitAnswers {
    projectName: string;
    flagBdConnection: boolean,
    orm: Orm
    flagGit: boolean
    bdOptions: BdOptions
    flagSendEmail: boolean
}
