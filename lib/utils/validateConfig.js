import Joi from 'joi';

const schema = Joi.object().keys({
	account: Joi.string().required(),
	accessToken: Joi.string().required(),
	container: Joi.object().keys({
		name: Joi.string().required(),
		properties: Joi.object(),
		policy: Joi.object()
	}),
	progress: Joi.boolean(),
	sources: Joi.array().items(Joi.string().required()).required(),
	verbose: Joi.boolean()
});

export default (config) => Joi.validate(config, schema);
