const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(collaborationsService, playlistSongService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistSongService = playlistSongService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistSongService.verifyPlaylistSongOwner(playlistId, credentialId);
      // eslint-disable-next-line max-len
      const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

      const response = h.response({
        status: 'success',
        message: 'Collaboration added successfully',
        data: {
          collaborationId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Sorry, there is something wrong with our server',
      });
      
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistSongService.verifyPlaylistSongOwner(playlistId, credentialId);
      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return {
        status: 'success',
        message: 'Collaboration deleted successfully',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Sorry, there is something wrong with our server',
      });
      
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = CollaborationsHandler;
