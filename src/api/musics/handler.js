const ClientError = require('../../exceptions/ClientError');

class MusicsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMusicHandler = this.postMusicHandler.bind(this);
    this.getMusicsHandler = this.getMusicsHandler.bind(this);
    this.getMusicByIdHandler = this.getMusicByIdHandler.bind(this);
    this.putMusicByIdHandler = this.putMusicByIdHandler.bind(this);
    this.deleteMusicByIdHandler = this.deleteMusicByIdHandler.bind(this);
  }

  async postMusicHandler(request, h) {
    try {
      this._validator.validateMusicPayload(request.payload);
      const { title, year, performer, genre, duration } = request.payload;

      const songId = await this._service.addMusic({ title, year, performer, genre, duration });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
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
        message: 'Sorry, there is something wrong with our server.',
      });

      response.code(500);
      console.log(error);
      return response;
    }
  }

  async getMusicsHandler() {
    const songs = await this._service.getMusics();

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getMusicByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      const song = await this._service.getMusicById(songId);

      return {
        status: 'success',
        data: {
          song,
        },
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
        message: 'Sorry, there is something wrong with our server.',
      });

      response.code(500);
      console.log(error);
      return response;
    }
  }

  async putMusicByIdHandler(request, h) {
    try {
      this._validator.validateMusicPayload(request.payload);
      const { title, year, genre, performer, duration } = request.payload;
      const { songId } = request.params;

      await this._service.editMusicById(songId, { title, year, genre, performer, duration });

      return {
        status: 'success',
        message: 'lagu berhasil diperbarui',
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
        message: 'Sorry, there is something wrong with our server.',
      });

      response.code(500);
      console.log(error);
      return response;
    }
  }

  async deleteMusicByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      await this._service.deleteMusicById(songId);

      return {
        status: 'success',
        message: 'lagu berhasil dihapus',
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
        message: 'Sorry, there is something wrong with our server.',
      });

      response.code(500);
      console.log(error);
      return response;
    }
  }
}

module.exports = MusicsHandler;
