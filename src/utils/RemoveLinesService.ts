import fs from 'fs'
import { isWin } from './getPlatform'

export class RemoveLines {

    static removeLinesWithString(data: string, lines = [] as string[]) {

        let content
        if (isWin) content = data.split('\r\n')
        else content = data.split('\n')

        for (const test of lines) {

            content = content.filter((val) => val.indexOf(test) === -1)

        }

        if (isWin) return content.join('\r\n')
        return content.join('\n')

    }

    static removeLinesWithNumber(data: string, lines = []) {

        return data.split('\n').filter((val, idx) => lines.indexOf(idx as never) === -1).join('\n')

    }

    static removeLinesStartEnd(dir: string, start: string, end?: string, extraLines?: string[], extraOptions?: { linesAfterEnd: number }) {

        try {

            let content
            if (isWin) content = fs.readFileSync(dir, 'utf8').split('\r\n')
            else content = fs.readFileSync(dir, 'utf8').split('\n')

            const flatedContent = content.map((line) => line.trim())

            const numberOfExtraLines: number[] = []

            if (extraLines) {

                extraLines.forEach(line => {

                    let numberLine = flatedContent.indexOf(line)
                    if (numberLine === -1) numberLine = flatedContent.indexOf(`${line};`)
                    if (numberLine === -1) numberLine = flatedContent.indexOf(`${line}\r\n`)
                    if (numberLine === -1) throw new Error('ERROR 500 Line not found #3')
                    numberOfExtraLines.push(numberLine)

                })

            }

            const startConnection = flatedContent.indexOf(start)
            let endConnection = flatedContent.length
            if (end) endConnection = flatedContent.indexOf(end) + 1
            if (end && extraOptions?.linesAfterEnd) endConnection = flatedContent.indexOf(end) + extraOptions.linesAfterEnd

            if (startConnection === -1) throw new Error(`ERROR 500 Line not found #1 ${start} `)
            if (endConnection === -1) throw new Error(`ERROR 500 Line not found #2 ${end} `)

            const allConnectionLines = [...Array(endConnection - startConnection).keys()].map(val => startConnection + val)

            let newContent
            if (isWin) newContent = this.removeLinesWithNumber(content.join('\r\n'), [...allConnectionLines, ...numberOfExtraLines] as never[])
            else newContent = this.removeLinesWithNumber(content.join('\n'), [...allConnectionLines, ...numberOfExtraLines] as never[])

            fs.writeFileSync(dir, newContent, 'utf8')
            return { flagErro: false, result: 'OK' }

        } catch (error: any) {

            return { flagErro: true, result: error.message }

        }

    }

}
