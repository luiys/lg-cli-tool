"use strict";
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const init_1 = __importDefault(require("./init"));
const cli = new commander_1.Command();
cli
    .name('lg-node')
    .description('CLI para criar projetos node')
    .version('0.0.1', '-v, --version', 'Mostra a versão do CLI');
cli
    .command('init')
    .description('Inicializa um projeto node')
    .action(init_1.default);
cli.parse(process.argv);
cli.showHelpAfterError();
exports.default = cli;