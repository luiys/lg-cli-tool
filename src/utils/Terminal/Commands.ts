import shell from 'shelljs'
import { isWin } from '../getPlatform'

export class Commands {

    static initializeGit() {

        shell.exec('git init')
        if (shell.error()) return { flagErro: true, result: 'Erro ao inicializar o git' }
        return { flagErro: false, result: 'Git inicializado com sucesso' }

    }

    static cloneRepo(repo: string) {

        shell.exec(`git clone ${repo}`)
        if (shell.error()) return { flagErro: true, result: `Erro ao clonar repositório ${repo}` }
        return { flagErro: false, result: `Repositório ${repo} clonado com sucesso` }

    }

    static navigateTo(dir: string) {

        shell.cd(dir)
        if (shell.error()) return { flagErro: true, result: `Erro ao navegar para ${dir}` }
        return { flagErro: false, result: `Navegado para ${dir}` }

    }

    static installDeps() {

        shell.exec('yarn')
        if (shell.error()) shell.exec('npm install')
        if (shell.error()) return { flagErro: true, result: 'Erro ao instalar dependências' }
        return { flagErro: false, result: 'Dependências instaladas com sucesso' }

    }

    static renameDir(oldName: string, newName: string) {

        if (isWin) shell.exec(`ren "${oldName}" "${newName}"`)
        else shell.exec(`mv "${oldName}" "${newName}"`)

        if (shell.error()) return { flagErro: true, result: `Erro ao renomear arquivo ${oldName} para ${newName}` }
        return { flagErro: false, result: `Arquivo ${oldName} renomeado com sucesso para ${newName}` }

    }

    static moveDir(origin: string, destiny: string) {

        shell.cp(origin, destiny)
        if (shell.error()) return { flagErro: true, result: `Erro ao copiar arquivo ${origin} para ${destiny}` }
        return { flagErro: false, result: `Arquivo ${origin} copiado com sucesso para ${destiny}` }

    }

    static deleteDir(dir: string) {

        shell.exec(`npx rimraf "${dir}"`)
        if (shell.error()) return { flagErro: true, result: `Erro ao remover diretório ${dir}` }
        return { flagErro: false, result: `Diretório ${dir} removido com sucesso` }

    }

}
