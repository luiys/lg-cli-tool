import fs from 'fs'

export function createEntitiesIndex() {

    try {

        let entitiesName = fs.readdirSync('src/entity')

        entitiesName = entitiesName.map(name => name.split('.')[0])
        entitiesName = entitiesName.filter(name => name !== 'index')

        const imports = `${entitiesName.map(name => `import { ${name} } from './${name}';`).join('\r\n')}\r\n` + '\r\n'
        const yields = entitiesName.map(name => `\t\tyield ${name}`).join('\r\n')
        const tablesConst = `export const Tables = {\r\n\t*[Symbol.iterator]() {\r\n${yields}\r\n\t}\r\n}`

        fs.writeFileSync('src/entity/index.ts', imports + tablesConst, 'utf8')
        return { flagErro: false, result: 'Arquivo index das entities criado com sucesso!' }

    } catch (error: any) {

        return { flagErro: true, result: error.message }

    }

}
