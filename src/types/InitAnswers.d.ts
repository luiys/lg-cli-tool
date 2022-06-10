export interface BdOptions {
    type: 'mysql' | 'postgresql' | 'sqlserver';
    name: string;
    user: string;
    password: string;
    host: string;
    port: string;
}

export interface InitAnswers {
    projectName: string;
    flagBdConnection: boolean
    flagGit: boolean
    bdOptions: BdOptions
    flagSendEmail: boolean
}
