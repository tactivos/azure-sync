import validateConfig from '../utils/validateConfig';
import merge from 'deepmerge';
import chalk from 'chalk';

// Some one-liners...
const def = (conf) => conf || {};
const isObject = (obj) => typeof obj === 'object';
// Recursive object reducer
const environmentRedux = (obj, final, key) => {
	let field = obj[key];
	if (field) {
		if (isObject(field)) {
			field = Object.keys(field).reduce((initial, key) => environmentRedux(field, initial, key), {});
			if (!Object.keys(field).length) return final;
		}
		return Object.assign(final, { [key]: field });
	}
	return final;
};

const ENVIRONMENT_CONFIG = {
	account: process.env.AZURE_STORAGE_ACCOUNT,
	accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
	container: {
		name: process.env.AZURE_SYNC_CONTAINER_NAME,
		cache: process.env.AZURE_SYNC_CONTAINER_CACHE,
		policy: process.env.AZURE_SYNC_CONTAINER_POLICY
	},
	progress: process.env.AZURE_SYNC_PROGRESS,
	service: process.env.AZURE_SYNC_SERVICE,
	sources: process.env.AZURE_SYNC_SOURCES,
	verbose: process.env.AZURE_SYNC_VERBOSE
};

const AZURE_SYNC_CLI = Object.keys(ENVIRONMENT_CONFIG).reduce((initial, key) => environmentRedux(ENVIRONMENT_CONFIG, initial, key), {});

export default (params) => {

	const config = merge(def(params), def(AZURE_SYNC_CLI));
	const validate = validateConfig(config);

	if (validate.error) {
		console.log(chalk.red(`Configuration error found!`));
		throw new Error(chalk.red(validate.error));
	}

	return config;

};
