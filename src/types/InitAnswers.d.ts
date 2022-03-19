export interface InitAnswers {

	projectName: string;
	flagBdConnection: boolean
	flagGit: boolean
	bdOptions: {
		type: string;
		name: string;
		user: string;
		password: string;
		host: string;
		port: string;
	},
	flagSendEmail: boolean

}