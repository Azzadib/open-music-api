const InvariantError = require('../../exceptions/InvariantError');
const { MusicPayloadSchema } = require('./schema');

const MusicsValidator = {
  validateMusicPayload: (paylod) => {
    const validationResult = MusicPayloadSchema.validate(paylod);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = MusicsValidator;
