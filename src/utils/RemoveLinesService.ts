import fs from 'fs';

export class RemoveLines {


	static removeLinesWithString(data: string, lines = [] as string[]) {

		let content = data.split('\r\n')

		for (const test of lines) {
			content = content.filter((val) => val.indexOf(test) === -1)
		}

		return content.join('\r\n');
	}

	static removeLinesWithNumber(data: string, lines = []) {

		return data.split('\n').filter((val, idx) => lines.indexOf(idx as never) === -1).join('\n');
	}

	static removeLinesStartEnd(dir: string, start: string, end?: string, extraLines?: string[], extraOptions?: { linesAfterEnd: number }) {

		try {

			const content = fs.readFileSync(dir, 'utf8').split('\r\n')
			const flatedContent = content.map((line) => line.trim())

			let numberOfExtraLines: number[] = []

			if (extraLines) {
				extraLines.forEach(line => {
					let numberLine = flatedContent.indexOf(line)
					if (numberLine === -1) numberLine = flatedContent.indexOf(line + ';')
					if (numberLine === -1) numberLine = flatedContent.indexOf(line + '\r\n')
					if (numberLine === -1) throw new Error("ERROR 500 Line not found #3")
					numberOfExtraLines.push(numberLine)
				})
			}

			const startConnection = flatedContent.indexOf(start)
			let endConnection = flatedContent.length
			if (end) endConnection = flatedContent.indexOf(end) + 1
			if (end && extraOptions?.linesAfterEnd) endConnection = flatedContent.indexOf(end) + extraOptions.linesAfterEnd

			if (startConnection === -1) throw new Error("ERROR 500 Line not found #1")
			if (endConnection === -1) throw new Error("ERROR 500 Line not found #2")

			const allConnectionLines = [...Array(endConnection - startConnection).keys()].map(val => startConnection + val)
			const newContent = this.removeLinesWithNumber(content.join('\r\n'), [...allConnectionLines, ...numberOfExtraLines] as never[])

			fs.writeFileSync(dir, newContent, 'utf8');

			return { flagErro: false, result: 'OK' }

		} catch (error: any) {

			return { flagErro: true, result: error.message }

		}

	}

}