import updateNotifier from 'update-notifier'
//eslint-disable-next-line
const version = require('../../../package.json').version

export function displayUpdate() {

    updateNotifier({
        pkg: {
            name: 'lg-cli-tool',
            version,
        },
        updateCheckInterval: 0
    }).notify({
        isGlobal: true,
        defer: false
    })

}
