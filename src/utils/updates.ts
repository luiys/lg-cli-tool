import updateNotifier from 'update-notifier';
const version = require('../../package.json').version;

export function checkForUpdates() {
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