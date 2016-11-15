import Joi from 'joi';

const schema = Joi.object().keys({
	account: Joi.string().required(),
	accessKey: Joi.string().required(),
	container: Joi.object().keys({
		name: Joi.string().required(),
		cache: Joi.array().items(Joi.object()),
		properties: Joi.object(),
		policy: Joi.object()
	}),
	progress: Joi.boolean(),
	sources: Joi.array().items(Joi.object().keys({
		dir: Joi.string().required(),
		pattern: Joi.string().required(),
		include: Joi.boolean()
	}).required()).required(),
	verbose: Joi.boolean()
});

export default (config) => Joi.validate(config, schema);
