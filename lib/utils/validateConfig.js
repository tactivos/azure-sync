import Joi from 'joi';

const schema = Joi.object().keys({
	account: Joi.string().required(),
	accessToken: Joi.string().required(),
	container: Joi.object().keys({
		name: Joi.string().required(),
		properties: Joi.object(),
		policy: Joi.object()
	}),
	source: Joi.string().required()
});

export default (config) => Joi.validate(config, schema);
