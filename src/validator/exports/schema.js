const Joi = require('joi');

const exportSongPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = exportSongPayloadSchema;
