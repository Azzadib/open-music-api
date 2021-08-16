const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { data } = request.payload;
      this._validator.validateImageHeaders(data.hapi.headers);

      const fileName = await this._service.writeFile(data, data.hapi);

      const response = h.response({
        status: 'success',
        message: 'Image uploaded successfully',
        data: {
          pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${fileName}`,
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
}

module.exports = UploadsHandler;