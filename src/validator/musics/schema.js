/* eslint-disable newline-per-chained-call */
const Joi = require('joi');

const thisYear = new Date().getFullYear();

const MusicPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1970).max(thisYear).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().integer().greater(0),
});

module.exports = { MusicPayloadSchema };
