"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("readline");
const shelljs_1 = __importDefault(require("shelljs"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const readline = (0, readline_1.createInterface)({
    input: process.stdin,
    output: process.stdout
});
const question = util_1.default.promisify(readline.question).bind(readline);
function init() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repoUri = 'https://github.com/luiys/nodejs-express-typeorm-boilerplate.git';
            const options = ['y', 'n'];
            const bdOptions = { flagBdType: 'postgres', flagBdName: 'db_name', flagBdUser: 'db_user', flagBdPassword: 'db_password', flagBdHost: 'db_host', flagBdPort: 'db_port' };
            const projectName = (_a = yield question('Nome do Projeto (new-node-project): ')) !== null && _a !== void 0 ? _a : 'new-node-project';
            const flagBdConnection = (_b = yield question('Criar conexão com banco de dados? (y/n): ')) !== null && _b !== void 0 ? _b : 'y';
            if (!options.includes(flagBdConnection))
                throw new Error('BD Opção inválida');
            if (flagBdConnection === 'y') {
                bdOptions.flagBdType = (_c = yield question('Tipo de banco de dados (mysql/postgres/mssql): ')) !== null && _c !== void 0 ? _c : 'postgres';
                if (!['mysql', 'postgres', 'mssql'].includes(bdOptions.flagBdType.trim()))
                    throw new Error('BD_TYPE Opção inválida');
                bdOptions.flagBdName = (_d = yield question('Nome do bd: ')) !== null && _d !== void 0 ? _d : 'db_name';
                bdOptions.flagBdUser = (_e = yield question('User do bd: ')) !== null && _e !== void 0 ? _e : 'db_user';
                bdOptions.flagBdHost = (_f = yield question('Host do bd: ')) !== null && _f !== void 0 ? _f : 'db_host';
                bdOptions.flagBdPassword = (_g = yield question('Senha do bd: ')) !== null && _g !== void 0 ? _g : 'db_password';
                bdOptions.flagBdPort = (_h = yield question('Porta do bd: ')) !== null && _h !== void 0 ? _h : 'db_port';
            }
            const flagSendEmail = (_j = yield question('O projeto vai enviar emails? (y/n): ')) !== null && _j !== void 0 ? _j : 'y';
            if (!options.includes(flagBdConnection))
                throw new Error('EMAIL Opção inválida');
            shelljs_1.default.exec('git clone ' + repoUri);
            if (!!shelljs_1.default.error())
                throw new Error("Erro ao clonar repositório");
            shelljs_1.default.exec(`ren nodejs-express-typeorm-boilerplate ${projectName}`);
            if (!!shelljs_1.default.error())
                throw new Error("Erro ao renomear repositório");
            shelljs_1.default.cd(projectName);
            if (!!shelljs_1.default.error())
                throw new Error("Erro ao entrar no diretório");
            shelljs_1.default.exec('yarn');
            if (!!shelljs_1.default.error())
                shelljs_1.default.exec('npm install');
            if (!!shelljs_1.default.error())
                throw new Error("Erro ao instalar dependências");
            let env = fs_1.default.readFileSync('readme.md', 'utf8');
            env = env.split('-----BEGIN .ENV-----')[1];
            env = env.split('-----END .ENV-----')[0];
            fs_1.default.writeFileSync('.env', env);
            if (flagBdConnection === 'y') {
                let env = fs_1.default.readFileSync('.env', 'utf8');
                env = env.replace('DB_HOST=db_host\r\n', `DB_HOST=${bdOptions.flagBdHost}\r\n`);
                env = env.replace('DB_USER=db_user\r\n', `DB_USER=${bdOptions.flagBdUser}\r\n`);
                env = env.replace('DB_NAME=db_name\r\n', `DB_NAME=${bdOptions.flagBdName}\r\n`);
                env = env.replace('DB_HOST=db_host\r\n', `DB_HOST=${bdOptions.flagBdHost}\r\n`);
                env = env.replace('DB_PASSWORD=db_password\r\n', `DB_PASSWORD=${bdOptions.flagBdPassword}\r\n`);
                env = env.replace('DB_PORT=3306\r\n', `DB_PORT=${bdOptions.flagBdPort}\r\n`);
                fs_1.default.writeFileSync('.env', env);
                bdOptions.flagBdType === 'postgres' ? shelljs_1.default.exec('yarn add pg') : shelljs_1.default.exec(`yarn remove pg && yarn add ${bdOptions.flagBdType}`);
                if (!!shelljs_1.default.error())
                    throw new Error("Erro ao instalar dependências do banco de dados");
                const index = 'src/index.ts';
                let content = fs_1.default.readFileSync(index, 'utf8');
                content = content.replace('type: "postgres",', `type: "${bdOptions.flagBdType}",`);
                fs_1.default.writeFileSync(index, content, 'utf8');
            }
            if (flagBdConnection === 'n') {
                const removeLines = (data, lines = []) => data.split('\n').filter((val, idx) => lines.indexOf(idx) === -1).join('\n');
                const index = 'src/index.ts';
                const content = fs_1.default.readFileSync(index, 'utf8').split('\r\n');
                const flatedContent = content.map((line) => line.trim());
                const import1 = (_k = flatedContent.indexOf('import { createConnection } from "typeorm";')) !== null && _k !== void 0 ? _k : content.indexOf('import { createConnection } from "typeorm"');
                const import2 = (_l = flatedContent.indexOf('import { Tables } from "./entity";')) !== null && _l !== void 0 ? _l : content.indexOf('import { Tables } from "./entity"');
                const startConnection = flatedContent.indexOf('await createConnection({');
                const endConnection = (_m = flatedContent.indexOf('cache: { duration: 30000 },') + 3) !== null && _m !== void 0 ? _m : content.indexOf('cache: { duration: 30000 }') + 3;
                const allConnectionLines = [...Array(endConnection - startConnection).keys()].map(val => startConnection + val);
                const linesExceptConnection = removeLines(content.join('\r\n'), [import1, import2, ...allConnectionLines]);
                shelljs_1.default.exec('npx rimraf src/entity');
                if (!!shelljs_1.default.error())
                    throw new Error("Erro ao remover diretório entity");
                shelljs_1.default.exec('npx rimraf src/modules/Acesso');
                if (!!shelljs_1.default.error())
                    throw new Error("Erro ao remover diretório Acesso");
                fs_1.default.writeFileSync(index, linesExceptConnection, 'utf8');
            }
            if (flagSendEmail === 'n') {
                shelljs_1.default.exec('npx rimraf src/utils/EmailService.ts');
                if (!!shelljs_1.default.error())
                    throw new Error("Erro ao remover arquivo EmailService");
                shelljs_1.default.exec('npx rimraf src/types');
                if (!!shelljs_1.default.error())
                    throw new Error("Erro ao remover diretório Types");
            }
            shelljs_1.default.exec('npx rimraf .git');
            if (!!shelljs_1.default.error())
                throw new Error("Erro ao remover diretório .git");
            readline.close();
        }
        catch (error) {
            console.log(error.message);
            readline.close();
        }
    });
}
exports.default = init;
