const CollaborationsHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { collaborationsService, playlistSongsService, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService, playlistSongsService, validator,
    );
    server.route(routes(collaborationsHandler));
  },
};
