const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsong',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlitsongsHandler = new PlaylistSongsHandler(service, validator);

    server.route(routes(playlitsongsHandler));
  },
};
