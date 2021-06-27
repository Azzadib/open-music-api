require('dotenv').config();

const Hapi = require('@hapi/hapi');
const musics = require('./api/musics');
//* const ClientError = require('./exceptions/ClientError');
const MusicsService = require('./services/postgres/MusicsService');
const MusicsValidator = require('./validator/musics');
 
const init = async () => {
  const musicsService = new MusicsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
 
  await server.register({
    plugin: musics,
    options: {
      service: musicsService,
      validator: MusicsValidator,
    },
  });

  /* //* Check for client error
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
  
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
  
    //* If there is no client error, continue with previous response
    return response.continue || response;
  }); */
 
  await server.start();
  console.log(`Server runing on port ${server.info.uri}`);
};
 
init();
