import Joi from 'joi';

const schema = Joi.object().keys({
	account: Joi.string().required(),
	accessKey: Joi.string().required(),
	container: Joi.object().keys({
		name: Joi.string().required(),
		cache: [Joi.array().items(Joi.object()), Joi.boolean(), Joi.any().optional()],
		policy: Joi.object().required()
	}),
	progress: [Joi.boolean(), Joi.any().optional()],
	service: [Joi.object(), Joi.boolean(), Joi.any().optional()],
	sources: Joi.array().items(Joi.object().keys({
		dir: Joi.string().required(),
		pattern: Joi.string().required(),
		include: Joi.boolean()
	}).required()).required(),
	verbose: [Joi.boolean(),  Joi.any().optional()]
});

export default (config) => Joi.validate(config, schema);
