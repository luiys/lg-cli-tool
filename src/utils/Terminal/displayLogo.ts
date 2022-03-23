import figlet from 'figlet'
import { sleep } from '../sleep'
import gradient from 'gradient-string'

export async function displayLogo() {

    figlet('LG-CLI-TOOL', (err, data) => {

        //eslint-disable-next-line
        console.log(gradient.pastel.multiline(data))

    })

    await sleep(100)

}
