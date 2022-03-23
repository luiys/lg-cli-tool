import updateNotifier from 'update-notifier'
//eslint-disable-next-line
const version = require('../../../package.json').version

export function displayUpdate() {

    const notifier = updateNotifier({
        pkg: {
            name: 'lg-cli-tool',
            version,
        },
        updateCheckInterval: 0
    })

    if (notifier.update?.type !== 'patch') {

        notifier.notify({
            isGlobal: true,
            defer: false
        })

    }

}
